# Dynamic Imports & Code Splitting Plan

_Target: reduce the client bundle on `/` (home) to get mobile LCP/TTI from 5.6s down. Remaining bottleneck is the eager vendor chunk (~335 KB raw / ~90 KB gz `455-*.js`), plus a ~185 KB posthog-js chunk (`cee3cf31-*.js`, ~58 KB gz) and duplicated zod in `main-*.js`._

All size numbers below are from the webpack build produced by `pnpm analyze` (reading `.next/analyze/client.html`). Raw parsed / gzipped, measured on the current build (post-Sentry removal, post-bundle-analyzer wiring).

---

## 1. Investigation summary

### Measured baseline (webpack, home `/`)

| Chunk            | Parsed   | Gzip     | Contents (top packages)                                                                                                                                                                                                      |
| ---------------- | -------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `main-*.js`      | 413.5 KB | 123.4 KB | zod (204 KB), next (132 KB), posthog-js (73 KB), instrumentation-client + env/client                                                                                                                                         |
| `455-*.js`       | 326.9 KB | 90.6 KB  | next internals (216 KB, link/router/loading boundary etc.), **zod (108 KB — duplicated!)**                                                                                                                                   |
| `72598643-*.js`  | 195.2 KB | 61.3 KB  | next framework/react-dom                                                                                                                                                                                                     |
| `framework-*.js` | 185.2 KB | 58.3 KB  | react + scheduler                                                                                                                                                                                                            |
| `cee3cf31-*.js`  | 181.2 KB | 58.9 KB  | **posthog-js full** (surveys, session_recording, feature_flags, autocapture)                                                                                                                                                 |
| `app/page-*.js`  | 116.5 KB | 32.7 KB  | all OS shell code (boot, cmd-palette, start-menu, window, mobile-shell, apps, hooks)                                                                                                                                         |
| `809-*.js`       | 89.0 KB  | 30.8 KB  | react-hook-form (27 KB), tailwind-merge (25 KB), next (15 KB), lucide-react (6 KB), next-safe-action (4 KB), react-turnstile (4 KB), @hookform/resolvers (3 KB), @radix-ui/react-slot (2 KB), @radix-ui/react-label (0.6 KB) |
| `40-*.js`        | 32.8 KB  | 9.0 KB   | sonner                                                                                                                                                                                                                       |

Build-manifest `rootMainFiles` currently includes `72598643`, `cee3cf31`, `455`, and `main-app`. That means **every route loads `455` (zod duplicated) and `cee3cf31` (full posthog-js)** whether or not the user ever interacts with the contact form or with analytics.

### Static-import chain into the initial bundle (root)

```
app/layout.tsx
  → context/providers.tsx            → nextjs-toploader (eager, part of Providers)
  → components/ui/sonner.tsx         → sonner (~33 KB raw / ~9 KB gz)
app/page.tsx (server)
  → components/os/os-shell.tsx (client)
       ├── apps/panels/hero-plate.tsx                 (above-the-fold, keep eager)
       ├── apps/panels/terminal-panel.tsx             (above-the-fold)
       ├── apps/panels/featured-panel.tsx             (above-the-fold)
       ├── boot.tsx                                   (runs once/session; gated on sessionStorage)
       ├── cmd-palette.tsx                            (only visible when cmdOpen)
       ├── start-menu.tsx                             (only visible when startOpen)
       ├── desktop-canvas.tsx / desktop-icons.tsx     (above-the-fold on desktop)
       ├── menubar.tsx                                (above-the-fold on desktop)
       ├── mobile-shell.tsx                           (always imported; only rendered < 768)
       ├── noscript-fallback.tsx                      (static, tiny)
       ├── window.tsx                                 (rendered only when windows open)
       └── app-registry.tsx
              ├── apps/about-app.tsx                  (on-demand)
              ├── apps/skills-app.tsx                 (on-demand)
              ├── apps/readme-app.tsx                 (on-demand)
              ├── apps/projects-app.tsx               (on-demand)
              ├── apps/project-detail-app.tsx         (on-demand)
              └── apps/contact-app.tsx                (on-demand)
                      └── lib/contact/contact-form.tsx (on-demand)
                              ├── react-hook-form
                              ├── @hookform/resolvers/zod
                              ├── zod (+ schema)
                              ├── react-turnstile
                              ├── next-safe-action/hooks
                              ├── sonner (toast)
                              └── posthog-js (direct `posthog.capture` calls)

instrumentation-client.ts (eager, every page) → posthog-js + env/client (zod)
```

