/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  // The bail config option can be used here to have Jest stop running tests after
  // the first failure.
  bail: false,

  // Indicates whether each individual test should be reported during the run.
  verbose: false,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: false,

  // The directory where Jest should output its coverage files.
  coverageDirectory: './coverage/',

  // If the test path matches any of the patterns, it will be skipped.
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],

  // If the file path matches any of the patterns, coverage information will be skipped.
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],

  // The pattern Jest uses to detect test files.
  // 测试文件的目录
  testRegex: '/__test__/.*\\.(test|spec)\\.(js|ts)x?$',

  // @see: https://jestjs.io/docs/en/configuration#coveragethreshold-object
  // 测试覆盖率的设定
  coverageThreshold: {
    global: {
      // 声明
      statements: 100,
      // 分支
      branches: 95,
      // 方法
      functions: 100,
      // 行数
      lines: 100,
    },
  },
};
