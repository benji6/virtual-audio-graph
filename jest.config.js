module.exports = {
  preset: "ts-jest",
  roots: ["<rootDir>/test"],
  setupFiles: ["<rootDir>/jest/setup.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/test/utils"],
  testRegex: "^.+\\.ts$",
};
