/* eslint-disable @typescript-eslint/no-require-imports */
const merge = require('merge');
const tsPreset = require('ts-jest/jest-preset');

module.exports = merge.recursive(tsPreset, {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**'
  ],
  coverageDirectory: 'coverage',
  // testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
});
