# Contributing

This is my personal portfolio, so I keep its design and content to myself. Bug reports and suggestions are welcome as
issues; code changes are welcome for bugs and small fixes, please open an issue first for anything bigger.

## Setup

See the Getting started section of the [README](README.md). Node.js 26 or newer (`.nvmrc` pins the version CI uses) and pnpm 10.34.9 or newer.

## Before you open a pull request

- Run `pnpm lint`, `pnpm typecheck` and `pnpm build`. Husky runs lint-staged on commit and `pnpm lint` before it finishes.
- Generated files (colour tokens, pixel art code, icons, OG cards) come from their `pnpm` scripts, never from hand edits.
  `pnpm lint` fails on stale colour tokens or pixel art code. The favicons and manifest icons, the OG cards and the font
  subsets have their own checks: `pnpm generate:icons --check`, `pnpm generate:og --check` and `pnpm fonts:subset --check`.
  CI runs the icon and font checks; the OG check needs the Aseprite exports next to the repo, so it runs locally only.
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/) as `type(scope): lowercase summary`
  (commitlint checks it). Releases are cut by semantic-release from those messages, so the type matters.
- The pixel art in `src/assets/pixel/` is all rights reserved and cannot be reused, see [LICENSE.txt](LICENSE.txt).

## Security

Do not report vulnerabilities in a public issue, see [SECURITY.md](SECURITY.md).
