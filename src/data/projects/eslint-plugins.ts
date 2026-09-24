import { Project } from '@/types'

export const eslintPlugins: Project = {
  id: 'eslint-plugins',
  slug: 'eslint-plugins',
  title: '@noctcore/eslint-plugins',
  summary:
    'A family of focused ESLint plugins for the mistakes generic linters miss: cross-file boundaries, IO contracts and code that compiles but breaks in production. 13 packages, 110+ rules.',
  description: [
    'I kept finding the same classes of bugs in code review: fetch calls without timeouts, boundary data used without parsing, swallowed navigation errors, Prisma writes that skip tenant scoping. None of them are type errors, and the usual lint configs do not catch them. These plugins encode those checks as rules.',
    'The repository publishes 13 packages: eleven ESLint plugins (code quality, async safety, contracts, security, observability, React, React Server Components, LLM output handling, Prisma, architecture and monorepo boundaries), a shared utility package the rules are built on, and a set of whole-repo meta rules. Together they ship more than 110 rules.',
    'Each plugin is flat-config only, has a zero-config recommended preset, and is versioned and installed on its own. Every rule has documentation with options, examples and a note on when the plugin is a bad fit.',
  ],
  projectType: 'library',
  gallery: [],
  technologies: ['TypeScript', 'ESLint', 'typescript-eslint', 'Vitest'],
  features: [
    '11 ESLint plugins plus shared utilities and whole-repo meta rules',
    'More than 110 rules, each with documentation and examples',
    'Starter set for any TypeScript codebase: code-quality, async-safety, contracts',
    'Stack-specific plugins for React, React Server Components, Prisma and monorepos',
    'Security rules for shell injection, path traversal, SSRF, open redirects and XSS',
    'Flat config only, ESLint 9+, zero-config presets',
    'Each package versioned and installed independently',
  ],
  techDetails: {
    stack: [
      'TypeScript',
      'ESLint 9+ (flat config)',
      '@typescript-eslint/utils',
      'Vitest',
      'RuleTester',
      'GitHub Actions',
      'GitHub Pages (docs)',
    ],
  },
  status: 'shipped',
  duration: 'Ongoing (maintained)',
  demoUrl: 'https://noctcore.github.io/eslint-plugins/',
  githubUrl: 'https://github.com/noctcore/eslint-plugins',
  featured: true,
}
