/** Small helpers shared by the pixel scripts' command lines. */
import { realpathSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

/**
 * True when the module at `url` is the script node was started with, so a
 * script can also be imported (by tests, or by another script) without
 * running its `main`. Paths are compared after resolving symlinks.
 */
export function isMain(url) {
  if (!process.argv[1]) return false
  try {
    return realpathSync(process.argv[1]) === realpathSync(fileURLToPath(url))
  } catch {
    return false
  }
}

/** Value of `--flag value`, or `fallback`. */
export function flag(argv, name, fallback) {
  const i = argv.indexOf(name)
  return i > -1 && argv[i + 1] !== undefined ? argv[i + 1] : fallback
}

/**
 * `code` formatted with the repo's Prettier config for `filepath`, so a
 * generated TS module is what `pnpm format` would leave and a `--check`
 * comparison is stable.
 */
export async function formatSource(code, filepath) {
  const prettier = await import('prettier')
  const config = (await prettier.resolveConfig(filepath)) ?? {}
  return prettier.format(code, { ...config, filepath })
}
