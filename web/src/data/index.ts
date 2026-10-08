import type { ContentBundle } from "../domain/content";
import { SITES_DATA } from "./sites";
import { TIMELINE_DATA } from "./timeline";
import { STORYLINE_DATA } from "./storyline";

export { SITES_DATA } from "./sites";
export { TIMELINE_DATA } from "./timeline";
export { STORYLINE_DATA } from "./storyline";

export const CONTENT_BUNDLE: ContentBundle = {
  sites: SITES_DATA,
  timeline: TIMELINE_DATA,
  storyline: STORYLINE_DATA,
};
