/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import path from "path";
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      "@registry": path.resolve(__dirname, "./registry")
    }
  },
  server: {
    port: 5173
  },
  // Chemins RELATIFS : l'aperçu statique est lu depuis le dépôt, en local ou
  // sur une page GitHub, jamais à la racine d'un domaine.
  base: "./",
  // `root` sur le playground pour que l'aperçu sorte à plat dans
  // docs/preview/index.html, et non dans un sous-dossier playground/.
  root: path.resolve(__dirname, "playground"),
  publicDir: path.resolve(__dirname, "public"),
  build: {
    outDir: path.resolve(__dirname, "docs/preview"),
    emptyOutDir: true
  },
  test: {
    coverage: {
      provider: 'v8',
      // La couverture se règle à la RACINE de `test`, jamais dans un projet :
      // posée dans le projet, la clé est acceptée sans effet et le chiffre
      // reste inchangé — c'est ce qui est arrivé au premier essai.
      //
      // Ne mesurer QUE le design system. Par défaut `playground/` et
      // `.storybook/` étaient comptés : ce ne sont pas des livrables, et la
      // faible couverture du playground tirait le global vers le bas sans
      // rien dire de la qualité du registre.
      include: ['registry/aikoz/**/*.{ts,tsx}'],
      // Les stories sont le TEST, pas le code testé : les compter
      // reviendrait à s'auto-attester.
      exclude: ['**/*.stories.tsx'],
      // `text` donne le tableau PAR FICHIER — c'est lui qui sert, le résumé
      // seul ne dit pas où sont les trous. `html` pour le rapport navigable
      // servi par l'addon Storybook sur /coverage/.
      reporter: ['text', 'text-summary', 'html'],
    },
    projects: [{
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        }
      }
    }]
  }
});