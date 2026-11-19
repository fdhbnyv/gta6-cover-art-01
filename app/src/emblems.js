// 100% Original Custom Vector Artwork: Roman "VI" Emblem, Mature Parody Badge & Retail Barcode
// Strictly original: NO Rockstar Games trademarks, logos, or copyrighted assets.

/** Draws stylized 3D beveled Roman "VI" emblem with palm silhouette & neon glow */
export function drawRomanVI(ctx, cx, cy, size, style = 'sunset') {
  ctx.save();
  ctx.translate(cx, cy);

  // Neon Back-Glow
  const glowColor = style === 'neon' ? '#00f2fe' : style === 'gold' ? '#ffde59' : '#ff2a8d';
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = size * 0.25;

  // Draw tropical palm tree silhouette behind the emblem
  drawPalmSilhouette(ctx, 0, size * 0.1, size * 0.85);

  // Gradient finishes
  let fillMain, fillHighlight, fillShadow;
  if (style === 'gold') {
    fillMain = '#ffb703';
    fillHighlight = '#fff2b2';
    fillShadow = '#b07200';
  } else if (style === 'neon') {
    fillMain = '#00f2fe';
    fillHighlight = '#e0ffff';
    fillShadow = '#095e79';
  } else {
    // Sunset Metallic
    const sunsetGrad = ctx.createLinearGradient(0, -size / 2, 0, size / 2);
    sunsetGrad.addColorStop(0.0, '#ffe600');
    sunsetGrad.addColorStop(0.4, '#ff2a8d');
    sunsetGrad.addColorStop(0.8, '#a811da');
    sunsetGrad.addColorStop(1.0, '#3a0ca3');
    fillMain = sunsetGrad;
    fillHighlight = '#ffffff';
    fillShadow = '#1b0826';
  }

  // Scale factor for glyphs
  const s = size * 0.01;

  // Outer Stroke / Silhouette
  ctx.lineWidth = s * 6;
  ctx.strokeStyle = '#05020a';
  ctx.lineJoin = 'miter';
  ctx.miterLimit = 3;

  // Draw Roman 'V' (centered around x = -18 * s)
  ctx.save();
  ctx.translate(-18 * s, 0);
  drawLetterV(ctx, s, fillMain, fillHighlight, fillShadow);
  ctx.restore();

  // Draw Roman 'I' (centered around x = 24 * s)
  ctx.save();
  ctx.translate(24 * s, 0);
  drawLetterI(ctx, s, fillMain, fillHighlight, fillShadow);
  ctx.restore();

  ctx.restore();
}

/** Draws custom geometric Roman numeral V */
function drawLetterV(ctx, s, fillMain, fillHighlight, fillShadow) {
  // Outline of V
  ctx.beginPath();
  ctx.moveTo(-32 * s, -40 * s); // Top-left outer
  ctx.lineTo(-12 * s, -40 * s); // Top-left inner
  ctx.lineTo(0, 30 * s);        // Bottom inner apex
  ctx.lineTo(12 * s, -40 * s);  // Top-right inner
  ctx.lineTo(32 * s, -40 * s);  // Top-right outer
  ctx.lineTo(8 * s, 42 * s);    // Bottom right outer
  ctx.lineTo(-8 * s, 42 * s);   // Bottom left outer
  ctx.closePath();

  ctx.stroke();
  ctx.fillStyle = fillMain;
  ctx.fill();

  // Highlight facet on left arm
  ctx.fillStyle = fillHighlight;
  ctx.beginPath();
  ctx.moveTo(-32 * s, -40 * s);
  ctx.lineTo(-24 * s, -40 * s);
  ctx.lineTo(-4 * s, 36 * s);
  ctx.lineTo(-8 * s, 42 * s);
  ctx.closePath();
  ctx.globalAlpha = 0.45;
  ctx.fill();

  // Shadow facet on right inner edge
  ctx.fillStyle = fillShadow;
  ctx.beginPath();
  ctx.moveTo(0, 30 * s);
  ctx.lineTo(12 * s, -40 * s);
  ctx.lineTo(18 * s, -40 * s);
  ctx.lineTo(4 * s, 36 * s);
  ctx.closePath();
  ctx.globalAlpha = 0.55;
  ctx.fill();
  ctx.globalAlpha = 1.0;
}

/** Draws custom geometric Roman numeral I */
function drawLetterI(ctx, s, fillMain, fillHighlight, fillShadow) {
  // Outline of I with classic serif heads
  ctx.beginPath();
  ctx.moveTo(-16 * s, -40 * s);
  ctx.lineTo(16 * s, -40 * s);
  ctx.lineTo(16 * s, -30 * s);
  ctx.lineTo(6 * s, -30 * s);
  ctx.lineTo(6 * s, 30 * s);
  ctx.lineTo(16 * s, 30 * s);
  ctx.lineTo(16 * s, 42 * s);
  ctx.lineTo(-16 * s, 42 * s);
  ctx.lineTo(-16 * s, 30 * s);
  ctx.lineTo(-6 * s, 30 * s);
  ctx.lineTo(-6 * s, -30 * s);
  ctx.lineTo(-16 * s, -30 * s);
  ctx.closePath();

  ctx.stroke();
  ctx.fillStyle = fillMain;
  ctx.fill();

  // Highlight facet along left stem
  ctx.fillStyle = fillHighlight;
  ctx.beginPath();
  ctx.moveTo(-6 * s, -30 * s);
  ctx.lineTo(0, -30 * s);
  ctx.lineTo(0, 30 * s);
  ctx.lineTo(-6 * s, 30 * s);
  ctx.closePath();
  ctx.globalAlpha = 0.45;
  ctx.fill();

  // Shadow facet along right stem
  ctx.fillStyle = fillShadow;
  ctx.beginPath();
  ctx.moveTo(0, -30 * s);
  ctx.lineTo(6 * s, -30 * s);
  ctx.lineTo(6 * s, 30 * s);
  ctx.lineTo(0, 30 * s);
  ctx.closePath();
  ctx.globalAlpha = 0.5;
  ctx.fill();
  ctx.globalAlpha = 1.0;
}

