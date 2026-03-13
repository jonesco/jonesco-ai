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
- **Image strategy** — tries local `images/` first, then musclefigures.com and uofmuscle.com with automatic per-card URL fallback cycling; falls back to a flesh-colored CSS placeholder with figure number and wrestling silhouette
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

## Downloading Figure Images

The catalog includes scripts to scrape and download images for all 236 figures into `images/figure-NNN.jpg`. Once downloaded, the catalog will display the local copies automatically.

### Python (recommended)

```bash
# Install dependencies
pip install requests beautifulsoup4

# Basic download (uses requests + Wayback Machine CDX)
python3 scripts/download-images.py

# Better anti-bot bypass using a headless browser
pip install playwright && playwright install chromium
python3 scripts/download-images.py --browser
```

### Node.js

```bash
cd scripts
npm install
node download-images.js
```

The scripts try these sources in order for each figure:

1. **musclefigures.com** gallery page (scraped for real URLs)
2. **uofmuscle.com** figure archive (scraped for real URLs)
3. **Wayback Machine CDX API** (archived copies)
4. Multiple URL pattern guesses on both sites

Any figures not automatically downloaded are listed at the end with manual download instructions.

## Data Sources

Figure numbering and names follow the canonical Mattel 236-figure poster numbering system. Character names reference the original Japanese Kinnikuman (キン肉マン) manga by Yudetamago.

---

*Fan reference catalog. Not affiliated with Mattel or Bandai. M.U.S.C.L.E. © 1985–1988 Mattel Inc.*
