import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { HashRouter } from "react-router-dom"; // ✅ correct import

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>   {/* ✅ wrap App inside */}
      <App />
    </HashRouter>
  </StrictMode>
);