The form stack (rhf + zod + turnstile + safe-action) and the posthog analytics SDK are **both paying a full tax on initial paint** for a view that primarily needs fonts, the hero, the terminal panel, and the featured-work list.

### Opportunities

1. `posthog-js` initialization is eager in `instrumentation-client.ts`. The library itself already lazy-loads its extensions (recorder, surveys), but core init + the 73 KB chunk in `main` + the 181 KB `cee3cf31` chunk load on every request. Deferring `init` until `requestIdleCallback` (or first user interaction) lets the browser paint before any of that code runs.
2. `contact-form.tsx` is statically imported via `app-registry.tsx` so rhf + zod + turnstile + resolvers + next-safe-action/hooks all end up in the initial shared graph. Contact is a single modal the user has to explicitly open. This is the single biggest candidate for `next/dynamic`.
3. `CmdPalette`, `StartMenu`, and `Window` are conditionally rendered (`{cmdOpen && ...}`) in `os-shell.tsx`, but statically imported — so their code is in the page chunk regardless. Dynamic-import them and they're gone until the user presses ⌘K, opens Start, or launches an app.
4. `Boot` is shown at most once per session (sessionStorage-gated) and is reduced-motion-aware. No reason to block first paint.
5. `MobileShell` is always imported but only rendered at `< 768px`. The desktop branch and mobile branch both pay each other's cost. Two dynamic imports, one per branch, selected after `useIsMobile` resolves.
6. `GithubActivityStrip` (below-the-fold panel on mobile, and on desktop the Terminal column already covers above-the-fold) does a client fetch and renders a 26-week grid. Can render from inside `react-intersection-observer` or be split off.
7. `sonner` is imported eagerly via `components/ui/sonner.tsx` in the root layout. `Toaster` only matters after the first `toast()` call; the first and likely only toast comes from the contact form. It can be mounted when the contact app (or any other toast-capable UI) is first opened.
8. `nextjs-toploader` in `providers.tsx` runs eagerly to decorate router transitions. This is mostly a luxury on a single-page portfolio with few navigations — candidate for removal or deferred mount.
9. `env/client.ts` uses `zod.createEnv(...)` at module scope. Because `instrumentation-client.ts` imports it, zod lives in `main-*.js` (204 KB parsed) — in addition to the copy pulled in by `next-safe-action` into `455`. Options to break the duplicate: (a) drop `zod` from `env/client.ts` (it's just a string validator, can be hand-written), or (b) defer `posthog.init` so `instrumentation-client` stops pulling `env/client` into the main graph. Option (b) is cleaner and already planned in #1.
10. Anti-pattern: `@/env/client` is imported at the top of `lib/contact/contact-form.tsx`. Because Next turns `@t3-oss/env-nextjs` into a zod schema that runs at module-eval time, this is fine correctness-wise, but it does mean the form chunk also pulls in zod — harmless once the form is itself behind `next/dynamic`.

### Things that are fine as-is

- `lucide-react` usage is already tree-shaken (ESM named imports, ~6 KB in the 809 chunk). No action needed.
- `motion` is only used for a single `Variants` _type_ import in `lib/utils/animations.ts`. No runtime `motion` code lands on the client at all — a grep confirmed zero distinctive framer-motion strings in any rootMainFile. Skip.
- `@radix-ui/react-separator`, `@radix-ui/react-scroll-area`, `@radix-ui/react-select` are listed in `package.json` but no file under `src/` imports them today (grep: only `@radix-ui/react-label` and `@radix-ui/react-slot` appear). These are candidates for removal from `dependencies` entirely (no bundle impact today because they're tree-shaken out, but they pollute the lockfile and install size).

---

## 2. Ranked recommendations

Sorted by impact-to-risk ratio. Every savings figure is the chunk's contribution at current gzip in the webpack build; "critical-path" savings means bytes removed from the set that loads before the home-route page chunk runs.

### A. Dynamic-import the contact form stack (highest impact, low risk)

- **Target**: `src/components/os/apps/contact-app.tsx`
- **Change**: Replace the static `import { ContactForm } from '@/lib/contact/contact-form'` with `const ContactForm = dynamic(() => import('@/lib/contact/contact-form').then(m => m.ContactForm), { ssr: false, loading: () => <FormSkeleton /> })`. Everything else in `contact-app.tsx` (the "Reach me" aside, lucide icons, theme hook) stays static — those are cheap.
- **Estimated critical-path savings**: the entire `809-*.js` chunk vanishes from the home page (which doesn't need it), which is **~89 KB raw / ~31 KB gz** of react-hook-form + tailwind-merge + next-safe-action/hooks + react-turnstile + @hookform/resolvers + the two Radix primitives that form uses. Plus zod (108 KB in `455`) stops being reachable from the home page's static graph — webpack may or may not move it to a lazy chunk depending on `rootMainFiles` behavior; in the worst case this at least removes the form from the home-route page chunk. Also removes the indirect `posthog.capture` import path via `contact-form.tsx`.
- **Risk**: None for SEO (contact body isn't indexed; it's behind a window). `ssr: false` avoids any hydration risk with `useAction` / `useForm`. Need a tiny 8-line skeleton so layout doesn't pop.
- **Where to watch**: `contact-app.tsx` uses `theme` from `useTheme`. Make sure the skeleton respects theme or is theme-agnostic (a gray rectangle of fixed height matches).

### B. Defer PostHog init to idle / first interaction

- **Target**: `src/instrumentation-client.ts`
- **Change**: Replace the eager top-level `import posthog from 'posthog-js'; posthog.init(...)` with a scheduled dynamic import:
  - Wrap in a function `bootPosthog()` that does `const { default: posthog } = await import('posthog-js'); posthog.init(token, { ... })`.
  - Schedule it with `requestIdleCallback(bootPosthog, { timeout: 2000 })`, falling back to `setTimeout(bootPosthog, 1500)` when `requestIdleCallback` is unavailable (Safari). Also kick it early on the first `pointerdown`/`keydown`/`scroll` (whichever comes first) via `{ once: true, passive: true }` listeners.
  - Keep `capture_exceptions: true` (posthog-js itself lazy-loads the error tracker on init).
- **Estimated critical-path savings**: moves `cee3cf31-*.js` (~181 KB raw / **~59 KB gz**) out of the pre-paint network waterfall, and removes the 73 KB of posthog-js that's currently in `main-*.js` from the critical path (the import becomes dynamic, so webpack splits it into its own async chunk). Also stops `env/client.ts` from being eager, which breaks zod's reach into `main` (another ~60 KB gz if webpack re-balances — conservatively assume half).
- **Risk**:
  - PostHog best-practice per the 2026 docs is still to use `instrumentation-client.ts` — but the file only needs to _ensure_ init runs, it doesn't need to run init synchronously. Anything captured in the ~1.5s idle window is lost; for a portfolio where the valuable events are "clicked contact", "opened project", and "submitted form" (all downstream of user interaction), this is acceptable.
  - `capture_exceptions` early-life errors (between first paint and idle) will be missed. If this matters, also attach a one-shot `window.addEventListener('error', e => { pendingErrors.push(e); bootPosthog().then(() => pendingErrors.forEach(...)) })`. Include this if error-tracking coverage is non-negotiable.
  - Next's `instrumentation-client` file is a module that Next guarantees to execute client-side on bootstrap; deferring _inside_ that module is supported (the 2026 Next docs explicitly show dynamic `import()` as a lazy-load primitive). No framework-level breakage.
  - `defaults: '2026-01-30'` in the current config is preserved.
- **Source**: PostHog's docs confirm posthog-js already lazy-loads extensions (recorder, surveys) — deferring the _core_ init is a separate win not addressed by the library. The Next.js 16 lazy-loading guide supports `await import(...)` inside client modules for exactly this use case.

### C. Dynamic-import `CmdPalette`, `StartMenu`, and `Boot`

- **Target**: `src/components/os/os-shell.tsx`
- **Change**:
  - `const CmdPalette = dynamic(() => import('./cmd-palette').then(m => m.CmdPalette), { ssr: false })`
  - `const StartMenu = dynamic(() => import('./start-menu').then(m => m.StartMenu), { ssr: false })`
  - `const Boot = dynamic(() => import('./boot').then(m => m.Boot), { ssr: false })`
- **Estimated critical-path savings**: ~14 KB raw / ~4 KB gz out of `app/page-*.js` (Boot 4.9K, StartMenu 4.8K, CmdPalette 4.5K parsed). Each becomes its own async chunk that only loads on trigger.
- **Risk**:
  - `Boot` shouldn't flash: it's already gated on `!gone && ready` via a mount effect, so dynamic-import adds one more tick before it can render — acceptable because the splash is "nice-to-have" and reduced-motion users skip it anyway.
  - `CmdPalette` and `StartMenu` already render conditionally (`{cmdOpen && ...}`); making them dynamic-import just means the code also loads lazily, not only the React tree. No UX change for first load.
  - `ssr: false` is safe — none of these are server-rendered anyway (they're inside an OS shell that's already a client boundary and only appears after user actions).
- **Caveat**: Keyboard hotkey ⌘K shows the palette; there will be a one-frame flash when it opens the first time. Pair with a `loading:` dimmer overlay so the backdrop appears instantly while the panel streams in.

### D. Dynamic-import the per-app window bodies

- **Target**: `src/components/os/app-registry.tsx`
- **Change**: Convert every `import ProjectsApp from './apps/projects-app'` etc. to a `dynamic(() => import('./apps/projects-app'), { ssr: false, loading: AppBodySkeleton })` map. Only `AboutApp`, `SkillsApp`, `ReadmeApp`, `ProjectsApp`, `ProjectDetailApp`, `ContactApp` should be dynamic. The dispatch function (`switch (win.id)`) returns the right dynamic component; React.lazy-style.
- **Estimated critical-path savings**: roughly **~22 KB raw / ~6 KB gz** off `app/page-*.js` (sum of the six app modules from the analyzer). Contact pairs with item A — contact-app.tsx itself is tiny, the savings come from the contact form stack.
- **Risk**:
  - Opening a window for the first time adds a microtask round-trip before content renders. Mitigate with a low-effort skeleton inside `<AppBody>` or a "Loading…" row with the app's accent color.
  - All six app modules are purely interactive; none need SSR.
  - The switch dispatch keeps working because the returned component from `dynamic()` is still a React component.

### E. Split the mobile/desktop branch in `os-shell.tsx`

- **Target**: `src/components/os/os-shell.tsx`
- **Change**:
  - `const MobileShell = dynamic(() => import('./mobile-shell').then(m => m.MobileShell), { ssr: false })`
  - The desktop-only subtree (MenuBar, DesktopCanvas, DesktopIcons, Window, Taskbar) is harder to split with a single call, but wrapping it in a dynamic `DesktopShell` barrel component (new file, ~15 lines) and gating both by `useIsMobile()` means mobile users never download MenuBar/DesktopCanvas/DesktopIcons/Window/Taskbar.
- **Estimated critical-path savings**:
  - For mobile users: remove MenuBar (~3.3K), DesktopCanvas (~1K), DesktopIcons (~2K), Window (~4.3K), Taskbar (~3.6K) from page chunk. **~15 KB raw / ~4 KB gz**.
  - For desktop users: remove MobileShell (~6.4K) + MobileSheet. **~8 KB raw / ~2 KB gz**.
- **Risk**:
  - `useIsMobile` has to return a stable value before the correct branch is imported; the first render during hydration is already handled (the hook gates on `window.matchMedia` in an effect), so the `ssr: false` pattern is safe.
  - Potentially causes a brief blank frame on mobile first paint (before the mobile bundle loads) — acceptable because the static HTML (server-rendered) shows nothing for this page today anyway (`os-shell.tsx` is entirely client). Consider adding a minimal static HTML placeholder in `page.tsx` (header bar with logo + "ShiroOS") to avoid FOUC; that's orthogonal to code-splitting but belongs in the same pass.

### F. Remove `nextjs-toploader` from the critical path

- **Target**: `src/context/providers.tsx`
- **Options**:
  1. **Remove the package.** The portfolio is mostly a one-page OS shell. Internal route navigations are limited to 404 → `/`. The value of a top-of-page progress bar is low vs. its bundle + eager render cost.
  2. **Dynamic-import it** with `ssr: false`. `const NextTopLoader = dynamic(() => import('nextjs-toploader'), { ssr: false })`. Slight delay before the loader appears on the first route transition; acceptable.
- **Estimated critical-path savings**: hard to quantify precisely (it didn't show up as its own package in the analyzer breakdown because it's small), but roughly **~5–8 KB raw / ~2–3 KB gz**. Option 1 (remove) is cleaner.
- **Risk**: Option 1 removes a UI affordance — confirm the product doesn't depend on the visual cue. Option 2 is zero-risk.

### G. Lazy-mount `Toaster` (sonner)

- **Target**: `src/app/layout.tsx`, `src/components/ui/sonner.tsx`
- **Change**: Replace the eager `<Toaster />` in layout with a client component `ToasterMount` that uses `dynamic(() => import('./sonner').then(m => m.Toaster), { ssr: false })`, **and** delays the import until after `requestIdleCallback` (similar to the PostHog pattern). Or simpler: only import + mount `Toaster` from inside `contact-app.tsx` and anywhere else `toast()` is called.
- **Grep confirms** `toast(...)` callers: `contact-form.tsx` and `menubar.tsx` only. If both are already dynamic (A + C), sonner naturally becomes async-chunk-only.
- **Estimated critical-path savings**: **~33 KB raw / ~9 KB gz** (the 40-\*.js chunk).
- **Risk**: Any `toast(...)` call that fires before the Toaster mounts gets silently dropped. Menubar is always mounted on desktop, so it has at least one eager `toast()` import path (grep line: `menubar.tsx:7`). Either:
  - (a) dynamic-import `menubar.tsx` too (but it _is_ part of the desktop above-the-fold chrome), or
  - (b) route menubar's `toast()` through a lazy wrapper `const { toast } = await import('sonner')` at the call site.
- Solution (b) is lower risk; defer this to Phase 3 unless A + C already remove the menubar's toast dependency.

### H. Drop `zod` from `src/env/client.ts` (deduplication)

- **Target**: `src/env/client.ts`
- **Problem**: the current shape uses `z.string().min(1)` and `z.string().optional()` for five env vars. The analyzer shows **zod is duplicated (204 KB in main + 108 KB in 455)** because (a) `instrumentation-client` imports this file and (b) `next-safe-action` imports zod in the other graph. After B (defer posthog init), the first reason goes away automatically — the `env/client` module will only be imported from inside `contact-form.tsx`, which is now lazy (A). So this item is resolved by doing A + B; no separate change needed.
- **Alternative if savings still insufficient**: replace `@t3-oss/env-nextjs` + zod with a ~20-line hand-written assertion (`throw new Error` if env var missing). But the tree-shake from A+B should already collapse the duplicate — verify with `pnpm analyze` after Phase 1 before touching this.

### I. Lazy-mount `GithubActivityStrip`

- **Target**: wherever it's used (currently imported by `terminal-panel.tsx` — verify).
- **Change**: `const GithubActivityStrip = dynamic(() => import('./github-activity-strip').then(m => m.GithubActivityStrip), { ssr: false })` combined with a simple in-view gate (`react-intersection-observer` is already a dep; or just render lazily after mount with `useEffect`).
- **Estimated critical-path savings**: **~3.9 KB raw / ~1 KB gz** off page chunk, plus it stops firing the `/api/github-activity` fetch during first paint — helps TTI even if bytes are small.
- **Risk**: None. The strip has a `loading` state baked in.

### J. Cleanup: remove unused Radix deps (tiny, not a bundle win)

- **Target**: `package.json`
- **Change**: `pnpm remove @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator` — no file under `src/` imports them today.
- **Estimated critical-path savings**: zero today (tree-shaking already excludes them). Do this for lockfile hygiene, not performance.
- **Risk**: None. Verify grep before removing.

---

## 3. Answers to the three "special attention" asks

### PostHog deferral idiom for Next.js App Router in 2026

Confirmed against the current PostHog + Next.js docs:

- PostHog still recommends `instrumentation-client.ts` as the mounting point. That file is allowed to do its work asynchronously — nothing in PostHog's contract requires synchronous `init`.
- posthog-js already lazy-loads its recorder/surveys extensions internally. The ~181 KB `cee3cf31` chunk is posthog-js's _core_; the recorder isn't in it. Deferring core init therefore saves the whole chunk.
- The Next.js 16 lazy-loading guide explicitly documents `await import('lib')` inside client modules as the pattern for bundle-splitting a third-party library. The `turbopackIgnore` / `webpackIgnore` magic comments exist for runtime-only imports but aren't needed here — we _want_ the split chunk.
- There's a pre-release `@posthog/next` package that further simplifies client/server identity, but it's not shipping yet and isn't needed for this deferral.
- Recommended shape (Agent B implements):
  ```
  instrumentation-client.ts
    1. no top-level import of posthog-js or @/env/client
    2. `const boot = () => import('posthog-js').then(m => {
         m.default.init(envToken, { api_host, ui_host, defaults: '2026-01-30', capture_exceptions: true })
       })`
    3. schedule via `requestIdleCallback(boot, { timeout: 2000 })` with a `setTimeout(boot, 1500)` fallback
    4. also bind a `once:true, passive:true` listener set on `pointerdown`, `keydown`, `scroll` to boot eagerly on first interaction (whichever fires first)
    5. env token/host can be read via `process.env.NEXT_PUBLIC_*` inside the deferred function to avoid dragging `env/client.ts` into the critical path (`instrumentation-client.ts` is one of the files where direct `process.env` usage is permitted; the existing eslint ignore can be kept or mirrored)
  ```

### OS shell — above-the-fold vs. on-demand

Above-the-fold (keep eagerly imported):

- `hero-plate.tsx` — hero copy, LCP candidate text
- `terminal-panel.tsx` — visible immediately on desktop
- `featured-panel.tsx` — visible immediately on desktop and mobile
- `menubar.tsx` — visible immediately on desktop
- `desktop-canvas.tsx`, `desktop-icons.tsx` — the wallpaper frame, visible immediately on desktop
- `taskbar.tsx` — visible immediately on desktop
- `noscript-fallback.tsx` — tiny and static
- `os-shell.tsx` itself

On-demand (safe to `next/dynamic`):

- `boot.tsx` — session-gated splash
- `cmd-palette.tsx` — triggered by ⌘K
- `start-menu.tsx` — triggered by clicking Start
- `window.tsx` — rendered only when an app window opens
- every module under `components/os/apps/` — opened by window launch
- `mobile-shell.tsx` and everything it uniquely imports (`mobile-sheet.tsx`) — only rendered `< 768`

### Contact form — its own chunk

Yes, and it should include everything downstream of `ContactForm`: zod validation schema, turnstile widget, next-safe-action hook, @hookform/resolvers, react-hook-form. Single `next/dynamic` on `contact-form.tsx` achieves this because those are all transitive imports. The form becomes a ~100 KB async chunk that only loads when the user opens the contact window. Savings measured above in item A.

### Radix primitives inside modals/drawers

Only two Radix packages are actually imported:

- `@radix-ui/react-slot` via `button.tsx` and `form.tsx` — button is everywhere, keep eager.
- `@radix-ui/react-label` via `label.tsx` / `form.tsx` — only form uses this, so it rides along with item A's dynamic import automatically.

No Radix Dialog, Popover, or Sheet is in use. Nothing else to split out.

---

## 4. Anti-patterns flagged

- **`app-registry.tsx`** eagerly imports all six window body components (including `contact-app.tsx` which drags the entire form stack). The `switch` dispatcher only needs one of them at a time. Phase-1 fix: `dynamic()` each app.
- **`os-shell.tsx`** imports `CmdPalette`, `StartMenu`, and `Window` statically even though they're all conditionally rendered. Phase-1 fix: `dynamic()`.
- **`instrumentation-client.ts`** imports `posthog-js` _and_ `@/env/client` at module scope. The top of the module runs before React, before hydration, and before any user pixel is painted. Phase-1 fix: defer.
- **`components/ui/sonner.tsx`** is mounted in `layout.tsx` even though the only toast callers are inside interactive features. Deferral goes in Phase 2 because it depends on menubar's `toast` path.
- **`providers.tsx`** eagerly mounts `nextjs-toploader` on a mostly single-page site. Phase-1 fix: delete or dynamic-import.
- **`contact-form.tsx`** imports `posthog-js` at module scope for `posthog.capture(...)`. After item A (form is dynamic), this is fine — but the capture call itself should await `import('posthog-js')` rather than importing at top level, so that even if the form ever gets reintroduced to an eager path it doesn't drag posthog back in. Phase-2 tidy.
- **`env/client.ts`** uses `zod` for what is effectively five `assertDefined` checks. See item H.
- Stale deps: `@radix-ui/react-scroll-area`, `@radix-ui/react-select`, `@radix-ui/react-separator` — none are imported anywhere under `src/`. Remove from `package.json`.

---

## 5. Implementation order

### Phase 1 — quick wins (< 30 min each, biggest absolute savings)

1. **[A] Dynamic-import `ContactForm`** in `contact-app.tsx` with `ssr: false`.  
   _Savings: ~89 KB raw / ~31 KB gz off the critical path (809 chunk disappears from home). Plus removes the contact-form-indirected reach of zod + posthog-js from the home page graph._

2. **[B] Defer `posthog.init`** to `requestIdleCallback` + first-interaction in `instrumentation-client.ts`.  
   _Savings: ~181 KB raw / ~59 KB gz out of the pre-paint waterfall (cee3cf31 becomes an idle-loaded chunk), and ~73 KB of posthog-js moves out of `main-*.js` into its own async chunk. Secondary effect: `env/client.ts` stops being eager, which unblocks H._

3. **[C] Dynamic-import `CmdPalette`, `StartMenu`, `Boot`** in `os-shell.tsx`.  
   _Savings: ~14 KB raw / ~4 KB gz off `app/page-*.js`._

4. **[F] Remove (preferred) or dynamic-import `nextjs-toploader`** in `providers.tsx`.  
   _Savings: ~5–8 KB raw / ~2–3 KB gz._

5. **[J] Remove unused Radix deps** from `package.json` — install/lockfile hygiene.

**Phase 1 expected critical-path reduction (gzipped):** ~96–98 KB gz off the pre-paint bundles (cee3cf31 + 809 + small page-chunk trims). On mobile TTI — which is JS-execution-bound, not transfer-bound — this is the highest-leverage change because it removes ~100 KB of parse+compile+init work, including PostHog's init (which is non-trivial on slow mobile CPUs).

### Phase 2 — mid effort

6. **[D] Dynamic-import per-app window bodies** in `app-registry.tsx`. Six `dynamic()` calls + a small `<AppBodySkeleton />`.  
   _Savings: ~22 KB raw / ~6 KB gz off page chunk._

7. **[E] Split mobile vs. desktop branch** in `os-shell.tsx`. Extract a `DesktopShell` barrel; `dynamic()` both branches.  
   _Savings: ~15 KB raw / ~4 KB gz for mobile; ~8 KB raw / ~2 KB gz for desktop._

8. **[I] Lazy-mount `GithubActivityStrip`**.  
   _Savings: ~4 KB raw / ~1 KB gz, plus defers a `/api/github-activity` fetch._

9. **[G] Lazy-mount `Toaster`** — contingent on A + C already landing. Switch the two `toast()` callers (menubar, contact-form) to an await-in-place pattern so sonner is not needed at layout render time.  
   _Savings: ~33 KB raw / ~9 KB gz._

### Phase 3 — larger refactors, only if still needed

10. **[H] Replace zod-based `env/client.ts`** with a tiny hand-rolled assertion helper (if, after Phase 1 + 2, zod still ships in main). Likely unnecessary once B lands.

11. **Static HTML placeholder** in `app/page.tsx`: render a server component that includes the visible chrome (logo, hero headline text) before the client-only `OsShell` mounts. This doesn't shrink the bundle but reduces the perceived LCP because the first text paint isn't blocked on client bundle execution. Consider only if the mobile LCP is still the chosen element.

12. **Migrate to posthog-js slim bundle**: `import posthog from 'posthog-js/dist/module.slim'` + explicit extension bundles. Source: the 2026 PostHog JS docs document the slim bundle as the "biggest reduction in bundle size" path. Only do this if the deferred-init savings from B aren't enough on their own. It's more invasive and needs a check of which PostHog features the site actually uses (event capture + exceptions, based on the code; neither surveys nor session replay are wired up).

---

## 6. How to verify

After each phase:

1. `pnpm analyze` and inspect `.next/analyze/client.html`. Look specifically at:
   - `main-*.js` parsed/gzip size (target: drop below 80 KB gz after B)
   - `cee3cf31-*.js` should be removed from `rootMainFiles` (check `.next/build-manifest.json`) after B
   - `809-*.js` should no longer be reachable from `app/page-*.js` after A
   - `app/page-*.js` should drop from 116 KB to ~80 KB after C, and ~55 KB after D+E

2. Lighthouse mobile on production — track TTI and LCP. A reduction in `cee3cf31` alone should shave ~1.5–2s off mobile TTI on 4× CPU throttle because PostHog's init is one of the longest-running scripts on load.

3. Smoke test:
   - Open `/`, confirm boot splash still appears (not on second load — sessionStorage)
   - Press ⌘K, confirm palette opens with < 200ms delay (will be instant after the chunk is cached)
   - Click Start, confirm menu opens
   - Open contact window, type, submit — confirm Turnstile renders, form posts, toast appears
   - Check PostHog dashboard that events still arrive for `contact_form_submitted`

4. Network waterfall check on a throttled Slow 4G profile: `cee3cf31` and `809` should not appear in the waterfall until interaction. `main-*.js` should be noticeably smaller.
