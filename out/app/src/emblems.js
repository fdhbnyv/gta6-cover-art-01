/**
 * GTA 6 Cover Art Studio - Procedural Vector Emblems & Satirical Badges
 * Renders beveled Roman VI emblem, mature content rating, 5-star wanted meter, and barcode.
 */

/**
 * Draws the iconic beveled Roman numeral "VI" vector emblem
 */
export function drawRomanVI(ctx, centerX, centerY, scale = 1.0, style = "vice-gradient") {
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.scale(scale, scale);

  // Palette definitions
  const palettes = {
    "vice-gradient": {
      left: ["#ffffff", "#ff85c0", "#ff2a85", "#7209b7"],
      right: ["#ff99c8", "#ff007f", "#9d4edd", "#3a0ca3"],
      glow: "rgba(255, 42, 133, 0.6)",
      outline: "#000000"
    },
    "gold-chrome": {
      left: ["#ffffff", "#fff3b0", "#f4c430", "#b8860b"],
      right: ["#fffae0", "#e5b700", "#996515", "#5c3d00"],
      glow: "rgba(244, 196, 48, 0.5)",
      outline: "#1a1200"
    },
    "electric-cyan": {
      left: ["#ffffff", "#bbf2f6", "#00e5ff", "#0077b6"],
      right: ["#e0fbfc", "#00b4d8", "#03045e", "#023e8a"],
      glow: "rgba(0, 229, 255, 0.6)",
      outline: "#001220"
    },
    "blood-red": {
      left: ["#ffffff", "#ff9999", "#d90429", "#590d22"],
      right: ["#ffccd5", "#ef233c", "#800f2f", "#2b0914"],
      glow: "rgba(217, 4, 41, 0.5)",
      outline: "#1a0005"
    }
  };

  const pal = palettes[style] || palettes["vice-gradient"];

  // Shadow / Glow pass
  ctx.shadowColor = pal.glow;
  ctx.shadowBlur = 24;

  // Outer bold black silhouette
  ctx.lineWidth = 14;
  ctx.strokeStyle = pal.outline;
  ctx.lineJoin = "miter";
  ctx.miterLimit = 4;

  // --- Draw 'V' Shape ---
  // Left arm of V: points
  const drawVOutline = () => {
    ctx.beginPath();
    ctx.moveTo(-110, -90);
    ctx.lineTo(-65, -90);
    ctx.lineTo(-25, 60);
    ctx.lineTo(15, -90);
    ctx.lineTo(60, -90);
    ctx.lineTo(5, 90);
    ctx.lineTo(-55, 90);
    ctx.closePath();
  };

  drawVOutline();
  ctx.stroke();

  // --- Draw 'I' Shape ---
  const drawIOutline = () => {
    ctx.beginPath();
    ctx.moveTo(85, -90);
    ctx.lineTo(145, -90);
    ctx.lineTo(145, -60);
    ctx.lineTo(125, -60);
    ctx.lineTo(125, 60);
    ctx.lineTo(145, 60);
    ctx.lineTo(145, 90);
    ctx.lineTo(85, 90);
    ctx.lineTo(85, 60);
    ctx.lineTo(105, 60);
    ctx.lineTo(105, -60);
    ctx.lineTo(85, -60);
    ctx.closePath();
  };

  drawIOutline();
  ctx.stroke();

  ctx.shadowBlur = 0; // disable shadow for interior facets

  // --- Shading Facets for 'V' ---
  // V Left facet
  const gradVLeft = ctx.createLinearGradient(-110, -90, 5, 90);
  pal.left.forEach((col, idx) => gradVLeft.addColorStop(idx / (pal.left.length - 1), col));

  ctx.fillStyle = gradVLeft;
  ctx.beginPath();
  ctx.moveTo(-110, -90);
  ctx.lineTo(-65, -90);
  ctx.lineTo(-25, 60);
  ctx.lineTo(-55, 90);
  ctx.closePath();
  ctx.fill();

  // V Right facet
  const gradVRight = ctx.createLinearGradient(15, -90, -25, 60);
  pal.right.forEach((col, idx) => gradVRight.addColorStop(idx / (pal.right.length - 1), col));

  ctx.fillStyle = gradVRight;
  ctx.beginPath();
  ctx.moveTo(-25, 60);
  ctx.lineTo(15, -90);
  ctx.lineTo(60, -90);
  ctx.lineTo(5, 90);
  ctx.closePath();
  ctx.fill();

  // --- Shading Facets for 'I' ---
  const gradILeft = ctx.createLinearGradient(85, -90, 115, 90);
  pal.left.forEach((col, idx) => gradILeft.addColorStop(idx / (pal.left.length - 1), col));

  ctx.fillStyle = gradILeft;
  ctx.beginPath();
  ctx.moveTo(85, -90);
  ctx.lineTo(115, -90);
  ctx.lineTo(115, 90);
  ctx.lineTo(85, 90);
  ctx.lineTo(85, 60);
  ctx.lineTo(105, 60);
  ctx.lineTo(105, -60);
  ctx.lineTo(85, -60);
  ctx.closePath();
  ctx.fill();

  const gradIRight = ctx.createLinearGradient(115, -90, 145, 90);
  pal.right.forEach((col, idx) => gradIRight.addColorStop(idx / (pal.right.length - 1), col));

  ctx.fillStyle = gradIRight;
  ctx.beginPath();
  ctx.moveTo(115, -90);
  ctx.lineTo(145, -90);
  ctx.lineTo(145, -60);
  ctx.lineTo(125, -60);
  ctx.lineTo(125, 60);
  ctx.lineTo(145, 60);
  ctx.lineTo(145, 90);
  ctx.lineTo(115, 90);
  ctx.closePath();
  ctx.fill();

  // Fine interior bevel highlights
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
  ctx.beginPath();
  ctx.moveTo(-110, -90);
  ctx.lineTo(-65, -90);
  ctx.moveTo(85, -90);
  ctx.lineTo(145, -90);
  ctx.stroke();

  ctx.restore();
}

