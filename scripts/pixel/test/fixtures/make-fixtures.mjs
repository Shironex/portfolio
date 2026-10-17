/**
 * Rebuilds the committed test fixtures with the real Aseprite CLI: the Lua
 * script draws three tiny documents into a temp folder, and `exportEntry`
 * (the code path `pnpm art:export` uses) exports each one here, so the PNG
 * and JSON files are exactly what the CLI writes.
 *
 *   node scripts/pixel/test/fixtures/make-fixtures.mjs [--aseprite <bin>] [--out <dir>]
 */
import { spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { flag, isMain } from '../../cli.mjs'
import { exportEntry, resolvePaths } from '../../export-art.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))

export const FIXTURE_NAMES = ['chrome-fixture', 'glyphs-fixture', 'sheet-fixture']

/** Draw the fixture documents and export them into `outDir`. */
export async function makeFixtures({ aseprite, outDir }) {
  const work = mkdtempSync(join(tmpdir(), 'pixel-fixtures-'))
  try {
    const run = spawnSync(
      aseprite,
      ['-b', '--script-param', `dir=${work}`, '--script', join(HERE, 'make-fixtures.lua')],
      { encoding: 'utf8', timeout: 60_000 }
    )
    if (run.error || run.status !== 0) {
      throw new Error(`make-fixtures.lua failed: ${run.error?.message ?? run.stderr}`)
    }
    const written = []
    for (const name of FIXTURE_NAMES) {
      const entry = { name, root: 'work', group: '.' }
      const paths = { aseprite, roots: { work }, outDir }
      written.push(...(await exportEntry(entry, paths)))
    }
    return written
  } finally {
    rmSync(work, { recursive: true, force: true })
  }
}

if (isMain(import.meta.url)) {
  const argv = process.argv.slice(2)
  const { aseprite } = resolvePaths(argv)
  const outDir = resolve(flag(argv, '--out', HERE))
  makeFixtures({ aseprite, outDir })
    .then((files) => {
      for (const f of files) console.log(`wrote ${f.png} and ${f.json}`)
    })
    .catch((error) => {
      console.error(error.message)
      process.exit(1)
    })
}
