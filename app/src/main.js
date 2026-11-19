// Main application controller for Vice Cover Studio

import { drawCover, setCanvasAspectRatio } from './cover.js';
import { PRESETS } from './presets.js';
import { runShot } from './shots.js';

const canvas = document.getElementById('cover-canvas');
const exportStatus = document.getElementById('export-status');
const stageInfo = document.getElementById('stage-info');

// In-memory cache of loaded Image objects
const loadedImages = {};

// Active editing state
let state = JSON.parse(JSON.stringify(PRESETS['vice-sunset']));
let activePanelIndex = 0;

/** Utility to load an image from a URL */
export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => {
      console.warn('Failed to load image:', url);
      resolve(null);
    };
    img.src = url;
  });
}

/** Preload all included themed sample photos */
async function preloadSamples() {
  const samples = [
    { key: 'boulevard', path: './samples/boulevard.jpg' },
    { key: 'pier', path: './samples/pier.jpg' },
    { key: 'rooftop', path: './samples/rooftop.jpg' },
    { key: 'neoncar', path: './samples/neoncar.jpg' },
  ];

  await Promise.all(
    samples.map(async ({ key, path }) => {
      const img = await loadImage(path);
      if (img) loadedImages[key] = img;
    })
  );
}

/** Redraws canvas based on current state */
export function redraw() {
  if (document.fonts) {
    document.fonts.ready.then(() => {
      drawCover(canvas, state, loadedImages);
      updateStageInfo();
    });
  } else {
    drawCover(canvas, state, loadedImages);
    updateStageInfo();
  }
}

/** Updates resolution and layout label in stage footer */
function updateStageInfo() {
  if (!stageInfo) return;
  const ratioLabel = state.ratio === '16:9' ? '1920 × 1080 px (16:9)' : state.ratio === '4:5' ? '1080 × 1350 px (4:5)' : '1080 × 1080 px (1:1)';
  const layoutLabel = state.layout.toUpperCase();
  stageInfo.textContent = `Resolution: ${ratioLabel} • Layout: ${layoutLabel}`;
}

/** Syncs HTML input values to match current state */
function syncUI() {
  // Tabs & Layout
  document.querySelectorAll('.layout-card').forEach((card) => {
    card.classList.toggle('active', card.dataset.layout === state.layout);
  });

  document.querySelectorAll('.btn-toggle').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.ratio === state.ratio);
  });

  const bw = document.getElementById('border-width');
  const bwVal = document.getElementById('border-width-val');
  if (bw && bwVal) {
    bw.value = state.borderWidth;
    bwVal.textContent = `${state.borderWidth}px`;
  }

  const bc = document.getElementById('border-color');
  if (bc) bc.value = state.borderColor;

  // Grade & Effects
  document.querySelectorAll('.grade-card').forEach((card) => {
    card.classList.toggle('active', card.dataset.grade === state.grade);
  });

  const gi = document.getElementById('grade-intensity');
  const giVal = document.getElementById('grade-intensity-val');
  if (gi && giVal) {
    gi.value = state.gradeIntensity;
    giVal.textContent = `${state.gradeIntensity}%`;
  }

  const grain = document.getElementById('grain-amount');
  const grainVal = document.getElementById('grain-amount-val');
  if (grain && grainVal) {
    grain.value = state.grain;
    grainVal.textContent = `${state.grain}%`;
  }

  const vig = document.getElementById('vignette-amount');
  const vigVal = document.getElementById('vignette-amount-val');
  if (vig && vigVal) {
    vig.value = state.vignette;
    vigVal.textContent = `${state.vignette}%`;
  }

  const sunsetGlow = document.getElementById('sunset-glow-toggle');
  if (sunsetGlow) sunsetGlow.checked = !!state.sunsetGlow;

  const halftone = document.getElementById('halftone-toggle');
  if (halftone) halftone.checked = !!state.halftone;

  // Typography
  const titleText = document.getElementById('title-text');
  if (titleText) titleText.value = state.titleText;

  const titleFont = document.getElementById('title-font');
  if (titleFont) titleFont.value = state.titleFont;

  const titleStyle = document.getElementById('title-style');
  if (titleStyle) titleStyle.value = state.titleStyle;

  const titleDepth = document.getElementById('title-depth');
  const titleDepthVal = document.getElementById('title-depth-val');
  if (titleDepth && titleDepthVal) {
    titleDepth.value = state.titleDepth;
    titleDepthVal.textContent = `${state.titleDepth}px`;
  }

  const subText = document.getElementById('subtitle-text');
  if (subText) subText.value = state.subtitleText;

  const subFont = document.getElementById('subtitle-font');
  if (subFont) subFont.value = state.subtitleFont;

  const subColor = document.getElementById('subtitle-color');
  if (subColor) subColor.value = state.subtitleColor;

  const tagline = document.getElementById('tagline-text');
  if (tagline) tagline.value = state.taglineText;

  // Emblems & Badges
  const viToggle = document.getElementById('vi-toggle');
  if (viToggle) viToggle.checked = !!state.viShow;

  const viPos = document.getElementById('vi-position');
  if (viPos) viPos.value = state.viPosition;

  const viStyle = document.getElementById('vi-style');
  if (viStyle) viStyle.value = state.viStyle;

  const badgeToggle = document.getElementById('badge-toggle');
  if (badgeToggle) badgeToggle.checked = !!state.badgeShow;

  const badgeRating = document.getElementById('badge-rating');
  if (badgeRating) badgeRating.value = state.badgeRating;

  const badgeDesc = document.getElementById('badge-desc');
  if (badgeDesc) badgeDesc.value = state.badgeDesc;

  const barcodeToggle = document.getElementById('barcode-toggle');
  if (barcodeToggle) barcodeToggle.checked = !!state.barcodeShow;

  const starsToggle = document.getElementById('stars-toggle');
  if (starsToggle) starsToggle.checked = !!state.starsShow;

  // Active panel
  syncPanelUI();
}

