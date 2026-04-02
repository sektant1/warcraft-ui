import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/warcraft-ui/",
  server: {
    port: 3000,
    proxy: {
      "/api": { target: "http://localhost:3001", changeOrigin: true },
    },
  },
  build: {
    target: ["esnext"],
    outDir: "dist-demo",
  },
});
