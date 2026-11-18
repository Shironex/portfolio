import { Project } from '@/types'

export const harness: Project = {
  id: 'harness',
  slug: 'harness',
  title: '@noctcore/harness',
  summary:
    'Checks that hold a TypeScript repo to its own rules in any CI, with no server, no account and no runtime dependencies. One committed list of checks, whole-repo rules ESLint cannot reach, and linters pinned to an exact version.',
  description: [
    "A repo's rules usually live in three places at once: a lint config, a few scripts and the memory of whoever set them up. They drift, a new linter release turns CI red on nobody's change, and a check that could not run quietly counts as a pass. I wrote the harness to put those rules in files the repo commits and to run them the same way everywhere.",
    'One .noctcore/harness.json lists the checks and harness check runs every one of them, printing each command before it runs, so one CI run shows the whole failure set. A registry of lint-meta rules covers what ESLint cannot see, such as lockfile resolutions, single-version dependencies and workflow security, and six ready-made rules ship with it. Pinned tools run zizmor, actionlint, gitleaks, hadolint, squawk and trivy at exactly their pinned version, and block instead of passing when they cannot.',
    'Around that sit CI helpers (the base commit a run diffs against, the commit range commitlint reads, due dates over dated ledgers) and web bundle budgets that weigh each file the way nginx serves it; nothing in them raises a budget. A second package, @noctcore/harness-mutation, turns a Stryker run into a gate: a mutation score that may only rise, changed-line runs that fail any surviving mutant on the lines a branch touched, and a reviewed ledger of accepted mutants.',
    'The design is fail closed: a timeout, a rule that throws or a manifest from a newer schema is a failure with a reason, never a silent pass. The package makes no network calls (a test scans the built entry points for them), uses only node builtins and runs its suites on Ubuntu and Windows. @noctcore/harness is at 0.8.0 and @noctcore/harness-mutation at 0.1.0, both on npm, and the API may still change before 1.0.',
  ],
  image: '/projects/harness/thumbnail.webp',
  projectType: 'library',
  gallery: [
    {
      src: '/projects/harness/home.webp',
      alt: 'noctcore harness: Docs home',
      caption: 'Docs home: what the harness holds a repo to, and how.',
    },
    {
      src: '/projects/harness/runner.webp',
      alt: 'noctcore harness: The manifest and the runner guide',
      caption:
        'The manifest and the runner: one harness.json of checks, run the same way in any CI.',
    },
    {
      src: '/projects/harness/mutation.webp',
      alt: 'noctcore harness: Mutation testing guide',
      caption:
        'The mutation gate: a score that may only rise, and changed-line runs for a branch.',
    },
  ],
  technologies: ['TypeScript', 'Node.js', 'GitHub Actions', 'Stryker'],
  features: [
    'One committed harness.json of checks, run the same way locally and in any CI',
    'Every check runs and every command is printed; a check that could not run is a failure',
    'Lint-meta rules for whole-repo invariants ESLint cannot reach, with six ready-made rules',
    'Pinned linters: zizmor, actionlint, gitleaks, hadolint, squawk and trivy at an exact version',
    'CI helpers for the diff base, commit ranges and dated ledgers',
    'Web bundle budgets weighed the way nginx serves each file',
    '@noctcore/harness-mutation: a mutation score ratchet and changed-line runs over Stryker',
    'Zero runtime dependencies and no network calls; tested on Linux and Windows',
  ],
  techDetails: {
    stack: [
      'TypeScript',
      'Node.js 22+ (builtins only)',
      'Bun workspaces',
      'Stryker (peer dependency)',
      'changesets + npm trusted publishing',
      'Astro Starlight (docs)',
      'GitHub Actions',
    ],
  },
  status: 'in-progress',
  duration: 'Ongoing',
  demoUrl: '',
  githubUrl: 'https://github.com/noctcore/harness',
  links: [
    {
      label: 'docs',
      url: 'https://noctcore.github.io/harness/',
      kind: 'docs',
    },
    {
      label: 'npm',
      url: 'https://www.npmjs.com/package/@noctcore/harness',
      kind: 'npm',
    },
    {
      label: 'npm: harness-mutation',
      url: 'https://www.npmjs.com/package/@noctcore/harness-mutation',
      kind: 'npm',
    },
    {
      label: 'releases',
      url: 'https://github.com/noctcore/harness/releases',
      kind: 'release',
    },
  ],
  featured: true,
}
