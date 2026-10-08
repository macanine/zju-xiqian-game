import type { ReactElement } from "react";

export function LoadingScreen(): ReactElement {
  return (
    <div className="vn-loading-screen">
      <div className="vn-loading-seal">求是</div>
      <p>正在載入浙江大學西遷文軍長征史料……</p>
    </div>
  );
}

export function ErrorScreen({ error }: { error: unknown }): ReactElement {
  const message = error instanceof Error ? error.message : "未知錯誤";
  return (
    <section className="vn-error-screen">
      <div className="vn-error-seal">警</div>
      <h2>史料讀取中斷</h2>
      <p>未能完整載入西遷歷史檔案，請檢查網絡與數據文件。</p>
      <code>{message}</code>
    </section>
  );
}
