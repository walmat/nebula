const pkg = require('./package.json');

module.exports = {
  name: pkg.name,
  displayName: pkg.name,
  testPathIgnorePatterns: ['/node_modules/'],
  coverageReporters: ['lcov', 'html'],
  reporters: ['default', 'jest-junit'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)?$': 'babel-jest'
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test))\\.(j|t)sx?$',
  moduleFileExtensions: ['js', 'jsx', 'css', 'ts', 'tsx', 'json'],
  collectCoverageFrom: ['app/**/*.tsx'],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  moduleDirectories: ['node_modules', 'app'],
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '^@Log$': '<rootDir>/app/utils/log.js'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  setupFiles: ['<rootDir>/test/polyfill.js'],
  rootDir: './'
};
