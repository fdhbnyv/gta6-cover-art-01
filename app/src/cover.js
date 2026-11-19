/**
 * GTA 6 Cover Art Studio - Core Canvas Rendering Engine
 * Composites multi-panel layouts, images, retro shaders, 3D typography, and vector badges.
 */

import { LAYOUT_DEFINITIONS, clipToPolygon, drawGutterBorders } from "./layouts.js";
import { applyColorGrade, applyFilmGrain, applyRadialVignette, applyHalftone } from "./filters.js";
import { drawExtrudedTitle, drawScriptSubtitle } from "./typography.js";
import { drawRomanVI, drawMatureBadge, drawWantedMeter, drawBarcode } from "./emblems.js";

/**
 * Calculates canvas pixel dimensions for a given aspect ratio and scale multiplier
 */
export function getDimensionsForAspect(aspect, multiplier = 1.0) {
  switch (aspect) {
    case "1-1":
      return { width: Math.round(1080 * multiplier), height: Math.round(1080 * multiplier) };
    case "9-16":
      return { width: Math.round(1080 * multiplier), height: Math.round(1920 * multiplier) };
    case "16-9":
    default:
      return { width: Math.round(1920 * multiplier), height: Math.round(1080 * multiplier) };
  }
}

/**
 * Renders fallback procedural graphic if image asset is loading or missing
 */
