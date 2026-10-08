import type { ReactElement } from "react";
import type { ContentBundle } from "../domain/content";
import type { Session } from "../domain/session";
import type { WaypointStory } from "../domain/passport";
import { VNRouteMap } from "../scene/VNRouteMap";

export function RouteScreen({
  content,
  session,
  visitedWaypoints,
  onEnter,
  onArchive,
  onOpenPassport,
  onVisitWaypoint,
}: {
  content: ContentBundle;
  session: Session;
  lastResolution?: string | null;
  visitedWaypoints: Set<string>;
  onEnter: () => void;
  onArchive: () => void;
  onOpenPassport: () => void;
  onVisitWaypoint: (wp: WaypointStory) => void;
}): ReactElement {
  return (
    <section className="vn-route-screen">
      <VNRouteMap
        content={content}
        currentNodeIndex={session.nodeIndex}
        visitedWaypoints={visitedWaypoints}
        onEnterNode={onEnter}
        onArchive={onArchive}
        onOpenPassport={onOpenPassport}
        onVisitWaypoint={onVisitWaypoint}
      />
    </section>
  );
}
