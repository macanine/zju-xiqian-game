import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
} from "react";
import type { Choice, ContentBundle, Effects } from "./domain/content";
import {
  applyEffects,
  calculateEnding,
  resolveChoice,
  type EndResult,
  type Resolution,
  type Resources,
} from "./domain/rules";
import { sound } from "./domain/audio";
import { getSpeakerInfo } from "./domain/speakers";
import { VNStage } from "./scene/VNStage";
import { VNBacklog, type LogEntry } from "./scene/VNBacklog";
import { VNPassport } from "./scene/VNPassport";
import { JourneyTransition } from "./scene/JourneyTransition";
import { getJourneyLeg, type JourneyLeg } from "./domain/journey";
import type { WaypointStory } from "./domain/passport";
import { preloadNodeImages } from "./domain/preloader";
import {
  buildEventQueue,
  newSession,
  resolveQueuedChoice,
  type Screen,
} from "./domain/session";

import { AppHeader } from "./components/AppHeader";
import { ImageViewer } from "./components/ImageViewer";
import { HomeScreen } from "./screens/HomeScreen";
import { RouteScreen } from "./screens/RouteScreen";
import { VNEventScreen } from "./screens/VNEventScreen";
import { ArchiveScreen } from "./screens/ArchiveScreen";
import { EndingScreen } from "./screens/EndingScreen";

interface AppProps {
  content: ContentBundle;
}

