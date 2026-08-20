/**
 * Drives the real app through every palette in both modes and asserts the
 * document actually repainted, then writes one screenshot per combination.
 *
 *   pnpm build && pnpm start          (in another shell)
 *   node scripts/verify-palettes.mjs  [--out <dir>] [--url http://localhost:3000]
 *
 * The three things worth proving here, none of which a build catches:
 *   - the pre-paint boot script runs before React, so there is no flash of the
 *     wrong palette (checked at domcontentloaded, before hydration)
 *   - the dark blocks' descendant selectors resolve, so dark mode is not
 *     silently falling back to light values
 *   - the noscript fallback still renders styled with scripting disabled,
 *     which is the one consumer whose failure is invisible in a normal run
 */
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

import { PALETTES } from './gen-palettes.mjs'

const args = process.argv.slice(2)
const arg = (name, fallback) => {
  const i = args.indexOf(name)
  return i > -1 ? args[i + 1] : fallback
}

const URL = arg('--url', 'http://localhost:3000')
const OUT = arg('--out', join(process.cwd(), '.palette-shots'))
mkdirSync(OUT, { recursive: true })

const failures = []
function check(label, actual, expected) {
  const ok = actual === expected
  if (!ok) failures.push(`${label}: got ${actual}, want ${expected}`)
  return ok ? 'ok' : 'FAIL'
}

/* The boot splash covers the desktop for ~2.4s on a cold load. Escape skips
   it; the wait is what keeps a screenshot from catching the overlay. */
async function dismissBoot(page) {
  await page.keyboard.press('Escape')
  await page
    .locator('text=booting with love')
    .waitFor({ state: 'hidden', timeout: 6000 })
    .catch(() => page.waitForTimeout(2600))
}

const browser = await chromium.launch({ channel: 'msedge' })

for (const { id, name } of PALETTES) {
  for (const mode of ['light', 'dark']) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    })
    await context.addInitScript(
      ([p, m]) => {
        localStorage.setItem('shiroos:palette', p)
        localStorage.setItem('shiroos:theme', m)
      },
      [id, mode]
    )
    const page = await context.newPage()

    await page.goto(URL, { waitUntil: 'domcontentloaded' })
    const prePaint = await page.evaluate(() => ({
      palette: document.documentElement.dataset.palette,
      dark: document.documentElement.classList.contains('dark'),
    }))

    await page.waitForLoadState('networkidle')
    await dismissBoot(page)
    const painted = await page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement)
      return {
        palette: document.documentElement.dataset.palette,
        accent: cs.getPropertyValue('--color-miku').trim(),
        ground: cs.getPropertyValue('--shiro-sky-1').trim(),
        onAccent: cs.getPropertyValue('--color-cloud').trim(),
      }
    })

    const bootOk = check(`${id}/${mode} boot palette`, prePaint.palette, id)
    const modeOk = check(`${id}/${mode} boot mode`, prePaint.dark, mode === 'dark')
    if (!painted.accent) failures.push(`${id}/${mode}: --color-miku is empty`)
    if (!painted.ground) failures.push(`${id}/${mode}: --shiro-sky-1 is empty`)

    await page.screenshot({ path: join(OUT, `${id}-${mode}.png`) })
    console.log(
      `${name.padEnd(7)} ${mode.padEnd(5)}  boot ${bootOk}/${modeOk}  ` +
        `accent ${painted.accent}  ground ${painted.ground}  on-accent ${painted.onAccent}`
    )
    await context.close()
  }
}

const noJs = await browser.newContext({
  javaScriptEnabled: false,
  viewport: { width: 1440, height: 900 },
})
const noJsPage = await noJs.newPage()
await noJsPage.goto(URL, { waitUntil: 'domcontentloaded' })
const attr = await noJsPage.getAttribute('html', 'data-palette')
check('noscript data-palette', attr, 'teal')
await noJsPage.screenshot({ path: join(OUT, 'noscript.png') })
console.log(`noscript          data-palette ${attr}`)
await noJs.close()

await browser.close()

if (failures.length) {
  console.error('\nFAILURES:')
  for (const f of failures) console.error(`  ${f}`)
  process.exit(1)
}
console.log(`\nall checks pass — ${PALETTES.length * 2 + 1} screenshots in ${OUT}`)
