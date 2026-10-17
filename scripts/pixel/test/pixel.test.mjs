/**
 * Tests for the pixel art pipeline, on fixtures the real Aseprite CLI wrote
 * (see fixtures/make-fixtures.mjs). Run with `pnpm test:pixel`.
 */
import assert from 'node:assert/strict'
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

import { checkArt, sheetProblems } from '../check-art.mjs'
import { normalizeSheetJson, resolvePaths, sheetArgs } from '../export-art.mjs'
import { chromeCss, growGrid, sliceInsets } from '../gen-chrome.mjs'
import { cursorsCss } from '../gen-cursors.mjs'
import { glyphModuleSource, readGlyphs } from '../gen-glyphs.mjs'
import { buildSpritesCss, spriteCss } from '../gen-sprites.mjs'
import { PALETTE_HEX, PAPER_RECOLOUR, normalizeHex } from '../palette.mjs'
import { optimizePng, samePixels } from '../png.mjs'
import {
  loadSheet,
  pixelAt,
  readRegion,
  readSheetJson,
  sliceKey,
  tagFrames,
} from '../sheet.mjs'
import { gridToPaths, mergeRuns, rectsToPath, svgDataUri } from '../svg.mjs'
import { FIXTURE_NAMES, makeFixtures } from './fixtures/make-fixtures.mjs'

const FIXTURES = join(dirname(fileURLToPath(import.meta.url)), 'fixtures')
const fixture = (name) => join(FIXTURES, `${name}.json`)

function tempDir() {
  return mkdtempSync(join(tmpdir(), 'pixel-test-'))
}

/** A PNG of `rows` (hex or null per pixel) written to `file`. */
async function writePng(file, rows, alpha = 255) {
  const h = rows.length
  const w = rows[0].length
  const raw = Buffer.alloc(w * h * 4)
  rows.flat().forEach((hex, i) => {
    if (!hex) return
    const n = parseInt(hex.slice(1), 16)
    raw.set([(n >> 16) & 255, (n >> 8) & 255, n & 255, alpha], i * 4)
  })
  await sharp(raw, { raw: { width: w, height: h, channels: 4 } })
    .png()
    .toFile(file)
}

/** A one-frame sheet JSON for a `w`x`h` PNG named `name.png`. */
function sheetJson(name, w, h, extra = {}) {
  return {
    frames: [
      {
        filename: `${name} 0.aseprite`,
        frame: { x: 0, y: 0, w, h },
        rotated: false,
        trimmed: false,
        spriteSourceSize: { x: 0, y: 0, w, h },
        sourceSize: { w, h },
        duration: 100,
      },
    ],
    meta: {
      image: `${name}.png`,
      size: { w, h },
      frameTags: [],
      layers: [],
      slices: [],
      ...extra,
    },
  }
}

