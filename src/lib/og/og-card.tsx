import { ImageResponse } from 'next/og'
import type { CSSProperties, ReactElement, ReactNode } from 'react'

import { readFile, readdir } from 'node:fs/promises'
import { basename, join } from 'node:path'

import type { AccentRole } from '@/components/os/accent-map'

import type { ProjectStatus } from '@/types'

import { type FontMetrics, readFontMetrics, textWidth } from './font-metrics'

/*
 * The pixel Open Graph cards (SPEC 1.1, `aseprite-demo/og/OG.md`). Each card
 * is drawn at 400x210 art px and shown at 3x: the scene (sky, skyline, a
 * focused window, the ride) is a baked base PNG, and the text and icon go
 * into its slots at the image px OG.md gives. The base, the icons and the
 * fonts are files under `src/app/_og` and `src/app/_fonts` (`pnpm
 * generate:og`): the renderer cannot read woff2, and fetching at build time
 * would make builds need the network.
 *
 * Sizes are exact multiples of the faces' design pixel (Shiro Pixel Sans at
 * 27 and 54 px, Departure Mono at 33) and positions multiples of 3, so the
 * stems land on the 3 px grid. Every line is laid out here, measured with the
 * fonts' own advances, so the renderer never wraps or clips on its own.
 */

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

/** The README palette the cards use (`src/styles/tokens.css`, night). */
const COLOR = {
  teal: '#8fe0cf',
  lamp: '#f0c070',
  ink: '#e8e4dc',
  meta: '#9aa4a8',
  /** The window body under every slot. */
  body: '#13253a',
  ground: '#0b1420',
} as const

/** A chip's text on its fill (OG.md; archived as the site's archived chip). */
const CHIP = {
  type: { color: '#d8fff2', background: '#1f5058' },
  'in-progress': { color: '#2a1a1c', background: COLOR.lamp },
  shipped: { color: COLOR.ground, background: '#4fa3a0' },
  archived: { color: COLOR.meta, background: COLOR.ground },
} as const satisfies Record<
  'type' | ProjectStatus,
  { color: string; background: string }
>

/**
 * The letter on a bare tile, in the night ink of the project's accent
 * (`--accent-<role>-ink` in tokens.css): the tile is night in both Lamp modes.
 */
const LETTER_INK: Record<AccentRole, string> = {
  primary: COLOR.teal,
  deep: COLOR.teal,
  bright: COLOR.teal,
  warm: COLOR.lamp,
  'warm-2': COLOR.lamp,
  neutral: COLOR.ink,
}

const SANS = 'Shiro Pixel Sans'
const MONO = 'Departure Mono'

/** The faces at the sizes the cards use, with their line boxes (no leading). */
const FACE = {
  title: { family: MONO, weight: 400, size: 33, line: 42 },
  heading: { family: SANS, weight: 700, size: 54, line: 66 },
  body: { family: SANS, weight: 400, size: 27, line: 33 },
} as const

type Face = (typeof FACE)[keyof typeof FACE]

const ROOT = process.cwd()
const fontDir = join(ROOT, 'src/app/_fonts')
const ogDir = join(ROOT, 'src/app/_og')

const [sansData, boldData, monoData] = await Promise.all(
  [
    'shiro-pixel-sans-regular.ttf',
    'shiro-pixel-sans-bold.ttf',
    'departure-mono-regular.ttf',
  ].map((file) => readFile(join(fontDir, file)))
)

const METRICS = new Map<Face, FontMetrics>([
  [FACE.title, readFontMetrics(monoData)],
  [FACE.heading, readFontMetrics(boldData)],
  [FACE.body, readFontMetrics(sansData)],
])

const dataUri = (bytes: Buffer) =>
  `data:image/png;base64,${bytes.toString('base64')}`

const [homeBase, projectBase] = await Promise.all(
  ['home-base.png', 'project-base.png'].map(async (file) =>
    dataUri(await readFile(join(ogDir, file)))
  )
)

/** Every icon still, 96x96, by slug (plus `tile` and `shironedev`). */
const ICONS = new Map(
  await Promise.all(
    (await readdir(join(ogDir, 'icons')))
      .filter((file) => file.endsWith('.png'))
      .map(
        async (file) =>
          [
            basename(file, '.png'),
            dataUri(await readFile(join(ogDir, 'icons', file))),
          ] as const
      )
  )
)

/** Width of `text` in `face`, to the end of its ink. */
function inkWidth(face: Face, text: string): number {
  const metrics = METRICS.get(face)!
  const advance = textWidth(metrics, text, face.size)
  // Shiro Pixel Sans leaves one design pixel (a ninth of the em) after each
  // glyph; Departure Mono's cells are its full advance.
  return face.family === SANS ? advance - face.size / 9 : advance
}

