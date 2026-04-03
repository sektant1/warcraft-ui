import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react(), dts({ insertTypesEntry: true })],
  base: "/warcraft-ui/",
  build: {
    lib: {
      entry: resolve(__dirname, "lib/main.ts"),
      name: "Warcraft3UI",
      formats: ["es", "umd"],
      fileName: (format) => `warcraft3-ui.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "react/jsx-runtime",
        },
        // Keep asset names readable (important for .blp/.mdx)
        assetFileNames: "assets/[name][extname]",
      },
    },
    // Ensure CSS is emitted as a single file
    cssCodeSplit: false,
  },
  server: {
    port: 3000,
    proxy: {
      "/api": { target: "http://localhost:3001", changeOrigin: true },
    },
  },
});