describe('palette', () => {
  it('holds the 34 README colours, unique and lower case', () => {
    assert.equal(PALETTE_HEX.length, 34)
    assert.equal(new Set(PALETTE_HEX).size, 34)
    for (const hex of PALETTE_HEX) assert.match(hex, /^#[0-9a-f]{6}$/)
  })

  it('recolours paper only into palette colours', () => {
    for (const [from, to] of Object.entries(PAPER_RECOLOUR)) {
      assert.ok(PALETTE_HEX.includes(from), from)
      assert.ok(PALETTE_HEX.includes(to), to)
    }
  })

  it('normalises hex forms', () => {
    assert.equal(normalizeHex('#ABC'), '#aabbcc')
    assert.equal(normalizeHex('#0B1420FF'), '#0b1420')
    assert.throws(() => normalizeHex('teal'))
  })
})

describe('svg', () => {
  it('merges runs across and down', () => {
    const grid = [
      ['a', 'a', null],
      ['a', 'a', 'b'],
      [null, 'b', 'b'],
    ]
    assert.deepEqual(mergeRuns(grid), {
      a: [{ x: 0, y: 0, w: 2, h: 2 }],
      b: [
        { x: 2, y: 1, w: 1, h: 1 },
        { x: 1, y: 2, w: 2, h: 1 },
      ],
    })
  })

  it('does not stack runs separated by a gap row', () => {
    const grid = [[true], [null], [true]]
    assert.deepEqual(mergeRuns(grid).true, [
      { x: 0, y: 0, w: 1, h: 1 },
      { x: 0, y: 2, w: 1, h: 1 },
    ])
  })

  it('writes rect paths and a CSS-safe data URI', () => {
    assert.equal(rectsToPath([{ x: 1, y: 2, w: 3, h: 4 }]), 'M1 2h3v4H1z')
    const uri = svgDataUri('<svg fill="#0b1420" d="100%"/>')
    assert.equal(uri, "data:image/svg+xml,<svg fill='%230b1420' d='100%25'/>")
  })

  it('paints the largest colour under the whole opaque area', () => {
    const grid = [
      [null, 'a', 'a', null],
      ['a', 'b', 'a', 'a'],
      [null, 'a', 'a', null],
    ]
    assert.deepEqual(gridToPaths(grid), [
      { fill: 'a', d: 'M1 0h2v1H1zM0 1h4v1H0zM1 2h2v1H1z' },
      { fill: 'b', d: 'M1 1h1v1H1z' },
    ])
  })
})

describe('sheet', () => {
  it('rejects JSON that is not a json-array sheet', () => {
    const dir = tempDir()
    try {
      const file = join(dir, 'bad.json')
      writeFileSync(file, JSON.stringify({ frames: {}, meta: {} }))
      assert.throws(
        () => readSheetJson(file),
        /not an Aseprite json-array sheet/
      )
    } finally {
      rmSync(dir, { recursive: true })
    }
  })

  it('reads packed frames through their own rectangles', async () => {
    const sheet = await loadSheet(fixture('glyphs-fixture'))
    // frame 2 was packed onto the second row of the sheet
    assert.deepEqual(sheet.data.frames[2].frame, { x: 0, y: 8, w: 24, h: 8 })
    // the spinner's third frame has its arm in the bottom right corner
    assert.equal(pixelAt(sheet, 2, 23, 7)[3], 255)
    assert.equal(pixelAt(sheet, 0, 23, 7)[3], 0)
    assert.equal(pixelAt(sheet, 0, -1, 0)[3], 0)
  })

  it('plays tags in their direction', () => {
    assert.deepEqual(
      tagFrames({ from: 1, to: 3, direction: 'forward' }),
      [1, 2, 3]
    )
    assert.deepEqual(
      tagFrames({ from: 1, to: 3, direction: 'reverse' }),
      [3, 2, 1]
    )
    assert.deepEqual(
      tagFrames({ from: 1, to: 3, direction: 'pingpong' }),
      [1, 2, 3, 2]
    )
    assert.deepEqual(
      tagFrames({ from: 1, to: 3, direction: 'pingpong_reverse' }),
      [3, 2, 1, 2]
    )
  })

  it('picks the slice key in effect at a frame', () => {
    const slice = {
      keys: [
        { frame: 0, bounds: 'a' },
        { frame: 3, bounds: 'b' },
      ],
    }
    assert.equal(sliceKey(slice, 2).bounds, 'a')
    assert.equal(sliceKey(slice, 3).bounds, 'b')
  })

  it('throws on partial alpha', async () => {
    const dir = tempDir()
    try {
      await writePng(join(dir, 'soft.png'), [['#0b1420']], 128)
      writeFileSync(
        join(dir, 'soft.json'),
        JSON.stringify(sheetJson('soft', 1, 1))
      )
      const sheet = await loadSheet(join(dir, 'soft.json'))
      assert.throws(
        () => readRegion(sheet, 0, { x: 0, y: 0, w: 1, h: 1 }),
        /partial alpha 128/
      )
    } finally {
      rmSync(dir, { recursive: true })
    }
  })
})

describe('export-art', () => {
  it('opens split layers before the file and scales after it', () => {
    const { args } = sheetArgs(
      { name: 'wall', splitLayers: true },
      '/a/wall.aseprite',
      2
    )
    assert.ok(args.indexOf('--split-layers') < args.indexOf('/a/wall.aseprite'))
    assert.ok(args.indexOf('--scale') > args.indexOf('/a/wall.aseprite'))
    assert.ok(args.includes('wall@2x.png'))
    assert.deepEqual(args.slice(-2), ['--filename-format', '{layer}:{frame}'])
    for (const flag of [
      '--list-tags',
      '--list-slices',
      '--list-layers',
      '-b',
    ]) {
      assert.ok(args.includes(flag), flag)
    }
    assert.ok(!args.includes('--save-as'), 'never writes back to a source')
    assert.ok(!args.includes('--trim'), 'never trims')
  })

  it('drops the Aseprite build version and formats stably', () => {
    const out = normalizeSheetJson(
      '{"frames":[],"meta":{"version":"1.x-dev","image":"a.png"}}'
    )
    assert.equal(
      out,
      '{\n  "frames": [],\n  "meta": {\n    "image": "a.png"\n  }\n}\n'
    )
  })

  it('takes locations from flags first', () => {
    const paths = resolvePaths([
      '--art-dir',
      '/x/art',
      '--aseprite',
      '/x/aseprite',
    ])
    assert.equal(paths.roots.art, '/x/art')
    assert.equal(paths.aseprite, '/x/aseprite')
  })

  it('writes the committed fixtures exactly as the CLI does', async (t) => {
    const { aseprite } = resolvePaths([])
    if (!existsSync(aseprite)) {
      t.skip(`no Aseprite at ${aseprite} (it never runs in CI)`)
      return
    }
    const dir = tempDir()
    try {
      await makeFixtures({ aseprite, outDir: dir })
      for (const name of FIXTURE_NAMES) {
        assert.deepEqual(
          JSON.parse(readFileSync(join(dir, `${name}.json`), 'utf8')),
          JSON.parse(readFileSync(fixture(name), 'utf8')),
          `${name}.json`
        )
        const [a, b] = await Promise.all(
          [join(dir, `${name}.png`), join(FIXTURES, `${name}.png`)].map(
            async (file) => {
              const { data, info } = await sharp(file)
                .ensureAlpha()
                .raw()
                .toBuffer({ resolveWithObject: true })
              return { data, width: info.width, height: info.height }
            }
          )
        )
        assert.ok(samePixels(a, b), `${name}.png pixels`)
      }
    } finally {
      rmSync(dir, { recursive: true })
    }
  })
})

describe('png', () => {
  it('shrinks losslessly', async () => {
    const dir = tempDir()
    try {
      const file = join(dir, 'a.png')
      const rows = Array.from({ length: 16 }, (_, y) =>
        Array.from({ length: 16 }, (_, x) =>
          (x + y) % 3 ? PALETTE_HEX[(x * y) % 34] : null
        )
      )
      await writePng(file, rows)
      const before = await sharp(file)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true })
      const result = await optimizePng(file)
      const after = await sharp(file)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true })
      assert.ok(result.after <= result.before)
      assert.ok(
        samePixels(
          { data: before.data, width: 16, height: 16 },
          { data: after.data, width: 16, height: 16 }
        )
      )
    } finally {
      rmSync(dir, { recursive: true })
    }
  })
})

