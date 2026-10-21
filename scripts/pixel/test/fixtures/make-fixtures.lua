-- Builds the tiny Aseprite documents the pixel script tests run on.
-- Run through make-fixtures.mjs (which then exports them with the real CLI):
--   aseprite -b --script-param dir=<out> --script make-fixtures.lua
-- Writes chrome-fixture, glyphs-fixture and sheet-fixture .aseprite into <dir>.

local dir = app.params.dir

local colours = {
  ['N'] = Color{ r = 0x0b, g = 0x14, b = 0x20 }, -- ground / outline
  ['S'] = Color{ r = 0x13, g = 0x25, b = 0x3a }, -- surf
  ['R'] = Color{ r = 0x17, g = 0x3a, b = 0x45 }, -- surf-raised
  ['T'] = Color{ r = 0x4f, g = 0xa3, b = 0xa0 }, -- frame teal
  ['L'] = Color{ r = 0xf0, g = 0xc0, b = 0x70 }, -- lamp
  ['C'] = Color{ r = 0xe8, g = 0xe4, b = 0xdc }, -- cream ink
}

-- Paint `rows` (strings; '.' is transparent) at x, y of a cel image.
local function paint(image, x, y, rows)
  for j, row in ipairs(rows) do
    for i = 1, #row do
      local key = row:sub(i, i)
      if key ~= '.' then image:drawPixel(x + i - 1, y + j - 1, colours[key]) end
    end
  end
end

-- A cel for every frame of the first layer, frames 2.. created empty.
local function frames(spr, count, durations)
  for _ = 2, count do spr:newEmptyFrame() end
  local cels = {}
  for f = 1, count do
    spr.frames[f].duration = durations[f]
    local cel = spr.layers[1]:cel(f) or spr:newCel(spr.layers[1], f)
    cels[f] = cel.image
  end
  return cels
end

-- 1. Chrome: a 9-slice window, a button with round-repeat edges, a 2x2 tile
--    and a 2-frame tile, all on one 16x8 canvas.
do
  local spr = Sprite(16, 8, ColorMode.RGB)
  local img = frames(spr, 2, { 0.2, 0.2 })
  for f = 1, 2 do
    paint(img[f], 0, 0, {
      '.NNNN.',
      'NTTTTN',
      'NTSSTN',
      'NTSSTN',
      'NTTTTN',
      '.NNNN.',
    })
    paint(img[f], 6, 0, {
      'NNNNN',
      'NRLRN',
      'NRRRN',
      'NNNNN',
    })
    paint(img[f], 12, 0, { 'NS', 'SN' })
  end
  paint(img[1], 14, 0, { 'N.', '.N' })
  paint(img[2], 14, 0, { '.N', 'N.' })

  local window = spr:newSlice(Rectangle(0, 0, 6, 6))
  window.name = 'window'
  window.center = Rectangle(2, 2, 2, 2)
  local button = spr:newSlice(Rectangle(6, 0, 5, 4))
  button.name = 'button'
  button.center = Rectangle(1, 1, 3, 2)
  button.data = 'repeat=round'
  local tile = spr:newSlice(Rectangle(12, 0, 2, 2))
  tile.name = 'shadow-tile'
  local skeleton = spr:newSlice(Rectangle(14, 0, 2, 2))
  skeleton.name = 'skeleton-tile'
  skeleton.data = 'night'
  spr:saveAs(dir .. '/chrome-fixture.aseprite')
end

-- 2. Glyphs: 8x8 cells as slices; `spinner` animates over 4 frames (tag).
do
  local spr = Sprite(24, 8, ColorMode.RGB)
  local img = frames(spr, 4, { 0.1, 0.1, 0.1, 0.1 })
  local close = {
    'C......C',
    '.C....C.',
    '..C..C..',
    '...CC...',
    '...CC...',
    '..C..C..',
    '.C....C.',
    'C......C',
  }
  local check = {
    '........',
    '.......C',
    '......CC',
    'C....CC.',
    'CC..CC..',
    '.CCCC...',
    '..CC....',
    '........',
  }
  local spin = {
    { 'CCC.....', 'C.......', 'C.......' },
    { '.....CCC', '.......C', '.......C' },
    { '.......C', '.......C', '.....CCC' },
    { 'C.......', 'C.......', 'CCC.....' },
  }
  for f = 1, 4 do
    paint(img[f], 0, 0, close)
    paint(img[f], 8, 0, check)
    local rows = spin[f]
    if f <= 2 then paint(img[f], 16, 0, rows) else paint(img[f], 16, 5, rows) end
  end
  -- ipairs, not pairs: slice order must be the same on every run.
  for _, cell in ipairs({ { 'close', 0 }, { 'check', 8 }, { 'spinner', 16 } }) do
    local s = spr:newSlice(Rectangle(cell[2], 0, 8, 8))
    s.name = cell[1]
  end
  local tag = spr:newTag(1, 4)
  tag.name = 'spinner'
  spr:saveAs(dir .. '/glyphs-fixture.aseprite')
end

-- 3. Sheet: a 4x4 sprite over 4 frames with uneven timing; `blink` plays
--    frames 1-3 forward and `pulse` frames 3-4 pingpong.
do
  local spr = Sprite(4, 4, ColorMode.RGB)
  local img = frames(spr, 4, { 0.1, 0.25, 0.15, 0.3 })
  local fill = { 'N', 'S', 'T', 'L' }
  for f = 1, 4 do
    local k = fill[f]
    paint(img[f], 0, 0, { k .. k .. k .. k, k .. 'CC' .. k, k .. 'CC' .. k, k .. k .. k .. k })
  end
  local blink = spr:newTag(1, 3)
  blink.name = 'blink'
  local pulse = spr:newTag(3, 4)
  pulse.name = 'pulse'
  pulse.aniDir = AniDir.PING_PONG
  spr:saveAs(dir .. '/sheet-fixture.aseprite')
end
