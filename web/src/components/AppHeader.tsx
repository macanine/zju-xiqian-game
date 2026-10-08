import type { ReactElement } from "react";
import type { ContentBundle } from "../domain/content";
import type { Resources } from "../domain/rules";
import { resourceLabels, type Screen } from "../domain/session";

export function AppHeader({
  content,
  resources,
  nodeName,
  screen,
  soundEnabled,
  onToggleSound,
  onOpenBacklog,
  onOpenPassport,
  onArchive,
  onHome,
}: {
  content: ContentBundle;
  resources: Resources;
  nodeName: string;
  screen: Screen;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenBacklog: () => void;
  onOpenPassport: () => void;
  onArchive: () => void;
  onHome: () => void;
}): ReactElement {
  return (
    <header className="vn-topbar">
      {/* Primary Top Bar Row: Brand Title & Global Actions */}
      <div className="vn-topbar-primary">
        <div className="vn-topbar-left">
          <button className="vn-brand-seal" onClick={onHome} aria-label="返回封面">
            <span className="seal-char">浙</span>
            <div className="seal-text">
              <strong>文軍長征</strong>
              <span>1937—1946</span>
            </div>
          </button>
          <div className="vn-current-station">
            <span className="station-kicker">當前紀事</span>
            <b className="station-name">{nodeName}</b>
          </div>
        </div>

        <nav className="vn-topbar-right">
          <button
            className="vn-icon-button"
            onClick={onToggleSound}
            title={soundEnabled ? "关闭音效" : "开启音效"}
            aria-label="音效开关"
          >
            {soundEnabled ? "🔊" : "🔇"}
          </button>
          <button
            className="vn-nav-button"
            onClick={onOpenPassport}
            title="檢閱西遷行軍通關路引文牒（快捷鍵 P）"
          >
            <span>📜</span> 文牒
          </button>
          <button className="vn-nav-button" onClick={onOpenBacklog}>
            <span>📖</span> 手記
          </button>
          <button
            className={`vn-nav-button ${screen === "archive" ? "is-active" : ""}`}
            onClick={onArchive}
          >
            <span>📂</span> 檔案
          </button>
          <button className="vn-nav-button" onClick={onHome}>
            <span>↻</span> 歸途
          </button>
        </nav>
      </div>

      {/* Four Core Survival Resources Styled as Archival Seals (舒展血条与物资栏) */}
      <div className="vn-resources-deck" aria-label="行军生存物资与状态">
        {(["supplies", "ration", "health", "morale"] as const).map((key) => {
          const cfg = content.storyline.config.resources[key];
          const val = resources[key];
          const meta = resourceLabels[key];
          const pct = Math.max(0, Math.min(100, (val / cfg.max) * 100));
          const isCritical = pct <= 25;

          return (
            <div
              className={`vn-resource-chip vn-res-${key} ${isCritical ? "is-critical" : ""}`}
              key={key}
              title={`${meta.name}: ${val}/${cfg.max}`}
            >
              <div className="chip-seal">{meta.seal}</div>
              <div className="chip-details">
                <div className="chip-label">
                  <span className="chip-name">{meta.name}</span>
                  <strong className="chip-value">{val}</strong>
                </div>
                <div className="chip-bar">
                  <i style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </header>
  );
}
