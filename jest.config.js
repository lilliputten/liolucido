const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: [
    // Generic tests setup
    // '<rootDir>/src/jest/jestCommonSetup.js',
  ],
  // // NOTE: This doesn't work for prisma tests, will got error: "PrismaClient is unable to run in this browser environment..."
  // testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    'node_modules/@t3-oss/.+\\.js$': ['ts-jest'],
  },
  transformIgnorePatterns: ['/node_modules/(?!@t3-oss)'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
