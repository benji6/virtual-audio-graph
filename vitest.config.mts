import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.ts"],
    exclude: ["test/utils/**"],
    setupFiles: ["./vitest/setup.ts"],
  },
});
