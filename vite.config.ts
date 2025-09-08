import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: mode === "development",
        type: "module",
        navigateFallback: "/index.html",
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff,woff2}"],
        navigateFallback: "/index.html",
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/qssmaz.*\.supabase\.co\/rest\/v1\//,
            handler: "StaleWhileRevalidate",
            method: "GET",
            options: {
              cacheName: "supabase-api-cache",
              expiration: {
                maxEntries: 1000,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
            },
          },
          {
            urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif|webp)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
      includeAssets: [
        "favicon.svg",
        "icon-512.png",
        "timeline-screenshot.png",
        "robots.txt",
      ],
      manifest: {
        id: "/",
        name: "UpLine",
        short_name: "UpLine",
        description: "UpLine - Your Festival companion",
        theme_color: "#7c3aed",
        background_color: "#1e1b4b",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        dir: "ltr",
        categories: ["entertainment", "music"],
        prefer_related_applications: false,
        related_applications: [],
        scope_extensions: [
          {
            origin: "https://getupline.com",
          },
          {
            origin: "https://*.getupline.com",
          },
        ],
        launch_handler: {
          client_mode: "focus-existing",
        },
        screenshots: [
          {
            src: "timeline-screenshot.png",
            sizes: "1920x1080",
            type: "image/png",
            form_factor: "wide",
          },
        ],
        icons: [
          {
            src: "favicon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any",
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
