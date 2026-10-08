import { useEffect, useState, type ReactElement } from "react";
import { assetUrl, imageCaption, type ContentBundle } from "../domain/content";
import { sound } from "../domain/audio";
import { WAYPOINTS, type WaypointStory } from "../domain/passport";

export interface VNRouteMapProps {
  content: ContentBundle;
  currentNodeIndex: number;
  visitedWaypoints: Set<string>;
  onSelectNode?: (index: number) => void;
  onEnterNode: () => void;
  onArchive: () => void;
  onOpenPassport: () => void;
  onVisitWaypoint: (wp: WaypointStory) => void;
}

interface MapCoordinate {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  province: string;
}

const NODE_COORDINATES: Record<string, MapCoordinate> = {
  "prologue-hangzhou": { x: 88, y: 22, province: "浙江" },
  "01-xitianmushan": { x: 77, y: 14, province: "浙江" },
  "02-jiande": { x: 74, y: 34, province: "浙江" },
  "03-jian": { x: 58, y: 44, province: "江西" },
  "04-taihe": { x: 48, y: 58, province: "江西" },
  "05-yishan": { x: 32, y: 76, province: "广西" },
  "06-zunyi-meitan": { x: 14, y: 38, province: "贵州" },
  "finale-1946": { x: 89, y: 52, province: "浙江" },
};

const WAYPOINT_COORDINATES: Record<
  string,
  { x: number; y: number; province: string; shortName: string }
> = {
  "waypoint-xianghu": { x: 84, y: 34, province: "浙江", shortName: "萧山湘湖" },
  "waypoint-jinhua": { x: 67, y: 36, province: "浙江", shortName: "金华转运" },
  "waypoint-zhangshu": { x: 56, y: 30, province: "江西", shortName: "樟树药市" },
  "waypoint-shacun": { x: 41, y: 68, province: "江西", shortName: "泰和沙村" },
  "waypoint-yongxing": { x: 22, y: 26, province: "贵州", shortName: "湄潭永兴" },
};

function getCleanStationName(name: string): string {
  return name
    .replace(/^第?[一二三四五六七八九十0-9]+站\s*[·-]\s*/, "")
    .replace(/^序章\s*[·-]\s*/, "")
    .replace(/^终章\s*[·-]\s*(1946\s*)?/, "")
    .replace(/\s*\/\s*永兴$/, "")
    .trim();
}

