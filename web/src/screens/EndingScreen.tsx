import type { ReactElement } from "react";
import { assetUrl, type ContentBundle } from "../domain/content";
import type { EndResult, Resources } from "../domain/rules";

export function EndingScreen({
  content,
  ending,
  resources,
  onRestart,
  onArchive,
}: {
  content: ContentBundle;
  ending: EndResult;
  resources: Resources;
  onRestart: () => void;
  onArchive: () => void;
}): ReactElement {
  const endingImage =
    content.storyline.nodes.at(-1)?.images[0] ??
    content.storyline.nodes.find((node) => node.images.length)?.images[0];

  return (
    <section className="vn-ending-screen">
      <div className="vn-ending-scroll">
        <div className="ending-top-seal">复员回杭</div>
        <div className="ending-header">
          <span className="ending-kicker">一九四六年 · 历时九年万里长征</span>
          <h1>路还在，学校也还在。</h1>
          <p className="ending-sub">{content.storyline.endings.main.title}</p>
        </div>

        {endingImage && (
          <div className="ending-hero-photo">
            <img src={assetUrl(endingImage)} alt="浙江大学复员回杭" />
            <div className="photo-caption-bar">
              <span>一九四六年夏 · 国立浙江大学全面复员杭州庆功大会</span>
            </div>
          </div>
        )}

        {/* Historical Invariable Mainline Narrative */}
        <div className="ending-parchment-block">
          <div className="block-seal">史实</div>
          <h3>{content.storyline.endings.main.title}</h3>
          <div className="block-lines">
            {content.storyline.endings.main.lines.map((line, idx) => (
              <p key={`line-${idx}`}>{line}</p>
            ))}
          </div>
        </div>

        {/* Player Evaluated Character Card */}
        <div className="ending-character-block">
          <div className="block-seal">考評</div>
          <div className="character-card-inner">
            <div className="character-card-header">
              <span className="card-badge">西迁行军留印</span>
              <h2>{ending.card.title}</h2>
              <p className="card-tone">{ending.card.tone}</p>
            </div>

            <div className="ending-stats-ribbon">
              <div className="stat-cell">
                <strong>{Math.round(ending.preserveRate * 100)}%</strong>
                <span>图书仪器保全率</span>
              </div>
              <div className="stat-cell">
                <strong>{resources.health}</strong>
                <span>全队最终健康</span>
              </div>
              <div className="stat-cell">
                <strong>{resources.morale}</strong>
                <span>全校心志士气</span>
              </div>
            </div>
          </div>
        </div>

        {/* Epilogue Fragments */}
        <div className="ending-epilogue-block">
          <div className="block-seal">后记</div>
          <h4>行军后记 · 历史回响</h4>
          {ending.fragments.length ? (
            ending.fragments.map((frag) => (
              <div className="epilogue-item" key={frag.flag}>
                <span className="epilogue-stamp">「{frag.flag}」</span>
                <p>{frag.text}</p>
              </div>
            ))
          ) : (
            <p className="epilogue-empty">这一次征途，未留存额外的特殊印记。</p>
          )}
        </div>

        {/* Actions */}
        <div className="ending-actions-deck">
          <button className="ending-primary-btn" onClick={onRestart}>
            <span>再历长征 · 重新出发</span>
            <span>↻</span>
          </button>
          <button className="ending-secondary-btn" onClick={onArchive}>
            回顾全体二十五张史料档案
          </button>
        </div>
      </div>
    </section>
  );
}
