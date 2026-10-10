import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite reads this file when you run "npm run dev" or "npm run build".
// The react() plugin teaches Vite how to understand JSX.
export default defineConfig({
  plugins: [react()],
});