/** Syncs sliders for the currently selected panel */
function syncPanelUI() {
  document.querySelectorAll('.panel-select-btn').forEach((btn) => {
    btn.classList.toggle('active', Number(btn.dataset.panelIdx) === activePanelIndex);
  });

  const p = (state.panels && state.panels[activePanelIndex]) || { panX: 0, panY: 0, zoom: 100 };

  const panX = document.getElementById('panel-pan-x');
  const panXVal = document.getElementById('panel-pan-x-val');
  if (panX && panXVal) {
    panX.value = p.panX || 0;
    panXVal.textContent = `${p.panX || 0}%`;
  }

  const panY = document.getElementById('panel-pan-y');
  const panYVal = document.getElementById('panel-pan-y-val');
  if (panY && panYVal) {
    panY.value = p.panY || 0;
    panYVal.textContent = `${p.panY || 0}%`;
  }

  const zoom = document.getElementById('panel-zoom');
  const zoomVal = document.getElementById('panel-zoom-val');
  if (zoom && zoomVal) {
    zoom.value = p.zoom || 100;
    zoomVal.textContent = `${p.zoom || 100}%`;
  }
}

/** Applies a named preset */
export function applyPreset(presetName) {
  const p = PRESETS[presetName];
  if (!p) return;
  state = JSON.parse(JSON.stringify(p));

  document.querySelectorAll('.preset-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.preset === presetName);
  });

  syncUI();
  redraw();
}