export function App({ content }: AppProps): ReactElement {
  const [screen, setScreen] = useState<Screen>("home");
  const [session, setSession] = useState(() => newSession(content));
  const [viewerPath, setViewerPath] = useState<string | null>(null);
  const [backlogOpen, setBacklogOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [hideUI, setHideUI] = useState(false);
  const [transitionLeg, setTransitionLeg] = useState<JourneyLeg | null>(null);
  const [passportOpen, setPassportOpen] = useState(false);
  const [visitedWaypoints, setVisitedWaypoints] = useState<Set<string>>(
    () => new Set(),
  );

  // Sync sound system state
  useEffect(() => {
    sound.enabled = soundEnabled;
  }, [soundEnabled]);

  const node =
    content.storyline.nodes[session.nodeIndex] || content.storyline.nodes[0];
  const currentEvent = session.queue[session.queueIndex];

  const ending = useMemo<EndResult | null>(() => {
    if (screen !== "ending") return null;
    return calculateEnding(content.storyline, session.resources, session.flags);
  }, [content.storyline, screen, session.flags, session.resources]);

  const resetGame = useCallback((): void => {
    sound.playPageTurn();
    setTransitionLeg(null);
    setSession(newSession(content));
    setViewerPath(null);
    setBacklogOpen(false);
    setLogs([]);
    setAutoPlay(false);
    setHideUI(false);
    setPassportOpen(false);
    setVisitedWaypoints(new Set());
    setScreen("home");
  }, [content]);

  const handleVisitWaypoint = useCallback(
    (wp: WaypointStory): void => {
      if (visitedWaypoints.has(wp.id)) return;
      setVisitedWaypoints((prev) => new Set(prev).add(wp.id));
      if (wp.bonus.effects) {
        setSession((prev) => {
          return {
            ...prev,
            resources: applyEffects(
              prev.resources,
              wp.bonus.effects ?? {},
              content.storyline,
            ),
          };
        });
      }
      setLogs((prev) => [
        ...prev,
        {
          stage: node.name,
          speaker: `【沿途駐地探索】${wp.title}`,
          text: wp.fullStory,
          choice: `收录驻地手记（${wp.bonus.label}）`,
          resolution: `行军文牒增添朱砂印记：${wp.sealChar}`,
        },
      ]);
    },
    [content, node, visitedWaypoints],
  );

  useEffect(() => {
    const currentNode = content.storyline.nodes[session.nodeIndex];
    const nextNode = content.storyline.nodes[session.nodeIndex + 1];
    if (currentNode?.images) preloadNodeImages(currentNode.images);
    if (nextNode?.images) preloadNodeImages(nextNode.images);
  }, [session.nodeIndex, content]);

  const handleJourneyTransitionComplete = useCallback((): void => {
    setTransitionLeg(null);
    setScreen("event");
  }, []);

  const startGame = useCallback((): void => {
    sound.playSealStamp();
    const freshSession = newSession(content);
    const firstNode = content.storyline.nodes[0];
    const queue = firstNode
      ? buildEventQueue(content, firstNode, freshSession)
      : [];
    setSession({ ...freshSession, queue });
    setLogs([]);
    const leg = getJourneyLeg(firstNode?.id || "prologue-hangzhou");
    if (firstNode?.images) {
      preloadNodeImages(firstNode.images);
    }
    setTransitionLeg(leg);
    setScreen("route");
  }, [content]);

  const enterNode = useCallback((): void => {
    const target = content.storyline.nodes[session.nodeIndex];
    if (!target) return;
    let resources = session.resources;
    if (target.order > 0) {
      const travel = content.storyline.config.travel;
      const travelEffects: Effects = {
        ration: travel.rationPerLeg,
        health: travel.healthPerNode,
      };
      resources = resolveChoice(
        resources,
        { label: "行军", effects: travelEffects },
        content.storyline,
      ).resources;
    }
    if (target.order === content.storyline.nodes.length - 1) {
      setSession((previous) => ({ ...previous, resources }));
      setScreen("ending");
      return;
    }
    const queue = buildEventQueue(content, target, session);
    setSession((previous) => ({
      ...previous,
      resources,
      queue,
      queueIndex: 0,
    }));
    if (target.images) {
      preloadNodeImages(target.images);
    }
    const leg = getJourneyLeg(target.id);
    setTransitionLeg(leg);
  }, [content, session]);

  const finishCurrentEvent = useCallback(
    (
      resources: Resources,
      flag?: string,
      log?: string,
      choiceText?: string,
    ): void => {
      if (!currentEvent) return;

      const eventTitle =
        currentEvent.kind === "location"
          ? currentEvent.event.title
          : currentEvent.event.name;
      const speakerMeta = getSpeakerInfo(currentEvent.event.id, eventTitle);

      // Append to Visual Novel Backlog
      setLogs((prev) => [
        ...prev,
        {
          stage: node.name,
          speaker: `${speakerMeta.name}（${speakerMeta.badge}）`,
          text: currentEvent.event.text,
          choice: choiceText,
          resolution: log,
        },
      ]);

      const nextIndex = session.queueIndex + 1;
      const nextFlags = new Set(session.flags);
      if (flag) nextFlags.add(flag);
      const nextHistory = log ? [...session.history, log] : session.history;
      const nextSession = {
        ...session,
        resources,
        flags: nextFlags,
        history: nextHistory,
        queueIndex: nextIndex,
      };

      if (nextIndex < session.queue.length) {
        setSession(nextSession);
        return;
      }
      if (session.nodeIndex >= content.storyline.nodes.length - 1) {
        setSession(nextSession);
        setScreen("ending");
        return;
      }
      setSession({
        ...nextSession,
        nodeIndex: session.nodeIndex + 1,
        queue: [],
        queueIndex: 0,
      });
      setScreen("route");
    },
    [content, currentEvent, node, session],
  );

  const previewEventChoice = useCallback(
    (choice: Choice): Resolution => {
      if (!currentEvent) {
        throw new Error("无法在没有当前事件时预览选择");
      }
      return resolveQueuedChoice(content, session, currentEvent, choice).result;
    },
    [content, currentEvent, session],
  );

  const resolveEventChoice = useCallback(
    (choice: Choice): void => {
      if (!currentEvent) return;
      sound.playSealStamp();

      const { result, choiceText } = resolveQueuedChoice(
        content,
        session,
        currentEvent,
        choice,
      );
      finishCurrentEvent(
        result.resources,
        result.flag,
        `${result.log}${result.forcedRest ? " · 队伍强制休整" : ""}`,
        choiceText,
      );
    },
    [content, currentEvent, finishCurrentEvent, session],
  );

  const currentPhoto =
    currentEvent?.kind === "location"
      ? node.images[currentEvent.photoIndex]
      : node.images[0] || node.backgroundHint;

  const toggleSound = useCallback(() => {
    setSoundEnabled((previous) => !previous);
  }, []);
  const toggleHideUI = useCallback(() => {
    setHideUI((previous) => !previous);
  }, []);
  const toggleAutoPlay = useCallback(() => {
    setAutoPlay((previous) => !previous);
  }, []);
  const openBacklog = useCallback(() => setBacklogOpen(true), []);
  const openPassport = useCallback(() => setPassportOpen(true), []);
  const openArchive = useCallback(() => setScreen("archive"), []);
  const closeBacklog = useCallback(() => setBacklogOpen(false), []);
  const closePassport = useCallback(() => setPassportOpen(false), []);
  const closeViewer = useCallback(() => setViewerPath(null), []);
  const backFromArchive = useCallback(() => {
    setScreen(session.history.length ? "route" : "home");
  }, [session.history.length]);
  const selectPassportWaypoint = useCallback(() => {
    setPassportOpen(false);
    setScreen("route");
  }, []);

  return (
    <div className={`vn-app-shell vn-screen-${screen}`}>
      {/* Pure 2D Visual Novel Stage (Historical photos + Aged parchment) */}
      <VNStage
        content={content}
        node={node}
        photoPath={currentPhoto}
        screen={screen}
        onViewImage={setViewerPath}
      />

      {/* Atmospheric Header Bar */}
      {screen !== "home" && !hideUI && (
        <AppHeader
          content={content}
          resources={session.resources}
          nodeName={node.name}
          screen={screen}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          onOpenBacklog={openBacklog}
          onOpenPassport={openPassport}
          onArchive={openArchive}
          onHome={resetGame}
        />
      )}

      {/* Main Narrative Content Area */}
      <main className={`vn-main-layer ${hideUI ? "is-ui-hidden" : ""}`}>
        {screen === "home" && (
          <HomeScreen
            content={content}
            onStart={startGame}
            onArchive={openArchive}
          />
        )}

        {screen === "route" && (
          <RouteScreen
            content={content}
            session={session}
            visitedWaypoints={visitedWaypoints}
            onEnter={enterNode}
            onArchive={openArchive}
            onOpenPassport={openPassport}
            onVisitWaypoint={handleVisitWaypoint}
          />
        )}

        {screen === "event" && currentEvent && (
          <VNEventScreen
            key={`event-${session.nodeIndex}-${session.queueIndex}`}
            session={session}
            item={currentEvent}
            autoPlay={autoPlay}
            soundEnabled={soundEnabled}
            hideUI={hideUI}
            onToggleHideUI={toggleHideUI}
            onToggleAutoPlay={toggleAutoPlay}
            onOpenBacklog={openBacklog}
            onChoice={resolveEventChoice}
            onPreviewChoice={previewEventChoice}
            onViewImage={setViewerPath}
            isBlocked={Boolean(transitionLeg)}
          />
        )}

        {screen === "ending" && ending && (
          <EndingScreen
            content={content}
            ending={ending}
            resources={session.resources}
            onRestart={resetGame}
            onArchive={openArchive}
          />
        )}

        {screen === "archive" && (
          <ArchiveScreen
            content={content}
            onBack={backFromArchive}
            onViewImage={setViewerPath}
          />
        )}
      </main>

      {/* Backlog / Memory Log Drawer */}
      <VNBacklog logs={logs} isOpen={backlogOpen} onClose={closeBacklog} />

      {/* High-Resolution Historical Photo Modal */}
      {viewerPath && (
        <ImageViewer
          path={viewerPath}
          content={content}
          onClose={closeViewer}
        />
      )}

      {/* Smooth Location Migration Transition Cutscene */}
      {transitionLeg && (
        <JourneyTransition
          leg={transitionLeg}
          onComplete={handleJourneyTransitionComplete}
        />
      )}

      {/* Travel Passport Stamp Book and Waypoint Notes Modal */}
      <VNPassport
        unlockedNodeIndex={session.nodeIndex}
        visitedWaypoints={visitedWaypoints}
        isOpen={passportOpen}
        onClose={closePassport}
        onSelectWaypoint={selectPassportWaypoint}
      />
    </div>
  );
}
