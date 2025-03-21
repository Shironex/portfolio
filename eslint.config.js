import { FlatCompat } from '@eslint/eslintrc'
import nextPlugin from '@next/eslint-plugin-next'
import tseslint from '@typescript-eslint/eslint-plugin'
import eslintConfigPrettier from 'eslint-config-prettier'
import checkFilePlugin from 'eslint-plugin-check-file'
import nPlugin from 'eslint-plugin-n'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

/** @type {import('eslint').Linter.FlatConfig[]} */
const eslintConfig = [
  {
    ignores: ['node_modules/**', 'dist/**', '.github/**', 'pnpm-lock.yaml'],
  },
  ...compat.config({
    extends: ['next'],
  }),
  {
    files: ['**/*.ts', '**/*.tsx'],
    settings: {
      next: {
        rootDir: '.',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'check-file': checkFilePlugin,
      n: nPlugin,
      next: nextPlugin,
    },
    rules: {
      // TypeScript rules
      'no-console': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],

      // Style rules
      'prefer-arrow-callback': ['error'],
      'prefer-template': ['error'],
      quotes: ['error', 'single'],
      'n/no-process-env': ['error'],

      // File naming conventions
      'check-file/filename-naming-convention': [
        'error',
        {
          '**/*.{ts,tsx}': 'KEBAB_CASE',
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
      'check-file/folder-naming-convention': [
        'error',
        {
          'src/**/!^[.*': 'KEBAB_CASE',
        },
      ],

      // Next.js rules
      'next/google-font-display': 'warn',
      'next/google-font-preconnect': 'warn',
      'next/no-css-tags': 'error',
      'next/no-document-import-in-page': 'error',
      'next/no-duplicate-head': 'error',
      'next/no-head-import-in-document': 'error',
      'next/no-html-link-for-pages': 'error',
      'next/no-img-element': 'error',
      'next/no-page-custom-font': 'error',
      'next/no-sync-scripts': 'error',
      'next/no-title-in-document-head': 'error',
      'next/no-typos': 'error',
      'next/no-unwanted-polyfillio': 'error',
    },
  },
  eslintConfigPrettier,
]

export default eslintConfig
