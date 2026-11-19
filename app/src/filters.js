// Color grading, filters, and cinematic effects for Vice Cover Studio
// Vice Sunset, Neon Noir, Comic Punch, Golden Hour, Ocean Drive

/** Applies the selected Vice City color grade */
export function applyColorGrade(ctx, w, h, gradeName, intensityPercent) {
  if (gradeName === 'none' || intensityPercent <= 0) return;
  const alpha = Math.min(1, Math.max(0, intensityPercent / 100));

  ctx.save();

  switch (gradeName) {
    case 'vice-sunset': {
      // Hot magenta, vibrant coral, warm yellow, deep purple
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0.0, 'rgba(42, 8, 69, 0.7)');      // Deep purple sky
      grad.addColorStop(0.35, 'rgba(255, 20, 147, 0.55)');  // Hot pink / magenta
      grad.addColorStop(0.70, 'rgba(255, 94, 58, 0.60)');   // Coral orange
      grad.addColorStop(1.0, 'rgba(255, 230, 0, 0.50)');    // Warm golden yellow

      ctx.globalAlpha = alpha * 0.75;
      ctx.globalCompositeOperation = 'overlay';
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Warm highlight tint
      ctx.globalAlpha = alpha * 0.35;
      ctx.globalCompositeOperation = 'color';
      ctx.fillStyle = '#ff2a8d';
      ctx.fillRect(0, 0, w, h);
      break;
    }

    case 'neon-noir': {
      // Cyberpunk deep indigo, cyan highlights, electric magenta
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0.0, 'rgba(0, 242, 254, 0.6)');     // Cyan
      grad.addColorStop(0.5, 'rgba(121, 40, 202, 0.5)');    // Violet
      grad.addColorStop(1.0, 'rgba(255, 0, 128, 0.6)');     // Neon magenta

      ctx.globalAlpha = alpha * 0.8;
      ctx.globalCompositeOperation = 'color';
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Deep shadows
      ctx.globalAlpha = alpha * 0.45;
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = '#0a0314';
      ctx.fillRect(0, 0, w, h);
      break;
    }

    case 'comic-punch': {
      // Punchy saturated comic book illustration style
      ctx.globalAlpha = alpha * 0.5;
      ctx.globalCompositeOperation = 'hard-light';
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0.0, '#ff007f');
      grad.addColorStop(0.5, '#ffe600');
      grad.addColorStop(1.0, '#00d2ff');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Contrast boost
      ctx.globalAlpha = alpha * 0.3;
      ctx.globalCompositeOperation = 'overlay';
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      break;
    }

    case 'golden-hour': {
      // Lush golden hour afternoon sun
      const grad = ctx.createRadialGradient(w * 0.5, h * 0.3, w * 0.1, w * 0.5, h * 0.5, w * 0.9);
      grad.addColorStop(0.0, 'rgba(255, 238, 187, 0.8)');
      grad.addColorStop(0.4, 'rgba(255, 183, 3, 0.6)');
      grad.addColorStop(0.8, 'rgba(251, 133, 0, 0.5)');
      grad.addColorStop(1.0, 'rgba(74, 40, 0, 0.7)');

      ctx.globalAlpha = alpha * 0.7;
      ctx.globalCompositeOperation = 'overlay';
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      break;
    }

    case 'ocean-drive': {
      // Tropical turquoise teal ocean and pastel pink
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0.0, 'rgba(0, 245, 212, 0.55)');   // Turquoise teal
      grad.addColorStop(0.5, 'rgba(255, 112, 166, 0.45)'); // Flamingo pink
      grad.addColorStop(1.0, 'rgba(155, 93, 229, 0.55)');  // Lavender purple

      ctx.globalAlpha = alpha * 0.7;
      ctx.globalCompositeOperation = 'color';
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      break;
    }
  }

  ctx.restore();
}

/** Draws dramatic tropical sunset horizon glow rising across the cover */
export function drawSunsetHorizonGlow(ctx, w, h) {
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.globalAlpha = 0.45;

  const glow = ctx.createLinearGradient(0, h * 0.4, 0, h);
  glow.addColorStop(0.0, 'rgba(255, 50, 150, 0)');
  glow.addColorStop(0.5, 'rgba(255, 100, 50, 0.35)');
  glow.addColorStop(1.0, 'rgba(255, 200, 50, 0.65)');

  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

/** Draws cinematic vignette darkening corners */
export function drawVignette(ctx, w, h, amountPercent) {
  if (amountPercent <= 0) return;
  const alpha = Math.min(1, Math.max(0, amountPercent / 100));

  ctx.save();
  const radius = Math.max(w, h) * 0.75;
  const vignette = ctx.createRadialGradient(w / 2, h / 2, radius * 0.35, w / 2, h / 2, radius);
  vignette.addColorStop(0.0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(0.7, `rgba(5, 2, 10, ${alpha * 0.4})`);
  vignette.addColorStop(1.0, `rgba(0, 0, 0, ${alpha * 0.85})`);

  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

/** Draws authentic 35mm film grain noise */
export function drawFilmGrain(ctx, w, h, amountPercent) {
  if (amountPercent <= 0) return;
  const alpha = (amountPercent / 100) * 0.18;

  const grainCanvas = document.createElement('canvas');
  grainCanvas.width = 256;
  grainCanvas.height = 256;
  const gCtx = grainCanvas.getContext('2d');
  const imgData = gCtx.createImageData(256, 256);
  const buf = imgData.data;

  for (let i = 0; i < buf.length; i += 4) {
    const val = (Math.random() * 255) | 0;
    buf[i] = val;
    buf[i + 1] = val;
    buf[i + 2] = val;
    buf[i + 3] = (Math.random() * 60) | 0;
  }
  gCtx.putImageData(imgData, 0, 0);

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.globalCompositeOperation = 'screen';
  const pattern = ctx.createPattern(grainCanvas, 'repeat');
  if (pattern) {
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.restore();
}

/** Draws subtle vintage comic book halftone dot matrix */
export function drawHalftone(ctx, w, h) {
  const dotCanvas = document.createElement('canvas');
  dotCanvas.width = 12;
  dotCanvas.height = 12;
  const dCtx = dotCanvas.getContext('2d');
  dCtx.fillStyle = 'rgba(0, 0, 0, 0.18)';
  dCtx.beginPath();
  dCtx.arc(6, 6, 2.2, 0, Math.PI * 2);
  dCtx.fill();

  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  const pattern = ctx.createPattern(dotCanvas, 'repeat');
  if (pattern) {
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.restore();
}