process.env.FUSEBOX_DIST_ROOT = __dirname;
process.env.JEST_TEST = true;
module.exports = {
  globals: {
    'ts-jest': {
      diagnostics: false,
      tsConfig: 'src/tsconfig.json',
    },
  },
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },

  coveragePathIgnorePatterns: ['test_utils.ts', 'logging/logging.ts', 'logging/spinner.ts'],
  maxConcurrency: 1,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'json'],
  modulePathIgnorePatterns: ['/modules', '/_modules'],
  testPathIgnorePatterns: [
    '.fusebox/',
    '/lib/',
    '__refactor',
    '____production',
    'node_modules/',
    'modules',
    '_playground/',
    'dist/',
    '.dev/',
    'website',
  ],
  testRegex: '(/(__tests__|tests)/.*|(\\.|/))\\.test\\.tsx?$',
  watchPathIgnorePatterns: ['.tmp', 'dist'],
};