const fits = (face: Face, text: string, width: number) =>
  inkWidth(face, text) <= width

/** Greedy word wrap at spaces. */
function wrap(face: Face, text: string, width: number): string[] {
  const lines: string[] = []
  let line = ''
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word
    if (line && !fits(face, next, width)) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines
}

/** `text` cut short with an ellipsis so it fits `width`. */
function ellipsize(face: Face, text: string, width: number): string {
  if (fits(face, text, width)) return text
  let cut = text
  while (cut && !fits(face, `${cut}…`, width)) cut = cut.slice(0, -1)
  return `${cut.trimEnd()}…`
}

/** Image px of the slots (OG.md, art px times 3). */
const SLOT = {
  title: { left: 81, top: 78, width: 687 },
  icon: { left: 81, top: 153, size: 96 },
  heading: { left: 204, top: 141, width: 639 },
  /** The second line of a long title, 20 art px under the first. */
  headingLine2: 201,
  /** The role under the name, and the chips under a project title. */
  under: { left: 204, top: 222 },
  meta: { left: 81, top: 303, width: 762 },
  summary: { left: 81, top: 291, width: 762 },
  /** The chips of a long title, under the rule. */
  chipsLow: { left: 81, top: 294 },
} as const

/**
 * The lines of a project title: one, or two when it is wider than its slot
 * (OG.md's fallback, which the owner chose), broken at a space or after a
 * slash, the first line as long as it can be.
 */
export function titleLines(title: string): string[] {
  const { width } = SLOT.heading
  if (fits(FACE.heading, title, width)) return [title]
  let best: string[] | null = null
  for (let i = 1; i < title.length; i++) {
    const space = title[i] === ' '
    const slash = title[i - 1] === '/'
    if (!space && !slash) continue
    const first = title.slice(0, i).trimEnd()
    const second = title.slice(space ? i + 1 : i)
    if (!fits(FACE.heading, first, width)) break
    best = [first, second]
  }
  return best ?? [title]
}

/**
 * The summary in at most two lines (OG.md): as it wraps when it fits; else
 * cut at its first colon or semicolon and closed with a period; else its
 * first two lines, the second ending in an ellipsis.
 */
export function summaryLines(summary: string): string[] {
  const { width } = SLOT.summary
  const lines = wrap(FACE.body, summary, width)
  if (lines.length <= 2) return lines
  const stop = summary.search(/[:;]/)
  if (stop > 0) {
    const short = wrap(FACE.body, `${summary.slice(0, stop).trimEnd()}.`, width)
    if (short.length <= 2) return short
  }
  let second = lines[1]!
  while (second.includes(' ') && !fits(FACE.body, `${second}...`, width)) {
    second = second.slice(0, second.lastIndexOf(' '))
  }
  return [lines[0]!, `${second.replace(/[\s,.:;]+$/, '')}...`]
}

function faceStyle(face: Face, color: string): CSSProperties {
  return {
    fontFamily: face.family,
    fontWeight: face.weight,
    fontSize: face.size,
    lineHeight: `${face.line}px`,
    color,
    whiteSpace: 'pre',
  }
}

/** One line of text with its line box's top left at (left, top). */
function Line({
  left,
  top,
  face,
  color,
  children,
}: {
  left: number
  top: number
  face: Face
  color: string
  children: ReactNode
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        display: 'flex',
        ...faceStyle(face, color),
      }}
    >
      {children}
    </div>
  )
}

/** The title bar's prompt: `<path> ❯ <command>`, cut to its slot. */
function Prompt({ path, command }: { path: string; command: string }) {
  const lead = `${path} ❯ `
  const rest = ellipsize(
    FACE.title,
    command,
    SLOT.title.width - inkWidth(FACE.title, lead)
  )
  return (
    <Line {...SLOT.title} face={FACE.title} color={COLOR.ink}>
      <span style={{ color: COLOR.teal }}>{path}</span>
      <span style={{ color: COLOR.lamp }}> ❯ </span>
      <span>{rest}</span>
    </Line>
  )
}

/** A 32x32 icon at 3x in the icon slot, with a letter on the bare tile. */
function Icon({
  src,
  letter,
}: {
  src: string
  letter?: { text: string; color: string }
}) {
  const { left, top, size } = SLOT.icon
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        display: 'flex',
        width: size,
        height: size,
      }}
    >
      <img src={src} width={size} height={size} alt="" />
      {letter && (
        // Inside the tile's rim, as the site's tile draws it.
        <div
          style={{
            position: 'absolute',
            left: 9,
            top: 9,
            width: size - 18,
            height: size - 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...faceStyle(FACE.title, letter.color),
          }}
        >
          {letter.text}
        </div>
      )}
    </div>
  )
}

