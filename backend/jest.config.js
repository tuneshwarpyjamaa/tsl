/** @type {import('jest').Config} */
const config = {
  verbose: true,
  testEnvironment: "node",
  transform: {},
  setupFilesAfterEnv: ['./jest.setup.js'],
};

export default config;
