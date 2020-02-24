module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: ['prettier'],
  globals: {
    __DEVELOPMENT__: true,
    __IS_BROWSER__: true,
    fetch: 'readonly'
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['prettier'],
  rules: {
    'jsx-quotes': ['error', 'prefer-single'],
    'max-len': ['error', { code: 80 }],
    'no-console': 'error',
    'prettier/prettier': 'error',
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'never',
        asyncArrow: 'always',
        named: 'never'
      }
    ]
  }
};
