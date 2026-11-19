/**
 * GTA 6 Cover Art Studio - 3D Typography & Script Compositor
 * Renders beveled extruded display headings and neon cursive subtitles.
 */

/**
 * Draws 3D extruded and beveled header text on canvas
 */
export function drawExtrudedTitle(ctx, text, x, y, options = {}) {
  const {
    fontSize = 72,
    fontFamily = "'Anton', Impact, sans-serif",
    depth = 14,
    depthAngle = Math.PI * 0.25, // 45 degrees
    faceGradient = ["#ffffff", "#ffe6f0", "#ff2a85", "#7209b7"],
    strokeColor = "#000000",
    strokeWidth = 10,
    letterSpacing = 4,
    align = "center"
  } = options;

  ctx.save();
  ctx.font = `900 ${fontSize}px ${fontFamily}`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.lineJoin = "miter";
  ctx.miterLimit = 4;

  const dx = Math.cos(depthAngle);
  const dy = Math.sin(depthAngle);

  // 1. Draw extruded depth layers from back to front
  for (let d = depth; d >= 1; d--) {
    const layerX = x + dx * d;
    const layerY = y + dy * d;

    // Outer dark stroke for extrusion body
    ctx.lineWidth = strokeWidth + 2;
    ctx.strokeStyle = "#050308";
    ctx.strokeText(text, layerX, layerY);

    // Inner shadow color
    const shadowRatio = d / depth;
    const r = Math.round(15 + shadowRatio * 35);
    const g = Math.round(5 + shadowRatio * 10);
    const b = Math.round(30 + shadowRatio * 50);
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillText(text, layerX, layerY);
  }

  // 2. Draw outer boundary stroke for the front face
  ctx.lineWidth = strokeWidth;
  ctx.strokeStyle = strokeColor;
  ctx.strokeText(text, x, y);

  // 3. Create rich vertical metallic/sunset gradient for front face
  const grad = ctx.createLinearGradient(x, y - fontSize * 0.55, x, y + fontSize * 0.45);
  grad.addColorStop(0, faceGradient[0] || "#ffffff");
  grad.addColorStop(0.25, faceGradient[1] || "#ffe6f0");
  grad.addColorStop(0.65, faceGradient[2] || "#ff2a85");
  grad.addColorStop(1, faceGradient[3] || "#7209b7");

  ctx.fillStyle = grad;
  ctx.fillText(text, x, y);

  // 4. Subtle top-edge light reflection line
  ctx.save();
  ctx.clip();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
  ctx.strokeText(text, x, y - 1);
  ctx.restore();

  ctx.restore();
}

/**
 * Draws the neon cursive "Vice City" script subtitle
 */
export function drawScriptSubtitle(ctx, text, x, y, options = {}) {
  const {
    fontSize = 58,
    rotation = -0.11, // approx -6.3 degrees
    glowColor = "#ff2a85",
    coreColor = "#ffffff"
  } = options;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  ctx.font = `400 ${fontSize}px 'Pacifico', cursive`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Multi-pass neon bloom
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 24;
  ctx.strokeStyle = glowColor;
  ctx.lineWidth = 8;
  ctx.strokeText(text, 0, 0);

  ctx.shadowBlur = 12;
  ctx.strokeStyle = "#ff7700";
  ctx.lineWidth = 4;
  ctx.strokeText(text, 0, 0);

  // Dark outline for contrast against busy collage backgrounds
  ctx.shadowBlur = 0;
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#08060d";
  ctx.strokeText(text, 0, 0);

  // Core bright gradient text
  const textGrad = ctx.createLinearGradient(0, -fontSize * 0.4, 0, fontSize * 0.4);
  textGrad.addColorStop(0, "#ffffff");
  textGrad.addColorStop(0.4, "#ffeef8");
  textGrad.addColorStop(1, "#ff99cc");

  ctx.fillStyle = textGrad;
  ctx.fillText(text, 0, 0);

  ctx.restore();
}
