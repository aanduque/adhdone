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
              src: "icon-72x72.png",
              sizes: "72x72",
              type: "image/png",
              purpose: "maskable any",
            },
            {
              src: "icon-96x96.png",
              sizes: "96x96",
              type: "image/png",
              purpose: "maskable any",
            },
            {
              src: "icon-128x128.png",
              sizes: "128x128",
              type: "image/png",
              purpose: "maskable any",
            },
            {
              src: "icon-144x144.png",
              sizes: "144x144",
              type: "image/png",
              purpose: "maskable any",
            },
            {
              src: "icon-152x152.png",
              sizes: "152x152",
              type: "image/png",
              purpose: "maskable any",
            },
            {
              src: "icon-192x192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "maskable any",
            },
            {
              src: "icon-384x384.png",
              sizes: "384x384",
              type: "image/png",
              purpose: "maskable any",
            },
            {
              src: "icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable any",
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
