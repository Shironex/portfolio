import nextPlugin from '@next/eslint-plugin-next'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import eslintConfigPrettier from 'eslint-config-prettier'
import checkFilePlugin from 'eslint-plugin-check-file'
import nPlugin from 'eslint-plugin-n'

export default [
  {
    ignores: ['node_modules/**', 'dist/**', '.github/**', 'pnpm-lock.yaml'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'check-file': checkFilePlugin,
      n: nPlugin,
      next: nextPlugin,
    },
    rules: {
      'no-console': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      'prefer-arrow-callback': ['error'],
      'prefer-template': ['error'],
      quotes: ['error', 'single'],
      'n/no-process-env': ['error'],
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
      ...nextPlugin.configs['core-web-vitals'].rules,
      ...nextPlugin.configs.typescript.rules,
    },
  },
  eslintConfigPrettier,
]
