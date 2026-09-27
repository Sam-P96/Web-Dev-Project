import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // describe / it / expect / beforeAll ... without importing them
    globals: true,
    environment: "node",
    // All test files share one test database -> run them one after another
    fileParallelism: false,
    // DB operations + bcrypt hashing can be slow
    testTimeout: 20000,
    hookTimeout: 20000,
    // Loads .env and connects/disconnects the test database for every file
    setupFiles: ["./tests/setup.js"],
  },
});
