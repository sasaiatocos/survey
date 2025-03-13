module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  preset: 'ts-jest/presets/js-with-ts',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/$1',
  },
  modulePaths: ["<rootDir>"],
  setupFilesAfterEnv: ["<rootDir>/../node_modules/tsconfig-paths-jest/dist/register.js"],
};