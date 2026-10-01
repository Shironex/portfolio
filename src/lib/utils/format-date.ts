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

/** `Sep 23, 2026`, the same for every visitor. */
export const SHORT_DATE = {
  locale: 'en-US',
  format: { month: 'short', day: 'numeric', year: 'numeric' },
} as const satisfies FormatDateOptions

/**
 * Parse and format a date string. Returns `null` for empty input. Unparseable
 * input yields `null`, or the raw string when `fallbackToRaw` is set.
 *
 * Month-and-year strings ("May 2026") go through {@link parseMonthYear}
 * instead.
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

/** Lowercase English month names, January first. */
const MONTH_NAMES = Array.from({ length: 12 }, (_, month) =>
  new Date(Date.UTC(2000, month, 1))
    .toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' })
    .toLowerCase()
)

export interface MonthYear {
  /** Short display form: `Nov 2024`. */
  label: string
  /** `2026-05`: the month, with no day made up. */
  iso: string
}

/**
 * Parse a "Month YYYY" string such as `May 2026`. Returns `null` for empty or
 * free-text input. Matched against the month names instead of handed to
 * `Date`, so the result does not depend on the runtime or its time zone.
 */
export function parseMonthYear(raw: string | undefined): MonthYear | null {
  const match = /^([A-Za-z]+) (\d{4})$/.exec(raw ?? '')
  if (!match) return null
  const month = MONTH_NAMES.indexOf(match[1].toLowerCase())
  if (month === -1) return null
  const year = Number(match[2])
  return {
    label: new Date(Date.UTC(year, month, 1)).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    }),
    iso: `${match[2]}-${String(month + 1).padStart(2, '0')}`,
  }
}
