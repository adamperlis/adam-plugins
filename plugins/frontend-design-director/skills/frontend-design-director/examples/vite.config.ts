import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";
import { copyFile, mkdir } from "node:fs/promises";
export default defineConfig({
  base: "./",
  plugins: [
    tailwindcss(),
    {
      name: "preserve-file-compatible-script",
      async closeBundle() {
        await mkdir(resolve(import.meta.dirname, "dist/vanilla"), {
          recursive: true,
        });
        await copyFile(
          resolve(import.meta.dirname, "vanilla/script.js"),
          resolve(import.meta.dirname, "dist/vanilla/script.js"),
        );
        await mkdir(resolve(import.meta.dirname, "dist/structures"), { recursive: true });
        for (const file of ["structures.css", "structures.js", "manifest.json"]) {
          await copyFile(resolve(import.meta.dirname, "structures", file), resolve(import.meta.dirname, "dist/structures", file));
        }
        await mkdir(resolve(import.meta.dirname, "dist/reference-ui"), { recursive: true });
        await copyFile(resolve(import.meta.dirname, "reference-ui/README.md"), resolve(import.meta.dirname, "dist/reference-ui/README.md"));
        await copyFile(resolve(import.meta.dirname, "reference-ui/REVIEW.md"), resolve(import.meta.dirname, "dist/reference-ui/REVIEW.md"));
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        gallery: resolve(import.meta.dirname, "index.html"),
        lab: resolve(import.meta.dirname, "lab.html"),
        northstar: resolve(import.meta.dirname, "vanilla/index.html"),
        commerce: resolve(import.meta.dirname, "commerce/index.html"),
        developer: resolve(import.meta.dirname, "developer/index.html"),
        research: resolve(import.meta.dirname, "research/index.html"),
        cinematic: resolve(import.meta.dirname, "cinematic/index.html"),
        saas: resolve(import.meta.dirname, "saas/index.html"),
        trace: resolve(import.meta.dirname, "trace/index.html"),
        structures: resolve(import.meta.dirname, "structures/index.html"),
        referenceUi: resolve(import.meta.dirname, "reference-ui/index.html"),
        harvest: resolve(import.meta.dirname, "harvest/index.html"),
        dayform: resolve(import.meta.dirname, "dayform/index.html"),
        dayformConcepts: resolve(import.meta.dirname, "concepts/index.html"),
        dayformMobileReview: resolve(import.meta.dirname, "concepts/mobile.html"),
        lumaDirected: resolve(import.meta.dirname, "luma-directed/index.html"),
      },
    },
  },
});
