/** `one` for a count of exactly 1, `many` otherwise. */
export function pluralWord(count: number, one: string, many: string) {
  return count === 1 ? one : many
}

/** The count, formatted for the reader's locale, followed by its noun. */
export function plural(count: number, one: string, many: string) {
  return `${count.toLocaleString()} ${pluralWord(count, one, many)}`
}
