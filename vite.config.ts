/// <reference types="vitest/globals" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    globals: true,
    environment: "miniflare",
  },
});