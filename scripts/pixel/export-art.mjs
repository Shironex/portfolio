/**
 * Exports the OS pixel art from its Aseprite sources into
 * `src/assets/pixel/<group>/` (sheet PNG plus json-array data with tags,
 * slices and layers), then shrinks each PNG losslessly. The outputs are
 * committed: Aseprite runs on the owner's machine, never in CI.
 *
 *   pnpm art:export                     export every source that exists
 *   pnpm art:export --only readme-icons one source, by name or by group
 *   pnpm art:export --list              show the manifest and what is found
 *   pnpm art:export --dry-run           print the Aseprite commands only
 *   pnpm art:export --strict            fail when a source is missing
 *
 * Locations (flags win over the environment, which wins over the defaults):
 *   --aseprite <bin>   ASEPRITE          ../aseprite/build/bin/aseprite, else `aseprite` on PATH
 *   --art-dir <dir>    PIXEL_ART_DIR     ../aseprite-demo/portfolio-os/art
 *   --readme-dir <dir> PIXEL_README_DIR  ../aseprite-demo/readme
 *   --pet-dir <dir>    PIXEL_PET_DIR     ../aseprite-demo/pet
 *   --out-dir <dir>                      src/assets/pixel
 * The defaults are siblings of this repo, the layout on both the Mac and the
 * Windows PC.
 *
 * Sources are only read: Aseprite runs in batch mode (`-b`) with no
 * `--save-as`, so a document open in the editor is never touched. A source
 * that does not exist yet is skipped and reported, because the art is drawn
 * while the code lands.
 */
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { ART_SOURCES } from './art-manifest.mjs'
import { isMain } from './cli.mjs'
import { optimizePng } from './png.mjs'

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
const SIBLINGS = resolve(ROOT, '..')

/** Read a flag value, then an environment variable, then a default. */
function setting(argv, flag, envName, fallback) {
  const i = argv.indexOf(flag)
  if (i > -1 && argv[i + 1]) return resolve(argv[i + 1])
  // eslint-disable-next-line n/no-process-env -- a local tool's own config, not app env
  const fromEnv = envName ? process.env[envName] : undefined
  return fromEnv ? resolve(fromEnv) : fallback
}

/** Where everything is, from flags, environment and defaults. */
export function resolvePaths(argv = []) {
  const exe = process.platform === 'win32' ? 'aseprite.exe' : 'aseprite'
  const sibling = join(SIBLINGS, 'aseprite', 'build', 'bin', exe)
  return {
    aseprite: setting(
      argv,
      '--aseprite',
      'ASEPRITE',
      existsSync(sibling) ? sibling : exe
    ),
    roots: {
      art: setting(
        argv,
        '--art-dir',
        'PIXEL_ART_DIR',
        join(SIBLINGS, 'aseprite-demo', 'portfolio-os', 'art')
      ),
      readme: setting(
        argv,
        '--readme-dir',
        'PIXEL_README_DIR',
        join(SIBLINGS, 'aseprite-demo', 'readme')
      ),
      pet: setting(
        argv,
        '--pet-dir',
        'PIXEL_PET_DIR',
        join(SIBLINGS, 'aseprite-demo', 'pet')
      ),
    },
    outDir: setting(
      argv,
      '--out-dir',
      undefined,
      join(ROOT, 'src', 'assets', 'pixel')
    ),
  }
}

/** Absolute source path of a manifest entry. */
export function sourcePath(entry, roots) {
  const root = roots[entry.root]
  if (!root) throw new Error(`${entry.name}: unknown root "${entry.root}"`)
  return join(root, entry.file ?? `${entry.name}.aseprite`)
}

/**
 * Aseprite arguments for one sheet. Run with `cwd` set to the output folder:
 * the names are relative so `meta.image` in the JSON is a bare file name.
 * Options that change how the file is opened (`--split-layers`) come before
 * it; `--scale` resizes what was opened, so it comes after.
 */