describe('check-art', () => {
  const sources = FIXTURE_NAMES.map((name) => ({ name, group: 'fx' }))
  const budgets = [{ label: 'fixtures', groups: ['fx'], bytes: 4096 }]

  async function fixtureDir() {
    const dir = tempDir()
    mkdirSync(join(dir, 'fx'))
    for (const name of FIXTURE_NAMES) {
      for (const ext of ['png', 'json']) {
        copyFileSync(
          join(FIXTURES, `${name}.${ext}`),
          join(dir, 'fx', `${name}.${ext}`)
        )
      }
    }
    return dir
  }

  const run = (dir, extra = {}) =>
    checkArt({
      dir,
      sources,
      pngBudgets: budgets,
      generatedBudgets: [],
      root: dir,
      ...extra,
    })

  it('passes the CLI fixtures', async () => {
    const dir = await fixtureDir()
    try {
      const result = await run(dir)
      assert.deepEqual(result.failures, [])
      assert.equal(result.files, 3)
    } finally {
      rmSync(dir, { recursive: true })
    }
  })

  it('fails an empty folder unless allowed', async () => {
    const dir = tempDir()
    try {
      assert.match((await run(dir)).failures[0], /nothing was checked/)
      assert.deepEqual((await run(dir, { allowEmpty: true })).failures, [])
    } finally {
      rmSync(dir, { recursive: true })
    }
  })

  it('fails off-palette colours, partial alpha and stray files', async () => {
    const dir = await fixtureDir()
    try {
      await writePng(join(dir, 'fx', 'sheet-fixture.png'), [
        [
          '#0b1420',
          '#123456',
          '#0b1420',
          '#0b1420',
          '#0b1420',
          '#0b1420',
          '#0b1420',
          '#0b1420',
        ],
        ...Array.from({ length: 7 }, () => Array(8).fill('#0b1420')),
      ])
      await writePng(
        join(dir, 'fx', 'chrome-fixture.png'),
        Array.from({ length: 8 }, () => Array(32).fill('#0b1420')),
        200
      )
      copyFileSync(
        join(FIXTURES, 'sheet-fixture.png'),
        join(dir, 'fx', 'stray.png')
      )
      writeFileSync(join(dir, 'fx', 'orphan.json'), '{}')
      const { failures } = await run(dir)
      const text = failures.join('\n')
      assert.match(
        text,
        /sheet-fixture\.png: off-palette colour #123456, first at 1,0/
      )
      assert.match(
        text,
        /chrome-fixture\.png: 256 pixel\(s\) with partial alpha/
      )
      assert.match(text, /stray\.png: not exported from any source/)
      assert.match(text, /orphan\.json: no PNG next to this JSON/)
    } finally {
      rmSync(dir, { recursive: true })
    }
  })

  it('holds a 1-bit atlas to one colour, of any value', async () => {
    const dir = await fixtureDir()
    try {
      const oneBit = sources.map((source) =>
        source.name === 'glyphs-fixture' ? { ...source, oneBit: true } : source
      )
      await writePng(join(dir, 'fx', 'glyphs-fixture.png'), [
        ['#ffffff', null, '#ffffff', ...Array(45).fill(null)],
        ...Array.from({ length: 15 }, () => Array(48).fill(null)),
      ])
      assert.deepEqual((await run(dir, { sources: oneBit })).failures, [])
      await writePng(join(dir, 'fx', 'glyphs-fixture.png'), [
        ['#ffffff', null, '#0b1420', ...Array(45).fill(null)],
        ...Array.from({ length: 15 }, () => Array(48).fill(null)),
      ])
      assert.match(
        (await run(dir, { sources: oneBit })).failures.join('\n'),
        /glyphs-fixture\.png: 1-bit art in 2 colours: #0b1420 first at 2,0/
      )
    } finally {
      rmSync(dir, { recursive: true })
    }
  })

  it('fails a JSON that disagrees with its PNG', () => {
    const data = sheetJson('x', 4, 4, {
      frameTags: [{ name: 'loop', from: 0, to: 2, direction: 'forward' }],
      slices: [
        {
          name: 'win',
          keys: [{ frame: 0, bounds: { x: 2, y: 2, w: 4, h: 4 } }],
        },
      ],
    })
    const problems = sheetProblems(data, 8, 4).join('\n')
    assert.match(problems, /meta.size 4x4 but the PNG is 8x4/)
    assert.match(problems, /tag "loop" spans 0..2 of 1 frames/)
    assert.match(problems, /slice "win" lies outside/)
  })

  it('fails a group over budget', async () => {
    const dir = await fixtureDir()
    try {
      const tight = [{ label: 'fixtures', groups: ['fx'], bytes: 100 }]
      const { failures } = await run(dir, { pngBudgets: tight })
      assert.match(
        failures.join('\n'),
        /budget "fixtures": \d+ bytes, limit 100/
      )
    } finally {
      rmSync(dir, { recursive: true })
    }
  })
})

