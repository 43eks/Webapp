// src/main.jsx (React 18 正式構文)
//------------------------------------------------------------
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container); // React 18 の new API

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
