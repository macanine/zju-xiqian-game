import { useEffect, useMemo, useState, type ReactElement } from "react";
import { assetUrl, imageCaption, type ContentBundle, type StoryNode } from "../domain/content";
import journeyAmbience from "../assets/illustrations/journey_ambience.jpg";

export interface VNStageProps {
  content: ContentBundle;
  node: StoryNode;
  photoPath?: string;
  screen: "home" | "route" | "event" | "archive" | "ending";
  onViewImage?: (path: string) => void;
}

export function VNStage({
  content,
  node,
  photoPath,
  screen,
  onViewImage,
}: VNStageProps): ReactElement {
  const isJianWithoutPhoto =
    node.id === "03-jian" &&
    !photoPath &&
    node.images.length === 0 &&
    !node.backgroundHint;

  // Determine suitable background image
  const resolvedPath = useMemo(() => {
    if (isJianWithoutPhoto) return "";
    if (photoPath) return photoPath;
    if (node.images && node.images.length > 0) return node.images[0];
    if (node.backgroundHint) return node.backgroundHint;
    const yishanHero = content.storyline.nodes.find((item) => item.id === "05-yishan")?.images[0];
    return yishanHero || "";
  }, [photoPath, node, content, isJianWithoutPhoto]);

  // Double-buffered cross-fade state for butter-smooth visual transitions
  const [currentPath, setCurrentPath] = useState(resolvedPath);
  const [previousPath, setPreviousPath] = useState<string | null>(null);
  const [crossfading, setCrossfading] = useState(false);

  useEffect(() => {
    if (resolvedPath && resolvedPath !== currentPath) {
      setPreviousPath(currentPath);
      setCurrentPath(resolvedPath);
      setCrossfading(true);
      const timer = window.setTimeout(() => {
        setCrossfading(false);
        setPreviousPath(null);
      }, 750);
      return () => window.clearTimeout(timer);
    }
  }, [resolvedPath, currentPath]);

  const caption = currentPath ? imageCaption(currentPath, content) : "";
  return (
    <div className={`vn-stage vn-stage-${screen}`} aria-hidden="true">
      {/* Parchment & Aged Paper Background Layer */}
      <div className="vn-parchment-base" />

      {/* Historical Photo Stage with smooth double-buffer cross-fade */}
      <div className="vn-photo-container">
        {/* Outgoing previous photo layer */}
        {previousPath && crossfading && (
          <div className="vn-photo-frame is-leaving">
            <div
              className="vn-photo-plate"
              style={{ backgroundImage: `url(${assetUrl(previousPath)})` }}
            />
            <div className="vn-photo-grain" />
            <div className="vn-photo-vignette" />
          </div>
        )}

        {/* Incoming active photo layer */}
        {currentPath && !isJianWithoutPhoto ? (
          <div
            className={`vn-photo-frame ${crossfading ? "is-entering" : ""}`}
            onClick={() => onViewImage && onViewImage(currentPath)}
          >
            <div
              className="vn-photo-plate"
              style={{ backgroundImage: `url(${assetUrl(currentPath)})` }}
            />
            <div className="vn-photo-grain" />
            <div className="vn-photo-vignette" />
          </div>
        ) : (
          <div
            className="vn-sketch-plate"
            style={{ backgroundImage: `url(${journeyAmbience})` }}
          >
            <div className="vn-sketch-caption">
              吉安 · 氛围插画（非史料影像）
            </div>
          </div>
        )}
      </div>

      {/* Aged Paper Film Overlay */}
      <div className="vn-film-overlay" />
      <div className="vn-texture-overlay" />

      {/* Floating Historic Footnote Seal in Event mode */}
      {screen === "event" && currentPath && caption && (
        <div className="vn-stage-seal-tag">
          <span className="seal-char">史</span>
          <span className="seal-caption">{caption}</span>
        </div>
      )}
    </div>
  );
}
