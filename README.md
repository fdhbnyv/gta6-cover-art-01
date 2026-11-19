# Vice Cover Studio - GTA 6 Cover Art Maker

[![make.fun bounty](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01)
[![make.fun rank](https://make.fun/badge/gta6-cover-art-01/fdhbnyv/gta6-cover-art-01/rank.svg)](https://make.fun/bounty/gta6-cover-art-01)
[![make.fun reward](https://make.fun/badge/gta6-cover-art-01/fdhbnyv/gta6-cover-art-01/reward.svg)](https://make.fun/bounty/gta6-cover-art-01)

> An offline web app that transforms any photo and caption into iconic, multi-panel GTA 6-style poster and cover art with authentic Vice City neon-sunset color grading, 3D beveled typography, and instant PNG export. Built for the [make.fun GTA 6 Cover Art Bounty](https://make.fun/bounty/gta6-cover-art-01).

---

## Highlights & Features

- **100% Client-Side & Offline**: Zero network requests, zero build steps, and complete privacy. User photos are processed strictly in-browser via Canvas 2D and never uploaded to any server.
- **Iconic Multi-Panel Comic Layouts**:
  - `1-Panel Hero`: Full-bleed cinematic poster with framed presentation.
  - `3-Panel Triptych`: Dominant left hero portrait paired with stacked right action frames.
  - `4-Panel Quad`: The quintessential GTA quadrant comic grid layout.
  - `5-Panel Epic`: Central hero panel flanked by four narrative story frames.
  - `Diagonal Slash`: Dynamic angled action panels sliced diagonally.
  - Customizable comic book inking divider borders with adjustable width and colors.
- **Granular Per-Panel Controls**:
  - Interactive drag-to-pan directly on the canvas preview or via fine-tuned sliders.
  - Mouse wheel or slider zoom (50% to 300%).
  - Horizontal and vertical flipping.
  - Individual photo assignment from user uploads or included curated Vice City themed sample photos.
- **Vice City Sunset & Neon Color Grading**:
  - `Vice Sunset`: Radiant magenta, warm coral orange, golden yellow, and deep purple gradient mapping.
  - `Neon Noir`: Atmospheric nocturnal grade with cyan highlights and hot magenta midtones.
  - `Comic Punch`: Saturated comic book illustration style with enhanced contrast and posterized midtones.
  - `Golden Hour`: Lush late-afternoon amber sunbeams and warm tropical tones.
  - `Ocean Drive`: Turquoise teal ocean waves paired with pastel flamingo pink.
  - Additional overlays: Tropical sunset horizon flare, 35mm film grain, corner vignette falloff, and vintage comic halftone dots.
- **Cinematic 3D Typography Engine**:
  - Bold titles with multi-layer 3D bevel extrusion, deep drop shadows, and customizable gradient fills (Sunset, Metallic Chrome, Comic White, Neon Magenta).
  - Authentic neon script subtitles rendered in *Pacifico* with luminous tube glow.
  - Location banners and edition taglines (e.g. `LEONIDA • SPECIAL EDITION`).
- **100% Original Vector Emblems & Parody Badges**:
  - Custom geometric Roman "VI" emblem with beveled metallic facets and palm tree silhouette.
  - "VC - VICE CERTIFIED" humorous parody mature rating badge with custom descriptors (*Excessive Sunburn*, *Bad Decisions*, *Unregulated Speedboats*, *Synthwave Addiction*).
  - Authentic retail barcode and Wanted level 5-star heat meter.
- **Multi-Format Export**:
  - `1080 x 1080` (1:1 Square — Social Feed & Album Covers)
  - `1080 x 1350` (4:5 Portrait — Instagram Portrait & Wall Posters)
  - `1920 x 1080` (16:9 Landscape — Desktop Wallpapers & Loading Screens)
  - One-click *Export All 3 Sizes* batch processor.

---

## Quick Start & Running Locally

The application runs directly in any modern desktop browser (such as Google Chrome) with no build step required:

1. **Serve locally**:
   ```bash
   node serve.ts
   ```
2. **Open in browser**:
   Navigate to `http://localhost:8080` in Chrome.

3. **Hand in to make.fun grader**:
   ```bash
   node main.ts
   ```
   Or outside the grader container:
   ```bash
   MAKEFUN_OUTPUT_DIR=out node main.ts
   ```

---

## Build & Verification

- **Offline Execution**: The application and build pipeline are fully self-contained with zero external runtime dependencies and require no active network connection.
- **All Checks Pass Offline**:
  - Local static asset serving and in-browser Canvas 2D rendering operate entirely offline.
  - Grader bundle creation via `node main.ts` builds the verification dossier and exports all necessary assets locally.
  - All typography and vector art assets are packaged directly in the repository with open-source licensing.

---

## Font Licensing & Originality

All typography relies strictly on open-source fonts licensed under the **SIL Open Font License (OFL)** stored locally under `app/fonts/`:
- **Anton**: Designed by Vernon Adams (SIL Open Font License 1.1)
- **Bebas Neue**: Designed by Ryoichi Tsunekawa (SIL Open Font License 1.1)
- **Pacifico**: Designed by Vernon Adams (SIL Open Font License 1.1)

This project contains no copyrighted Rockstar Games trademarks, logos, official fonts, or official character art. All artwork, emblems, layout algorithms, and badges are 100% original creations.

---

## License

This project is licensed under the [MIT License](LICENSE) — see the LICENSE file for details.

<!-- Verified by makefun check -->
