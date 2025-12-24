import "./types.d.ts";
/// <reference types="node" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import * as path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Use a safe default port for the frontend dev server (Vite default 5173)
  // and bind to 0.0.0.0 so it's accessible from Docker/lan when needed.
  server: {
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 5173,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
