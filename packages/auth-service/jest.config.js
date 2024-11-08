/* eslint-disable @typescript-eslint/no-require-imports */

const merge = require('merge');
const tsPreset = require('ts-jest/jest-preset');
const mongotsPreset = require('@shelf/jest-mongodb/jest-preset');

module.exports = merge.recursive(tsPreset, mongotsPreset, {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
});
