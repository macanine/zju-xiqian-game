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
          {/* 线装书缝线装饰 */}
        <div className="vn-book-stitch" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className="vn-cover-content">
          <div className="vn-cover-motto">
            <span>国立浙江大学西迁校史纪事</span>
            <span>中华民国二十六年 · 一九三七年秋</span>
          </div>

          <div className="vn-cover-title-panel">
            <h1>文军长征</h1>
            <p className="vn-cover-sub">
              在烽火漫卷与九年万里流亡之间 · 守护求是火种的真实足迹
            </p>
          </div>

          <div className="vn-cover-quote">
            <p>「大不自多 · 海纳江河 · 唯学无际 · 际于天地」</p>
            <span>— 竺可桢校长题辞 · 浙大校歌</span>
          </div>

          <div className="vn-cover-actions">
            <button
              className="vn-cover-start-btn"
              onClick={(e) => {
                (e.currentTarget as HTMLElement)?.blur();
                onStart();
              }}
            >
              <span className="btn-seal">开卷</span>
              <span>启程入蜀黔 · 从杭州出发</span>
              <span className="btn-arrow">→</span>
            </button>
            <button
              className="vn-cover-archive-btn"
              onClick={(e) => {
                (e.currentTarget as HTMLElement)?.blur();
                onArchive();
              }}
            >
              检阅二十五张原始影像档案
            </button>
          </div>

          <div className="vn-cover-footer-meta">
            <span>八个历史迁校节点</span>
            <i className="meta-dot">·</i>
            <span>
              {content.storyline.config.decisionEventIds?.length ?? 10} 次求是抉择
            </span>
            <i className="meta-dot">·</i>
            <span>纯2D校史视觉小说</span>
          </div>
        </div>
      </div>
    </section>
  );
}
