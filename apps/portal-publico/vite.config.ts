import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  resolve: {
    alias: {
      "@siscomat/shared-ui": path.resolve(
        __dirname,
        "../../packages/shared-ui/src/index.ts",
      ),
      "/shared-fonts": path.resolve(
        __dirname,
        "../../packages/shared-ui/src/fonts",
      ),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/tests/setupTests.ts",
    css: true,
  },
});
