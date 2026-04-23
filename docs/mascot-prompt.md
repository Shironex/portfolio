# ShiroOS Mascot — Recraft AI Prompt (single pose)

Adapted from the ShiroAni chibi-vampire-neko prompt library. Single-pose version — the mascot only lives in a handful of spots (boot splash, Start menu avatar, noscript fallback) so one well-generated asset is enough. Regenerate additional poses later only if needed.

## Platform Settings

- **Model**: Recraft V3 (not V4 — V4 doesn't support style presets)
- **Style**: Digital Illustration > **"Hand Drawn Outline"** (`hand_drawn_outline`)
- **Aspect ratio**: 1:1 (square)
- **Output**: 512×512 RGBA PNG (downscale to 256 if needed)

### Alternative Styles to Test

- Digital Illustration > "Outline Details" — slightly more interior detail
- Digital Illustration > "2D Art Poster" — bolder shapes
- Vector Illustration > "Line Art" — cleanest lines, may lose hand-drawn warmth

**Avoid**: "Grain", "Pencil Sketch", "Risograph", "Watercolor" — texture degrades at small sizes.

## Color Palette (ShiroOS)

| Color      | Hex       | Used for                                            |
| ---------- | --------- | --------------------------------------------------- |
| Miku Teal  | `#39c5bb` | Hair primary, clothing stars, eye accent            |
| Teal Light | `#6ae3da` | Hair highlights, sneaker trim                       |
| Pink       | `#ff8ecf` | Blush, star pattern, accents                        |
| Pink Deep  | `#ff5fa8` | Shoe laces, ribbons, eye primary                    |
| Lavender   | `#b79dff` | Cardigan, socks, secondary accent                   |
| Cream      | `#fff5f0` | Skin base, shirt base                               |
| Ink Navy   | `#0d1b2a` | Outlines (not pure black — plays nicer on light bg) |

## Custom Style Setup (critical for consistency)

1. Create a new Recraft project for ShiroOS mascot
2. (Optional) Upload a chibi reference image
3. Set Style Model to "Style essentials", Style Category to "Illustration"
4. Style Prompt:

   ```
   clean chibi anime illustration, dark navy outline art, flat colors,
   minimal shading, teal and pink and lavender pastel color palette,
   cute kawaii Miku-inspired character design, sticker style,
   simple clean lines
   ```

5. Save as "ShiroOS Chibi" — use for every generation

## Character Anchor

> chibi anime girl character, 2-head-tall proportions with oversized head and tiny body, long flowing teal-green hair with twin tails tied with pink polka-dot ribbons, small headphones resting around her neck, teal star hair clips, bright teal-cyan eyes with gentle cheerful expression, small open smile, wearing a cream white top with pink star pattern, lavender cardigan draped over shoulders, pink high-top sneakers with teal and white accents, pale cream skin with soft pink blush marks on cheeks

## Pose — Idle / gentle wave (`mascot.png`)

```
A hand-drawn outline digital illustration of a chibi anime girl character,
2-head-tall proportions with oversized head and tiny body, long flowing
teal-green hair with twin tails tied with pink polka-dot ribbons, small
headphones resting around her neck, teal star hair clips, bright teal-cyan
eyes with gentle cheerful expression, small open smile, wearing a cream
white top with pink star pattern, lavender cardigan draped over shoulders,
pink high-top sneakers with teal and white accents, pale cream skin with
soft pink blush marks on cheeks. She is standing with one hand raised in a
small wave hello, other arm resting at her side, slight tilt of the head,
friendly welcoming pose. Clean dark navy outlines, flat colors, minimal
shading, sticker style, full body visible, single character, centered
composition, transparent background.
```

## Generation Workflow

1. Open the ShiroOS project in Recraft
2. Select the "ShiroOS Chibi" custom style
3. Set aspect ratio to 1:1, output 512×512
4. Paste the pose prompt above
5. Generate 4+ images
6. Pick the best match; remove background with the scissors tool if the transparent-bg prompt didn't take
7. Export as PNG, save to `public/mascot.png`

## Transparency Tips

- Try "transparent background" in prompt first
- Fallback: generate on solid white, then use Recraft's background remover
- Never upscale after background removal (destroys alpha)

## Used In

- Boot splash (above the wordmark, inside the rotating rings)
- Start menu footer avatar
- `<noscript>` fallback card
- Future 404 page
