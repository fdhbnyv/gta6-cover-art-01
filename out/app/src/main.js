/**
 * GTA 6 Cover Art Studio - Main Client Application Controller
 * Orchestrates reactive state, canvas render passes, and high-DPI export pipelines.
 */

import { PRESETS, getPreset } from "./presets.js";
import { LAYOUT_DEFINITIONS } from "./layouts.js";
import { renderCover, getDimensionsForAspect } from "./cover.js";
import { parseUrlState } from "./shots.js";

// Global Application State Store
const state = {
  ...getPreset("quad-comic"),
  resolutionScale: 1.0
};

// Apply URL search query parameter overrides if present
const urlOverrides = parseUrlState();
Object.assign(state, urlOverrides);

// In-Memory Image Cache
const imageCache = {};

// Preload standard sample character images
function preloadSampleImages() {
  const samples = ["sample-1.jpg", "sample-2.jpg", "sample-3.jpg", "sample-4.jpg"];
  return Promise.all(
    samples.map((name) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          imageCache[name] = img;
          resolve(img);
        };
        img.onerror = () => {
          // Resolve anyway so procedural fallbacks can render without blocking
          resolve(null);
        };
        img.src = `./samples/${name}`;
      });
    })
  );
}

// Canvas & DOM Element References
const canvas = document.getElementById("cover-canvas");
const renderIndicator = document.getElementById("render-indicator");
const hudAspect = document.getElementById("hud-aspect");
const hudLayout = document.getElementById("hud-layout");
const hudFilter = document.getElementById("hud-filter");

let renderScheduled = false;

/**
 * Triggers a debounced canvas render
 */
export function requestRender() {
  if (renderScheduled) return;
  renderScheduled = true;

  if (renderIndicator) renderIndicator.classList.remove("hidden");

  requestAnimationFrame(() => {
    renderCover(canvas, state, imageCache);
    updateHud();
    renderScheduled = false;
    if (renderIndicator) renderIndicator.classList.add("hidden");
    window.dispatchEvent(new CustomEvent("cover-art-ready", { detail: { state } }));
  });
}

/**
 * Updates Viewport HUD overlay badges
 */
function updateHud() {
  const { width, height } = getDimensionsForAspect(state.aspect);
  if (hudAspect) {
    const aspectNames = { "16-9": "16:9 Cinematic", "1-1": "1:1 Square Album", "9-16": "9:16 Story Poster" };
    hudAspect.textContent = `${aspectNames[state.aspect] || state.aspect} (${width} × ${height})`;
  }
  if (hudLayout) {
    const layoutObj = LAYOUT_DEFINITIONS[state.layout];
    hudLayout.textContent = `Layout: ${layoutObj ? layoutObj.name : state.layout}`;
  }
  if (hudFilter) {
    hudFilter.textContent = `Shader: ${state.filter} (${Math.round(state.filterIntensity * 100)}%)`;
  }
}

/**
 * Rebuilds Panel Slot Controls when layout changes
 */
