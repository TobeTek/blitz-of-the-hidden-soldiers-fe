import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    nodePolyfills(),
    tsconfigPaths({
      loose: true,
      root: "./",
    }),
    vue(),
  ],
});
