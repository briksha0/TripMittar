import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // allow LAN access
    port: 5173,
    proxy: {
      "/api": {
        target: process.env.VITE_BACKEND_URL, // your backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