function rebuildSlotControls() {
  const container = document.getElementById("slot-controls-container");
  if (!container) return;

  container.innerHTML = "";
  const layout = LAYOUT_DEFINITIONS[state.layout] || LAYOUT_DEFINITIONS.quad;

  // Ensure state.slots has entries for each slot
  if (!state.slots) state.slots = [];
  while (state.slots.length < layout.slotsCount) {
    const idx = state.slots.length;
    state.slots.push({
      id: idx,
      sample: `sample-${(idx % 4) + 1}.jpg`,
      zoom: 1.0,
      panX: 0,
      panY: 0
    });
  }

  layout.slots.forEach((slotDef, idx) => {
    const slotState = state.slots[idx] || (state.slots[idx] = {
      id: idx,
      sample: `sample-${(idx % 4) + 1}.jpg`,
      zoom: 1.0,
      panX: 0,
      panY: 0
    });

    const card = document.createElement("div");
    card.className = "slot-item-card";

    card.innerHTML = `
      <div class="slot-item-header">
        <span class="slot-name">Slot ${idx + 1}: ${slotDef.name}</span>
        <label class="slot-file-btn">
          Upload
          <input type="file" accept="image/*" class="sr-only slot-file-input" data-slot="${idx}">
        </label>
      </div>
      <div class="slider-control">
        <div class="slider-label-row">
          <label>Zoom</label>
          <span class="slider-val zoom-val">${Math.round(slotState.zoom * 100)}%</span>
        </div>
        <input type="range" min="50" max="250" value="${Math.round(slotState.zoom * 100)}" class="ui-slider slot-zoom-slider" data-slot="${idx}">
      </div>
      <div class="slider-control">
        <div class="slider-label-row">
          <label>Pan Offset X</label>
          <span class="slider-val panx-val">${slotState.panX}px</span>
        </div>
        <input type="range" min="-300" max="300" value="${slotState.panX}" class="ui-slider slot-panx-slider" data-slot="${idx}">
      </div>
    `;

    // File Upload Handler
    const fileInput = card.querySelector(".slot-file-input");
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (rev) => {
          const img = new Image();
          img.onload = () => {
            const dataUrl = rev.target.result;
            imageCache[dataUrl] = img;
            slotState.customDataUrl = dataUrl;
            requestRender();
          };
          img.src = rev.target.result;
        };
        reader.readAsDataURL(file);
      }
    });

    // Zoom Slider Handler
    const zoomSlider = card.querySelector(".slot-zoom-slider");
    zoomSlider.addEventListener("input", (e) => {
      const val = parseInt(e.target.value, 10);
      slotState.zoom = val / 100;
      card.querySelector(".zoom-val").textContent = `${val}%`;
      requestRender();
    });

    // Pan X Slider Handler
    const panxSlider = card.querySelector(".slot-panx-slider");
    panxSlider.addEventListener("input", (e) => {
      const val = parseInt(e.target.value, 10);
      slotState.panX = val;
      card.querySelector(".panx-val").textContent = `${val}px`;
      requestRender();
    });

    container.appendChild(card);
  });
}

/**
 * Downloads canvas as image file with memory cleanup and revocation
 */
function downloadArtwork(filename, scale = 1.0, mime = "image/png", quality = 1.0) {
  console.debug(`[export] Rendering artwork export: ${filename} at ${scale}x scale (${mime})`);
  const exportCanvas = document.createElement("canvas");
  const exportState = { ...state, resolutionScale: scale };
  renderCover(exportCanvas, exportState, imageCache);

  exportCanvas.toBlob(
    (blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    mime,
    quality
  );
}

/**
 * Initializes all sidebar controls and event listeners
 */
function initControls() {
  // Preset Select
  const presetSelect = document.getElementById("preset-select");
  if (presetSelect) {
    presetSelect.value = state.preset || "quad-comic";
    presetSelect.addEventListener("change", (e) => {
      const newPreset = getPreset(e.target.value);
      Object.assign(state, newPreset);
      syncControlsToState();
      rebuildSlotControls();
      requestRender();
    });
  }

  // Aspect Ratio Buttons
  const ratioPills = document.querySelectorAll(".ratio-pill");
  ratioPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      ratioPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      state.aspect = pill.getAttribute("data-aspect");
      requestRender();
    });
  });

  // Layout Buttons
  const layoutPills = document.querySelectorAll(".layout-pill");
  layoutPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      layoutPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      state.layout = pill.getAttribute("data-layout");
      rebuildSlotControls();
      requestRender();
    });
  });

  // Filter Buttons
  const filterPills = document.querySelectorAll(".filter-pill");
  filterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      filterPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      state.filter = pill.getAttribute("data-filter");
      requestRender();
    });
  });

  // Shader Sliders
  bindSlider("filter-intensity", "filter-intensity-val", (v) => {
    state.filterIntensity = v / 100;
  }, "%");

  bindSlider("grain-intensity", "grain-intensity-val", (v) => {
    state.grain = v / 100;
  }, "%");

  bindSlider("vignette-intensity", "vignette-intensity-val", (v) => {
    state.vignette = v / 100;
  }, "%");

  bindSlider("halftone-intensity", "halftone-intensity-val", (v) => {
    state.halftone = v / 100;
  }, "%");

  // Typography Inputs
  bindInput("title-text-top", (val) => { state.titleTop = val; });
  bindInput("title-text-sub", (val) => { state.titleSub = val; });

  // Emblems & Badges Toggles
  bindCheckbox("show-vi-emblem", (checked) => { state.showViEmblem = checked; });
  bindCheckbox("show-mature-badge", (checked) => { state.showMatureBadge = checked; });
  bindCheckbox("show-wanted-meter", (checked) => { state.showWantedMeter = checked; });
  bindCheckbox("show-barcode", (checked) => { state.showBarcode = checked; });

  const viStyleSelect = document.getElementById("vi-style-select");
  if (viStyleSelect) {
    viStyleSelect.addEventListener("change", (e) => {
      state.viStyle = e.target.value;
      requestRender();
    });
  }

  bindSlider("wanted-stars", "wanted-stars-val", (v) => {
    state.wantedStars = v;
  }, " Stars");

  // Export Buttons
  document.getElementById("btn-quick-export")?.addEventListener("click", () => {
    downloadArtwork("gta6-cover-art.png", 1.0);
  });

  document.getElementById("btn-export-standard")?.addEventListener("click", () => {
    downloadArtwork("gta6-cover-art.png", 1.0);
  });

  document.getElementById("btn-export-4k")?.addEventListener("click", () => {
    downloadArtwork("gta6-cover-art-master-4k.png", 2.0);
  });

  document.getElementById("btn-export-jpeg")?.addEventListener("click", () => {
    downloadArtwork("gta6-cover-art.jpg", 1.0, "image/jpeg", 0.92);
  });

  document.getElementById("btn-reset-defaults")?.addEventListener("click", () => {
    Object.assign(state, getPreset("quad-comic"));
    syncControlsToState();
    rebuildSlotControls();
    requestRender();
  });
}

