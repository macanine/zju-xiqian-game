import type {
  Choice,
  ContentBundle,
  LocationEvent,
  RandomEvent,
  StoryNode,
} from "./content";
import { initialResources, type Resources } from "./rules";

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
      interactive: boolean;
    }
  | { kind: "random"; node: StoryNode; event: RandomEvent; interactive: boolean };

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

export const fallbackDecisionEventIds = new Set([
  "hz-01",
  "hz-02",
  "xm-01",
  "xm-02",
  "jd-01",
  "jd-02",
  "jd-03",
  "ja-01",
  "ja-02",
  "th-01",
  "th-02",
  "ys-01",
  "ys-02",
  "zy-01",
  "zy-02",
  "re-airraid",
  "re-disease",
  "re-traffic",
  "re-camp",
]);

export function isDecisionEvent(
  content: ContentBundle,
  event: { id: string; choices?: Choice[] } | string,
): boolean {
  if (typeof event === "object" && event.choices && event.choices.length > 1) {
    return true;
  }
  const id = typeof event === "string" ? event : event.id;
  return Boolean(
    content.storyline.config.decisionEventIds?.includes(id) ??
      fallbackDecisionEventIds.has(id),
  );
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
