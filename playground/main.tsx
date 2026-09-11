import { definirBaseDesLogos } from "@registry/aikoz/brand-logo/brands";

// La base des logos est un réglage d'APPLICATION, pas de composant.
// `import.meta.env.BASE_URL` suit le `--base` passé au build, ce qui rend
// l'aperçu statique servable depuis n'importe quel sous-chemin.
definirBaseDesLogos(import.meta.env.BASE_URL + "brands/");

import "../build/index.css";
import "../bridge/shadcn-bridge.css";
import "./playground.css";

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import DeliveredComponents from "./DeliveredComponents";

// Accès temporaire de dev à la page d'inventaire, tant qu'elle n'est pas
// câblée dans App.tsx : http://localhost:5173/?inventory
const Root = new URLSearchParams(window.location.search).has("inventory")
  ? DeliveredComponents
  : App;

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