/**
 * Draws the satirical "Mature 17+" ESRB rating box
 */
export function drawMatureBadge(ctx, x, y, width = 110, height = 150) {
  ctx.save();
  ctx.translate(x, y);

  // Background outer box
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  ctx.lineWidth = 3;
  ctx.strokeStyle = "#000000";
  ctx.strokeRect(0, 0, width, height);

  // Top black box for "M"
  const topBoxHeight = height * 0.58;
  ctx.fillStyle = "#000000";
  ctx.fillRect(4, 4, width - 8, topBoxHeight);

  // Big bold "M"
  ctx.fillStyle = "#ffffff";
  ctx.font = `900 ${Math.round(topBoxHeight * 0.72)}px 'Anton', serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("M", width / 2, topBoxHeight / 2 + 2);

  // Bottom rating descriptors
  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";
  ctx.font = `800 ${Math.round(height * 0.085)}px 'Bebas Neue', sans-serif`;
  ctx.fillText("MATURE 17+", width / 2, topBoxHeight + 14);

  ctx.font = `600 ${Math.round(height * 0.045)}px sans-serif`;
  ctx.fillText("INTENSE VIOLENCE", width / 2, topBoxHeight + 25);
  ctx.fillText("BLOOD AND GORE", width / 2, topBoxHeight + 35);
  ctx.fillText("VICE CITY NOIR", width / 2, topBoxHeight + 45);

  ctx.restore();
}

/**
 * Draws the 5-Star Wanted Level meter
 */
export function drawWantedMeter(ctx, x, y, stars = 5, activeStars = 5, starSize = 22) {
  ctx.save();
  ctx.translate(x, y);

  const drawStar = (cx, cy, spikes, outerRadius, innerRadius) => {
    let rot = (Math.PI / 2) * 3;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      let sx = cx + Math.cos(rot) * outerRadius;
      let sy = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(sx, sy);
      rot += step;

      sx = cx + Math.cos(rot) * innerRadius;
      sy = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(sx, sy);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
  };

  const spacing = starSize * 2.3;

  for (let i = 0; i < stars; i++) {
    const starX = i * spacing;
    const isActive = i < activeStars;

    if (isActive) {
      // Glow effect for active stars
      ctx.shadowColor = "rgba(255, 215, 0, 0.7)";
      ctx.shadowBlur = 10;
      ctx.fillStyle = "#ffcc00";
      drawStar(starX, 0, 5, starSize, starSize * 0.45);
      ctx.fill();

      // Outer outline
      ctx.shadowBlur = 0;
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#000000";
      ctx.stroke();
    } else {
      // Dim inactive star
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      drawStar(starX, 0, 5, starSize, starSize * 0.45);
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "rgba(0, 0, 0, 0.6)";
      ctx.stroke();
    }
  }

  ctx.restore();
}

/**
 * Draws commercial barcode stamp and copyright text
 */
export function drawBarcode(ctx, x, y, width = 160, height = 48) {
  ctx.save();
  ctx.translate(x, y);

  // White backing pill
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.fillRect(-6, -6, width + 12, height + 16);

  ctx.fillStyle = "#000000";
  const barPattern = [
    2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 1, 4, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 1, 3, 4, 2, 1, 2, 3
  ];

  let currentX = 0;
  const barH = height - 10;

  for (let i = 0; i < barPattern.length; i++) {
    const barW = barPattern[i] * 1.5;
    if (i % 2 === 0) {
      ctx.fillRect(currentX, 0, barW, barH);
    }
    currentX += barW + 1;
    if (currentX >= width) break;
  }

  // Serial text below barcode
  ctx.font = "9px monospace";
  ctx.textAlign = "center";
  ctx.fillText("6 - 0420 - 2026 - VI", width / 2, height + 6);

  ctx.restore();
}
