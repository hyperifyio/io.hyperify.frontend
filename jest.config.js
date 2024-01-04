// See also https://github.com/heusalagroup/test or project specific test folder
/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(scss|css|less)$': '<rootDir>/../testing/mocks/styleMock.js',
  },
  transform: {
    '\\.(scss|css|less)$': '<rootDir>/../testing/jest/fileTransformer.js'
  },
  // testTimeout: 30000
};
