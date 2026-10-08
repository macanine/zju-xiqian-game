import { useEffect, type ReactElement } from "react";
import { sound } from "../domain/audio";

export interface LogEntry {
  stage: string;
  speaker: string;
  text: string;
  choice?: string;
  resolution?: string;
}

export interface VNBacklogProps {
  logs: LogEntry[];
  isOpen: boolean;
  onClose: () => void;
}

export function VNBacklog({ logs, isOpen, onClose }: VNBacklogProps): ReactElement | null {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "l" || e.key === "L") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="vn-backlog-modal"
      role="dialog"
      aria-modal="true"
      aria-label="西迁见闻手记"
      onClick={() => {
        sound.playPageTurn();
        onClose();
      }}
    >
      <div
        className="vn-backlog-sheet"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="vn-backlog-header">
          <div className="backlog-title-wrap">
            <span className="backlog-seal">憶</span>
            <div>
              <h3>西遷見聞手記 · 歷史存檔</h3>
              <p>一紙一墨 · 一路走來的求是痕跡</p>
            </div>
          </div>
          <button
            className="backlog-close-btn"
            onClick={() => {
              sound.playPageTurn();
              onClose();
            }}
            aria-label="关闭手记"
          >
            ✕
          </button>
        </div>

        <div className="vn-backlog-body">
          {logs.length === 0 ? (
            <div className="backlog-empty">
              <span>求是</span>
              <p>長征伊始，暫無更多筆錄……</p>
            </div>
          ) : (
            logs.map((entry, idx) => (
              <div className="backlog-item" key={`log-${idx}`}>
                <div className="backlog-item-meta">
                  <span className="backlog-item-stage">{entry.stage}</span>
                  <span className="backlog-item-speaker">{entry.speaker}</span>
                </div>
                <div className="backlog-item-text">{entry.text}</div>
                {entry.choice && (
                  <div className="backlog-item-choice">
                    <span className="choice-tag">決策筆錄：</span>
                    <b>{entry.choice}</b>
                    {entry.resolution && <span>（{entry.resolution}）</span>}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="vn-backlog-footer">
          <span>點擊任意處或按 ESC 鍵收起手記</span>
        </div>
      </div>
    </div>
  );
}
