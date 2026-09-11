import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";
import { fileURLToPath } from "url";

// `__dirname` n'existe pas : Storybook charge ce fichier comme un module ES.
const ici = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  // Les stories vivent À CÔTÉ du composant qu'elles montrent, pas dans un
  // dossier séparé. Une story éloignée de son composant cesse d'être mise à
  // jour avec lui — c'est la même raison qui fait dériver une liste tenue à
  // la main d'une liste générée.
  stories: [
    "../registry/**/*.stories.@(ts|tsx)",
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    // Contrôle d'accessibilité sur chaque story. Il ne remplace pas
    // `playground/audit.ts` : axe vérifie le balisage, notre audit vérifie
    // le CONTRASTE RENDU dans les quatre combinaisons, ce qu'axe ne fait pas
    // sur des couleurs composées.
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-mcp",
  ],
  framework: "@storybook/react-vite",
  viteFinal: async (config) => {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(ici, ".."),
      "@registry": path.resolve(ici, "../registry"),
    };
    return config;
  },
};
export default config;
