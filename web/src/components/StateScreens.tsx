import type { ReactElement } from "react";

export function LoadingScreen(): ReactElement {
  return (
    <div className="vn-loading-screen">
      <div className="vn-loading-ornament" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <p>正在载入浙江大学西迁文军长征史料……</p>
    </div>
  );
}

export function ErrorScreen({ error }: { error: unknown }): ReactElement {
  const message = error instanceof Error ? error.message : "未知錯誤";
  return (
    <section className="vn-error-screen">
      <div className="vn-error-seal">警</div>
      <h2>史料读取中断</h2>
      <p>未能完整载入西迁历史档案，请检查网络与数据文件。</p>
      <code>{message}</code>
    </section>
  );
}
