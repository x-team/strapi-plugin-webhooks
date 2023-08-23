const OFF = 0
const ERROR = 2

module.exports = {
  parser: 'babel-eslint',
  extends: [
    'eslint:recommended',
    'plugin:jest/recommended',
    'plugin:node/recommended',
    'plugin:json/recommended',
    'standard',
    'plugin:import/warnings'
  ],
  plugins: ['jest'],
  env: {
    commonjs: true,
    es6: true,
    node: true,
    jest: true
  },
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: false
    },
    sourceType: 'module'
  },
  globals: {
    strapi: true
  },
  rules: {
    indent: [ERROR, 2, { SwitchCase: 1 }],
    'space-before-function-paren': [ERROR, 'always'],
    'linebreak-style': [ERROR, 'unix'],
    curly: [ERROR, 'all'],
    'no-console': OFF,
    quotes: [ERROR, 'single', { allowTemplateLiterals: true }],
    semi: [ERROR, 'never'],
    'node/no-unpublished-require': [OFF],
    'jest/no-try-expect': OFF,
    'jest/no-jasmine-globals': OFF,
    'comma-dangle': ['error', 'only-multiline'],
    'import/order': [
      'error',
      {
        alphabetize: {
          caseInsensitive: true,
          order: 'asc'
        },
        'newlines-between': 'always',
        groups: [
          'builtin',
          'external',
          ['internal', 'parent'],
          'sibling',
          'index',
          'object'
        ],
        pathGroups: [
          {
            pattern: 'purest',
            group: 'external',
            position: 'after'
          }
        ],
        pathGroupsExcludedImportTypes: ['builtin', 'parent', 'index']
      }
    ]
  }
}
