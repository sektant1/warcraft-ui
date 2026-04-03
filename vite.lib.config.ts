import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ["lib", "src"],
      rollupTypes: true,
      tsconfigPath: "./tsconfig.app.json",
    }),
  ],
  build: {
    target: ["esnext"],
    copyPublicDir: true,
    lib: {
      entry: resolve(__dirname, "lib/main.ts"),
      name: "warcraft-ui",
      formats: ["es", "umd"],
      fileName: "warcraft-ui",
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
    cssCodeSplit: false,
  },
});
