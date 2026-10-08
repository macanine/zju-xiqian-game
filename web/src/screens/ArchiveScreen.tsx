import { useMemo, type ReactElement } from "react";
import {
  assetUrl,
  imageCaption,
  type ContentBundle,
} from "../domain/content";
import { sound } from "../domain/audio";

export function ArchiveScreen({
  content,
  onBack,
  onViewImage,
}: {
  content: ContentBundle;
  onBack: () => void;
  onViewImage: (path: string) => void;
}): ReactElement {
  const images = useMemo(() => {
    const seen = new Set<string>();
    const result: Array<{ path: string; caption: string; group: string }> = [];
    for (const site of content.sites.sites)
      for (const path of site.images ?? [])
        if (!seen.has(path)) {
          seen.add(path);
          result.push({
            path,
            caption: imageCaption(path, content),
            group: site.name,
          });
        }
    for (const gallery of content.sites.galleries)
      for (const image of gallery.images)
        if (!seen.has(image.path)) {
          seen.add(image.path);
          result.push({
            path: image.path,
            caption: image.caption ?? imageCaption(image.path, content),
            group: gallery.name,
          });
        }
    return result;
  }, [content]);

  return (
    <section className="vn-archive-screen">
      <div className="vn-archive-container">
        <div className="vn-archive-header">
          <div className="archive-title-wrap">
            <span className="archive-seal">鑑</span>
            <div>
              <h2>西遷原始史料影像檔案閣</h2>
              <p>
                共計收錄 {images.length} 張原始歷史照片 ·
                每一幀皆為流亡歲月的如磐證據
              </p>
            </div>
          </div>
          <button className="vn-archive-back-btn" onClick={onBack}>
            ← 返回校史長征
          </button>
        </div>

        <div className="vn-archive-grid">
          {images.map((image) => (
            <button
              className="vn-archive-card"
              key={image.path}
              onClick={() => {
                sound.playPageTurn();
                onViewImage(image.path);
              }}
            >
              <div className="card-photo-frame">
                <img
                  src={assetUrl(image.path)}
                  alt={image.caption}
                  loading="lazy"
                />
                <div className="card-zoom-badge">⌕ 檢閱</div>
              </div>
              <div className="card-caption-block">
                <span className="card-group-tag">{image.group}</span>
                <b className="card-title">{image.caption}</b>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
