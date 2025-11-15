import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import pages from "vite-plugin-pages";

export default defineConfig({
  plugins: [react(), pages()],
  server: {
    fs: {
      strict: false, // Prevents Vite from restricting file access
    },
  },
});
