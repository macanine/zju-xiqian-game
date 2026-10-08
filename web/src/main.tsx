import { StrictMode, useEffect, useState, type ReactElement } from "react";
import { createRoot } from "react-dom/client";
import { App, ErrorScreen, LoadingScreen } from "./App";
import { loadContent, type ContentBundle } from "./domain/content";
import "./styles.css";

function Root(): ReactElement {
  const [content, setContent] = useState<ContentBundle | null>(null);
  const [error, setError] = useState<unknown>(null);
  useEffect(() => {
    loadContent().then(setContent).catch(setError);
  }, []);
  if (error) return <ErrorScreen error={error} />;
  if (!content) return <LoadingScreen />;
  return <App content={content} />;
}

const root = document.querySelector("#app");
if (!root) throw new Error("找不到 #app");
createRoot(root).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
