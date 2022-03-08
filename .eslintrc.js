module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    allowImportExportEverywhere: true,
    ecmaVersion: 10,
    ecmaFeatures: {
      modules: true,
    },
  },
  env: {
    browser: true,
    node: true,
    jest: true,
    es6: true,
  },
  plugins: ['import', 'promise', 'compat', 'react', '@typescript-eslint'],
  extends: ['airbnb', 'plugin:prettier/recommended', 'prettier/react'],
  settings: {
    'import/resolver': {
      webpack: {
        config: 'webpack/config.eslint.js',
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      'eslint-import-resolver-typescript': true,
    },
  },
  rules: {
    'linebreak-style': 0,
    'arrow-parens': 'off',
    'compat/compat': 'error',
    'consistent-return': 'off',
    'comma-dangle': 'off',
    'generator-star-spacing': 'off',
    'import/no-unresolved': 'error',
    'import/extensions': [
      'error',
      'always',
      {
        ts: 'never',
        tsx: 'never',
        js: 'never',
        jsx: 'never',
      },
    ],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/label-has-for': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'no-console': [
      'error',
      {
        allow: ['info', 'error', 'warn'],
      },
    ],
    'no-use-before-define': 'off',
    'no-multi-assign': 'off',
    'prettier/prettier': ['error', { singleQuote: true }],
    'promise/param-names': 'error',
    'promise/always-return': 'error',
    'promise/catch-or-return': 'error',
    'promise/no-native': 'off',
    'react/sort-comp': [
      'error',
      {
        order: ['type-annotations', 'static-methods', 'lifecycle', 'everything-else', 'render'],
      },
    ],
    'react/jsx-no-bind': 'off',
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'react/prefer-stateless-function': 'off',
    strict: 'off',
    'import/prefer-default-export': 'off',
    'arrow-body-style': 'off',
    'no-underscore-dangle': 'off',
    'class-methods-use-this': 'off',
    'no-shadow': 'off',
    'react/prop-types': 'off',
    'import/no-dynamic-require': 'off',
    'no-unused-vars': 'off', //use typescript version.
    'no-restricted-syntax': 1,
    '@typescript-eslint/no-unused-vars': [
      'error', // setting this to warn for now...
      // TODO fix these when we finish typescript migration.
      {
        args: 'after-used',
        argsIgnorePattern: '^(args|theme|props|state|ownProps|dispatch|getState)|_',
        varsIgnorePattern: '^(args|variables|mixins|args|log)',
      },
    ],
  },
  globals: {
    fetchMock: true,
  },
};