function bindSlider(id, valId, setter, suffix = "") {
  const el = document.getElementById(id);
  const valEl = document.getElementById(valId);
  if (!el) return;
  el.addEventListener("input", (e) => {
    const num = parseInt(e.target.value, 10);
    setter(num);
    if (valEl) valEl.textContent = `${num}${suffix}`;
    requestRender();
  });
}

function bindInput(id, setter) {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener("input", (e) => {
    setter(e.target.value);
    requestRender();
  });
}

function bindCheckbox(id, setter) {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener("change", (e) => {
    setter(e.target.checked);
    requestRender();
  });
}

/**
 * Synchronizes DOM form inputs with state
 */
function syncControlsToState() {
  document.querySelectorAll(".ratio-pill").forEach((p) => {
    p.classList.toggle("active", p.getAttribute("data-aspect") === state.aspect);
  });

  document.querySelectorAll(".layout-pill").forEach((p) => {
    p.classList.toggle("active", p.getAttribute("data-layout") === state.layout);
  });

  document.querySelectorAll(".filter-pill").forEach((p) => {
    p.classList.toggle("active", p.getAttribute("data-filter") === state.filter);
  });

  setVal("filter-intensity", "filter-intensity-val", Math.round(state.filterIntensity * 100), "%");
  setVal("grain-intensity", "grain-intensity-val", Math.round(state.grain * 100), "%");
  setVal("vignette-intensity", "vignette-intensity-val", Math.round(state.vignette * 100), "%");
  setVal("halftone-intensity", "halftone-intensity-val", Math.round(state.halftone * 100), "%");

  setText("title-text-top", state.titleTop);
  setText("title-text-sub", state.titleSub);

  setCheck("show-vi-emblem", state.showViEmblem);
  setCheck("show-mature-badge", state.showMatureBadge);
  setCheck("show-wanted-meter", state.showWantedMeter);
  setCheck("show-barcode", state.showBarcode);
}

function setVal(id, valId, val, suffix = "") {
  const el = document.getElementById(id);
  const valEl = document.getElementById(valId);
  if (el) el.value = val;
  if (valEl) valEl.textContent = `${val}${suffix}`;
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el && text !== undefined) el.value = text;
}

function setCheck(id, checked) {
  const el = document.getElementById(id);
  if (el && checked !== undefined) el.checked = checked;
}

// Bootstrap Application
async function initApp() {
  initControls();
  rebuildSlotControls();
  syncControlsToState();
  await preloadSampleImages();
  requestRender();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
