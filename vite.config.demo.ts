import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@sektant1/warcraft-ui/style.css": resolve(__dirname, "src/index.css"),
      "@sektant1/warcraft-ui": resolve(__dirname, "lib/main.ts"),
    },
  },
  build: {
    outDir: "demo",
  },
});
