import {
  useEffect,
  useMemo,
  useState,
  type ReactElement,
} from "react";
import type {
  Choice,
  ContentBundle,
  Effects,
  StoryNode,
} from "./domain/content";
import {
  calculateEnding,
  randomAt,
  resolveChoice,
  selectWeightedEvent,
  type EndResult,
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
  isDecisionEvent,
  newSession,
  type QueuedEvent,
  type Screen,
  type Session,
} from "./domain/session";

import { AppHeader } from "./components/AppHeader";
import { ImageViewer } from "./components/ImageViewer";
import { HomeScreen } from "./screens/HomeScreen";
import { RouteScreen } from "./screens/RouteScreen";
import { VNEventScreen } from "./screens/VNEventScreen";
import { ArchiveScreen } from "./screens/ArchiveScreen";
import { EndingScreen } from "./screens/EndingScreen";

// Re-export utility state screens for consumers (e.g. main.tsx)
export { LoadingScreen, ErrorScreen } from "./components/StateScreens";

interface AppProps {
  content: ContentBundle;
}

export function App({ content }: AppProps): ReactElement {
  const [screen, setScreen] = useState<Screen>("home");
  const [session, setSession] = useState(() => newSession(content));
  const [viewerPath, setViewerPath] = useState<string | null>(null);
  const [lastResolution, setLastResolution] = useState<string | null>(null);
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

  function resetGame(): void {
    sound.playPageTurn();
    setTransitionLeg(null);
    setSession(newSession(content));
    setLastResolution(null);
    setLogs([]);
    setPassportOpen(false);
    setVisitedWaypoints(new Set());
    setScreen("home");
  }

  function handleVisitWaypoint(wp: WaypointStory): void {
    setVisitedWaypoints((prev) => new Set(prev).add(wp.id));
    if (wp.bonus.effects) {
      setSession((prev) => {
        const updated = { ...prev.resources };
        for (const [key, val] of Object.entries(wp.bonus.effects ?? {})) {
          const k = key as keyof Resources;
          const delta = val as number | undefined;
          const cfg = content.storyline.config.resources[k];
          if (cfg && typeof delta === "number") {
            updated[k] = Math.max(
              cfg.min,
              Math.min(cfg.max, updated[k] + delta),
            );
          }
        }
        return { ...prev, resources: updated };
      });
    }
    setLastResolution(`探訪${wp.title} · ${wp.bonus.label}`);
    setLogs((prev) => [
      ...prev,
      {
        stage: node.name,
        speaker: `【沿途駐地探索】${wp.title}`,
        text: wp.fullStory,
        choice: `收錄駐地手記（${wp.bonus.label}）`,
        resolution: `行軍文牒增添朱砂印記：${wp.sealChar}`,
      },
    ]);
  }

  useEffect(() => {
    const currentNode = content.storyline.nodes[session.nodeIndex];
    const nextNode = content.storyline.nodes[session.nodeIndex + 1];
    if (currentNode?.images) preloadNodeImages(currentNode.images);
    if (nextNode?.images) preloadNodeImages(nextNode.images);
  }, [session.nodeIndex, content]);

  function handleJourneyTransitionComplete(): void {
    setTransitionLeg(null);
    setScreen("event");
  }

  function startGame(): void {
    sound.playSealStamp();
    const freshSession = newSession(content);
    const firstNode = content.storyline.nodes[0];
    const queue = firstNode ? buildQueue(firstNode, freshSession) : [];
    setSession({ ...freshSession, queue });
    setLastResolution(null);
    setLogs([]);
    const leg = getJourneyLeg(firstNode?.id || "prologue-hangzhou");
    if (firstNode?.images) {
      preloadNodeImages(firstNode.images);
    }
    setTransitionLeg(leg);
    setScreen("route");
  }

  function buildQueue(
    targetNode: StoryNode,
    nextSession: Session,
  ): QueuedEvent[] {
    const fixedIds = new Set(targetNode.teachingEvents ?? []);
    const insertedFixedIds = new Set<string>();
    const queue: QueuedEvent[] = [];
    (targetNode.locationEvents ?? []).forEach((event, index) => {
      const isMarker = !event.choices.length && event.note && fixedIds.size > 0;
      if (!isMarker) {
        queue.push({
          kind: "location",
          node: targetNode,
          event,
          interactive: isDecisionEvent(content, event),
          photoIndex: targetNode.images.length
            ? index % targetNode.images.length
            : 0,
        });
      }
      if (event.note?.includes("固定触发") && fixedIds.size) {
        for (const eventId of fixedIds) {
          const fixed = content.storyline.randomEvents.find(
            (candidate) => candidate.id === eventId,
          );
          if (fixed)
            queue.push({
              kind: "random",
              node: targetNode,
              event: fixed,
              interactive: isDecisionEvent(content, fixed),
            });
          insertedFixedIds.add(eventId);
        }
      }
    });
    for (const eventId of fixedIds) {
      if (insertedFixedIds.has(eventId)) continue;
      const fixed = content.storyline.randomEvents.find(
        (candidate) => candidate.id === eventId,
      );
      if (fixed)
        queue.push({
          kind: "random",
          node: targetNode,
          event: fixed,
          interactive: isDecisionEvent(content, fixed),
        });
    }

    const shouldDraw = targetNode.teachingEvents?.length
      ? false
      : randomAt(nextSession.seed, targetNode.order + 10) <
        content.storyline.config.travel.randomEventChancePerLeg;
    const drawnEvent = shouldDraw
      ? selectWeightedEvent(
          content.storyline.randomEvents,
          targetNode.id,
          randomAt(nextSession.seed, targetNode.order + 30),
        )
      : null;
    return [
      ...queue,
      ...(drawnEvent
        ? [
            {
              kind: "random" as const,
              node: targetNode,
              event: drawnEvent,
              interactive: isDecisionEvent(content, drawnEvent),
            },
          ]
        : []),
    ];
  }

  function enterNode(): void {
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
    const queue = buildQueue(target, session);
    setSession((previous) => ({
      ...previous,
      resources,
      queue,
      queueIndex: 0,
    }));
    setLastResolution(
      target.order === 0
        ? null
        : `抵達${target.name} · 口糧${content.storyline.config.travel.rationPerLeg} · 健康${content.storyline.config.travel.healthPerNode}`,
    );
    if (target.images) {
      preloadNodeImages(target.images);
    }
    const leg = getJourneyLeg(target.id);
    setTransitionLeg(leg);
  }

  function finishCurrentEvent(
    resources: Resources,
    flag?: string,
    log?: string,
    choiceText?: string,
  ): void {
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
      setLastResolution(log ?? null);
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
    setLastResolution(log ?? `完成${node.name}`);
    setScreen("route");
  }

  function resolveEventChoice(choice: Choice): void {
    if (!currentEvent) return;
    sound.playSealStamp();

    if (
      currentEvent.kind === "random" &&
      currentEvent.event.choices.length === 0
    ) {
      const auto = currentEvent.event.autoOutcomes ?? [];
      const autoChoice: Choice = { label: "抽签", outcomes: auto };
      const result = resolveChoice(
        session.resources,
        autoChoice,
        content.storyline,
        randomAt(session.seed, session.history.length + session.queueIndex),
      );
      finishCurrentEvent(
        result.resources,
        undefined,
        `${currentEvent.event.name} · ${result.log}`,
        "自動檢點",
      );
      return;
    }

    const result = resolveChoice(
      session.resources,
      choice,
      content.storyline,
      randomAt(session.seed, session.history.length + session.queueIndex),
    );
    finishCurrentEvent(
      result.resources,
      result.flag,
      `${result.log}${result.forcedRest ? " · 隊伍強制休整" : ""}`,
      choice.label,
    );
  }

  const currentPhoto =
    currentEvent?.kind === "location"
      ? node.images[currentEvent.photoIndex]
      : node.images[0] || node.backgroundHint;

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
          onToggleSound={() => setSoundEnabled((prev) => !prev)}
          onOpenBacklog={() => setBacklogOpen(true)}
          onOpenPassport={() => setPassportOpen(true)}
          onArchive={() => setScreen("archive")}
          onHome={resetGame}
        />
      )}

      {/* Main Narrative Content Area */}
      <main className={`vn-main-layer ${hideUI ? "is-ui-hidden" : ""}`}>
        {screen === "home" && (
          <HomeScreen
            content={content}
            onStart={startGame}
            onArchive={() => setScreen("archive")}
          />
        )}

        {screen === "route" && (
          <RouteScreen
            content={content}
            session={session}
            lastResolution={lastResolution}
            visitedWaypoints={visitedWaypoints}
            onEnter={enterNode}
            onArchive={() => setScreen("archive")}
            onOpenPassport={() => setPassportOpen(true)}
            onVisitWaypoint={handleVisitWaypoint}
          />
        )}

        {screen === "event" && currentEvent && (
          <VNEventScreen
            key={`event-${session.nodeIndex}-${session.queueIndex}`}
            content={content}
            session={session}
            item={currentEvent}
            autoPlay={autoPlay}
            soundEnabled={soundEnabled}
            hideUI={hideUI}
            onToggleHideUI={() => setHideUI((prev) => !prev)}
            onToggleAutoPlay={() => setAutoPlay((prev) => !prev)}
            onOpenBacklog={() => setBacklogOpen(true)}
            onChoice={resolveEventChoice}
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
            onArchive={() => setScreen("archive")}
          />
        )}

        {screen === "archive" && (
          <ArchiveScreen
            content={content}
            onBack={() => setScreen(session.history.length ? "route" : "home")}
            onViewImage={setViewerPath}
          />
        )}
      </main>

      {/* Backlog / Memory Log Drawer */}
      <VNBacklog
        logs={logs}
        isOpen={backlogOpen}
        onClose={() => setBacklogOpen(false)}
      />

      {/* High-Resolution Historical Photo Modal */}
      {viewerPath && (
        <ImageViewer
          path={viewerPath}
          content={content}
          onClose={() => setViewerPath(null)}
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
        onClose={() => setPassportOpen(false)}
        onSelectWaypoint={() => {
          setPassportOpen(false);
          setScreen("route");
        }}
      />
    </div>
  );
}
