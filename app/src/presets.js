/**
 * GTA 6 Cover Art Studio - Default Presets
 * Pre-configured cinematic arrangements of layouts, color grades, and typography.
 */

export const PRESETS = {
  "quad-comic": {
    id: "quad-comic",
    name: "Quad Comic (Default)",
    aspect: "16-9",
    layout: "quad",
    filter: "vice-sunset",
    filterIntensity: 0.85,
    grain: 0.25,
    vignette: 0.40,
    halftone: 0.15,
    titleTop: "GRAND THEFT AUTO",
    titleSub: "Vice City",
    showViEmblem: true,
    viStyle: "vice-gradient",
    showMatureBadge: true,
    showWantedMeter: true,
    wantedStars: 5,
    showBarcode: true,
    slots: [
      { id: 0, sample: "sample-4.jpg", zoom: 1.0, panX: 0, panY: 0 },
      { id: 1, sample: "sample-1.jpg", zoom: 1.0, panX: 0, panY: 0 },
      { id: 2, sample: "sample-3.jpg", zoom: 1.0, panX: 0, panY: 0 },
      { id: 3, sample: "sample-2.jpg", zoom: 1.0, panX: 0, panY: 0 }
    ]
  },

  "vice-hero": {
    id: "vice-hero",
    name: "Vice Hero",
    aspect: "16-9",
    layout: "hero",
    filter: "vice-sunset",
    filterIntensity: 0.90,
    grain: 0.20,
    vignette: 0.35,
    halftone: 0.10,
    titleTop: "GRAND THEFT AUTO",
    titleSub: "Vice City",
    showViEmblem: true,
    viStyle: "gold-chrome",
    showMatureBadge: true,
    showWantedMeter: true,
    wantedStars: 5,
    showBarcode: true,
    slots: [
      { id: 0, sample: "sample-1.jpg", zoom: 1.05, panX: 0, panY: 0 }
    ]
  },

  "triptych-heist": {
    id: "triptych-heist",
    name: "Triptych Heist",
    aspect: "16-9",
    layout: "triptych",
    filter: "neon-noir",
    filterIntensity: 0.90,
    grain: 0.30,
    vignette: 0.45,
    halftone: 0.20,
    titleTop: "GRAND THEFT AUTO",
    titleSub: "Vice City",
    showViEmblem: true,
    viStyle: "electric-cyan",
    showMatureBadge: true,
    showWantedMeter: true,
    wantedStars: 4,
    showBarcode: true,
    slots: [
      { id: 0, sample: "sample-2.jpg", zoom: 1.0, panX: 0, panY: 0 },
      { id: 1, sample: "sample-1.jpg", zoom: 1.0, panX: 0, panY: 0 },
      { id: 2, sample: "sample-3.jpg", zoom: 1.0, panX: 0, panY: 0 }
    ]
  },

  "epic-overdrive": {
    id: "epic-overdrive",
    name: "Epic Overdrive",
    aspect: "16-9",
    layout: "epic",
    filter: "comic-punch",
    filterIntensity: 0.95,
    grain: 0.22,
    vignette: 0.40,
    halftone: 0.25,
    titleTop: "GRAND THEFT AUTO",
    titleSub: "Vice City",
    showViEmblem: true,
    viStyle: "vice-gradient",
    showMatureBadge: true,
    showWantedMeter: true,
    wantedStars: 5,
    showBarcode: true,
    slots: [
      { id: 0, sample: "sample-1.jpg", zoom: 1.0, panX: 0, panY: 0 },
      { id: 1, sample: "sample-2.jpg", zoom: 1.0, panX: 0, panY: 0 },
      { id: 2, sample: "sample-4.jpg", zoom: 1.0, panX: 0, panY: 0 },
      { id: 3, sample: "sample-3.jpg", zoom: 1.0, panX: 0, panY: 0 },
      { id: 4, sample: "sample-1.jpg", zoom: 1.0, panX: 0, panY: 0 }
    ]
  },

  "diagonal-action": {
    id: "diagonal-action",
    name: "Diagonal Slash",
    aspect: "1-1",
    layout: "slash",
    filter: "ocean-drive",
    filterIntensity: 0.85,
    grain: 0.25,
    vignette: 0.35,
    halftone: 0.15,
    titleTop: "GRAND THEFT AUTO",
    titleSub: "Vice City",
    showViEmblem: true,
    viStyle: "vice-gradient",
    showMatureBadge: true,
    showWantedMeter: true,
    wantedStars: 5,
    showBarcode: true,
    slots: [
      { id: 0, sample: "sample-1.jpg", zoom: 1.0, panX: 0, panY: 0 },
      { id: 1, sample: "sample-3.jpg", zoom: 1.0, panX: 0, panY: 0 },
      { id: 2, sample: "sample-2.jpg", zoom: 1.0, panX: 0, panY: 0 }
    ]
  }
};

export function getPreset(id) {
  return PRESETS[id] || PRESETS["quad-comic"];
}
