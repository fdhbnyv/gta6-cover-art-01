// Layout definitions for GTA 6 Cover Art Maker
// Supports 1-Panel Hero, 3-Panel Triptych, 4-Panel Quad, 5-Panel Epic Collage, and Diagonal Slash

export function getLayoutPanels(layoutName, w, h) {
  switch (layoutName) {
    case 'hero':
      return [
        {
          id: 0,
          bounds: { x: 0, y: 0, w, h },
          clip(ctx) {
            ctx.beginPath();
            ctx.rect(0, 0, w, h);
            ctx.clip();
          },
        },
      ];

    case 'triptych': {
      const splitX = Math.round(w * 0.52);
      const splitY = Math.round(h * 0.48);
      return [
        {
          id: 0,
          bounds: { x: 0, y: 0, w: splitX, h },
          clip(ctx) {
            ctx.beginPath();
            ctx.rect(0, 0, splitX, h);
            ctx.clip();
          },
        },
        {
          id: 1,
          bounds: { x: splitX, y: 0, w: w - splitX, h: splitY },
          clip(ctx) {
            ctx.beginPath();
            ctx.rect(splitX, 0, w - splitX, splitY);
            ctx.clip();
          },
        },
        {
          id: 2,
          bounds: { x: splitX, y: splitY, w: w - splitX, h: h - splitY },
          clip(ctx) {
            ctx.beginPath();
            ctx.rect(splitX, splitY, w - splitX, h - splitY);
            ctx.clip();
          },
        },
      ];
    }

    case 'epic': {
      const x1 = Math.round(w * 0.28);
      const x2 = Math.round(w * 0.72);
      const yLeft = Math.round(h * 0.50);
      const yRight = Math.round(h * 0.48);
      return [
        {
          // Center prominent hero
          id: 0,
          bounds: { x: x1, y: 0, w: x2 - x1, h },
          clip(ctx) {
            ctx.beginPath();
            ctx.rect(x1, 0, x2 - x1, h);
            ctx.clip();
          },
        },
        {
          // Top Left
          id: 1,
          bounds: { x: 0, y: 0, w: x1, h: yLeft },
          clip(ctx) {
            ctx.beginPath();
            ctx.rect(0, 0, x1, yLeft);
            ctx.clip();
          },
        },
        {
          // Bottom Left
          id: 2,
          bounds: { x: 0, y: yLeft, w: x1, h: h - yLeft },
          clip(ctx) {
            ctx.beginPath();
            ctx.rect(0, yLeft, x1, h - yLeft);
            ctx.clip();
          },
        },
        {
          // Top Right
          id: 3,
          bounds: { x: x2, y: 0, w: w - x2, h: yRight },
          clip(ctx) {
            ctx.beginPath();
            ctx.rect(x2, 0, w - x2, yRight);
            ctx.clip();
          },
        },
        {
          // Bottom Right
          id: 4,
          bounds: { x: x2, y: yRight, w: w - x2, h: h - yRight },
          clip(ctx) {
            ctx.beginPath();
            ctx.rect(x2, yRight, w - x2, h - yRight);
            ctx.clip();
          },
        },
      ];
    }

    case 'diagonal': {
      const topCut = Math.round(w * 0.56);
      const botCut = Math.round(w * 0.38);
      const midCutX = Math.round(w * 0.48);
      const midCutY = Math.round(h * 0.50);
      return [
        {
          // Left dynamic slash
          id: 0,
          bounds: { x: 0, y: 0, w: topCut, h },
          clip(ctx) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(topCut, 0);
            ctx.lineTo(botCut, h);
            ctx.lineTo(0, h);
            ctx.closePath();
            ctx.clip();
          },
        },
        {
          // Right top action slash
          id: 1,
          bounds: { x: botCut, y: 0, w: w - botCut, h: midCutY },
          clip(ctx) {
            ctx.beginPath();
            ctx.moveTo(topCut, 0);
            ctx.lineTo(w, 0);
            ctx.lineTo(w, midCutY);
            ctx.lineTo(midCutX, midCutY);
            ctx.closePath();
            ctx.clip();
          },
        },
        {
          // Right bottom action slash
          id: 2,
          bounds: { x: botCut, y: midCutY, w: w - botCut, h: h - midCutY },
          clip(ctx) {
            ctx.beginPath();
            ctx.moveTo(midCutX, midCutY);
            ctx.lineTo(w, midCutY);
            ctx.lineTo(w, h);
            ctx.lineTo(botCut, h);
            ctx.closePath();
            ctx.clip();
          },
        },
      ];
    }

    case 'quad':
    default: {
      const splitX = Math.round(w * 0.50);
      const splitY = Math.round(h * 0.50);
      return [
        {
          id: 0,
          bounds: { x: 0, y: 0, w: splitX, h: splitY },
          clip(ctx) {
            ctx.beginPath();
            ctx.rect(0, 0, splitX, splitY);
            ctx.clip();
          },
        },
        {
          id: 1,
          bounds: { x: splitX, y: 0, w: w - splitX, h: splitY },
          clip(ctx) {
            ctx.beginPath();
            ctx.rect(splitX, 0, w - splitX, splitY);
            ctx.clip();
          },
        },
        {
          id: 2,
          bounds: { x: 0, y: splitY, w: splitX, h: h - splitY },
          clip(ctx) {
            ctx.beginPath();
            ctx.rect(0, splitY, splitX, h - splitY);
            ctx.clip();
          },
        },
        {
          id: 3,
          bounds: { x: splitX, y: splitY, w: w - splitX, h: h - splitY },
          clip(ctx) {
            ctx.beginPath();
            ctx.rect(splitX, splitY, w - splitX, h - splitY);
            ctx.clip();
          },
        },
      ];
    }
  }
}

