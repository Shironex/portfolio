/**
 * Generates `src/styles/palettes.css` from the palette table below and gates
 * every palette on WCAG AA contrast. Run it after editing a colour:
 *
 *   node scripts/gen-palettes.mjs          write the stylesheet
 *   node scripts/gen-palettes.mjs --check  fail if the file is stale
 *
 * The table is the only place a ShiroOS colour is written down. Component code
 * never carries a hex; it paints with an accent role that resolves to one of
 * these variables (see `src/components/os/accent-map.ts`), so a palette swap
 * reaches every surface at once.
 *
 * `--color-cloud` means "the foreground that sits on a filled accent", not
 * "cream". In light mode that is the paper colour; in dark mode it is the deep
 * ground, because cream on a bright accent lands near 1.5:1.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const CSS_OUT = join(ROOT, 'src', 'styles', 'palettes.css')
const TS_OUT = join(ROOT, 'src', 'lib', 'os', 'palettes.generated.ts')

/**
 * Per palette, per mode:
 *   acc/acc2/acc3  accent, pressed, bright        -> --color-miku{,-2,-3}
 *   sec/sec2       warm counterpoint, its light   -> --color-peach{,-2}
 *   sky0..3        wallpaper gradient + fills     -> --shiro-sky-{0..3}
 *   surfSolid/Soft opaque panel surfaces          -> --shiro-surf-{solid,soft}
 *   surfRgb        translucent chrome base        -> --shiro-surf-{0,1,2}
 *   ink..ink4      text, brightest to faintest    -> --shiro-ink{,-2,-3,-4}
 *   inkRgb         hairlines, shadows, scrollbar
 *   cloud          foreground on a filled accent  -> --color-cloud
 */
