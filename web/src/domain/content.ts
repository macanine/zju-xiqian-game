export type ResourceKey = "supplies" | "ration" | "health" | "morale";
export type Effects = Partial<Record<ResourceKey, number>>;

export interface EventDialogue {
  speaker: string;
  role?: string;
  text: string;
}

export interface Choice {
  label: string;
  effects?: Effects;
  fallbackEffects?: Effects;
  flag?: string;
  outcomes?: Array<{ weight: number; effects: Effects }>;
  note?: string;
  penalty?: string;
  resolution?: string;
}

export interface LocationEvent {
  id: string;
  title: string;
  text: string;
  type?: string;
  choices: Choice[];
  note?: string;
  dialogues?: EventDialogue[];
}

export interface StoryNode {
  id: string;
  order: number;
  name: string;
  period: { label: string; start: string; end?: string };
  summary?: string;
  facts?: string[];
  images: string[];
  backgroundHint?: string;
  locationEvents?: LocationEvent[];
  teachingEvents?: string[];
  isPrologue?: boolean;
}

export interface QteConfig {
  windowSeconds: number;
  prompt: string;
  action: string;
}

export interface RandomEvent {
  id: string;
  name: string;
  weight: number;
  weightOverrides?: Record<string, number>;
  mechanic?: string;
  qte?: QteConfig;
  isPositive?: boolean;
  text: string;
  choices: Choice[];
  autoOutcomes?: Array<{ weight: number; effects: Effects }>;
  modifier?: string;
}

export interface ResourceConfig {
  label: string;
  initial: number;
  min: number;
  max: number;
}

export interface SiteImage {
  path: string;
  caption?: string;
}

export interface Site {
  id: string;
  order: number;
  name: string;
  place?: string;
  period?: { label?: string; start?: string; end?: string };
  summary?: string;
  events?: unknown[];
  tags?: string[];
  images?: string[];
}

export interface Gallery {
  id: string;
  name: string;
  period?: string;
  summary?: string;
  facts?: string[];
  images: SiteImage[];
}

export interface SitesData {
  sites: Site[];
  galleries: Gallery[];
}

export interface TimelineEntry {
  date: string;
  stageId: string | null;
  stage: string;
  text: string;
  type: string;
}

export interface TimelineData {
  timeline: TimelineEntry[];
}

export interface Endings {
  main: {
    id: string;
    isFixed: boolean;
    title: string;
    lines: string[];
  };
  character: {
    _rule: string;
    cards: Array<{
      priority: number;
      id: string;
      title: string;
      condition: string;
      tone: string;
    }>;
  };
  epilogueFragments: {
    _rule: string;
    fragments: Array<{ flag: string; text: string }>;
  };
}

export interface Storyline {
  config: {
    resources: Record<ResourceKey, ResourceConfig>;
    travel: {
      rationPerLeg: number;
      healthPerNode: number;
      randomEventChancePerLeg: number;
    };
    forcedRest: { effects: Effects; skipLegs: number; note: string };
    decisionEventIds?: string[];
    decisionRule?: string;
  };
  cast: {
    fictional: Array<{ id: string; name: string; role: string; bonus: string }>;
    historical: unknown[];
  };
  nodes: StoryNode[];
  randomEvents: RandomEvent[];
  endings: Endings;
}

export interface ContentBundle {
  sites: SitesData;
  timeline: TimelineData;
  storyline: Storyline;
}

import { CONTENT_BUNDLE } from "../data";

export function assetUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}

export async function loadContent(): Promise<ContentBundle> {
  return CONTENT_BUNDLE;
}

export function imageCaption(path: string, content: ContentBundle): string {
  for (const gallery of content.sites.galleries) {
    const match = gallery.images.find((image) => image.path === path);
    if (match?.caption) return match.caption;
  }
  const site = content.sites.sites.find((item) => item.images?.includes(path));
  return `${site?.name ?? "西迁史料"} · 原始影像`;
}

export function imageLabel(path: string): string {
  return (
    path
      .split("/")
      .pop()
      ?.replace(/\.[^.]+$/, "")
      .replace(/_/g, " ") ?? path
  );
}
