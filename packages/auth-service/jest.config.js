const merge = require('merge');
const tsPreset = require('ts-jest/jest-preset');
const mongotsPreset = require('@shelf/jest-mongodb/jest-preset');

module.exports = merge.recursive(tsPreset, mongotsPreset, {
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
