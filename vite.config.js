import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  server: {
    proxy: {
      "/backend": {
        target: "http://localhost", // ton serveur Apache
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/backend/, "/backend"),
      },
    },
  },
});
