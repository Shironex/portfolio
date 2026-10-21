# /// script
# requires-python = ">=3.10"
# dependencies = ["fonttools==4.67.0", "brotli==1.2.0"]
# ///
"""
Subsets the pixel fonts to WOFF2 for next/font/local (SPEC 2.3).

    pnpm fonts:subset            (uv run scripts/pixel/subset-fonts.py)
    pnpm fonts:subset --check    fail if a committed WOFF2 differs from a fresh subset

Sources are the untouched release files in assets/fonts/ (never shipped);
outputs go to src/app/fonts/ with each family's OFL text next to them.

Licensing. Both fonts are SIL OFL 1.1. Departure Mono has no Reserved Font
Name. Pixeloid's release (License.txt in Pixeloid_Font_1_0.zip) reserves the
name "Pixeloid", and a subset is a Modified Version under the OFL, which may
not use a Reserved Font Name as its primary font name (condition 3). So the
Pixeloid subsets are renamed "Shiro Pixel Sans" in their name table; the
copyright and licence records are kept and the description says what the
file was made from.

Coverage: Basic Latin, Latin-1, Latin Extended-A (Polish), general
punctuation, the euro and trade marks, arrows; Departure also keeps the box
and block characters of the terminal and the few symbols the OS uses
(command, music notes, sparkle, heavy chevron). Code points a font lacks
are skipped and listed.

The output is deterministic (no timestamps are recalculated), so --check
can compare bytes.
"""

from __future__ import annotations

import io
import sys
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[2]
SOURCES = ROOT / "assets" / "fonts"
OUT = ROOT / "src" / "app" / "fonts"

LATIN = [
    (0x0020, 0x007E),  # Basic Latin
    (0x00A0, 0x00FF),  # Latin-1 Supplement
    (0x0100, 0x017F),  # Latin Extended-A
    (0x2000, 0x206F),  # General Punctuation
    (0x20AC, 0x20AC),  # euro
    (0x2122, 0x2122),  # trade mark
    (0x2190, 0x21FF),  # Arrows
]

TERMINAL = [
    (0x2318, 0x2318),  # command key
    (0x2500, 0x259F),  # Box Drawing, Block Elements
    (0x25A0, 0x25FF),  # Geometric Shapes
    (0x266A, 0x266B),  # music notes
    (0x2727, 0x2727),  # sparkle
    (0x276F, 0x276F),  # heavy right chevron (prompt, selected row)
]

PIXELOID_DESCRIPTION = (
    "Subset of Pixeloid Sans 1.0 by GGBotNet (https://ggbot.net/fonts/), "
    "SIL Open Font License 1.1. Renamed because \"Pixeloid\" is a Reserved "
    "Font Name of the original."
)

FACES = [
    {
        "src": SOURCES / "pixeloid" / "PixeloidSans.ttf",
        "out": OUT / "shiro-pixel-sans-regular.woff2",
        "ranges": LATIN,
        "rename": ("Shiro Pixel Sans", "Regular", PIXELOID_DESCRIPTION),
    },
    {
        "src": SOURCES / "pixeloid" / "PixeloidSans-Bold.ttf",
        "out": OUT / "shiro-pixel-sans-bold.woff2",
        "ranges": LATIN,
        "rename": ("Shiro Pixel Sans", "Bold", PIXELOID_DESCRIPTION),
    },
    {
        "src": SOURCES / "departure-mono" / "DepartureMono-Regular.otf",
        "out": OUT / "departure-mono-regular.woff2",
        "ranges": LATIN + TERMINAL,
        "rename": None,
    },
]

LICENCES = [
    (SOURCES / "pixeloid" / "OFL.txt", OUT / "OFL-pixeloid.txt"),
    (SOURCES / "departure-mono" / "OFL.txt", OUT / "OFL-departure-mono.txt"),
]


def codepoints(ranges: list[tuple[int, int]]) -> list[int]:
    return [cp for lo, hi in ranges for cp in range(lo, hi + 1)]


def rename(font: TTFont, family: str, style: str, description: str) -> None:
    """Give a subset its own primary name (OFL condition 3)."""
    name = font["name"]
    compact = family.replace(" ", "")
    full = family if style == "Regular" else f"{family} {style}"
    version = name.getDebugName(5) or "1.0"
    records = {
        1: family,
        2: style,
        3: f"{version};{compact}-{style};subset",
        4: full,
        6: f"{compact}-{style}",
        10: description,
    }
    for record in list(name.names):
        if record.nameID in (16, 17, 18, 21, 22):
            name.removeNames(nameID=record.nameID)
    for name_id, value in records.items():
        name.removeNames(nameID=name_id)
        name.setName(value, name_id, 3, 1, 0x409)
        name.setName(value, name_id, 1, 0, 0)


def build(face: dict) -> tuple[bytes, list[int]]:
    options = subset.Options()
    options.flavor = "woff2"
    options.drop_tables += ["SVG", "DSIG"]
    options.name_IDs = [0, 1, 2, 3, 4, 5, 6, 10, 13, 14]
    options.hinting = False
    options.desubroutinize = True
    options.recalc_timestamp = False
    font = subset.load_font(str(face["src"]), options)
    wanted = codepoints(face["ranges"])
    cmap = font.getBestCmap()
    missing = [cp for cp in wanted if cp not in cmap and not 0x2000 <= cp <= 0x206F]
    subsetter = subset.Subsetter(options)
    subsetter.populate(unicodes=wanted)
    subsetter.subset(font)
    if face["rename"]:
        rename(font, *face["rename"])
    buffer = io.BytesIO()
    subset.save_font(font, buffer, options)
    return buffer.getvalue(), missing


def describe(missing: list[int], wanted: list[tuple[int, int]]) -> str:
    asked = set(codepoints(wanted))
    notable = [cp for cp in missing if cp in asked and cp > 0x7E]
    if not notable:
        return "all requested symbols present"
    sample = " ".join(f"U+{cp:04X}" for cp in notable[:12])
    more = f" (+{len(notable) - 12} more)" if len(notable) > 12 else ""
    return f"{len(notable)} requested code points absent: {sample}{more}"


def main(argv: list[str]) -> int:
    check = "--check" in argv
    OUT.mkdir(parents=True, exist_ok=True)
    stale = []
    total = 0
    for face in FACES:
        data, missing = build(face)
        total += len(data)
        rel = face["out"].relative_to(ROOT)
        if check:
            if not face["out"].exists() or face["out"].read_bytes() != data:
                stale.append(str(rel))
            continue
        face["out"].write_bytes(data)
        print(f"wrote {rel}: {len(data)} bytes; {describe(missing, face['ranges'])}")
    for src, dest in LICENCES:
        text = src.read_bytes()
        if check:
            if not dest.exists() or dest.read_bytes() != text:
                stale.append(str(dest.relative_to(ROOT)))
            continue
        dest.write_bytes(text)
    if check:
        if stale:
            print("stale, run `pnpm fonts:subset`: " + ", ".join(stale), file=sys.stderr)
            return 1
        print(f"fonts up to date: {len(FACES)} faces, {total} bytes")
        return 0
    print(f"total {total} bytes for {len(FACES)} faces")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