export const PALETTES = [
  {
    id: 'teal',
    name: 'Teal',
    light: {
      acc: '#0f7c74', acc2: '#0a5954', acc3: '#1ca59b',
      sec: '#b87a1e', sec2: '#cf8a33',
      sky0: '#fbf7ed', sky1: '#f5efe0', sky2: '#ece4d0', sky3: '#ddd2b8',
      surfSolid: '#fdfaf0', surfSoft: '#f7f2e3', surfRgb: '253, 249, 237',
      ink: '#1a1714', ink2: '#3a3530', ink3: '#5f564b', ink4: '#7a6f60',
      inkRgb: '26, 23, 20', cloud: '#fbf7ed', danger: '#ff5b6a',
    },
    dark: {
      acc: '#42ccc2', acc2: '#22a097', acc3: '#6fdfd6',
      sec: '#e8b055', sec2: '#f0c477',
      sky0: '#02110f', sky1: '#041816', sky2: '#06211e', sky3: '#082a26',
      surfSolid: '#0a2a26', surfSoft: '#061d1a', surfRgb: '12, 42, 38',
      ink: '#eaf4ec', ink2: '#bfd4cc', ink3: '#93afa5', ink4: '#7aa096',
      inkRgb: '234, 244, 236', cloud: '#02110f', danger: '#ff7c88',
    },
  },
  {
    id: 'sakura',
    name: 'Sakura',
    light: {
      acc: '#9e2f52', acc2: '#78203c', acc3: '#c75d7e',
      sec: '#b87a1e', sec2: '#cf8a33',
      sky0: '#fcf6f1', sky1: '#f7eee6', sky2: '#efe2d8', sky3: '#e2cfc4',
      surfSolid: '#fefaf6', surfSoft: '#f8f1ea', surfRgb: '254, 250, 246',
      ink: '#1c1512', ink2: '#3d322e', ink3: '#63524d', ink4: '#7e6a63',
      inkRgb: '28, 21, 18', cloud: '#fdf6f2', danger: '#e0453f',
    },
    dark: {
      acc: '#e8809f', acc2: '#cf5c7f', acc3: '#f5a8bf',
      sec: '#e8b055', sec2: '#f0c477',
      sky0: '#150409', sky1: '#1c0710', sky2: '#250a16', sky3: '#2f0e1d',
      surfSolid: '#2b0c18', surfSoft: '#1e0710', surfRgb: '43, 12, 24',
      ink: '#f6e9ec', ink2: '#dcc3cb', ink3: '#b799a2', ink4: '#a3838d',
      inkRgb: '246, 233, 236', cloud: '#150409', danger: '#ff7c88',
    },
  },
  {
    id: 'ai',
    name: 'Ai',
    light: {
      acc: '#2f4d99', acc2: '#21376f', acc3: '#5674c4',
      sec: '#b87a1e', sec2: '#cf8a33',
      sky0: '#f8f7f2', sky1: '#f1efe6', sky2: '#e6e3d6', sky3: '#d5d1c0',
      surfSolid: '#fbfaf6', surfSoft: '#f3f1e9', surfRgb: '251, 250, 246',
      ink: '#17181c', ink2: '#34363d', ink3: '#565a63', ink4: '#6c7079',
      inkRgb: '23, 24, 28', cloud: '#f8f7f2', danger: '#d84a52',
    },
    dark: {
      acc: '#7d9bea', acc2: '#5a79cc', acc3: '#a8bdf5',
      sec: '#e8b055', sec2: '#f0c477',
      sky0: '#05070f', sky1: '#080b18', sky2: '#0b0f20', sky3: '#0f1429',
      surfSolid: '#0f1530', surfSoft: '#080c1c', surfRgb: '15, 21, 48',
      ink: '#e8ecf7', ink2: '#c3cbe0', ink3: '#9aa3bd', ink4: '#858ea8',
      inkRgb: '232, 236, 247', cloud: '#05070f', danger: '#ff7c88',
    },
  },
  {
    id: 'kohaku',
    name: 'Kohaku',
    light: {
      acc: '#8a5a12', acc2: '#63400a', acc3: '#c9902f',
      sec: '#a4472e', sec2: '#c25f43',
      sky0: '#fdf8ea', sky1: '#f8f0dc', sky2: '#f0e5c8', sky3: '#e3d3ac',
      surfSolid: '#fffbef', surfSoft: '#faf3e0', surfRgb: '255, 251, 239',
      ink: '#1c1710', ink2: '#3d352a', ink3: '#635744', ink4: '#7d6f58',
      inkRgb: '28, 23, 16', cloud: '#fdf8ea', danger: '#c0392b',
    },
    dark: {
      acc: '#e0a63c', acc2: '#bd8624', acc3: '#f2c877',
      sec: '#d97a55', sec2: '#e89778',
      sky0: '#120c02', sky1: '#191204', sky2: '#221907', sky3: '#2c210a',
      surfSolid: '#2a1f08', surfSoft: '#1c1405', surfRgb: '42, 31, 8',
      ink: '#f6efdd', ink2: '#dccbab', ink3: '#b8a682', ink4: '#a3906d',
      inkRgb: '246, 239, 221', cloud: '#120c02', danger: '#ff7c66',
    },
  },
  {
    id: 'fuji',
    name: 'Fuji',
    light: {
      acc: '#6b3d9e', acc2: '#4f2a78', acc3: '#9268c9',
      sec: '#b87a1e', sec2: '#cf8a33',
      sky0: '#faf7f6', sky1: '#f3eff0', sky2: '#e8e2e6', sky3: '#d6ced5',
      surfSolid: '#fdfbfb', surfSoft: '#f6f2f4', surfRgb: '253, 251, 251',
      ink: '#1a161d', ink2: '#38323e', ink3: '#5b5363', ink4: '#726a7b',
      inkRgb: '26, 22, 29', cloud: '#faf7f6', danger: '#cc3b48',
    },
    dark: {
      acc: '#b596ea', acc2: '#9370d1', acc3: '#d0bcf7',
      sec: '#e8b055', sec2: '#f0c477',
      sky0: '#0b0514', sky1: '#10081c', sky2: '#160c26', sky3: '#1d1030',
      surfSolid: '#1b1030', surfSoft: '#120823', surfRgb: '27, 16, 48',
      ink: '#efeaf7', ink2: '#cec5e0', ink3: '#a89dbd', ink4: '#948aa8',
      inkRgb: '239, 234, 247', cloud: '#0b0514', danger: '#ff7c88',
    },
  },
  {
    id: 'sumi',
    name: 'Sumi',
    light: {
      acc: '#3b352d', acc2: '#221e19', acc3: '#6b6154',
      sec: '#b87a1e', sec2: '#cf8a33',
      sky0: '#fbf9f4', sky1: '#f4f1e9', sky2: '#e9e5da', sky3: '#d8d2c3',
      surfSolid: '#fdfcf7', surfSoft: '#f6f3ec', surfRgb: '253, 252, 247',
      ink: '#16130f', ink2: '#37322b', ink3: '#5c5449', ink4: '#776e60',
      inkRgb: '22, 19, 15', cloud: '#fbf9f4', danger: '#b03a3a',
    },
    dark: {
      acc: '#d8d0c2', acc2: '#b5ab9a', acc3: '#efe9dd',
      sec: '#e8b055', sec2: '#f0c477',
      sky0: '#0c0b09', sky1: '#12100d', sky2: '#191713', sky3: '#201d18',
      surfSolid: '#1c1a15', surfSoft: '#131110', surfRgb: '28, 26, 21',
      ink: '#f2eee6', ink2: '#cfc8bb', ink3: '#a49b8c', ink4: '#8d8474',
      inkRgb: '242, 238, 230', cloud: '#0c0b09', danger: '#e06a6a',
    },
  },
]

