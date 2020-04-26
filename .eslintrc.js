function has(name) {
  const pkg = require('./package.json')
  const sectionNames = ['dependencies', 'devDependencies', 'peerDependencies']

  return sectionNames.some((sectionName) => !!pkg[sectionName][name])
}

const hasReact = has('react')
const hasTypeScript = has('typescript')
let parserConfig = {}

if (hasTypeScript) {
  parserConfig = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: './tsconfig.json'
    }
  }
}

/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  ...parserConfig,
  env: {
    browser: true,
    jest: true
  },
  extends: [
    hasTypeScript && 'standard-with-typescript',
    hasReact && 'standard-react',
    'plugin:prettier/recommended',
    hasTypeScript && 'prettier/@typescript-eslint',
    hasReact && 'prettier/react',
    'prettier/standard'
  ].filter(Boolean),
  plugins: [
    'prettier',
    'simple-import-sort',
    hasReact && 'react-hooks',
    hasTypeScript && 'tsdoc'
  ].filter(Boolean),
  rules: {
    'sort-imports': 'off',
    'import/order': 'off',
    'simple-import-sort/sort': [
      'error',
      {
        groups: [['^\\u0000', '^@?\\w', '^[^.]', '^\\.']]
      }
    ]
  },
  overrides: [
    hasTypeScript && {
      files: ['*.ts', '*.tsx'],
      rules: {
        'tsdoc/syntax': 'warn'
      }
    },
    hasReact && {
      files: ['*.jsx', '*.tsx'],
      rules: {
        'react/prop-types': 'off'
      }
    }
  ].filter(Boolean)
}
