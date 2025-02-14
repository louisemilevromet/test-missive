import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ["keyword-extractor"],
  },
  server: {
    allowedHosts: ["0a0f-157-208-20-196.ngrok-free.app"],
  },
});
