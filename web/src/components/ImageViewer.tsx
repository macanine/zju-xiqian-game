import { useEffect, type ReactElement } from "react";
import {
  assetUrl,
  imageCaption,
  imageLabel,
  type ContentBundle,
} from "../domain/content";

export function ImageViewer({
  path,
  content,
  onClose,
}: {
  path: string;
  content: ContentBundle;
  onClose: () => void;
}): ReactElement {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="vn-photo-modal"
      role="dialog"
      aria-modal="true"
      aria-label="检阅历史原图"
      onClick={onClose}
    >
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="关闭">
          ✕
        </button>
        <div className="modal-photo-wrap">
          <img src={assetUrl(path)} alt={imageCaption(path, content)} />
        </div>
        <div className="modal-caption-wrap">
          <div className="caption-seal">原始档案</div>
          <div>
            <h4>{imageCaption(path, content)}</h4>
            <p>{imageLabel(path)} · 浙江大学西迁历史档案 · 原始影像翻拍</p>
          </div>
        </div>
      </div>
    </div>
  );
}
