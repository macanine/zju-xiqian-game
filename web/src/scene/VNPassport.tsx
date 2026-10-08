import { useEffect, useState, type ReactElement } from "react";
import { PASSPORT_STAMPS, WAYPOINTS, type WaypointStory } from "../domain/passport";
import { sound } from "../domain/audio";

export interface VNPassportProps {
  unlockedNodeIndex: number;
  visitedWaypoints: Set<string>;
  isOpen: boolean;
  onClose: () => void;
  onSelectWaypoint?: (wp: WaypointStory) => void;
}

export function VNPassport({
  unlockedNodeIndex,
  visitedWaypoints,
  isOpen,
  onClose,
  onSelectWaypoint,
}: VNPassportProps): ReactElement | null {
  const [selectedStampId, setSelectedStampId] = useState<string>(PASSPORT_STAMPS[0].id);
  const [tab, setTab] = useState<"stamps" | "waypoints">("stamps");

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "p" || e.key === "P") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentStamp =
    PASSPORT_STAMPS.find((s) => s.id === selectedStampId) || PASSPORT_STAMPS[0];
  const isStampUnlocked = currentStamp.unlockedAtOrder <= unlockedNodeIndex;

  return (
    <div
      className="vn-passport-modal"
      role="dialog"
      aria-modal="true"
      aria-label="西迁行军通关文牒"
      onClick={() => {
        sound.playPageTurn();
        onClose();
      }}
    >
      <div className="vn-passport-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Header Ribbon */}
        <div className="passport-header">
          <div className="passport-title-wrap">
            <span className="passport-top-seal">牒</span>
            <div>
              <h3>國立浙江大學西遷 · 通關路引印譜</h3>
              <p>八大驛站朱砂官印 · 沿途五處駐地見聞手札</p>
            </div>
          </div>
          <div className="passport-tab-switch">
            <button
              className={`tab-btn ${tab === "stamps" ? "is-active" : ""}`}
              onClick={() => {
                sound.playPageTurn();
                setTab("stamps");
              }}
            >
              八站印譜（{Math.min(unlockedNodeIndex + 1, PASSPORT_STAMPS.length)}/{PASSPORT_STAMPS.length}）
            </button>
            <button
              className={`tab-btn ${tab === "waypoints" ? "is-active" : ""}`}
              onClick={() => {
                sound.playPageTurn();
                setTab("waypoints");
              }}
            >
              沿途手札（{visitedWaypoints.size}/{WAYPOINTS.length}）
            </button>
          </div>
          <button
            className="passport-close-btn"
            onClick={() => {
              sound.playPageTurn();
              onClose();
            }}
            aria-label="关闭文牒"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        {tab === "stamps" ? (
          <div className="passport-body-stamps">
            {/* Left Column: 8 Big Vermilion Seals Grid */}
            <div className="stamps-grid-col">
              <div className="stamps-grid">
                {PASSPORT_STAMPS.map((stamp) => {
                  const unlocked = stamp.unlockedAtOrder <= unlockedNodeIndex;
                  const selected = stamp.id === selectedStampId;

                  return (
                    <button
                      key={stamp.id}
                      className={`stamp-cell ${unlocked ? "is-unlocked" : "is-locked"} ${
                        selected ? "is-selected" : ""
                      }`}
                      onClick={() => {
                        sound.playPageTurn();
                        setSelectedStampId(stamp.id);
                      }}
                    >
                      <div className="stamp-box">
                        <span className="seal-char">{unlocked ? stamp.sealChar : "印"}</span>
                        <span className="stamp-sub-tag">
                          {unlocked ? stamp.period.split("—")[0] : "待行"}
                        </span>
                      </div>
                      <span className="stamp-station-name">{stamp.stationName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Inscription Details */}
            <div className="stamp-detail-col">
              <div className="detail-card">
                <div className="detail-meta-row">
                  <span className="detail-period-tag">{currentStamp.period}</span>
                  <span className={`detail-status-pill ${isStampUnlocked ? "is-ok" : "is-pending"}`}>
                    {isStampUnlocked ? "已鈐印蓋章" : "征途尚未抵達"}
                  </span>
                </div>

                <div className="detail-seal-display">
                  <div className={`seal-large ${isStampUnlocked ? "is-red" : "is-gray"}`}>
                    <span>{isStampUnlocked ? currentStamp.sealChar : "封"}</span>
                  </div>
                  <div>
                    <h4>{currentStamp.sealName}</h4>
                    <p className="detail-station">{currentStamp.stationName}</p>
                  </div>
                </div>

                <div className="detail-epigraph-box">
                  <span className="epigraph-title">求是行軍手札紀要：</span>
                  <p className="epigraph-content">
                    {isStampUnlocked
                      ? currentStamp.epigraph
                      : "行軍先遣隊伍尚未踏入此站。隨隊伍前進完成此站歷史抉擇後，方可在此鈐蓋朱砂大印。"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Waypoints Tab */
          <div className="passport-body-waypoints">
            <div className="waypoints-list">
              {WAYPOINTS.map((wp) => {
                const visited = visitedWaypoints.has(wp.id);

                return (
                  <div
                    key={wp.id}
                    className={`waypoint-card ${visited ? "is-visited" : "is-unvisited"}`}
                  >
                    <div className="wp-seal-mark">
                      <span>{wp.sealChar}</span>
                    </div>
                    <div className="wp-info">
                      <div className="wp-title-row">
                        <strong>{wp.title}</strong>
                        <span className="wp-near-tag">{wp.stationNear}</span>
                      </div>
                      <p className="wp-snippet">
                        {visited ? wp.fullStory : `${wp.snippet}（在西遷全圖上點擊探訪解鎖）`}
                      </p>
                      <div className="wp-bonus-tag">
                        <span>史料收穫：</span>
                        <b>{wp.bonus.label}</b>
                        <i>{wp.bonus.effect}</i>
                      </div>
                    </div>
                    {onSelectWaypoint && !visited && (
                      <button
                        className="wp-explore-jump-btn"
                        onClick={() => {
                          onClose();
                          onSelectWaypoint(wp);
                        }}
                      >
                        地圖探訪 ↗
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="passport-footer">
          <span>點擊任意處或按 ESC 鍵收起文牒</span>
        </div>
      </div>
    </div>
  );
}