describe('gen-sprites', () => {
  it('keeps uneven frame timing per tag', () => {
    const css = spriteCss(
      'sheet-fixture',
      readSheetJson(fixture('sheet-fixture'))
    )
    assert.match(
      css,
      /\.px-sheet-fixture \{\n {2}width: calc\(4 \* var\(--px\)\);/
    )
    // blink: frames 0, 1, 2 at 100, 250, 150 ms
    assert.match(
      css,
      /animation: px-sheet-fixture-blink 500ms step-end infinite;/
    )
    assert.match(
      css,
      / {2}20% \{ background-position: calc\(-4 \* var\(--px\)\) 0; \}/
    )
    assert.match(
      css,
      / {2}70% \{ background-position: 0 calc\(-4 \* var\(--px\)\); \}/
    )
    // pulse: pingpong over frames 2 and 3 at 150 and 300 ms
    assert.match(
      css,
      /animation: px-sheet-fixture-pulse 450ms step-end infinite;/
    )
    assert.match(
      css,
      / {2}33.3333% \{ background-position: calc\(-4 \* var\(--px\)\) calc\(-4 \* var\(--px\)\); \}/
    )
  })

  it('rests on the first frame of each tag', () => {
    const css = spriteCss(
      'sheet-fixture',
      readSheetJson(fixture('sheet-fixture'))
    )
    assert.match(
      css,
      /\.px-sheet-fixture-pulse \{\n {2}background-position: 0 calc\(-4 \* var\(--px\)\);/
    )
  })

  it('refuses trimmed sheets', () => {
    const data = readSheetJson(fixture('sheet-fixture'))
    data.frames[1].trimmed = true
    assert.throws(() => spriteCss('x', data), /trimmed/)
  })

  it('writes one stylesheet for several sheets', () => {
    const css = buildSpritesCss([fixture('sheet-fixture')])
    assert.match(
      css,
      /^\/\*\n \* GENERATED by scripts\/pixel\/gen-sprites\.mjs/
    )
    assert.equal((css.match(/@keyframes /g) ?? []).length, 2)
  })
})

describe('gen-glyphs', () => {
  it('turns slices into 1-bit paths, with tagged frames', async () => {
    const glyphs = readGlyphs(await loadSheet(fixture('glyphs-fixture')))
    assert.deepEqual(Object.keys(glyphs), ['check', 'close', 'spinner'])
    assert.equal(glyphs.close.frames.length, 1)
    assert.match(glyphs.close.frames[0], /^M0 0h1v1H0z/)
    assert.match(glyphs.close.frames[0], /M3 3h2v2H3z/) // the merged 2x2 crossing
    assert.equal(glyphs.spinner.frames.length, 4)
    assert.deepEqual(glyphs.spinner.ms, [100, 100, 100, 100])
    assert.equal(glyphs.spinner.frames[2], 'M7 5h1v2H7zM5 7h3v1H5z')
  })

  it('reads numbered slices as frames', async () => {
    const sheet = await loadSheet(fixture('glyphs-fixture'))
    sheet.data.meta.frameTags = []
    sheet.data.meta.slices = [
      {
        name: 'dot-1',
        keys: [{ frame: 0, bounds: { x: 8, y: 0, w: 8, h: 8 } }],
      },
      {
        name: 'dot-0',
        data: 'ms=250',
        keys: [{ frame: 0, bounds: { x: 0, y: 0, w: 8, h: 8 } }],
      },
    ]
    const glyphs = readGlyphs(sheet)
    assert.equal(glyphs.dot.frames.length, 2)
    assert.match(glyphs.dot.frames[0], /^M0 0h1v1H0z/) // close came first
    assert.deepEqual(glyphs.dot.ms, [250, 100])
  })

  it('refuses a glyph in two colours', async () => {
    const dir = tempDir()
    try {
      await writePng(join(dir, 'two.png'), [['#e8e4dc', '#f0c070']])
      writeFileSync(
        join(dir, 'two.json'),
        JSON.stringify(
          sheetJson('two', 2, 1, {
            slices: [
              {
                name: 'bad',
                keys: [{ frame: 0, bounds: { x: 0, y: 0, w: 2, h: 1 } }],
              },
            ],
          })
        )
      )
      await assert.rejects(
        async () => readGlyphs(await loadSheet(join(dir, 'two.json'))),
        /1-bit/
      )
    } finally {
      rmSync(dir, { recursive: true })
    }
  })

  it('writes a typed currentColor component', async () => {
    const source = glyphModuleSource(
      readGlyphs(await loadSheet(fixture('glyphs-fixture')))
    )
    assert.match(source, /fill="currentColor"/)
    assert.match(source, /shapeRendering="crispEdges"/)
    assert.match(source, /calc\(\$\{glyph\.w\} \* var\(--px\)\)/)
    assert.match(
      source,
      /export type PixelIconName = keyof typeof PIXEL_GLYPHS/
    )
  })
})

describe('gen-chrome', () => {
  // The fixture's bodies; everything else in it is chrome and stays night.
  const BODIES = { paper: ['window', 'shadow-tile'] }
  const css = async (options = BODIES) =>
    chromeCss(await loadSheet(fixture('chrome-fixture')), undefined, options)

  it('turns 9-slices into border-images with the drawn insets', async () => {
    const out = await css()
    assert.deepEqual(
      sliceInsets({
        bounds: { w: 5, h: 4 },
        center: { x: 1, y: 1, w: 3, h: 2 },
      }),
      [1, 1, 1, 1]
    )
    assert.match(out, /\.px-window \{\n {2}border-style: solid;/)
    assert.match(out, /border-image-slice: 2 2 2 2 fill;/)
    assert.match(out, /border-image-repeat: round;/) // the button's slice data
    assert.match(out, /shape-rendering='crispEdges'/)
    // Stretch and a width of one border are the defaults; not written.
    assert.ok(!out.includes('border-image-width'))
    assert.ok(!out.includes('border-image-repeat: stretch'))
  })

  it('backs a one-colour centre with its colour, inside the border', async () => {
    const window = (await css()).split('.px-window {')[1].split('}')[0]
    assert.match(window, /background-color: #13253a;/)
    assert.match(window, /background-clip: padding-box;/)
  })

  it('recolours bodies for paper, outside night subtrees only', async () => {
    const out = await css()
    const paper = out
      .split(':root:not(.dark) .px-window:not(.os-night, .os-night *)')[1]
      .split('}')[0]
    assert.match(paper, /%23e8e4dc/) // the #13253a body became paper
    assert.match(paper, /%232e6e6e/) // the #4fa3a0 rim became the paper frame
    assert.match(paper, /%230b1420/) // the outline stays navy
    assert.match(paper, /background-color: #e8e4dc;/)
    assert.ok(
      !out.includes(':root:not(.dark) .px-skeleton-tile'),
      'a slice marked night has no paper copy'
    )
    assert.ok(
      !out.includes(':root:not(.dark) .px-button'),
      'chrome that is not a body stays night'
    )
    assert.ok(out.includes(':root:not(.dark) .px-shadow-tile'))
  })

  it('steps a tile through its frames', async () => {
    const out = await css()
    assert.match(out, /animation: px-skeleton-tile 400ms step-end infinite;/)
    assert.match(out, /@keyframes px-skeleton-tile \{\n {2}0% /)
    assert.match(out, /\n {2}50% \{ background-image/)
    assert.ok(
      !/animation: px-shadow-tile/.test(out),
      'a still tile does not animate'
    )
    assert.match(out, /--px-shadow-tile: url\(/)
    assert.match(out, /background-image: var\(--px-shadow-tile\);/)
  })

  it('makes one control of rest, hover and pressed slices', async () => {
    const sheet = await loadSheet(fixture('chrome-fixture'))
    const button = sheet.data.meta.slices.find((s) => s.name === 'button')
    const key = button.keys[0]
    // The pressed state draws its top bevel a row lower.
    const pressed = { ...key, center: { ...key.center, y: 2, h: 1 } }
    sheet.data.meta.slices = [
      { name: 'button-plain-rest', keys: [key] },
      { name: 'button-plain-hover', keys: [key] },
      { name: 'button-plain-pressed', keys: [pressed] },
      { name: 'button-disabled', keys: [key] },
    ]
    const out = chromeCss(sheet, undefined, { paper: [] })
    assert.ok(!out.includes('.px-button-plain-rest'), 'no class per state')
    assert.match(out, /\.px-button-plain \{\n {2}border-style: solid;/)
    assert.match(
      out,
      /@media \(hover: hover\) \{\n {2}\.px-button-plain:hover:not\(:disabled, \[aria-disabled='true'\]\) \{/
    )
    const down = out
      .split(
        ":is(.px-button-plain:active, .px-button-plain[aria-pressed='true'])"
      )[1]
      .split('}')[0]
    assert.match(down, /border-image-slice: 2 1 1 1 fill;/) // moved down a row
    assert.match(
      out,
      /\.px-button-plain:is\(:disabled, \[aria-disabled='true'\]\) \{/
    )
  })

  it('adds recoloured variants and grown slices', async () => {
    const out = await css({
      paper: ['window'],
      variants: [
        {
          name: 'window-warm',
          from: 'window',
          recolour: { '#13253a': '#4a2b25' },
        },
      ],
      grow: [{ slice: 'window', height: 9, media: '(pointer: coarse)' }],
    })
    const warm = out.split('.px-window-warm {')[1].split('}')[0]
    assert.match(warm, /background-color: #4a2b25;/)
    assert.ok(
      !out.includes(':root:not(.dark) .px-window-warm'),
      'a variant of a body is not a body'
    )
    const coarse = out.split('@media (pointer: coarse) {')[1].split('\n}')[0]
    assert.match(
      coarse,
      /\.px-window \{\n {4}border-image-source: url\("data:image\/svg\+xml,<svg [^"]*height='9'/
    )
    assert.match(coarse, /:root:not\(\.dark\) \.px-window:not/)
  })

  it('grows a slice by repeating its first and last centre rows', () => {
    const grid = [['t'], ['a'], ['m'], ['z'], ['b']]
    const grown = growGrid(grid, { x: 0, y: 1, w: 1, h: 3 }, 8)
    // Three rows more: one above (the floor of half) and two below.
    assert.equal(grown.grid.map((row) => row[0]).join(''), 'taamzzzb')
    assert.deepEqual(grown.center, { x: 0, y: 1, w: 1, h: 6 })
  })

  it('refuses a 9-slice that changes across frames', async () => {
    const sheet = await loadSheet(fixture('chrome-fixture'))
    sheet.data.meta.slices = [
      {
        name: 'blinky',
        keys: [
          {
            frame: 0,
            bounds: { x: 14, y: 0, w: 2, h: 2 },
            center: { x: 0, y: 0, w: 1, h: 1 },
          },
        ],
      },
    ]
    assert.throws(() => chromeCss(sheet), /changes across frames/)
  })
})

describe('gen-cursors', () => {
  it('draws each cursor at the art scale, with its hotspot and keyword', async () => {
    const sheet = await loadSheet(fixture('chrome-fixture'))
    sheet.data.meta.slices = [
      {
        name: 'grab',
        keys: [
          {
            frame: 0,
            bounds: { x: 0, y: 0, w: 6, h: 6 },
            pivot: { x: 3, y: 2 },
          },
        ],
      },
      {
        name: 'grabbing',
        keys: [
          {
            frame: 0,
            bounds: { x: 0, y: 0, w: 6, h: 6 },
            pivot: { x: 3, y: 3 },
          },
        ],
      },
    ]
    const out = await cursorsCss(sheet)
    const grab = out.split('.px-cursor-grab {')[1].split('}')[0]
    // 1x first, as a fallback, then the image sets; the hotspot is in the
    // CSS px of the 1x image (the art at 2x).
    assert.match(
      grab,
      /cursor: url\("data:image\/png;base64,[^"]+"\) 6 4, grab;/
    )
    assert.match(grab, /cursor: -webkit-image-set\(.+ 1x, .+ 2x\) 6 4, grab;/)
    assert.match(grab, /cursor: image-set\(.+ 1x, .+ 2x\) 6 4, grab;/)
    assert.match(
      out,
      /\.px-cursor-grab:active \{\n {2}cursor: url\([^)]+\) 6 6, grabbing;/
    )
    const png = Buffer.from(/base64,([^"]+)"/.exec(grab)[1], 'base64')
    const { width, height } = await sharp(png).metadata()
    assert.deepEqual([width, height], [12, 12])
  })
})
