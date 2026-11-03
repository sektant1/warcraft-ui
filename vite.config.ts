import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: "./tsconfig.app.json",
      include: ["lib", "src"],
      exclude: ["src/__tests__", "src/demo", "src/App.tsx", "src/main.tsx"],
      insertTypesEntry: true,
    }),
  ],
  resolve: {
    alias: {
      "@sektant1/warcraft-ui/style.css": resolve(__dirname, "src/index.css"),
      "@sektant1/warcraft-ui": resolve(__dirname, "lib/main.ts"),
    },
  },
  // Game assets in public/ are copyrighted and served by the consumer — never
  // copy them into the published package.
  publicDir: false,
  build: {
    lib: {
      entry: resolve(__dirname, "lib/main"),
      name: "WarcraftUI",
      formats: ["es", "umd"],
      fileName: (format) => `warcraft-ui.${format}.js`,
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
});