export function VNRouteMap({
  content,
  currentNodeIndex,
  visitedWaypoints,
  onEnterNode,
  onArchive,
  onOpenPassport,
  onVisitWaypoint,
}: VNRouteMapProps): ReactElement {
  const nodes = content.storyline.nodes;
  const [inspectedIndex, setInspectedIndex] = useState(currentNodeIndex);
  const [activeWaypoint, setActiveWaypoint] = useState<WaypointStory | null>(null);

  const inspectedNode = nodes[inspectedIndex] || nodes[currentNodeIndex] || nodes[0];
  const currentNode = nodes[currentNodeIndex] || nodes[0];
  const photo = inspectedNode.images?.[0] || inspectedNode.backgroundHint;

  const handleInspect = (idx: number) => {
    sound.playPageTurn();
    setInspectedIndex(idx);
    setActiveWaypoint(null);
  };

  const handleSelectWaypoint = (wp: WaypointStory) => {
    sound.playPageTurn();
    setActiveWaypoint(wp);
  };

  // Spacebar or Enter to depart from current node
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (activeWaypoint) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        onOpenPassport();
        return;
      }

      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        sound.playSealStamp();
        onEnterNode();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onEnterNode, onOpenPassport, activeWaypoint]);

  return (
    <div className="vn-map-screen">
      {/* Ancient Map Canvas Header */}
      <div className="vn-map-header">
        <div className="vn-map-title-group">
          <span className="vn-map-seal-mark">長征</span>
          <div>
            <h2>國立浙江大學西遷行軍全圖</h2>
            <p>一九三七至一九四六 · 歷時九年 · 涉五省 · 二千六百餘公里</p>
          </div>
        </div>
        <div className="vn-map-header-actions">
          <button className="vn-map-passport-btn" onClick={onOpenPassport}>
            📜 行軍文牒（{visitedWaypoints.size}/{WAYPOINTS.length} 手札）
          </button>
          <button className="vn-map-archive-btn" onClick={onArchive}>
            檢閱全部史料 ↗
          </button>
        </div>
      </div>

      {/* Map Interactive Canvas */}
      <div className="vn-map-board">
        <div className="vn-map-paper-texture" />
        <div className="vn-map-compass" aria-hidden="true">
          <span>北</span>
          <div className="needle" />
        </div>

        {/* SVG Route Paths */}
        <svg
          className="vn-map-svg"
          viewBox="0 0 1000 580"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="routeGradActive" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a8382c" />
              <stop offset="100%" stopColor="#c95843" />
            </linearGradient>
            <linearGradient id="routeGradPassed" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#483d34" />
              <stop offset="100%" stopColor="#7a6755" />
            </linearGradient>
          </defs>

          {/* Mountains and River contour lines (Stylized 2D ancient cartography) */}
          <path
            d="M 100 280 Q 220 220, 340 300 T 580 320 T 820 240"
            fill="none"
            stroke="rgba(140, 115, 85, 0.16)"
            strokeWidth="2.5"
            strokeDasharray="4 6"
          />
          <path
            d="M 160 500 Q 280 450, 460 530 T 730 480"
            fill="none"
            stroke="rgba(140, 115, 85, 0.14)"
            strokeWidth="2"
            strokeDasharray="5 7"
          />
          <path
            d="M 700 180 Q 800 280, 880 380"
            fill="none"
            stroke="rgba(110, 135, 125, 0.18)"
            strokeWidth="2.5"
          />

          {/* Connect nodes with ancient dashed stroke */}
          {nodes.slice(0, -1).map((node, i) => {
            const nextNode = nodes[i + 1];
            const startCoord = NODE_COORDINATES[node.id] || { x: 50, y: 50 };
            const endCoord = NODE_COORDINATES[nextNode.id] || { x: 50, y: 50 };
            const isPassed = i < currentNodeIndex;
            const isCurrentLeg = i === currentNodeIndex;

            const startX = startCoord.x * 10;
            const startY = startCoord.y * 5.8;
            const endX = endCoord.x * 10;
            const endY = endCoord.y * 5.8;

            // Curve control points tailored for each historical leg
            let midX = (startX + endX) / 2;
            let midY = (startY + endY) / 2;

            if (i === 0) {
              // Hangzhou -> Tianmu
              midX = 825;
              midY = 80;
            } else if (i === 1) {
              // Tianmu -> Jiande
              midX = 745;
              midY = 135;
            } else if (i === 2) {
              // Jiande -> Ji'an
              midX = 660;
              midY = 215;
            } else if (i === 3) {
              // Ji'an -> Taihe
              midX = 535;
              midY = 285;
            } else if (i === 4) {
              // Taihe -> Yishan
              midX = 410;
              midY = 405;
            } else if (i === 5) {
              // Yishan -> Zunyi
              midX = 210;
              midY = 360;
            } else if (i === 6) {
              // Grand Return Arc (Zunyi -> Hangzhou 1946)
              midX = 515;
              midY = 45;
            }

            return (
              <g key={`leg-${node.id}-${nextNode.id}`}>
                <path
                  d={`M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`}
                  fill="none"
                  stroke={
                    isPassed
                      ? "url(#routeGradActive)"
                      : i === 6
                        ? "rgba(168, 56, 44, 0.45)"
                        : "rgba(160, 140, 115, 0.35)"
                  }
                  strokeWidth={isPassed ? 3.5 : i === 6 ? 2.5 : 2}
                  strokeDasharray={isPassed && i !== 6 ? "none" : i === 6 ? "5 5" : "6 6"}
                  strokeLinecap="round"
                />
                {isCurrentLeg && (
                  <circle
                    cx={startX}
                    cy={startY}
                    r={6}
                    fill="#a8382c"
                    className="vn-map-pulse-dot"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Interactive Station Nodes */}
        <div className="vn-map-nodes">
          {nodes.map((node, index) => {
            const coord = NODE_COORDINATES[node.id] || {
              x: 10 + index * 11,
              y: 50,
              province: "",
            };
            const isCurrent = index === currentNodeIndex;
            const isPassed = index < currentNodeIndex;
            const isInspected = index === inspectedIndex;
            const cleanName = getCleanStationName(node.name);

            return (
              <button
                key={node.id}
                className={`vn-map-station ${
                  isCurrent ? "is-current" : isPassed ? "is-passed" : "is-future"
                } ${isInspected ? "is-inspected" : ""}`}
                style={{ left: `${coord.x}%`, top: `${coord.y}%` }}
                onClick={() => handleInspect(index)}
                title={`${coord.province} · ${cleanName}（第 ${index + 1} 站）`}
              >
                <div className="station-seal">
                  <span>{index === 0 ? "起" : index === nodes.length - 1 ? "归" : index}</span>
                </div>
                <div className="station-pill">
                  <span className="pill-province">{coord.province}</span>
                  <span className="pill-name">{cleanName}</span>
                  {isCurrent && <span className="pill-status-tag">駐留</span>}
                </div>
              </button>
            );
          })}

          {/* Interactive Route Waypoint Detours */}
          {WAYPOINTS.map((wp) => {
            const coord = WAYPOINT_COORDINATES[wp.id] || {
              x: 50,
              y: 50,
              province: "",
              shortName: wp.name,
            };
            const isVisited = visitedWaypoints.has(wp.id);
            const isSelected = activeWaypoint?.id === wp.id;

            return (
              <button
                key={wp.id}
                className={`vn-map-waypoint ${isVisited ? "is-visited" : "is-unvisited"} ${
                  isSelected ? "is-selected" : ""
                }`}
                style={{ left: `${coord.x}%`, top: `${coord.y}%` }}
                onClick={() => handleSelectWaypoint(wp)}
                title={`【駐地手記】${wp.title} · ${wp.bonus.label}（${isVisited ? "已探訪收錄" : "點擊探訪"}）`}
              >
                <div className="waypoint-pin">
                  <span className="waypoint-seal-char">{wp.sealChar}</span>
                </div>
                <div className="waypoint-tag">
                  <span className="waypoint-tag-label">{coord.shortName}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inspected Node Dossier / Bottom Deck (Responsive) */}
      <div className="vn-map-dossier">
        <div className="dossier-photo-col">
          {photo ? (
            <div className="dossier-photo-wrap">
              <img src={assetUrl(photo)} alt={imageCaption(photo, content)} />
              <div className="dossier-photo-caption">
                {imageCaption(photo, content)}
              </div>
            </div>
          ) : (
            <div className="dossier-no-photo">
              <span className="seal-watermark">吉安</span>
              <p>本段史料留檔文字詳實 · 影像待補</p>
            </div>
          )}
        </div>

        <div className="dossier-text-col">
          <div className="dossier-kicker">
            <span>西遷史記 · 第 {inspectedIndex + 1} / {nodes.length} 站</span>
            <span className="dossier-date">{inspectedNode.period.label}</span>
          </div>
          <h3>{inspectedNode.name}</h3>
          <p className="dossier-summary">{inspectedNode.summary}</p>
          {inspectedNode.facts && inspectedNode.facts.length > 0 && (
            <div className="dossier-facts">
              <b>史料考據：</b>
              <span>{inspectedNode.facts[0]}</span>
            </div>
          )}

          <div className="dossier-actions">
            {inspectedIndex === currentNodeIndex ? (
              <button
                className="vn-map-enter-btn"
                onClick={(e) => {
                  (e.currentTarget as HTMLElement)?.blur();
                  sound.playSealStamp();
                  onEnterNode();
                }}
              >
                <span>{currentNode.isPrologue ? "啓程出發 · 進入序章" : "進入本站劇情"}</span>
                <span className="btn-arrow">→</span>
              </button>
            ) : (
              <button
                className="vn-map-jump-btn"
                onClick={() => handleInspect(currentNodeIndex)}
              >
                返回當前行軍站（{currentNode.name}）
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Waypoint Inspection Modal */}
      {activeWaypoint && (
        <div
          className="vn-waypoint-modal-backdrop"
          onClick={() => setActiveWaypoint(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="vn-waypoint-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="wp-modal-header">
              <div className="wp-modal-title-group">
                <span className="wp-modal-seal">{activeWaypoint.sealChar}</span>
                <div>
                  <h3>{activeWaypoint.title}</h3>
                  <p>鄰近站點：{activeWaypoint.stationNear} · 沿途駐地探索手札</p>
                </div>
              </div>
              <button
                className="wp-modal-close-btn"
                onClick={() => setActiveWaypoint(null)}
                aria-label="關閉"
              >
                ✕
              </button>
            </div>

            <div className="wp-modal-body">
              <div className="wp-modal-story">
                <p>{activeWaypoint.fullStory}</p>
              </div>

              <div className="wp-modal-bonus-box">
                <div className="bonus-pill">
                  <span className="bonus-kicker">史料收穫：</span>
                  <strong>{activeWaypoint.bonus.label}</strong>
                  <i>{activeWaypoint.bonus.effect}</i>
                </div>
              </div>
            </div>

            <div className="wp-modal-footer">
              {visitedWaypoints.has(activeWaypoint.id) ? (
                <div className="wp-modal-visited-state">
                  <span>✓ 此篇手札已錄入《西遷通關路引文牒》</span>
                  <button
                    className="wp-modal-passport-link"
                    onClick={() => {
                      setActiveWaypoint(null);
                      onOpenPassport();
                    }}
                  >
                    翻開文牒檢閱 ➔
                  </button>
                </div>
              ) : (
                <button
                  className="wp-modal-collect-btn"
                  onClick={() => {
                    sound.playSealStamp();
                    onVisitWaypoint(activeWaypoint);
                  }}
                >
                  <span>探訪駐地 · 收錄手札（獲取物資）</span>
                  <span className="btn-arrow">✓</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
