import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: {
    port: 4020,
    proxy: {
      "/api": {
        target: process.env.VITE_ENVIRONMENT === "development"
          ? process.env.VITE_API_URL_DEV
          : process.env.VITE_API_URL,
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ""),
      },
    },
  },
});
