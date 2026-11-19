/**
 * GTA 6 Cover Art Studio - Retro Color Grading Shaders & Post-Processing Pipeline
 * Direct pixel-manipulation shaders and procedural overlays for authentic 80s aesthetics.
 */

/**
 * Apply selected color grading shader to a target 2D canvas context
 */
export function applyColorGrade(ctx, width, height, filterType, intensity = 0.85) {
  if (filterType === "natural" || intensity <= 0) return;

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const len = data.length;
  const factor = Math.max(0, Math.min(1, intensity));

  for (let i = 0; i < len; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Perceptual luminance calculation (Rec. 709)
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    let nr = r;
    let ng = g;
    let nb = b;

    switch (filterType) {
      case "vice-sunset": {
        // High saturation, magenta/pink highlights, dark cyan shadows
        const normLum = lum / 255;
        // Shadow tint (deep cyan/indigo)
        const shadowR = r * 0.7 + 10;
        const shadowG = g * 0.85 + 25;
        const shadowB = b * 1.25 + 60;

        // Highlight tint (electric hot pink / sunset orange)
        const highR = r * 1.35 + 40;
        const highG = g * 0.85;
        const highB = b * 1.1 + 30;

        nr = shadowR * (1 - normLum) + highR * normLum;
        ng = shadowG * (1 - normLum) + highG * normLum;
        nb = shadowB * (1 - normLum) + highB * normLum;

        // Contrast expansion
        nr = (nr - 128) * 1.2 + 128;
        ng = (ng - 128) * 1.1 + 128;
        nb = (nb - 128) * 1.25 + 128;
        break;
      }

      case "neon-noir": {
        // Crushed blacks, vivid neon cyans and magentas
        const norm = lum / 255;
        if (norm < 0.45) {
          // Crushed dark indigo
          nr = r * 0.65;
          ng = g * 0.75 + 10;
          nb = b * 1.2 + 25;
        } else {
          // Electric neon highlights
          nr = r * 1.2 + 20;
          ng = g * 1.05;
          nb = b * 1.35 + 40;
        }
        // Sharp contrast
        nr = (nr - 128) * 1.3 + 128;
        ng = (ng - 128) * 1.2 + 128;
        nb = (nb - 128) * 1.3 + 128;
        break;
      }

      case "comic-punch": {
        // Pop-art color quantization and high saturation punch
        const quantize = (val, steps) => Math.round(val / (255 / steps)) * (255 / steps);
        const steps = 7;
        const qr = quantize(r, steps);
        const qg = quantize(g, steps);
        const qb = quantize(b, steps);

        nr = qr * 1.25 + 15;
        ng = qg * 1.15;
        nb = qb * 0.95;
        break;
      }

      case "golden-hour": {
        // Warm sunset bronze, amber highlights, golden skin tones
        nr = r * 1.3 + 35;
        ng = g * 1.05 + 15;
        nb = b * 0.75 - 10;

        // Soft highlight bloom simulation
        if (lum > 180) {
          nr += (lum - 180) * 0.4;
          ng += (lum - 180) * 0.25;
        }
        break;
      }

      case "ocean-drive": {
        // Synthwave teal shadows, vibrant flamingo coral highlights
        const normLum = lum / 255;
        const tealR = r * 0.5;
        const tealG = g * 1.15 + 40;
        const tealB = b * 1.3 + 55;

        const coralR = r * 1.4 + 45;
        const coralG = g * 0.8 + 10;
        const coralB = b * 0.95;

        nr = tealR * (1 - normLum) + coralR * normLum;
        ng = tealG * (1 - normLum) + coralG * normLum;
        nb = tealB * (1 - normLum) + coralB * normLum;
        break;
      }
    }

    // Blend graded values with original based on intensity factor
    data[i] = Math.max(0, Math.min(255, r + (nr - r) * factor));
    data[i + 1] = Math.max(0, Math.min(255, g + (ng - g) * factor));
    data[i + 2] = Math.max(0, Math.min(255, b + (nb - b) * factor));
  }

  ctx.putImageData(imgData, 0, 0);
}

/**
 * Procedural Film Grain Noise with luminance weighting
 */
export function applyFilmGrain(ctx, width, height, intensity = 0.25) {
  if (intensity <= 0) return;

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const len = data.length;
  const maxNoise = intensity * 64;

  for (let i = 0; i < len; i += 4) {
    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    // Weight noise towards midtones, less in extreme black/white
    const weight = 1 - Math.abs((lum / 255) * 2 - 1);
    const noise = (Math.random() - 0.5) * maxNoise * weight;

    data[i] = Math.max(0, Math.min(255, data[i] + noise));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
  }

  ctx.putImageData(imgData, 0, 0);
}

/**
 * Radial Vignette Overlay for focus framing
 */
export function applyRadialVignette(ctx, width, height, intensity = 0.4) {
  if (intensity <= 0) return;

  ctx.save();
  const radius = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
  const grad = ctx.createRadialGradient(
    width / 2,
    height / 2,
    radius * 0.35,
    width / 2,
    height / 2,
    radius
  );

  grad.addColorStop(0, "rgba(0, 0, 0, 0)");
  grad.addColorStop(0.7, `rgba(5, 4, 10, ${intensity * 0.5})`);
  grad.addColorStop(1, `rgba(3, 2, 8, ${intensity * 0.95})`);

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

/**
 * Halftone Comic Screen Dot Texture
 */
export function applyHalftone(ctx, width, height, intensity = 0.15) {
  if (intensity <= 0) return;

  ctx.save();
  ctx.globalAlpha = Math.min(0.4, intensity * 0.6);
  ctx.fillStyle = "#000000";

  const dotSpacing = 8;
  const maxDotRadius = 2.2;

  // Render pseudo halftone grid overlay
  for (let y = 0; y < height; y += dotSpacing) {
    for (let x = (y % (dotSpacing * 2) === 0 ? 0 : dotSpacing / 2); x < width; x += dotSpacing) {
      ctx.beginPath();
      ctx.arc(x, y, maxDotRadius * (0.6 + Math.random() * 0.4), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}