/** A chip: 12 art px tall, 3 of padding, its four corner pixels cut. */
function Chip({ label, tone }: { label: string; tone: keyof typeof CHIP }) {
  const corner = (side: CSSProperties): ReactElement => (
    <div
      style={{
        position: 'absolute',
        width: 3,
        height: 3,
        background: COLOR.body,
        ...side,
      }}
    />
  )
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        height: 36,
        padding: '0 9px',
        background: CHIP[tone].background,
        ...faceStyle(FACE.body, CHIP[tone].color),
      }}
    >
      {label}
      {corner({ left: 0, top: 0 })}
      {corner({ right: 0, top: 0 })}
      {corner({ left: 0, bottom: 0 })}
      {corner({ right: 0, bottom: 0 })}
    </div>
  )
}

function Chips({
  left,
  top,
  chips,
}: {
  left: number
  top: number
  chips: { label: string; tone: keyof typeof CHIP }[]
}) {
  return (
    <div style={{ position: 'absolute', left, top, display: 'flex', gap: 12 }}>
      {chips.map((chip) => (
        <Chip key={chip.label} {...chip} />
      ))}
    </div>
  )
}

/** The base full bleed, the slots over it. */
function Card({ base, children }: { base: string; children: ReactNode }) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        width: OG_SIZE.width,
        height: OG_SIZE.height,
        background: COLOR.ground,
      }}
    >
      <img src={base} {...OG_SIZE} alt="" />
      {children}
    </div>
  )
}

function render(card: ReactElement): ImageResponse {
  return new ImageResponse(card, {
    ...OG_SIZE,
    fonts: [
      { name: SANS, data: sansData, weight: 400, style: 'normal' },
      { name: SANS, data: boldData, weight: 700, style: 'normal' },
      { name: MONO, data: monoData, weight: 400, style: 'normal' },
    ],
  })
}

/** The home card: `whoami`, the logo tile, name, role and where I work. */
export function homeCard({
  name,
  role,
  meta,
}: {
  name: string
  role: string
  meta: string
}): ImageResponse {
  return render(
    <Card base={homeBase}>
      <Prompt path="~/kacper" command="whoami" />
      <Icon src={ICONS.get('shironedev')!} />
      <Line {...SLOT.heading} face={FACE.heading} color={COLOR.ink}>
        {ellipsize(FACE.heading, name, SLOT.heading.width)}
      </Line>
      <Line {...SLOT.under} face={FACE.body} color={COLOR.lamp}>
        {ellipsize(FACE.body, role, SLOT.heading.width)}
      </Line>
      <Line {...SLOT.meta} face={FACE.body} color={COLOR.meta}>
        {ellipsize(FACE.body, meta, SLOT.meta.width)}
      </Line>
    </Card>
  )
}

export interface ProjectCardData {
  slug: string
  title: string
  /** The project's accent: the letter on a bare tile takes its ink. */
  accent: AccentRole
  type: string
  status: ProjectStatus
  statusLabel: string
  summary: string
}

/**
 * A project's card: its slug in the prompt, its icon (or its first letter on
 * the bare tile), title, type and status chips and the summary's lead. A
 * title too long for one line takes two, with the chips under the rule and
 * no summary.
 */
export function projectCard(project: ProjectCardData): ImageResponse {
  const icon = ICONS.get(project.slug)
  const title = titleLines(project.title)
  const chips = [
    { label: project.type, tone: 'type' as const },
    { label: project.statusLabel, tone: project.status },
  ]
  const long = title.length > 1
  return render(
    <Card base={projectBase}>
      <Prompt path="~/projects" command={project.slug} />
      {icon ? (
        <Icon src={icon} />
      ) : (
        <Icon
          src={ICONS.get('tile')!}
          letter={{
            text: project.title.slice(0, 1).toUpperCase(),
            color: LETTER_INK[project.accent],
          }}
        />
      )}
      {title.map((line, i) => (
        <Line
          key={line}
          left={SLOT.heading.left}
          top={i === 0 ? SLOT.heading.top : SLOT.headingLine2}
          face={FACE.heading}
          color={COLOR.ink}
        >
          {line}
        </Line>
      ))}
      <Chips {...(long ? SLOT.chipsLow : SLOT.under)} chips={chips} />
      {!long &&
        summaryLines(project.summary).map((line, i) => (
          <Line
            key={line}
            left={SLOT.summary.left}
            top={SLOT.summary.top + i * FACE.body.line}
            face={FACE.body}
            color={COLOR.meta}
          >
            {line}
          </Line>
        ))}
    </Card>
  )
}
