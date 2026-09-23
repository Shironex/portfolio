import js from '@eslint/js'
import nextPlugin from '@next/eslint-plugin-next'
import noctcoreAsyncSafety from '@noctcore/eslint-plugin-async-safety'
import noctcoreCodeQuality from '@noctcore/eslint-plugin-code-quality'
import noctcoreContracts from '@noctcore/eslint-plugin-contracts'
import noctcoreReact from '@noctcore/eslint-plugin-react'
import noctcoreSecurity from '@noctcore/eslint-plugin-security'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import eslintConfigPrettier from 'eslint-config-prettier'
import checkFilePlugin from 'eslint-plugin-check-file'
import nPlugin from 'eslint-plugin-n'

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  {
    ignores: [
      'node_modules/**',
      '.claude/**',
      '.next/**',
      'out/**',
      'dist/**',
      '.github/**',
      'new-design/**',
      'pnpm-lock.yaml',
    ],
  },
  js.configs.recommended,
  // Next.js 16 flat config (no legacy extends or compat)
  nextPlugin.configs['core-web-vitals'],
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint,
      'check-file': checkFilePlugin,
      n: nPlugin,
      next: nextPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      // TypeScript rules
      'no-console': 'off',
      // Disable core rules that TypeScript already handles better.
      // no-undef has no type info about DOM/Node globals and only produces
      // false positives on TS; no-unused-vars is superseded by the
      // @typescript-eslint version below (which understands type positions
      // and the ^_ ignore pattern).
      'no-undef': 'off',
      'no-unused-vars': 'off',
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
  // noctcore presets: architecture/correctness rules generic linters miss
  noctcoreCodeQuality.configs.recommended,
  noctcoreAsyncSafety.configs.recommended,
  noctcoreContracts.configs.recommended,
  noctcoreReact.configs.recommended,
  noctcoreSecurity.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    rules: {
      // Wall-clock reads (sitemap lastmod, the desktop clock, email
      // timestamps) are the point here; there is no mockable clock util.
      'noctcore-code-quality/no-bare-date-now': 'off',

      // `n/no-process-env` already covers this, and `src/env/*` is the one
      // place that must read process.env.
      'noctcore-contracts/no-direct-process-env': 'off',
      'noctcore-contracts/restrict-throw-to-taxonomy': [
        'error',
        { allow: ['Error', 'PublicError'] },
      ],
      'noctcore-contracts/require-schema-parse-at-boundary': 'error',

      // These assume a colocated `<Name>.hooks.ts` per component and
      // PascalCase component folders; this repo keeps hooks inline and uses
      // flat kebab-case files.
      'noctcore-react/no-state-in-component-body': 'off',
      'noctcore-react/no-jsx-computation': 'off',
      'noctcore-react/max-hooks-per-file': 'off',
      // `memo(ClockImpl)` wrappers keep the public `<Name>Props` name.
      'noctcore-react/component-props-naming': 'off',

      'noctcore-security/server-action-through-client': [
        'error',
        { actionClients: ['unauthenticatedAction'] },
      ],
    },
  },
  // Tooling scripts run in Node or a Playwright page, not the app runtime.
  {
    files: ['scripts/**/*.{js,mjs}'],
    rules: {
      'noctcore-react/no-unguarded-web-storage': 'off',
    },
  },
  // Node/CommonJS globals for JS tooling scripts
  {
    files: ['.commitlintrc.js', 'scripts/**/*.js'],
    languageOptions: {
      sourceType: 'script',
      globals: {
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        process: 'readonly',
        console: 'readonly',
      },
    },
  },
  // Node ESM globals for tooling scripts (generate-icons, etc.)
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        process: 'readonly',
        console: 'readonly',
      },
    },
  },
  // Playwright config + e2e specs run in Node, where reading process.env for
  // ports/base URLs/output dirs is the standard pattern (app code still uses
  // the typed env imports and stays under n/no-process-env).
  {
    files: ['playwright.config.ts', 'e2e/**/*.{ts,tsx}'],
    rules: {
      'n/no-process-env': 'off',
    },
  },
  // Keep Prettier last to disable formatting-related ESLint rules
  eslintConfigPrettier,
]

export default eslintConfig
