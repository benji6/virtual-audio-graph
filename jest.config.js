module.exports = {
  moduleFileExtensions: ['js', 'ts'],
  roots: ['<rootDir>/test'],
  setupFiles: ['<rootDir>/jest/setup.ts'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/test/utils',
  ],
  testRegex: '^.+\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
}
