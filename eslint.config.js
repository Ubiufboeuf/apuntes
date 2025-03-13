import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import stylistic from '@stylistic/eslint-plugin'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}']},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'no-empty-pattern': 'off',
      'semi': ['error', 'never'],
      'comma-dangle': ['error', 'never'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/jsx-quotes': ['error', 'prefer-single'],
      '@stylistic/eol-last': ['error', 'always'],
      '@stylistic/indent': ['error', 2]
    }
  }
]