/** Exports canvas to a downloadable PNG */
export function exportPNG(ratioOverride = null, filename = null) {
  const originalRatio = state.ratio;
  if (ratioOverride) {
    state.ratio = ratioOverride;
    drawCover(canvas, state, loadedImages);
  }

  const name = filename || `gta6-cover-${state.ratio.replace(':', 'x')}-${Date.now()}.png`;

  canvas.toBlob((blob) => {
    if (!blob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();

    if (exportStatus) {
      exportStatus.textContent = `✓ Exported ${name} (${(blob.size / 1024).toFixed(0)} KB)`;
    }

    if (ratioOverride && ratioOverride !== originalRatio) {
      state.ratio = originalRatio;
      drawCover(canvas, state, loadedImages);
    }
  }, 'image/png');
}

/** Export all 3 standard sizes */
export async function exportAllSizes() {
  const sizes = ['1:1', '4:5', '16:9'];
  for (const s of sizes) {
    exportPNG(s, `gta6-cover-${s.replace(':', 'x')}.png`);
    await new Promise((r) => setTimeout(r, 400));
  }
}

/** Initialize event listeners */
function setupEvents() {
  // Tabs
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach((p) => p.classList.remove('active'));
      btn.classList.add('active');
      const pane = document.getElementById(btn.dataset.tab);
      if (pane) pane.classList.add('active');
    });
  });

  // Preset Buttons
  document.querySelectorAll('.preset-btn').forEach((btn) => {
    btn.addEventListener('click', () => applyPreset(btn.dataset.preset));
  });

  // Layout selection
  document.querySelectorAll('.layout-card').forEach((card) => {
    card.addEventListener('click', () => {
      state.layout = card.dataset.layout;
      syncUI();
      redraw();
    });
  });

  // Aspect Ratio buttons
  document.querySelectorAll('.btn-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.ratio = btn.dataset.ratio;
      syncUI();
      redraw();
    });
  });

  // Border controls
  const bw = document.getElementById('border-width');
  if (bw) {
    bw.addEventListener('input', (e) => {
      state.borderWidth = Number(e.target.value);
      document.getElementById('border-width-val').textContent = `${state.borderWidth}px`;
      redraw();
    });
  }

  const bc = document.getElementById('border-color');
  if (bc) {
    bc.addEventListener('input', (e) => {
      state.borderColor = e.target.value;
      redraw();
    });
  }

  // Panel selector
  document.querySelectorAll('.panel-select-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      activePanelIndex = Number(btn.dataset.panelIdx);
      syncPanelUI();
    });
  });

  // Custom photo upload (client-side only)
  const photoUpload = document.getElementById('photo-upload');
  if (photoUpload) {
    photoUpload.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      const img = await loadImage(url);
      if (img) {
        const key = `custom_${activePanelIndex}`;
        loadedImages[key] = img;
        if (!state.panels[activePanelIndex]) state.panels[activePanelIndex] = {};
        state.panels[activePanelIndex].customUrl = key;
        redraw();
        if (exportStatus) exportStatus.textContent = `Loaded photo into Panel ${activePanelIndex + 1}`;
      }
    });
  }

  // Sample photo picker
  document.querySelectorAll('.sample-thumb').forEach((thumb) => {
    thumb.addEventListener('click', () => {
      const sampleKey = thumb.dataset.sample;
      if (!state.panels[activePanelIndex]) state.panels[activePanelIndex] = {};
      state.panels[activePanelIndex].customUrl = null;
      state.panels[activePanelIndex].sample = sampleKey;
      redraw();
    });
  });

  // Active panel transform sliders
  const panX = document.getElementById('panel-pan-x');
  if (panX) {
    panX.addEventListener('input', (e) => {
      if (!state.panels[activePanelIndex]) state.panels[activePanelIndex] = {};
      state.panels[activePanelIndex].panX = Number(e.target.value);
      document.getElementById('panel-pan-x-val').textContent = `${e.target.value}%`;
      redraw();
    });
  }

  const panY = document.getElementById('panel-pan-y');
  if (panY) {
    panY.addEventListener('input', (e) => {
      if (!state.panels[activePanelIndex]) state.panels[activePanelIndex] = {};
      state.panels[activePanelIndex].panY = Number(e.target.value);
      document.getElementById('panel-pan-y-val').textContent = `${e.target.value}%`;
      redraw();
    });
  }

  const zoom = document.getElementById('panel-zoom');
  if (zoom) {
    zoom.addEventListener('input', (e) => {
      if (!state.panels[activePanelIndex]) state.panels[activePanelIndex] = {};
      state.panels[activePanelIndex].zoom = Number(e.target.value);
      document.getElementById('panel-zoom-val').textContent = `${e.target.value}%`;
      redraw();
    });
  }

  // Flip buttons
  const btnFlipH = document.getElementById('btn-flip-h');
  if (btnFlipH) {
    btnFlipH.addEventListener('click', () => {
      if (!state.panels[activePanelIndex]) state.panels[activePanelIndex] = {};
      state.panels[activePanelIndex].flipH = !state.panels[activePanelIndex].flipH;
      redraw();
    });
  }

  const btnFlipV = document.getElementById('btn-flip-v');
  if (btnFlipV) {
    btnFlipV.addEventListener('click', () => {
      if (!state.panels[activePanelIndex]) state.panels[activePanelIndex] = {};
      state.panels[activePanelIndex].flipV = !state.panels[activePanelIndex].flipV;
      redraw();
    });
  }

  const btnResetPanel = document.getElementById('btn-reset-panel');
  if (btnResetPanel) {
    btnResetPanel.addEventListener('click', () => {
      if (state.panels[activePanelIndex]) {
        state.panels[activePanelIndex].panX = 0;
        state.panels[activePanelIndex].panY = 0;
        state.panels[activePanelIndex].zoom = 100;
        state.panels[activePanelIndex].flipH = false;
        state.panels[activePanelIndex].flipV = false;
        syncPanelUI();
        redraw();
      }
    });
  }

  // Color grade cards
  document.querySelectorAll('.grade-card').forEach((card) => {
    card.addEventListener('click', () => {
      state.grade = card.dataset.grade;
      syncUI();
      redraw();
    });
  });

  const gi = document.getElementById('grade-intensity');
  if (gi) {
    gi.addEventListener('input', (e) => {
      state.gradeIntensity = Number(e.target.value);
      document.getElementById('grade-intensity-val').textContent = `${e.target.value}%`;
      redraw();
    });
  }

  const grain = document.getElementById('grain-amount');
  if (grain) {
    grain.addEventListener('input', (e) => {
      state.grain = Number(e.target.value);
      document.getElementById('grain-amount-val').textContent = `${e.target.value}%`;
      redraw();
    });
  }

  const vig = document.getElementById('vignette-amount');
  if (vig) {
    vig.addEventListener('input', (e) => {
      state.vignette = Number(e.target.value);
      document.getElementById('vignette-amount-val').textContent = `${e.target.value}%`;
      redraw();
    });
  }

  const sunsetGlow = document.getElementById('sunset-glow-toggle');
  if (sunsetGlow) {
    sunsetGlow.addEventListener('change', (e) => {
      state.sunsetGlow = e.target.checked;
      redraw();
    });
  }

  const halftone = document.getElementById('halftone-toggle');
  if (halftone) {
    halftone.addEventListener('change', (e) => {
      state.halftone = e.target.checked;
      redraw();
    });
  }

  // Typography inputs
  const titleText = document.getElementById('title-text');
  if (titleText) {
    titleText.addEventListener('input', (e) => {
      state.titleText = e.target.value;
      redraw();
    });
  }

  const titleFont = document.getElementById('title-font');
  if (titleFont) {
    titleFont.addEventListener('change', (e) => {
      state.titleFont = e.target.value;
      redraw();
    });
  }

  const titleStyle = document.getElementById('title-style');
  if (titleStyle) {
    titleStyle.addEventListener('change', (e) => {
      state.titleStyle = e.target.value;
      redraw();
    });
  }

  const titleDepth = document.getElementById('title-depth');
  if (titleDepth) {
    titleDepth.addEventListener('input', (e) => {
      state.titleDepth = Number(e.target.value);
      document.getElementById('title-depth-val').textContent = `${e.target.value}px`;
      redraw();
    });
  }

  const subText = document.getElementById('subtitle-text');
  if (subText) {
    subText.addEventListener('input', (e) => {
      state.subtitleText = e.target.value;
      redraw();
    });
  }

  const subFont = document.getElementById('subtitle-font');
  if (subFont) {
    subFont.addEventListener('change', (e) => {
      state.subtitleFont = e.target.value;
      redraw();
    });
  }

  const subColor = document.getElementById('subtitle-color');
  if (subColor) {
    subColor.addEventListener('input', (e) => {
      state.subtitleColor = e.target.value;
      redraw();
    });
  }

  const tagline = document.getElementById('tagline-text');
  if (tagline) {
    tagline.addEventListener('input', (e) => {
      state.taglineText = e.target.value;
      redraw();
    });
  }

  // Emblems & Badges
  const viToggle = document.getElementById('vi-toggle');
  if (viToggle) {
    viToggle.addEventListener('change', (e) => {
      state.viShow = e.target.checked;
      redraw();
    });
  }

  const viPos = document.getElementById('vi-position');
  if (viPos) {
    viPos.addEventListener('change', (e) => {
      state.viPosition = e.target.value;
      redraw();
    });
  }

  const viStyle = document.getElementById('vi-style');
  if (viStyle) {
    viStyle.addEventListener('change', (e) => {
      state.viStyle = e.target.value;
      redraw();
    });
  }

  const badgeToggle = document.getElementById('badge-toggle');
  if (badgeToggle) {
    badgeToggle.addEventListener('change', (e) => {
      state.badgeShow = e.target.checked;
      redraw();
    });
  }

  const badgeRating = document.getElementById('badge-rating');
  if (badgeRating) {
    badgeRating.addEventListener('change', (e) => {
      state.badgeRating = e.target.value;
      redraw();
    });
  }

  const badgeDesc = document.getElementById('badge-desc');
  if (badgeDesc) {
    badgeDesc.addEventListener('input', (e) => {
      state.badgeDesc = e.target.value;
      redraw();
    });
  }

  const barcodeToggle = document.getElementById('barcode-toggle');
  if (barcodeToggle) {
    barcodeToggle.addEventListener('change', (e) => {
      state.barcodeShow = e.target.checked;
      redraw();
    });
  }

  const starsToggle = document.getElementById('stars-toggle');
  if (starsToggle) {
    starsToggle.addEventListener('change', (e) => {
      state.starsShow = e.target.checked;
      redraw();
    });
  }

  // Export buttons
  document.querySelectorAll('.btn-export').forEach((btn) => {
    btn.addEventListener('click', () => {
      const s = btn.dataset.size;
      const ratio = s === '1920x1080' ? '16:9' : s === '1080x1350' ? '4:5' : '1:1';
      exportPNG(ratio);
    });
  });

  const btnExportAll = document.getElementById('btn-export-all');
  if (btnExportAll) btnExportAll.addEventListener('click', exportAllSizes);

  const btnExportQuick = document.getElementById('btn-export-quick');
  if (btnExportQuick) btnExportQuick.addEventListener('click', () => exportPNG());

  // Interactive Canvas Drag-to-Pan
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let initialPanX = 0;
  let initialPanY = 0;

  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    const p = (state.panels && state.panels[activePanelIndex]) || {};
    initialPanX = p.panX || 0;
    initialPanY = p.panY || 0;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (!state.panels[activePanelIndex]) state.panels[activePanelIndex] = {};
    state.panels[activePanelIndex].panX = Math.max(-100, Math.min(100, initialPanX + (dx / 3)));
    state.panels[activePanelIndex].panY = Math.max(-100, Math.min(100, initialPanY + (dy / 3)));

    syncPanelUI();
    redraw();
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Wheel to Zoom
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (!state.panels[activePanelIndex]) state.panels[activePanelIndex] = {};
    const curZoom = state.panels[activePanelIndex].zoom || 100;
    const delta = e.deltaY < 0 ? 5 : -5;
    state.panels[activePanelIndex].zoom = Math.max(50, Math.min(300, curZoom + delta));
    syncPanelUI();
    redraw();
  });
}

// Initialization
(async () => {
  await preloadSamples();
  setupEvents();
  syncUI();

  const shot = new URLSearchParams(location.search).get('shot');
  if (shot) {
    runShot(shot, new URLSearchParams(location.search), async ({ presetName, layout, ratio, title, subtitle, photo }) => {
      if (presetName && PRESETS[presetName]) {
        state = JSON.parse(JSON.stringify(PRESETS[presetName]));
      }
      if (layout) state.layout = layout;
      if (ratio) state.ratio = ratio;
      if (title) state.titleText = title;
      if (subtitle) state.subtitleText = subtitle;
      if (photo && state.panels[0]) {
        state.panels[0].sample = photo;
      }
      syncUI();
      redraw();
    });
  } else {
    redraw();
  }
})();
