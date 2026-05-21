interface FormatDateOptions {
  /** `Intl` formatting options (month/year, weekday/day, etc.). */
  format: Intl.DateTimeFormatOptions
  /** Locale tag, or `undefined` for the runtime default. */
  locale?: string
  /**
   * Anchor a bare `YYYY-MM-DD` to local midnight before parsing, avoiding the
   * UTC-midnight-then-local-shift that can roll the date back a day.
   */
  anchorToMidnight?: boolean
  /**
   * When the input fails to parse as a date, return the raw string instead of
   * `null` (e.g. free-text values like "Ongoing").
   */
  fallbackToRaw?: boolean
}

/**
 * Parse and format a date string. Returns `null` for empty input. Unparseable
 * input yields `null`, or the raw string when `fallbackToRaw` is set.
 *
 * Consolidates the two former local `formatDate` helpers (project-detail's
 * month/year with raw fallback, and the activity strip's weekday/day anchored
 * to local midnight).
 */
export function formatDate(
  raw: string | undefined,
  {
    format,
    locale,
    anchorToMidnight = false,
    fallbackToRaw = false,
  }: FormatDateOptions
): string | null {
  if (!raw) return null
  const parsed = new Date(anchorToMidnight ? `${raw}T00:00:00` : raw)
  if (Number.isNaN(parsed.getTime())) return fallbackToRaw ? raw : null
  return parsed.toLocaleDateString(locale, format)
}
