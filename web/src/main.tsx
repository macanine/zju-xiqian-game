import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { CONTENT_BUNDLE } from "./data";
import "./styles.css";

const root = document.querySelector("#app");
if (!root) throw new Error("找不到 #app");
createRoot(root).render(
  <StrictMode>
    <App content={CONTENT_BUNDLE} />
  </StrictMode>,
);
