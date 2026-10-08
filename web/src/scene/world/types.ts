import type {
  CatmullRomCurve3,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import type { ContentBundle } from "../../domain/content";

export type CinematicScreen = "home" | "route" | "event" | "archive" | "ending";

export interface TravelWorldProps {
  content: ContentBundle;
  screen: CinematicScreen;
  storyNodeId: string;
  eventId?: string;
  nodeIndex: number;
  eventIndex: number;
  eventCount: number;
}

export interface WorldRuntime {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  route: CatmullRomCurve3;
  progress: number;
  targetProgress: number;
  elapsed: number;
}
