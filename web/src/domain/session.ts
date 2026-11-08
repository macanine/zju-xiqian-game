import type {
  Choice,
  ContentBundle,
  LocationEvent,
  RandomEvent,
  StoryNode,
} from "./content";
import {
  initialResources,
  randomAt,
  resolveChoice,
  selectWeightedEvent,
  type Resolution,
  type Resources,
} from "./rules";

export const FLAG_LABELS: Record<string, string> = {
  doubt: "求是存亡之思",
  siku: "护持文澜四库",
  dike: "筑就浙大长堤",
  memorial: "铭悼松山素车",
  debate: "求是诚朴之辨",
  anthem: "唱响大不自多",
  cambridge: "见证东方剑桥",
};

export type Screen = "home" | "route" | "event" | "archive" | "ending";

export type QueuedEvent =
  | {
      kind: "location";
      node: StoryNode;
      event: LocationEvent;
      photoIndex: number;
    }
  | {
      kind: "random";
      node: StoryNode;
      event: RandomEvent;
    };

export interface Session {
  seed: number;
  resources: Resources;
  flags: Set<string>;
  nodeIndex: number;
  queue: QueuedEvent[];
  queueIndex: number;
  history: string[];
}

export const resourceLabels: Record<
  keyof Resources,
  { name: string; seal: string }
> = {
  supplies: { name: "图书仪器", seal: "典" },
  ration: { name: "行军口粮", seal: "粮" },
  health: { name: "队伍健康", seal: "体" },
  morale: { name: "全校士气", seal: "志" },
};

function queueRandomEvent(node: StoryNode, event: RandomEvent): QueuedEvent {
  return {
    kind: "random",
    node,
    event,
  };
}

export interface EventResolution {
  result: Resolution;
  choiceText: string;
}

/** Resolve an event without mutating session state, so the UI can preview it. */
export function resolveQueuedChoice(
  content: ContentBundle,
  session: Pick<Session, "seed" | "resources" | "history" | "queueIndex">,
  item: QueuedEvent,
  choice: Choice,
): EventResolution {
  const isAutomaticRandomEvent =
    item.kind === "random" && item.event.choices.length === 0;
  const autoOutcomes =
    item.kind === "random" ? (item.event.autoOutcomes ?? []) : [];
  const resolvedChoice = isAutomaticRandomEvent
    ? autoOutcomes.length > 0
      ? { label: "抽签", outcomes: autoOutcomes }
      : { label: "抽签", effects: {} }
    : choice;
  const result = resolveChoice(
    session.resources,
    resolvedChoice,
    content.storyline,
    randomAt(session.seed, session.history.length + session.queueIndex),
  );
  return {
    result,
    choiceText: isAutomaticRandomEvent ? "自动检点" : choice.label,
  };
}

/** Build the deterministic event queue for a station. */
export function buildEventQueue(
  content: ContentBundle,
  node: StoryNode,
  session: Pick<Session, "seed">,
): QueuedEvent[] {
  const fixedEventIds = new Set(node.teachingEvents ?? []);
  const insertedFixedIds = new Set<string>();
  const queue: QueuedEvent[] = [];

  for (const [index, event] of (node.locationEvents ?? []).entries()) {
    const isFixedMarker =
      event.choices.length === 0 &&
      event.fixedEventAnchor === true &&
      fixedEventIds.size > 0;

    if (!isFixedMarker) {
      queue.push({
        kind: "location",
        node,
        event,
        photoIndex: node.images.length ? index % node.images.length : 0,
      });
    }

    if (!event.fixedEventAnchor) continue;
    for (const eventId of fixedEventIds) {
      if (insertedFixedIds.has(eventId)) continue;
      const fixedEvent = content.storyline.randomEvents.find(
        (candidate) => candidate.id === eventId,
      );
      if (!fixedEvent) continue;
      queue.push(queueRandomEvent(node, fixedEvent));
      insertedFixedIds.add(eventId);
    }
  }

  for (const eventId of fixedEventIds) {
    if (insertedFixedIds.has(eventId)) continue;
    const fixedEvent = content.storyline.randomEvents.find(
      (candidate) => candidate.id === eventId,
    );
    if (fixedEvent) queue.push(queueRandomEvent(node, fixedEvent));
  }

  if (fixedEventIds.size > 0) return queue;

  const shouldDraw =
    randomAt(session.seed, node.order + 10) <
    content.storyline.config.travel.randomEventChancePerLeg;
  if (!shouldDraw) return queue;

  const drawnEvent = selectWeightedEvent(
    content.storyline.randomEvents,
    node.id,
    randomAt(session.seed, node.order + 30),
  );
  queue.push(queueRandomEvent(node, drawnEvent));
  return queue;
}

export function newSession(content: ContentBundle): Session {
  return {
    seed: 19370924,
    resources: initialResources(content.storyline),
    flags: new Set(),
    nodeIndex: 0,
    queue: [],
    queueIndex: 0,
    history: [],
  };
}
