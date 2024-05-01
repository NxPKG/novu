module.exports = {
  extends: [
    '../../.eslintrc.js',
    // 'plugin:@pandacss/recommended'
  ],
  plugins: ['@pandacss', 'react-hooks'],
  rules: {
    'func-names': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/no-array-index-key': 'off',
    'no-empty-pattern': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'react/no-unescaped-entities': 'off',
    'react/jsx-closing-bracket-location': 'off',
    '@typescript-eslint/ban-types': 'off',
    'react/jsx-wrap-multilines': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'react/jsx-one-expression-per-line': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'jsx-a11y/aria-role': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'react/require-default-props': 'off',
    'react/no-danger': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        filter: '_',
        selector: 'variableLike',
        leadingUnderscore: 'allow',
        format: ['PascalCase', 'camelCase', 'UPPER_CASE'],
      },
    ],
    '@pandacss/file-not-included': 'off',
  },
  ignorePatterns: ['styled-system/*', 'prettier.config.ts', 'panda.config.ts'],
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 2020,
    sourceType: 'module',
  },
};
