import { useEffect, type ReactElement } from "react";
import type { ContentBundle } from "../domain/content";

export function HomeScreen({
  content,
  onStart,
  onArchive,
}: {
  content: ContentBundle;
  onStart: () => void;
  onArchive: () => void;
  onOpenPassport?: () => void;
}): ReactElement {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        onStart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onStart]);

  return (
    <section className="vn-home-screen">
      <div className="vn-book-cover">
        {/* Traditional Binding Thread Graphics */}
        <div className="vn-book-stitch" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className="vn-cover-content">
          <div className="vn-cover-motto">
            <span>國立浙江大學西遷校史紀事</span>
            <span>中華民國二十六年 · 一九三七年秋</span>
          </div>

          <div className="vn-cover-title-panel">
            <div className="vn-cover-title-seal">求是</div>
            <h1>文軍長征</h1>
            <p className="vn-cover-sub">
              在烽火漫卷與九年萬里流亡之間 · 守護求是火種的真實足跡
            </p>
          </div>

          <div className="vn-cover-quote">
            <p>「大不自多 · 海納江河 · 唯學無際 · 際於天地」</p>
            <span>— 竺可楨校長題辭 · 浙大校歌</span>
          </div>

          <div className="vn-cover-actions">
            <button
              className="vn-cover-start-btn"
              onClick={(e) => {
                (e.currentTarget as HTMLElement)?.blur();
                onStart();
              }}
            >
              <span className="btn-seal">開卷</span>
              <span>啓程入蜀黔 · 從杭州出發</span>
              <span className="btn-arrow">→</span>
            </button>
            <button
              className="vn-cover-archive-btn"
              onClick={(e) => {
                (e.currentTarget as HTMLElement)?.blur();
                onArchive();
              }}
            >
              檢閱二十五張原始影像檔案
            </button>
          </div>

          <div className="vn-cover-footer-meta">
            <span>八個歷史遷徒節點</span>
            <i className="meta-dot">·</i>
            <span>
              {content.storyline.config.decisionEventIds?.length ?? 10} 次求是抉擇
            </span>
            <i className="meta-dot">·</i>
            <span>純2D校史視覺小說</span>
          </div>
        </div>
      </div>
    </section>
  );
}
