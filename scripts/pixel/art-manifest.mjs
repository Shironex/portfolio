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
 * copies (cursors need a 2x file for `image-set()`). `ownPalette` marks art
 * that keeps its own colours (the mascot), which the palette check skips.
 */
export const ART_SOURCES = [
  { name: 'os-chrome', root: 'art', group: 'chrome' },
  { name: 'os-glyphs-8', root: 'art', group: 'glyphs' },
  { name: 'os-app-icons', root: 'art', group: 'app-icons' },
  { name: 'os-project-icons', root: 'art', group: 'project-icons' },
  {
    name: 'readme-icons',
    root: 'readme',
    file: 'icons.aseprite',
    group: 'project-icons',
  },
  { name: 'mascot-head', root: 'art', group: 'avatar', ownPalette: true },
  { name: 'os-boot', root: 'art', group: 'boot' },
  { name: 'os-wallpaper', root: 'art', group: 'wallpaper', splitLayers: true },
  { name: 'minime-ride', root: 'art', group: 'pets' },
  { name: 'os-cursors', root: 'art', group: 'cursors', scales: [2] },
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

/** Groups whose PNGs are only inputs to a generator and never ship. */
export const GENERATOR_INPUT_GROUPS = ['chrome', 'glyphs']

const KB = 1024

/**
 * PNG bytes per set of groups (SPEC 4.6). The chrome and glyph atlases ship
 * as generated CSS and TSX instead, so their budgets apply to those files.
 */
export const PNG_BUDGETS = [
  {
    label: 'app icons, logo, avatar, cursors',
    groups: ['app-icons', 'avatar', 'cursors'],
    bytes: 12 * KB,
  },
  { label: 'wallpaper layers', groups: ['wallpaper'], bytes: 30 * KB },
  {
    label: 'project icons, banners, shelf',
    groups: ['project-icons', 'banners'],
    bytes: 30 * KB,
  },
  { label: 'boot', groups: ['boot'], bytes: 25 * KB },
  { label: 'pets and cameos', groups: ['pets'], bytes: 50 * KB },
  { label: '404 neon', groups: ['neon'], bytes: 8 * KB },
]

/** Generated outputs and their raw-byte budgets (SPEC 4.6). */
export const GENERATED_BUDGETS = [
  { file: 'src/styles/pixel-chrome.css', bytes: 24 * KB },
  { file: 'src/components/pixel/pixel-icon.generated.tsx', bytes: 16 * KB },
  { file: 'src/styles/pixel-sprites.css', bytes: 12 * KB },
]
