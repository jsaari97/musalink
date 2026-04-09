import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  base: "/musalink/",
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      components: fileURLToPath(new URL("./src/components", import.meta.url)),
      "musalink-common": fileURLToPath(new URL("../common", import.meta.url)),
      utils: fileURLToPath(new URL("./src/utils", import.meta.url)),
      svg: fileURLToPath(new URL("./src/svg", import.meta.url))
    }
  },
  test: {
    environment: "jsdom",
    passWithNoTests: true
  }
});
