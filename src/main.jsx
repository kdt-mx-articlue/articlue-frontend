import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";
import "./styles/index.css";

// 앱 로드 시 저장된 다크모드 상태 즉시 적용 (깜빡임 방지)
if (localStorage.getItem("darkMode") === "true") {
  document.documentElement.classList.add("dark");
}

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);