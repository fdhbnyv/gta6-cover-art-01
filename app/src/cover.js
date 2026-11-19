// Master Cover Art Rendering Pipeline
// Coordinates layouts, image rendering, color grading, typography, and vector badges

import { getLayoutPanels, drawLayoutBorders } from './layouts.js';
import { applyColorGrade, drawSunsetHorizonGlow, drawVignette, drawFilmGrain, drawHalftone } from './filters.js';
import { drawTitle, drawSubtitle, drawTagline } from './typography.js';
import { drawRomanVI, drawParodyBadge, drawBarcode, drawHeatStars } from './emblems.js';

/** Sets canvas dimensions for requested aspect ratio */
export function setCanvasAspectRatio(canvas, ratio) {
  let w = 1080;
  let h = 1080;
  if (ratio === '4:5') {
    w = 1080;
    h = 1350;
  } else if (ratio === '16:9') {
    w = 1920;
    h = 1080;
  }
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
  return { w, h };
}

/** Master render function */
export function drawCover(canvas, state, loadedImages) {
  const { w, h } = setCanvasAspectRatio(canvas, state.ratio);
  const ctx = canvas.getContext('2d');

  // 1. Dark base background
  ctx.fillStyle = '#08040f';
  ctx.fillRect(0, 0, w, h);

  // 2. Render Layout Panels & Photos
  const panels = getLayoutPanels(state.layout, w, h);

  panels.forEach((panel, idx) => {
    const pState = (state.panels && state.panels[idx]) || {};
    const imgKey = pState.customUrl ? `custom_${idx}` : (pState.sample || 'boulevard');
    const img = loadedImages[imgKey] || loadedImages['boulevard'];

    ctx.save();
    panel.clip(ctx);

    if (img && img.naturalWidth) {
      // Calculate scaling to cover panel bounds
      const bounds = panel.bounds;
      const zoom = (pState.zoom || 100) / 100;
      const baseScale = Math.max(bounds.w / img.naturalWidth, bounds.h / img.naturalHeight);
      const scale = baseScale * zoom;

      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;

      const panXOffset = ((pState.panX || 0) / 100) * (bounds.w * 0.5);
      const panYOffset = ((pState.panY || 0) / 100) * (bounds.h * 0.5);

      const cx = bounds.x + bounds.w / 2 + panXOffset;
      const cy = bounds.y + bounds.h / 2 + panYOffset;

      ctx.save();
      ctx.translate(cx, cy);

      if (pState.flipH) ctx.scale(-1, 1);
      if (pState.flipV) ctx.scale(1, -1);

      ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
      ctx.restore();
    } else {
      // Fallback placeholder pattern
      ctx.fillStyle = '#1c102a';
      ctx.fillRect(panel.bounds.x, panel.bounds.y, panel.bounds.w, panel.bounds.h);
    }

    ctx.restore();
  });

  // 3. Comic Panel Inking Dividers
  const bw = state.borderWidth != null ? state.borderWidth : 10;
  const bc = state.borderColor || '#050308';
  drawLayoutBorders(ctx, w, h, state.layout, bw, bc);

  // 4. Color Grading
  applyColorGrade(ctx, w, h, state.grade || 'vice-sunset', state.gradeIntensity != null ? state.gradeIntensity : 85);

  // 5. Cinematic Overlays
  if (state.sunsetGlow) {
    drawSunsetHorizonGlow(ctx, w, h);
  }

  if (state.halftone) {
    drawHalftone(ctx, w, h);
  }

  if (state.grain > 0) {
    drawFilmGrain(ctx, w, h, state.grain);
  }

  if (state.vignette > 0) {
    drawVignette(ctx, w, h, state.vignette);
  }

  // 6. Wanted Heat Stars (Top-Left)
  if (state.starsShow) {
    const starSize = Math.round(w * 0.024);
    drawHeatStars(ctx, Math.round(w * 0.04), Math.round(h * 0.05), starSize, 5);
  }

  // 7. Roman "VI" Emblem
  if (state.viShow) {
    let viX, viY, viSize;
    if (state.viPosition === 'center') {
      viX = w / 2;
      viY = h * 0.38;
      viSize = Math.round(Math.min(w, h) * 0.32);
    } else if (state.viPosition === 'bottom-right') {
      viX = w - Math.round(w * 0.14);
      viY = h - Math.round(h * 0.22);
      viSize = Math.round(Math.min(w, h) * 0.20);
    } else {
      // Default: top-right
      viX = w - Math.round(w * 0.14);
      viY = Math.round(h * 0.14);
      viSize = Math.round(Math.min(w, h) * 0.22);
    }
    drawRomanVI(ctx, viX, viY, viSize, state.viStyle || 'sunset');
  }

  // 8. Typography: Title, Subtitle, Tagline
  let titleY = Math.round(h * 0.80);
  if (state.ratio === '16:9') {
    titleY = Math.round(h * 0.82);
  } else if (state.ratio === '4:5') {
    titleY = Math.round(h * 0.81);
  }

  let titleSize = Math.round(w * 0.125);
  ctx.font = `900 ${titleSize}px '${state.titleFont || 'Anton'}', sans-serif`;
  while (ctx.measureText((state.titleText || '').toUpperCase()).width > w * 0.86 && titleSize > 24) {
    titleSize -= 4;
    ctx.font = `900 ${titleSize}px '${state.titleFont || 'Anton'}', sans-serif`;
  }

  // Tagline Ribbon (above title)
  if (state.taglineText) {
    drawTagline(ctx, state.taglineText, w / 2, titleY - titleSize * 0.68, Math.round(titleSize * 0.18));
  }

  // Main 3D Title
  drawTitle(
    ctx,
    state.titleText || 'GRAND THEFT',
    state.titleFont || 'Anton',
    w / 2,
    titleY,
    titleSize,
    state.titleStyle || 'sunset',
    state.titleDepth != null ? state.titleDepth : 12,
  );

  // Subtitle / Script Signature (below title)
  if (state.subtitleText) {
    const subSize = Math.round(titleSize * 0.62);
    drawSubtitle(
      ctx,
      state.subtitleText,
      state.subtitleFont || 'Pacifico',
      w / 2,
      titleY + titleSize * 0.48,
      subSize,
      state.subtitleColor || '#ff2a8d',
    );
  }

  // 9. Mature Parody Badge (Bottom-Left)
  if (state.badgeShow) {
    const badgeW = Math.round(w * 0.24);
    const badgeH = Math.round(badgeW * 0.42);
    const badgeX = Math.round(w * 0.035);
    const badgeY = h - badgeH - Math.round(h * 0.035);
    drawParodyBadge(ctx, badgeX, badgeY, badgeW, badgeH, state.badgeRating || 'VC', state.badgeDesc);
  }

  // 10. Authentic Retail Barcode (Bottom-Right)
  if (state.barcodeShow) {
    const codeW = Math.round(w * 0.18);
    const codeH = Math.round(codeW * 0.25);
    const codeX = w - codeW - Math.round(w * 0.035);
    const codeY = h - codeH - Math.round(h * 0.035);
    drawBarcode(ctx, codeX, codeY, codeW, codeH);
  }

  // 11. Thin fine inner poster frame
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 2;
  ctx.strokeRect(16, 16, w - 32, h - 32);
  ctx.restore();
}