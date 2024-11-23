module.exports = {
  roots: ['<rootDir>/backend/src'],
  collectCoverageFrom: ['<rootDir>/backend/src/**/*.ts'],
  coverageDirectory: 'coverage',
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}