export function sheetArgs(entry, source, scale = 1) {
  const base = scale === 1 ? entry.name : `${entry.name}@${scale}x`
  const args = ['-b']
  if (entry.splitLayers) args.push('--split-layers')
  args.push(source)
  if (scale !== 1) args.push('--scale', String(scale))
  args.push(
    '--sheet',
    `${base}.png`,
    '--data',
    `${base}.json`,
    '--format',
    'json-array',
    '--sheet-type',
    'packed',
    '--list-tags',
    '--list-slices',
    '--list-layers'
  )
  if (entry.splitLayers) args.push('--filename-format', '{layer}:{frame}')
  return { args, png: `${base}.png`, json: `${base}.json` }
}

/**
 * The JSON as committed: Aseprite's data, minus the build version (a dev
 * build changes it on every rebuild, which would rewrite every file), with
 * stable two-space formatting.
 */
export function normalizeSheetJson(text) {
  const data = JSON.parse(text)
  if (data.meta) delete data.meta.version
  return `${JSON.stringify(data, null, 2)}\n`
}

/** Run Aseprite for one entry at every scale. Returns the files written. */
export async function exportEntry(entry, paths, { dryRun = false } = {}) {
  const source = sourcePath(entry, paths.roots)
  const outDir = join(paths.outDir, entry.group)
  const written = []
  for (const scale of [1, ...(entry.scales ?? [])]) {
    const { args, png, json } = sheetArgs(entry, source, scale)
    if (dryRun) {
      console.log(`(cd ${outDir} && ${paths.aseprite} ${args.join(' ')})`)
      continue
    }
    mkdirSync(outDir, { recursive: true })
    const run = spawnSync(paths.aseprite, args, {
      cwd: outDir,
      encoding: 'utf8',
      timeout: 120_000,
    })
    if (run.error) {
      throw new Error(
        `${entry.name}: cannot run ${paths.aseprite}: ${run.error.message}`
      )
    }
    if (run.status !== 0) {
      throw new Error(
        `${entry.name}: aseprite exited ${run.status}\n${run.stderr || run.stdout}`
      )
    }
    const jsonFile = join(outDir, json)
    const pngFile = join(outDir, png)
    if (!existsSync(jsonFile) || !existsSync(pngFile)) {
      throw new Error(
        `${entry.name}: aseprite wrote no ${png} / ${json} in ${outDir}`
      )
    }
    writeFileSync(jsonFile, normalizeSheetJson(readFileSync(jsonFile, 'utf8')))
    const size = await optimizePng(pngFile)
    written.push({ png: pngFile, json: jsonFile, ...size })
  }
  return written
}

function pick(argv) {
  const i = argv.indexOf('--only')
  if (i === -1) return ART_SOURCES
  const want = argv[i + 1]
  const hits = ART_SOURCES.filter((e) => e.name === want || e.group === want)
  if (hits.length === 0) {
    throw new Error(
      `--only ${want}: no source or group of that name ` +
        `(${ART_SOURCES.map((e) => e.name).join(', ')})`
    )
  }
  return hits
}

async function main(argv) {
  const paths = resolvePaths(argv)
  const entries = pick(argv)
  const strict = argv.includes('--strict')
  const dryRun = argv.includes('--dry-run')

  if (argv.includes('--list')) {
    for (const entry of entries) {
      const source = sourcePath(entry, paths.roots)
      const state = existsSync(source) ? 'found  ' : 'missing'
      console.log(`${state} ${entry.group}/${entry.name}  <- ${source}`)
    }
    return
  }

  const missing = []
  let count = 0
  for (const entry of entries) {
    const source = sourcePath(entry, paths.roots)
    if (!existsSync(source)) {
      missing.push(`${entry.name} (${source})`)
      continue
    }
    for (const file of await exportEntry(entry, paths, { dryRun })) {
      count++
      const rel = file.png.slice(ROOT.length + 1)
      console.log(
        `exported ${rel}: ${file.before} -> ${file.after} bytes (${file.encoding})`
      )
    }
  }
  if (missing.length) {
    const say = strict ? console.error : console.log
    say(`not drawn yet, skipped:\n  ${missing.join('\n  ')}`)
    if (strict) process.exit(1)
  }
  if (!dryRun) console.log(`${count} sheet(s) exported`)
}

if (isMain(import.meta.url)) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error.message)
    process.exit(1)
  })
}