/** Draws comic book black inking divider borders between panels */
export function drawLayoutBorders(ctx, w, h, layoutName, borderWidth, borderColor) {
  if (borderWidth <= 0) return;

  ctx.save();
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = borderWidth;
  ctx.lineCap = 'square';
  ctx.lineJoin = 'miter';

  switch (layoutName) {
    case 'hero':
      // Outer poster frame only
      ctx.strokeRect(borderWidth / 2, borderWidth / 2, w - borderWidth, h - borderWidth);
      break;

    case 'triptych': {
      const splitX = Math.round(w * 0.52);
      const splitY = Math.round(h * 0.48);
      ctx.beginPath();
      ctx.moveTo(splitX, 0);
      ctx.lineTo(splitX, h);
      ctx.moveTo(splitX, splitY);
      ctx.lineTo(w, splitY);
      ctx.stroke();
      ctx.strokeRect(borderWidth / 2, borderWidth / 2, w - borderWidth, h - borderWidth);
      break;
    }

    case 'epic': {
      const x1 = Math.round(w * 0.28);
      const x2 = Math.round(w * 0.72);
      const yLeft = Math.round(h * 0.50);
      const yRight = Math.round(h * 0.48);
      ctx.beginPath();
      // Left vertical
      ctx.moveTo(x1, 0);
      ctx.lineTo(x1, h);
      // Right vertical
      ctx.moveTo(x2, 0);
      ctx.lineTo(x2, h);
      // Left horizontal
      ctx.moveTo(0, yLeft);
      ctx.lineTo(x1, yLeft);
      // Right horizontal
      ctx.moveTo(x2, yRight);
      ctx.lineTo(w, yRight);
      ctx.stroke();
      ctx.strokeRect(borderWidth / 2, borderWidth / 2, w - borderWidth, h - borderWidth);
      break;
    }

    case 'diagonal': {
      const topCut = Math.round(w * 0.56);
      const botCut = Math.round(w * 0.38);
      const midCutX = Math.round(w * 0.48);
      const midCutY = Math.round(h * 0.50);
      ctx.beginPath();
      ctx.moveTo(topCut, 0);
      ctx.lineTo(botCut, h);
      ctx.moveTo(midCutX, midCutY);
      ctx.lineTo(w, midCutY);
      ctx.stroke();
      ctx.strokeRect(borderWidth / 2, borderWidth / 2, w - borderWidth, h - borderWidth);
      break;
    }

    case 'quad':
    default: {
      const splitX = Math.round(w * 0.50);
      const splitY = Math.round(h * 0.50);
      ctx.beginPath();
      ctx.moveTo(splitX, 0);
      ctx.lineTo(splitX, h);
      ctx.moveTo(0, splitY);
      ctx.lineTo(w, splitY);
      ctx.stroke();
      ctx.strokeRect(borderWidth / 2, borderWidth / 2, w - borderWidth, h - borderWidth);
      break;
    }
  }

  ctx.restore();
}
