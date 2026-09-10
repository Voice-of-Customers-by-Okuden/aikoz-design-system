import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import path from "path";

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      "@registry": path.resolve(__dirname, "./registry"),
    },
  },
  server: {
    port: 5173,
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
    emptyOutDir: true,
  },
});