/** Draws tropical palm tree silhouette */
function drawPalmSilhouette(ctx, x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = 'rgba(10, 4, 18, 0.85)';

  // Trunk
  ctx.beginPath();
  ctx.moveTo(-size * 0.03, size * 0.45);
  ctx.quadraticCurveTo(size * 0.08, 0, 0, -size * 0.35);
  ctx.quadraticCurveTo(size * 0.12, 0, size * 0.03, size * 0.45);
  ctx.closePath();
  ctx.fill();

  // Palm Fronds
  const frondCount = 7;
  for (let i = 0; i < frondCount; i++) {
    const angle = (i / (frondCount - 1)) * Math.PI * 0.95 - Math.PI * 0.98;
    ctx.save();
    ctx.translate(0, -size * 0.35);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(size * 0.25, -size * 0.15, size * 0.5, size * 0.1);
    ctx.quadraticCurveTo(size * 0.25, 0, 0, 0);
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

/** Draws the "VC - VICE CERTIFIED" Mature Parody Rating Badge */
export function drawParodyBadge(ctx, x, y, w, h, rating = 'VC', descriptors = '') {
  ctx.save();

  // Outer dark box with rounded corners
  ctx.fillStyle = '#08040d';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.5;

  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 6);
  ctx.fill();
  ctx.stroke();

  // Divider lines
  const leftW = Math.round(w * 0.38);
  ctx.beginPath();
  ctx.moveTo(x + leftW, y);
  ctx.lineTo(x + leftW, y + h);
  ctx.stroke();

  // Big rating letter ("VC" or "M")
  ctx.font = `bold ${Math.round(h * 0.52)}px 'Anton', sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(rating, x + leftW / 2, y + h * 0.44);

  // Subtitle under letter
  ctx.font = `bold ${Math.round(h * 0.16)}px 'Bebas Neue', sans-serif`;
  ctx.fillStyle = '#ff2a8d';
  ctx.fillText('17+', x + leftW / 2, y + h * 0.82);

  // Right side: Header & Descriptors
  const rightX = x + leftW + 8;
  const rightW = w - leftW - 14;

  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.font = `bold ${Math.max(10, Math.round(h * 0.17))}px 'Anton', sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(rating === 'VC' ? 'VICE CERTIFIED' : 'MATURE 17+', rightX, y + 6);

  // Descriptors text wrap
  ctx.font = `${Math.max(9, Math.round(h * 0.12))}px sans-serif`;
  ctx.fillStyle = '#cccccc';

  const descItems = descriptors
    ? descriptors.split(',').map((s) => s.trim())
    : ['Excessive Sunburn', 'Bad Decisions', 'Unregulated Speedboats', 'Synthwave Addiction'];

  let curY = y + 6 + h * 0.22;
  for (let i = 0; i < Math.min(3, descItems.length); i++) {
    ctx.fillText(`• ${descItems[i]}`, rightX, curY);
    curY += h * 0.16;
  }

  // Footer rating line
  ctx.font = `italic ${Math.max(8, Math.round(h * 0.10))}px sans-serif`;
  ctx.fillStyle = '#999999';
  ctx.fillText('VICE RATINGS BOARD', rightX, y + h - h * 0.15);

  ctx.restore();
}

/** Draws authentic game cover barcode */
export function drawBarcode(ctx, x, y, w, h) {
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x, y, w, h);

  ctx.fillStyle = '#05020a';
  // Procedural barcode bars
  const pattern = [3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 2];
  let curX = x + 8;
  const barH = h * 0.72;

  for (let i = 0; i < pattern.length; i++) {
    const barW = pattern[i] * 1.5;
    if (i % 2 === 0) {
      ctx.fillRect(curX, y + 4, barW, barH);
    }
    curX += barW + 2;
  }

  // Numbers beneath bars
  ctx.font = `bold ${Math.round(h * 0.18)}px monospace`;
  ctx.textAlign = 'center';
  ctx.fillText('8 61986 20261 4 • LEONIDA', x + w / 2, y + h - 3);
  ctx.restore();
}

/** Draws Wanted Level 5-Star Heat Meter */
export function drawHeatStars(ctx, x, y, size, count = 5) {
  ctx.save();
  for (let i = 0; i < 5; i++) {
    const starX = x + i * (size * 1.25);
    drawStar(ctx, starX, y, size * 0.5, size * 0.22, 5, i < count ? '#ffbe0b' : '#332244');
  }
  ctx.restore();
}

function drawStar(ctx, cx, cy, outerR, innerR, points, fill) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / points;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerR);
  for (let i = 0; i < points; i++) {
    x = cx + Math.cos(rot) * outerR;
    y = cy + Math.sin(rot) * outerR;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerR;
    y = cy + Math.sin(rot) * innerR;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerR);
  ctx.closePath();

  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = '#08040d';
  ctx.lineWidth = 2;
  ctx.stroke();
}
