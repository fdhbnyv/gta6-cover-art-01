# GTA 6 Cover Art Studio 🌴⚡

[![make.fun · gta6-cover-art-01](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/fdhbnyv/gta6-cover-art-01/rank.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/fdhbnyv/gta6-cover-art-01/reward.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)

A high-performance, client-side procedural cover art generator inspired by the iconic Rockstar Games visual design language and the neon-soaked aesthetics of Vice City.

Create professional, print-ready multi-panel comic book collages with authentic 3D extruded typography, retro color grading shaders, satirical ESRB rating badges, wanted meters, and triple-ratio export presets.

---

## 🌟 Key Features

- **Multi-Panel Comic Book Layouts**:
  - `Hero` (1 full bleed poster panel)
  - `Triptych` (3 cinematic vertical character slices)
  - `Quad` (4 classic comic story blocks with bold borders)
  - `Epic` (5-panel asymmetric master collage)
  - `Diagonal Slash` (Dynamic action split with angled cutaways)
- **Retro Vice City Color Shaders**:
  - `Vice Sunset`: Magenta-to-cyan split tone with heightened vibrancy
  - `Neon Noir`: Crushed blacks, deep indigo shadows, and electric cyan highlights
  - `Comic Punch`: High-contrast, posterized halftone aesthetic with crisp edges
  - `Golden Hour`: Warm amber glow, rich bronze skin tones, and soft lens diffusion
  - `Ocean Drive`: Retro synthwave teal and hot coral palette
  - Procedural film grain, radial vignette, and custom halftone overlays
- **3D Extrusion Typography & Emblems**:
  - Genuine multi-layered 3D beveled block letters with procedural light drops
  - Dual-gradient metallic and neon surface textures
  - Handcrafted vector Roman numeral **VI** emblem
  - Satirical "M for Mature 17+" content advisory badge
  - Authentic 5-Star Wanted Level meter and commercial barcode stamp
- **Triple-Ratio Responsive Export**:
  - `16:9` Cinematic Desktop / Wallpaper (1920x1080 & 3840x2160 4K)
  - `1:1` Square Vinyl / Album Art (1080x1080 & 2048x2048)
  - `9:16` Portrait Mobile / Story Poster (1080x1920)
- **Zero External Runtime Dependencies**:
  - 100% vanilla HTML5 Canvas 2D engine
  - SIL Open Font License (OFL) compliant bundled typefaces (Anton, Bebas Neue, Pacifico)
  - Works completely offline and in sandboxed environments

---

## 🚀 Quick Start

### Prerequisites
- Node.js 22+ (native TypeScript execution support)

### Run Local Development Server
```bash
# Start zero-dependency static dev server on http://localhost:3000
node --experimental-strip-types serve.ts
```

Open your browser to `http://localhost:3000` to launch the studio.

### Generate Dossier
```bash
# Build make.fun compliance dossier with captured screenshot artifacts
node --experimental-strip-types main.ts
```

---

## 🎨 Architecture & Canvas Pipeline

```
┌────────────────────────────────────────────────────────┐
│                   App Controller                       │
│     (State machine, drag-and-drop, preset loader)      │
└───────────────────────────┬────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
┌───────────────────────┐       ┌───────────────────────┐
│     Layout Engine     │       │    Shader Pipeline    │
│  - Coordinate mapping │       │  - Pixel grading      │
│  - Clip paths         │       │  - Film grain / noise │
│  - Border strokes     │       │  - Radial vignette    │
└───────────┬───────────┘       └───────────┬───────────┘
            │                               │
            └───────────────┬───────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│              Typography & Emblem Compositor            │
│  - 3D Extruded Bevels (Anton / Bebas Neue)             │
│  - Pacifico Script Subtitles                           │
│  - Roman Numeral VI Vector Emblem                      │
│  - Satirical Mature Badge & Wanted Level Meter         │
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│                  HTML5 Canvas Viewport                 │
│      (Interactive pan/zoom, high-DPI export)          │
└────────────────────────────────────────────────────────┘
```

---

## 📜 Font Licensing

All embedded typography adheres strictly to open-source licensing:
- **Anton**: Designed by Vernon Adams, licensed under SIL Open Font License (OFL 1.1).
- **Bebas Neue**: Designed by Ryoichi Tsunekawa, licensed under SIL Open Font License (OFL 1.1).
- **Pacifico**: Designed by Vernon Adams, licensed under SIL Open Font License (OFL 1.1).

Full license texts are preserved under `app/fonts/*-OFL.txt`.

---

## ⚖️ License

Source code is available under the MIT License.
