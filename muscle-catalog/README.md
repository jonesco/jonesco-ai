# M.U.S.C.L.E. Figure Catalog

A comprehensive, visually stunning catalog of all 236 M.U.S.C.L.E. figures released by Mattel from 1985–1988.

## Files

| File | Description |
|------|-------------|
| `index.html` | Main page — hero, filter bar, grid, modal, footer |
| `style.css` | All styles — dark theme, flesh-pink palette, animations |
| `app.js` | All logic — figure data, rendering, search, filter, modal |

## Features

- **All 236 figures** with number, name, character, series, and pose
- **Full-screen hero** with animated M.U.S.C.L.E. title letters, floating figure numbers, and counter animation
- **Immersive grid** — cards animate in via IntersectionObserver as you scroll
- **Hover effects** — scale-up with flesh-pink glow shadow
- **Series filter buttons** — Hero, Justice, Villain, Devil Knight, Minor, Special (with counts)
- **Live text search** — filter by name in real time
- **Modal lightbox** — click any figure for expanded detail view with nav arrows and keyboard support
- **External links** — each modal links to eBay search, Google Images, and the Kinnikuman Wiki
- **Image strategy** — attempts to load from musclefigures.com; gracefully falls back to a beautiful flesh-colored CSS placeholder with figure number and wrestling silhouette
- **Sticky filter bar** with results count and reset button
- **Hero parallax** scrolling effect
- **Mobile responsive** — grid adapts from 130px–160px minimum card width

## How to Use

Open `index.html` in any modern browser. No build step or server required.

```bash
# From this directory, open directly:
open index.html          # macOS
xdg-open index.html      # Linux
start index.html         # Windows
```

Or serve locally:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Design

- Background: `#0a0a0a` near-black
- Primary accent: `#F0A87A` flesh/salmon (the actual color of the figures)
- Typography: Bebas Neue (display), Orbitron (sub-headings/labels), Rajdhani (body)
- Series color coding: yellow (Hero), blue (Justice), red (Villain), purple (Devil Knight), gray (Minor), orange (Special)

## Data Sources

Figure numbering and names follow the canonical Mattel 236-figure poster numbering system. Character names reference the original Japanese Kinnikuman (キン肉マン) manga by Yudetamago.

---

*Fan reference catalog. Not affiliated with Mattel or Bandai. M.U.S.C.L.E. © 1985–1988 Mattel Inc.*
