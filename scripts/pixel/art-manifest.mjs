/**
 * Every Aseprite source the OS ships, where it comes from and where its
 * export lands (SPEC sections 5.1 and 5.2), plus the byte budgets of SPEC 4.6.
 *
 * `root` names a source folder, resolved by `export-art.mjs`:
 *   art     aseprite-demo/portfolio-os/art   (the new OS documents)
 *   readme  aseprite-demo/readme             (reused README pieces)
 *   pet     aseprite-demo/pet                (the mascot pet sheet)
 *
 * Each source exports to `src/assets/pixel/<group>/<name>.png` plus
 * `<name>.json` (json-array, tags, slices and layers listed, packed, never
 * trimmed). `splitLayers` sheets put each visible layer in its own frames;
 * their frame `filename` is `<layer>:<frame>`. `scales` adds `<name>@<n>x`
 * copies. `ownPalette` marks art that keeps its own colours (the mascot, and
 * the stack shelf, whose tool logos keep their brand colours), which the
 * palette check skips. `oneBit` marks art drawn in one colour that
 * code recolours (the glyphs, drawn into `currentColor`): any one colour
 * passes, a second fails. `skyPalette` marks the wallpaper, whose clouds and
 * day skyline may also use the sky colours (`SKY_COLOURS` in palette.mjs).
 * `companions` are data files drawn up with the art
 * (the wallpaper's sky bands, recolour maps and layout) that are copied next
 * to the export as they are, for a generator to read. `layer` exports one
 * layer alone and `frames` (`[from, to]`, 0-based) a range of frames, with no
 * tags listed, since a tag can reach past the range (the project icon tile).
 */
export const ART_SOURCES = [
  { name: 'os-chrome', root: 'art', group: 'chrome' },
  { name: 'os-glyphs-8', root: 'art', group: 'glyphs', oneBit: true },
  { name: 'os-app-icons', root: 'art', group: 'app-icons' },
  { name: 'os-project-icons', root: 'art', group: 'project-icon-art' },
  {
    name: 'os-project-tile',
    root: 'art',
    file: 'os-project-icons.aseprite',
    group: 'project-icon-art',
    layer: 'tile',
    frames: [0, 0],
  },
  {
    name: 'readme-icons',
    root: 'readme',
    file: 'icons.aseprite',
    group: 'project-icon-art',
  },
  { name: 'mascot-head', root: 'art', group: 'avatar', ownPalette: true },
  { name: 'os-boot', root: 'art', group: 'boot' },
  {
    name: 'os-wallpaper',
    root: 'art',
    group: 'wallpaper',
    splitLayers: true,
    skyPalette: true,
    companions: ['wallpaper-palette.json'],
  },
  { name: 'minime-ride', root: 'art', group: 'pets' },
  { name: 'os-cursors', root: 'art', group: 'cursors' },
  { name: 'os-neon-404', root: 'art', group: 'neon' },
  {
    name: 'readme-headers',
    root: 'readme',
    file: 'headers.aseprite',
    group: 'banners',
  },
  {
    name: 'stack-shelf',
    root: 'readme',
    file: 'stack-shelf.aseprite',
    group: 'banners',
    ownPalette: true,
  },
  { name: 'minime', root: 'readme', file: 'minime.aseprite', group: 'pets' },
  {
    name: 'mascot-pet',
    root: 'pet',
    file: 'mascot-pet.aseprite',
    group: 'pets',
    ownPalette: true,
  },
]

/** The skies the wallpaper paints (SPEC 2.2); Live resolves to one of them. */
export const WALLPAPER_SKIES = ['night', 'dusk', 'dawn', 'day']

/**
 * Sheets a generator cuts from an export (`gen-app-icons.mjs`,
 * `gen-project-icons.mjs`, `gen-wallpaper.mjs`), checked like exports: `from`
 * names the source they are cut from. `canvas` marks art drawn by script (the
 * wallpaper canvas and its static frame), which gets no sprite classes.
 */
export const DERIVED_SHEETS = [
  { name: 'app-icons-32', group: 'icons', from: 'os-app-icons' },
  { name: 'app-icons-16', group: 'icons', from: 'os-app-icons' },
  {
    name: 'project-icons-32',
    group: 'project-icons',
    from: 'os-project-icons',
  },
  ...[
    'wallpaper',
    'stars',
    ...WALLPAPER_SKIES.flatMap((sky) => [`skyline-${sky}`, `lamps-${sky}`]),
  ].map((name) => ({
    name,
    group: 'scene',
    from: 'os-wallpaper',
    canvas: true,
    skyPalette: true,
  })),
]

/**
 * Groups whose PNGs are only inputs to a generator and never ship: the
 * chrome, glyphs and cursors become CSS and TSX, the app icon, project icon
 * and wallpaper exports are cut into the shipped sheets.
 */
export const GENERATOR_INPUT_GROUPS = [
  'chrome',
  'glyphs',
  'app-icons',
  'project-icon-art',
  'cursors',
  'wallpaper',
]

const KB = 1024

/**
 * PNG bytes per set of groups (SPEC 4.6). The chrome and glyph atlases ship
 * as generated CSS and TSX instead, so their budgets apply to those files.
 */
export const PNG_BUDGETS = [
  {
    label: 'app icons, logo, avatar, cursors',
    groups: ['icons', 'avatar', 'cursors'],
    bytes: 12 * KB,
  },
  { label: 'wallpaper layers', groups: ['scene'], bytes: 30 * KB },
  {
    label: 'project icons, banners, shelf',
    groups: ['project-icons', 'banners'],
    bytes: 30 * KB,
  },
  { label: 'boot', groups: ['boot'], bytes: 25 * KB },
  { label: 'pets and cameos', groups: ['pets'], bytes: 50 * KB },
  { label: '404 neon', groups: ['neon'], bytes: 8 * KB },
]

/** Where `gen-sprites.mjs` writes one stylesheet per sheet. */
export const SPRITE_CSS_DIR = 'src/styles/sprites'

/**
 * Generated outputs and their raw-byte budgets (SPEC 4.6). The sprite loops
 * are one file per sheet, each loaded by the component that shows the sheet,
 * so each has a budget of its own; `check-art.mjs` fails a sprite file that
 * has none.
 */
export const GENERATED_BUDGETS = [
  { file: 'src/styles/pixel-chrome.css', bytes: 24 * KB },
  { file: 'src/components/pixel/pixel-icon.generated.tsx', bytes: 16 * KB },
  { file: 'src/styles/pixel-cursors.css', bytes: 6 * KB },
  { file: `${SPRITE_CSS_DIR}/app-icons-16.css`, bytes: 2 * KB },
  { file: `${SPRITE_CSS_DIR}/app-icons-32.css`, bytes: 6 * KB },
  { file: `${SPRITE_CSS_DIR}/mascot-head.css`, bytes: 2 * KB },
  { file: `${SPRITE_CSS_DIR}/os-boot.css`, bytes: 3 * KB },
  { file: `${SPRITE_CSS_DIR}/readme-headers.css`, bytes: 5 * KB },
  { file: `${SPRITE_CSS_DIR}/project-icons-32.css`, bytes: 12 * KB },
  { file: `${SPRITE_CSS_DIR}/os-neon-404.css`, bytes: 1 * KB },
  { file: `${SPRITE_CSS_DIR}/stack-shelf.css`, bytes: 2 * KB },
  { file: `${SPRITE_CSS_DIR}/minime.css`, bytes: 3 * KB },
]
