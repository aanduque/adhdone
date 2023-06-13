import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const basePath = mode === "production" ? "/" : "/";
  return {
    base: basePath,
    plugins: [
      vue(),
      vueJsx(),
      VitePWA({
        injectRegister: "auto",
        registerType: "autoUpdate",
        manifest: {
          name: "Daily",
          short_name: "Daily",
          description: "Finish your tasks, one day at a time.",
          start_url: basePath,
          theme_color: "#1f2937",
          background_color: "#ffffff",
          display: "standalone",
          icons: [
            {
              src: "1024.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "icon.svg",
              sizes: "512x512",
              type: "image/svg+xml",
              purpose: "maskable",
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  };
});
