<div align="center">
  <img src="assets/showcase/hero.webp" alt="shirone.dev: my portfolio, built as a small desktop OS" width="100%" />

  <h1>shirone.dev</h1>

  <p><strong>My portfolio, built as a small desktop OS in the browser.</strong></p>

  <p>
    <a href="https://github.com/Shironex/portfolio/releases/latest">
      <img src="https://img.shields.io/github/v/release/Shironex/portfolio?style=flat&color=0f7c74" alt="Latest release" />
    </a>
    <a href="https://github.com/Shironex/portfolio/actions/workflows/build.yaml">
      <img src="https://img.shields.io/github/actions/workflow/status/Shironex/portfolio/build.yaml?branch=master&style=flat&label=build" alt="Build" />
    </a>
    <a href="LICENSE.txt">
      <img src="https://img.shields.io/badge/License-MIT-lightgrey?style=flat" alt="MIT License" />
    </a>
  </p>

  <p>
    <a href="https://shirone.dev"><strong>Live site</strong></a>
    &nbsp;·&nbsp;
    <a href="CHANGELOG.md"><strong>Changelog</strong></a>
  </p>

  <blockquote>
    <p>Windows, a dock, a command palette and a terminal that tells you who I am. Click around, or press Ctrl+K.</p>
  </blockquote>
</div>

---

### What is this?

This is my portfolio. Instead of a long scrolling page, it opens as a desktop: my projects, a short about page, the tools I use and a contact form each live in their own window, and everything can be reached from the command palette. On a phone it turns into a simple feed with a dock.

### Screenshots

<table>
  <tr>
    <td width="50%"><img src="assets/showcase/desktop.webp" alt="shirone.dev: Desktop" /></td>
    <td width="50%"><img src="assets/showcase/projects.webp" alt="shirone.dev: Projects" /></td>
  </tr>
  <tr>
    <td align="center"><sub>The desktop: a pixel night city, who I am, a short shell transcript, featured projects and my GitHub activity.</sub></td>
    <td align="center"><sub>Projects: everything I have built, filterable by status.</sub></td>
  </tr>
  <tr>
    <td width="50%"><img src="assets/showcase/project.webp" alt="shirone.dev: Project detail" /></td>
    <td width="50%"><img src="assets/showcase/about.webp" alt="shirone.dev: About" /></td>
  </tr>
  <tr>
    <td align="center"><sub>A project window, scrolled to its tech stack and screenshot gallery.</sub></td>
    <td align="center"><sub>About: who I am, what I work on and what I do away from code.</sub></td>
  </tr>
  <tr>
    <td width="50%"><img src="assets/showcase/monitor.webp" alt="shirone.dev: Monitor" /></td>
    <td width="50%"><img src="assets/showcase/contact.webp" alt="shirone.dev: Contact" /></td>
  </tr>
  <tr>
    <td align="center"><sub>Monitor: the languages, frameworks and tools I use every day.</sub></td>
    <td align="center"><sub>Contact: a form, plus my email and GitHub.</sub></td>
  </tr>
  <tr>
    <td width="50%"><img src="assets/showcase/palette.webp" alt="shirone.dev: Command palette" /></td>
    <td width="50%"><img src="assets/showcase/readme.webp" alt="shirone.dev: Readme" /></td>
  </tr>
  <tr>
    <td align="center"><sub>The command palette: open any app or project, turn the Lamp on, pick a sky or change a setting.</sub></td>
    <td align="center"><sub>Readme: a short welcome note and the keyboard shortcuts.</sub></td>
  </tr>
</table>

### What's inside

|                      |                                                                                                                                                                                                    |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Desktop shell**    | Menu bar, desktop icons, windows you can drag, resize, minimize and maximize, a taskbar and a start menu                                                                                           |
| **Pixel art**        | Window frames, icons, cursors, the night city wallpaper and two pets, drawn in Aseprite and always shown at a whole number of screen pixels per art pixel, so they stay crisp at 125% and 150% too |
| **Command palette**  | Ctrl+K (Cmd+K on macOS) opens any app or project, turns the Lamp on, picks a sky and copies my email                                                                                               |
| **Keyboard windows** | On a focused title bar: arrow keys move the window, Shift+arrows resize it, Ctrl+W closes, Ctrl+M minimizes                                                                                        |
| **Themes**           | The Lamp turns window bodies into warm paper, and four skies (or a live one that follows the time in Warsaw) repaint the wallpaper, all applied before the first paint so there is no flash        |
| **Mobile layout**    | Below 768px the desktop becomes a vertical feed with a bottom dock, and windows open as full-screen sheets                                                                                         |
| **Projects**         | Every project is a typed data file, filterable by status and searchable, with its own window and a gallery                                                                                         |
| **GitHub activity**  | A contribution heatmap from GitHub's GraphQL API, cached for six hours; it turns on when `GITHUB_TOKEN` is set                                                                                     |
| **Contact form**     | next-safe-action and Zod, Cloudflare Turnstile, a honeypot, a Redis rate limit, Resend email and a Discord ping                                                                                    |
| **Boot splash**      | A short greeting once per tab, skippable, and skipped entirely when you prefer reduced motion                                                                                                      |
| **Fast first paint** | The hero text is server-rendered under the client shell, with a plain HTML fallback when JavaScript is off                                                                                         |
| **Security headers** | A Content Security Policy and the usual hardening headers, set in `src/proxy.ts`                                                                                                                   |
| **Social images**    | Pixel Open Graph and Twitter cards rendered by the app itself, on the same night scene                                                                                                             |
| **Analytics**        | PostHog, loaded only once the browser is idle or you interact with the page                                                                                                                        |
| **End to end tests** | Playwright specs for the layout, windows, pets, contrast and keyboard paths, plus a pixel crispness check on Chromium, WebKit and Firefox                                                          |

