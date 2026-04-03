import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [react(), dts({ insertTypesEntry: true })],
  base: "/warcraft-ui/",
  build: {
    target: ["esnext"],
    outDir: "dist-demo",
    rollupOptions: {
      external: ["react", "react/jsx-runtime"],
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": { target: "http://localhost:3001", changeOrigin: true },
    },
  },
});