function drawProceduralFallback(ctx, poly, index) {
  // Compute polygon bounding box
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [x, y] of poly) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  const w = maxX - minX;
  const h = maxY - minY;

  // Vibrant synthwave gradient backgrounds
  const grad = ctx.createLinearGradient(minX, minY, minX, maxY);
  const colorSets = [
    ["#ff2a85", "#7209b7", "#150b2e"],
    ["#00e5ff", "#0077b6", "#03045e"],
    ["#ff7700", "#e63946", "#3a0ca3"],
    ["#9d4edd", "#ff007f", "#240046"],
    ["#f4c430", "#e76f51", "#264653"]
  ];
  const set = colorSets[index % colorSets.length];
  grad.addColorStop(0, set[0]);
  grad.addColorStop(0.5, set[1]);
  grad.addColorStop(1, set[2]);

  ctx.fillStyle = grad;
  ctx.fillRect(minX, minY, w, h);

  // Stylized sun/horizon disk
  ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
  ctx.beginPath();
  ctx.arc(minX + w * 0.5, minY + h * 0.55, Math.min(w, h) * 0.3, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Master Cover Rendering Function
 */
export function renderCover(canvas, state, imageCache = {}) {
  const { width, height } = getDimensionsForAspect(state.aspect, state.resolutionScale || 1.0);

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return;

  // 1. Clear backdrop
  ctx.fillStyle = "#0c0a14";
  ctx.fillRect(0, 0, width, height);

  // 2. Resolve layout & panels
  const layoutDef = LAYOUT_DEFINITIONS[state.layout] || LAYOUT_DEFINITIONS.quad;
  const panels = layoutDef.getPolygons(width, height, 12);

  // 3. Render individual panel images with transform matrices
  panels.forEach((panel, idx) => {
    const slotState = (state.slots && state.slots[idx]) || {
      sample: `sample-${(idx % 4) + 1}.jpg`,
      zoom: 1.0,
      panX: 0,
      panY: 0
    };

    const poly = panel.polygon;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const [x, y] of poly) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    const boxW = maxX - minX;
    const boxH = maxY - minY;

    ctx.save();
    clipToPolygon(ctx, poly);

    const imgKey = slotState.customDataUrl || slotState.sample || `sample-${(idx % 4) + 1}.jpg`;
    const img = imageCache[imgKey];

    if (img && img.complete && img.naturalWidth > 0) {
      // Calculate aspect-fill scale
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const boxRatio = boxW / boxH;
      let drawW, drawH;

      if (boxRatio > imgRatio) {
        drawW = boxW;
        drawH = boxW / imgRatio;
      } else {
        drawH = boxH;
        drawW = boxH * imgRatio;
      }

      const zoom = slotState.zoom || 1.0;
      drawW *= zoom;
      drawH *= zoom;

      const drawX = minX + (boxW - drawW) / 2 + (slotState.panX || 0);
      const drawY = minY + (boxH - drawH) / 2 + (slotState.panY || 0);

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    } else {
      drawProceduralFallback(ctx, poly, idx);
    }

    ctx.restore();
  });

  // 4. Color grading shader pass
  applyColorGrade(ctx, width, height, state.filter, state.filterIntensity);

  // 5. Procedural film grain noise
  if (state.grain > 0) {
    applyFilmGrain(ctx, width, height, state.grain);
  }

  // 6. Halftone comic printing screen
  if (state.halftone > 0) {
    applyHalftone(ctx, width, height, state.halftone);
  }

  // 7. Comic book border gutters
  drawGutterBorders(ctx, state.layout, width, height, 10, "#08060f");

  // 8. Radial vignette overlay
  if (state.vignette > 0) {
    applyRadialVignette(ctx, width, height, state.vignette);
  }

  // 9. Typography and Emblems Layer
  const isPortrait = state.aspect === "9-16";
  const isSquare = state.aspect === "1-1";

  // Calculate proportional title sizing
  const titleFontSize = Math.round(width * (isPortrait ? 0.088 : isSquare ? 0.075 : 0.065));
  const titleY = Math.round(height * (isPortrait ? 0.12 : isSquare ? 0.14 : 0.15));

  // Main 3D Title
  if (state.titleTop) {
    drawExtrudedTitle(ctx, state.titleTop, width / 2, titleY, {
      fontSize: titleFontSize,
      depth: Math.round(titleFontSize * 0.18),
      faceGradient: ["#ffffff", "#ffe6f0", "#ff2a85", "#7209b7"],
      strokeColor: "#000000",
      strokeWidth: Math.round(titleFontSize * 0.14)
    });
  }

  // Script Subtitle ("Vice City")
  if (state.titleSub) {
    const scriptFontSize = Math.round(titleFontSize * 0.85);
    const scriptY = titleY + Math.round(titleFontSize * 0.55);
    drawScriptSubtitle(ctx, state.titleSub, width / 2, scriptY, {
      fontSize: scriptFontSize,
      rotation: -0.11,
      glowColor: "#ff2a85"
    });
  }

  // Roman VI 3D Emblem
  if (state.showViEmblem) {
    const emblemScale = (width / 1920) * (isPortrait ? 1.3 : isSquare ? 1.15 : 1.0);
    const emblemX = width * (isPortrait ? 0.5 : 0.85);
    const emblemY = height * (isPortrait ? 0.26 : 0.18);
    drawRomanVI(ctx, emblemX, emblemY, emblemScale, state.viStyle || "vice-gradient");
  }

  // Satirical Mature 17+ Badge
  if (state.showMatureBadge) {
    const badgeW = Math.round(width * 0.055 * (isPortrait ? 1.6 : 1.0));
    const badgeH = Math.round(badgeW * 1.36);
    const badgeMargin = Math.round(width * 0.022);
    drawMatureBadge(ctx, badgeMargin, height - badgeH - badgeMargin, badgeW, badgeH);
  }

  // 5-Star Wanted Level Meter
  if (state.showWantedMeter) {
    const starSize = Math.round(width * 0.012 * (isPortrait ? 1.8 : 1.0));
    const wantedX = width * (isPortrait ? 0.52 : 0.72);
    const wantedY = height - Math.round(height * 0.045);
    drawWantedMeter(ctx, wantedX, wantedY, 5, state.wantedStars || 5, starSize);
  }

  // Commercial Barcode
  if (state.showBarcode) {
    const barW = Math.round(width * 0.085 * (isPortrait ? 1.5 : 1.0));
    const barH = Math.round(barW * 0.28);
    const barMargin = Math.round(width * 0.022);
    drawBarcode(ctx, width - barW - barMargin, height - barH - barMargin, barW, barH);
  }
}
