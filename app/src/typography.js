// Typography engine: 3D Beveled Titles, Outlines, Gradients, and Neon Script Subtitles

/** Renders bold 3D beveled title lettering with multi-layer extrusion and stroke */
export function drawTitle(ctx, text, fontName, cx, cy, size, style = 'sunset', depth = 12) {
  if (!text) return;
  const upper = text.trim().toUpperCase();

  ctx.save();
  ctx.font = `900 ${size}px '${fontName}', sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // 1. 3D Bevel / Extrusion layers (drawn from back to front)
  if (depth > 0) {
    ctx.fillStyle = '#06020c';
    ctx.strokeStyle = '#06020c';
    ctx.lineWidth = size * 0.12;
    ctx.lineJoin = 'miter';
    ctx.miterLimit = 3;

    for (let d = depth; d >= 1; d -= 1.5) {
      ctx.strokeText(upper, cx + d * 0.7, cy + d);
      ctx.fillText(upper, cx + d * 0.7, cy + d);
    }
  }

  // 2. Thick black comic outline
  ctx.strokeStyle = '#05020a';
  ctx.lineWidth = size * 0.14;
  ctx.lineJoin = 'miter';
  ctx.miterLimit = 4;
  ctx.strokeText(upper, cx, cy);

  // 3. Fill Gradient
  let fillStyle;
  if (style === 'chrome') {
    const chrome = ctx.createLinearGradient(0, cy - size * 0.5, 0, cy + size * 0.5);
    chrome.addColorStop(0.0, '#ffffff');
    chrome.addColorStop(0.45, '#a1c4fd');
    chrome.addColorStop(0.50, '#1a2a6c');
    chrome.addColorStop(0.55, '#c2e9fb');
    chrome.addColorStop(1.0, '#ffffff');
    fillStyle = chrome;
  } else if (style === 'comic') {
    fillStyle = '#ffffff';
  } else if (style === 'neon') {
    ctx.shadowColor = '#ff007f';
    ctx.shadowBlur = size * 0.35;
    fillStyle = '#ffffff';
  } else {
    // Default: Sunset Gradient
    const sunset = ctx.createLinearGradient(0, cy - size * 0.55, 0, cy + size * 0.55);
    sunset.addColorStop(0.0, '#fff066');
    sunset.addColorStop(0.35, '#ff2a8d');
    sunset.addColorStop(0.75, '#b5179e');
    sunset.addColorStop(1.0, '#3a0ca3');
    fillStyle = sunset;
  }

  ctx.fillStyle = fillStyle;
  ctx.fillText(upper, cx, cy);

  // 4. Subtle inner highlight stroke for crisp definition
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = Math.max(1, size * 0.02);
  ctx.strokeText(upper, cx, cy);

  ctx.restore();
}

/** Renders vibrant neon script subtitle with radiant tube glow */
export function drawSubtitle(ctx, text, fontName, cx, cy, size, glowColor = '#ff2a8d') {
  if (!text) return;
  const trimmed = text.trim();

  ctx.save();
  ctx.font = `${size}px '${fontName}', cursive`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Deep dark drop shadow
  ctx.shadowColor = '#000000';
  ctx.shadowBlur = size * 0.3;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 4;

  // Outer dark boundary
  ctx.strokeStyle = '#05020a';
  ctx.lineWidth = size * 0.18;
  ctx.strokeText(trimmed, cx, cy);

  // Neon Radiant Glow
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = size * 0.45;

  ctx.strokeStyle = glowColor;
  ctx.lineWidth = size * 0.08;
  ctx.strokeText(trimmed, cx, cy);

  // Pure white neon tube core
  ctx.shadowBlur = size * 0.15;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(trimmed, cx, cy);

  ctx.restore();
}

/** Renders location banner / edition tagline with letter spacing */
export function drawTagline(ctx, text, cx, cy, size) {
  if (!text) return;
  const upper = text.trim().toUpperCase();

  ctx.save();
  ctx.font = `bold ${size}px 'Anton', sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Background pill / ribbon
  const metrics = ctx.measureText(upper);
  const pillW = metrics.width + size * 2.5;
  const pillH = size * 1.8;

  ctx.fillStyle = 'rgba(10, 4, 18, 0.9)';
  ctx.strokeStyle = '#ff2a8d';
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.roundRect(cx - pillW / 2, cy - pillH / 2, pillW, pillH, 4);
  ctx.fill();
  ctx.stroke();

  // Text
  ctx.fillStyle = '#ffffff';
  ctx.fillText(upper, cx, cy);

  ctx.restore();
}
