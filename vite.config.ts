import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/chatapi": {
        target: "https://api.langflow.astra.datastax.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/chatapi/, ""),
        secure: true,
      },
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});