### Built with

|           |                                                                                |
| --------- | ------------------------------------------------------------------------------ |
| Framework | Next.js 16 (App Router, Turbopack, Cache Components), React 19                 |
| Language  | TypeScript 6                                                                   |
| Styling   | Tailwind CSS 4, Radix UI primitives, pixel art from Aseprite                   |
| Forms     | React Hook Form, Zod 4, next-safe-action                                       |
| Services  | Resend and React Email, Redis (ioredis), Cloudflare Turnstile, PostHog         |
| Quality   | ESLint 10 with my `@noctcore` plugins, Prettier, Playwright, Husky, commitlint |
| Releases  | semantic-release on GitHub Actions                                             |

### Getting started

You need [Node.js](https://nodejs.org/) 22.13 or newer and [pnpm](https://pnpm.io/) 10.9 or newer.

```bash
git clone https://github.com/Shironex/portfolio.git
cd portfolio
pnpm install
cp .env.example .env    # on Windows cmd: copy .env.example .env
pnpm dev
```

The placeholder values in `.env.example` are enough to run the site locally: the Turnstile keys are Cloudflare's
always-pass test keys, and Redis is only used for the contact form's rate limit, which is skipped in development. For a
local production build, `docker compose up -d` starts Redis. Uncomment `GITHUB_TOKEN` and set it (a fine-grained token with read-only access to public
repositories) to see the GitHub heatmap.

| Command           | What it does                                                                   |
| ----------------- | ------------------------------------------------------------------------------ |
| `pnpm dev`        | Dev server with Turbopack on port 3000                                         |
| `pnpm dev:email`  | React Email preview of the templates, port 3001                                |
| `pnpm build`      | Production build                                                               |
| `pnpm start`      | Serve the production build                                                     |
| `pnpm lint`       | ESLint                                                                         |
| `pnpm typecheck`  | TypeScript, no emit                                                            |
| `pnpm format`     | Prettier over `src/`                                                           |
| `pnpm test:e2e`   | Playwright end to end tests                                                    |
| `pnpm test:pixel` | Unit tests of the pixel art scripts                                            |
| `pnpm tokens`     | Writes the colour tokens; `tokens:check` fails on a stale file or a faint pair |

### Pixel art

The art lives in Aseprite files outside this repo, so a clone builds without Aseprite. What the site needs is exported
into `src/assets/pixel/` and committed, and `pnpm lint` checks it.

| Command               | What it does                                                                                                                                                                            |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm art:export`     | Exports every sheet from Aseprite, `--list` shows what it found, `--only <name>` exports one                                                                                            |
| `pnpm art:<kind>`     | The generators (`chrome`, `glyphs`, `cursors`, `icons`, `project-icons`, `wallpaper`, `pets` and `sprites`) turn the exported sheets into the CSS, components and data the site imports |
| `pnpm art:check`      | Checks every sheet: palette colours only, hard alpha, matching data, and the byte budgets                                                                                               |
| `pnpm art:fresh`      | Fails if a generated file no longer matches its sheet                                                                                                                                   |
| `pnpm fonts:subset`   | Subsets the pixel fonts to WOFF2 with [uv](https://docs.astral.sh/uv/), `--check` compares the bytes                                                                                    |
| `pnpm generate:og`    | Copies the Open Graph card scenes and cuts the project icons into `src/app/_og/`, `--check` fails on a stale file                                                                       |
| `pnpm generate:icons` | Writes the favicons and manifest icons from the README logo tile, `--check` fails on a stale file                                                                                       |

`art:export` looks for Aseprite at `../aseprite/build/bin/aseprite`, then on `PATH`, and for the art in
`../aseprite-demo/`. The flags and environment variables that change both are at the top of
`scripts/pixel/export-art.mjs`, and `generate:og` takes `--og-dir` or `PIXEL_OG_DIR` the same way.

### Showcase images

The images in this README and the project galleries are captured with
[`@noctcore/showcase-kit`](https://www.npmjs.com/package/@noctcore/showcase-kit):

- `pnpm showcase:portfolio` builds this site on mock values and captures `assets/showcase/`, hero included (stop
  `pnpm dev` first, it rebuilds `.next`).
- `pnpm showcase:blog` captures shirone.blog into `public/projects/shirone-blog/`.
- `pnpm showcase:eslint` captures the ESLint plugins docs into `public/projects/eslint-plugins/`.

### Releases

Every push to `master` runs [semantic-release](https://semantic-release.gitbook.io/): it reads the conventional
commits, bumps the version, updates [CHANGELOG.md](CHANGELOG.md) and publishes a
[GitHub release](https://github.com/Shironex/portfolio/releases).

### License

The code is MIT. The pixel art in `src/assets/pixel/` is all rights reserved and may not be reused. See [LICENSE.txt](LICENSE.txt).