export const DEFAULT_PALETTE_ID = 'teal'

/* ------------------------------------------------------------------ */
/* colour maths                                                        */
/* ------------------------------------------------------------------ */

function rgb(hex) {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function luminance(hex) {
  const [r, g, b] = rgb(hex).map((v) => {
    const s = v / 255
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/** shadcn's `--primary` / `--ring` want a bare `H S% L%` triplet. */
function hsl(hex) {
  const [r, g, b] = rgb(hex).map((v) => v / 255)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  const d = max - min
  if (d === 0) return `0 0% ${Math.round(l * 100)}%`
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

/* ------------------------------------------------------------------ */
/* contrast gate                                                       */
/* ------------------------------------------------------------------ */

const AA = 4.5
const failures = []

function gate(palette, mode, what, fg, bg) {
  const r = contrast(fg, bg)
  if (r < AA) {
    failures.push(
      `${palette}/${mode} ${what}: ${r.toFixed(2)}:1 (needs ${AA})  ${fg} on ${bg}`
    )
  }
  return r
}

/* ------------------------------------------------------------------ */
/* emit                                                                */
/* ------------------------------------------------------------------ */

function tokens(t, mode) {
  const dark = mode === 'dark'
  const shadow = dark ? '0, 0, 0' : t.inkRgb
  const accRgb = rgb(t.acc).join(', ')
  return [
    ['--color-miku', t.acc],
    ['--color-miku-2', t.acc2],
    ['--color-miku-3', t.acc3],
    ['--color-peach', t.sec],
    ['--color-peach-2', t.sec2],
    ['--color-cloud', t.cloud],
    ['--color-danger', t.danger],
    ['--primary', hsl(t.acc)],
    ['--ring', hsl(t.acc)],
    ['--shiro-sky-0', t.sky0],
    ['--shiro-sky-1', t.sky1],
    ['--shiro-sky-2', t.sky2],
    ['--shiro-sky-3', t.sky3],
    ['--shiro-surf-0', `rgba(${t.surfRgb}, ${dark ? 0.5 : 0.6})`],
    ['--shiro-surf-1', `rgba(${t.surfRgb}, ${dark ? 0.7 : 0.8})`],
    ['--shiro-surf-2', `rgba(${t.surfRgb}, ${dark ? 0.9 : 0.95})`],
    ['--shiro-surf-solid', t.surfSolid],
    ['--shiro-surf-soft', t.surfSoft],
    ['--shiro-ink', t.ink],
    ['--shiro-ink-2', t.ink2],
    ['--shiro-ink-3', t.ink3],
    ['--shiro-ink-4', t.ink4],
    ['--shiro-rule', `rgba(${t.inkRgb}, ${dark ? 0.08 : 0.1})`],
    ['--shiro-rule-2', `rgba(${t.inkRgb}, 0.16)`],
    ['--shiro-scrollbar-track', `rgba(${t.inkRgb}, ${dark ? 0.04 : 0.05})`],
    ['--shiro-scrollbar-thumb', `rgba(${t.inkRgb}, ${dark ? 0.22 : 0.2})`],
    ['--shiro-scrollbar-thumb-hover', `rgba(${accRgb}, ${dark ? 0.65 : 0.5})`],
    ['--shiro-elev-1', `0 2px 8px -2px rgba(${shadow}, ${dark ? 0.45 : 0.1})`],
    ['--shiro-elev-2', `0 10px 30px -10px rgba(${shadow}, ${dark ? 0.6 : 0.18})`],
    ['--shiro-elev-3', `0 20px 60px -10px rgba(${shadow}, ${dark ? 0.65 : 0.22})`],
    ['--shiro-elev-4', `0 40px 80px -20px rgba(${shadow}, ${dark ? 0.75 : 0.3})`],
  ]
}

function block(selector, t, mode) {
  const body = tokens(t, mode)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n')
  return `${selector} {\n${body}\n}`
}

function build() {
  const blocks = []
  for (const p of PALETTES) {
    gate(p.id, 'light', 'on-accent', p.light.cloud, p.light.acc)
    gate(p.id, 'light', 'ink-3', p.light.ink3, p.light.surfSolid)
    gate(p.id, 'light', 'ink-4', p.light.ink4, p.light.surfSolid)
    gate(p.id, 'dark', 'on-accent', p.dark.cloud, p.dark.acc)
    gate(p.id, 'dark', 'ink-3', p.dark.ink3, p.dark.surfSolid)
    gate(p.id, 'dark', 'ink-4', p.dark.ink4, p.dark.surfSolid)

    blocks.push(`/* ${p.name} */`)
    blocks.push(block(`[data-palette='${p.id}']`, p.light, 'light'))
    blocks.push(
      block(
        `.dark[data-palette='${p.id}'],\n.dark [data-palette='${p.id}']`,
        p.dark,
        'dark'
      )
    )
  }

  return `/*
 * GENERATED by scripts/gen-palettes.mjs. Do not edit by hand — edit the
 * palette table in that script and re-run it.
 *
 * Every palette-varying token lives here and nowhere else. Selectors are
 * attribute-scoped rather than :root-scoped so a swatch can render in a
 * palette the document is not currently using: put data-palette on any
 * element and its subtree paints with that palette.
 *
 * The descendant form of each dark selector is what makes that work inside
 * dark mode, where .dark sits on <html> and the swatch sits deeper.
 */

${blocks.join('\n\n')}
`
}

function buildTs() {
  const rows = PALETTES.map(
    (p) => `  { id: '${p.id}', name: '${p.name}' },`
  ).join('\n')
  return `/**
 * GENERATED by scripts/gen-palettes.mjs. Do not edit by hand.
 *
 * Mirrors the palette table that produced src/styles/palettes.css, so the
 * picker cannot offer a palette the stylesheet has no block for.
 */

export const PALETTES = [
${rows}
] as const

export type PaletteId = (typeof PALETTES)[number]['id']

export const DEFAULT_PALETTE: PaletteId = '${DEFAULT_PALETTE_ID}'
`
}

const css = build()
const ts = buildTs()

if (failures.length) {
  console.error('contrast gate failed:')
  for (const f of failures) console.error(`  ${f}`)
  process.exit(1)
}

const outputs = [
  [CSS_OUT, css, 'src/styles/palettes.css'],
  [TS_OUT, ts, 'src/lib/os/palettes.generated.ts'],
]

if (process.argv.includes('--check')) {
  const stale = outputs.filter(([file, want]) => readFileSync(file, 'utf8') !== want)
  if (stale.length) {
    for (const [, , label] of stale) console.error(`${label} is stale.`)
    console.error('Run: node scripts/gen-palettes.mjs')
    process.exit(1)
  }
  console.log(`palettes up to date — ${PALETTES.length} palettes, gates pass`)
} else {
  for (const [file, content] of outputs) writeFileSync(file, content)
  console.log(
    `wrote ${outputs.length} files — ${PALETTES.length} palettes x 2 modes, ` +
      `${tokens(PALETTES[0].light, 'light').length} tokens each, gates pass`
  )
}
