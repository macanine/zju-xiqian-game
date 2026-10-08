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
        <div className="ending-top-seal">復員回杭</div>
        <div className="ending-header">
          <span className="ending-kicker">一九四六年 · 歷時九年萬里長征</span>
          <h1>路還在，學校也還在。</h1>
          <p className="ending-sub">{content.storyline.endings.main.title}</p>
        </div>

        {endingImage && (
          <div className="ending-hero-photo">
            <img src={assetUrl(endingImage)} alt="浙江大学复员回杭" />
            <div className="photo-caption-bar">
              <span>一九四六年夏 · 國立浙江大學全面復員杭州慶功大會</span>
            </div>
          </div>
        )}

        {/* Historical Invariable Mainline Narrative */}
        <div className="ending-parchment-block">
          <div className="block-seal">史實</div>
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
              <span className="card-badge">求是行軍留印</span>
              <h2>{ending.card.title}</h2>
              <p className="card-tone">{ending.card.tone}</p>
            </div>

            <div className="ending-stats-ribbon">
              <div className="stat-cell">
                <strong>{Math.round(ending.preserveRate * 100)}%</strong>
                <span>圖書儀器保全率</span>
              </div>
              <div className="stat-cell">
                <strong>{resources.health}</strong>
                <span>全隊最終健康</span>
              </div>
              <div className="stat-cell">
                <strong>{resources.morale}</strong>
                <span>全校心志士氣</span>
              </div>
            </div>
          </div>
        </div>

        {/* Epilogue Fragments */}
        <div className="ending-epilogue-block">
          <div className="block-seal">後記</div>
          <h4>行軍後記 · 歷史回響</h4>
          {ending.fragments.length ? (
            ending.fragments.map((frag) => (
              <div className="epilogue-item" key={frag.flag}>
                <span className="epilogue-stamp">「{frag.flag}」</span>
                <p>{frag.text}</p>
              </div>
            ))
          ) : (
            <p className="epilogue-empty">這一次征途，未留存額外的特殊印記。</p>
          )}
        </div>

        {/* Actions */}
        <div className="ending-actions-deck">
          <button className="ending-primary-btn" onClick={onRestart}>
            <span>再歷長征 · 重新出發</span>
            <span>↻</span>
          </button>
          <button className="ending-secondary-btn" onClick={onArchive}>
            回顧全體二十五張史料檔案
          </button>
        </div>
      </div>
    </section>
  );
}
