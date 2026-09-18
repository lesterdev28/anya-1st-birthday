import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    // The invitation is one page; keeping the vendor split small helps first paint
    // on the phone connections most guests will open this on.
    rollupOptions: {
      output: {
        manualChunks: {
          motion: ["framer-motion"],
        },
      },
    },
  },
});
