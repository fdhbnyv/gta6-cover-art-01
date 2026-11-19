/**
 * GTA 6 Cover Art Studio - Multi-Panel Comic Collage Layout Engine
 * Handles normalized coordinate projections, polygon clipping, and gutter drawing.
 */

export const LAYOUT_DEFINITIONS = {
  hero: {
    id: "hero",
    name: "Hero Poster (1-Panel)",
    slotsCount: 1,
    slots: [
      { id: 0, name: "Master Hero Focus", defaultSample: "sample-1.jpg" }
    ],
    getPolygons: (w, h, gap = 12) => {
      const g = gap;
      return [
        {
          id: 0,
          polygon: [
            [g, g],
            [w - g, g],
            [w - g, h - g],
            [g, h - g]
          ]
        }
      ];
    }
  },

  triptych: {
    id: "triptych",
    name: "Triptych Heist (3-Panel)",
    slotsCount: 3,
    slots: [
      { id: 0, name: "Left Infiltration", defaultSample: "sample-2.jpg" },
      { id: 1, name: "Center Mastermind", defaultSample: "sample-1.jpg" },
      { id: 2, name: "Right Getaway", defaultSample: "sample-3.jpg" }
    ],
    getPolygons: (w, h, gap = 10) => {
      const g = gap;
      const gHalf = g / 2;
      const w1 = w * 0.33;
      const w2 = w * 0.67;

      return [
        {
          id: 0,
          polygon: [
            [g, g],
            [w1 - gHalf, g],
            [w1 - gHalf, h - g],
            [g, h - g]
          ]
        },
        {
          id: 1,
          polygon: [
            [w1 + gHalf, g],
            [w2 - gHalf, g],
            [w2 - gHalf, h - g],
            [w1 + gHalf, h - g]
          ]
        },
        {
          id: 2,
          polygon: [
            [w2 + gHalf, g],
            [w - g, g],
            [w - g, h - g],
            [w2 + gHalf, h - g]
          ]
        }
      ];
    }
  },

  quad: {
    id: "quad",
    name: "Quad Comic (4-Panel)",
    slotsCount: 4,
    slots: [
      { id: 0, name: "Top-Left Neon Skyline", defaultSample: "sample-4.jpg" },
      { id: 1, name: "Top-Right Lead Protagonist", defaultSample: "sample-1.jpg" },
      { id: 2, name: "Bottom-Left Fast Vehicle", defaultSample: "sample-3.jpg" },
      { id: 3, name: "Bottom-Right Ocean Drive", defaultSample: "sample-2.jpg" }
    ],
    getPolygons: (w, h, gap = 12) => {
      const g = gap;
      const gHalf = g / 2;
      const splitX = w * 0.52;
      const splitY = h * 0.48;

      return [
        {
          id: 0,
          polygon: [
            [g, g],
            [splitX - gHalf, g],
            [splitX - gHalf, splitY - gHalf],
            [g, splitY - gHalf]
          ]
        },
        {
          id: 1,
          polygon: [
            [splitX + gHalf, g],
            [w - g, g],
            [w - g, splitY - gHalf],
            [splitX + gHalf, splitY - gHalf]
          ]
        },
        {
          id: 2,
          polygon: [
            [g, splitY + gHalf],
            [splitX - gHalf, splitY + gHalf],
            [splitX - gHalf, h - g],
            [g, h - g]
          ]
        },
        {
          id: 3,
          polygon: [
            [splitX + gHalf, splitY + gHalf],
            [w - g, splitY + gHalf],
            [w - g, h - g],
            [splitX + gHalf, h - g]
          ]
        }
      ];
    }
  },

  epic: {
    id: "epic",
    name: "Epic Overdrive (5-Panel)",
    slotsCount: 5,
    slots: [
      { id: 0, name: "Commanding Left Pillar", defaultSample: "sample-1.jpg" },
      { id: 1, name: "Top Mid Syndicate", defaultSample: "sample-2.jpg" },
      { id: 2, name: "Top Right Chopper", defaultSample: "sample-4.jpg" },
      { id: 3, name: "Bottom Mid Muscle Car", defaultSample: "sample-3.jpg" },
      { id: 4, name: "Bottom Right Sunset Palms", defaultSample: "sample-1.jpg" }
    ],
    getPolygons: (w, h, gap = 10) => {
      const g = gap;
      const gHalf = g / 2;
      const leftColW = w * 0.40;
      const rightColW1 = w * 0.72;
      const midSplitY = h * 0.50;

      return [
        // Panel 0: Left Column
        {
          id: 0,
          polygon: [
            [g, g],
            [leftColW - gHalf, g],
            [leftColW - gHalf, h - g],
            [g, h - g]
          ]
        },
        // Panel 1: Top Center
        {
          id: 1,
          polygon: [
            [leftColW + gHalf, g],
            [rightColW1 - gHalf, g],
            [rightColW1 - gHalf, midSplitY - gHalf],
            [leftColW + gHalf, midSplitY - gHalf]
          ]
        },
        // Panel 2: Top Right
        {
          id: 2,
          polygon: [
            [rightColW1 + gHalf, g],
            [w - g, g],
            [w - g, midSplitY - gHalf],
            [rightColW1 + gHalf, midSplitY - gHalf]
          ]
        },
        // Panel 3: Bottom Center
        {
          id: 3,
          polygon: [
            [leftColW + gHalf, midSplitY + gHalf],
            [rightColW1 - gHalf, midSplitY + gHalf],
            [rightColW1 - gHalf, h - g],
            [leftColW + gHalf, h - g]
          ]
        },
        // Panel 4: Bottom Right
        {
          id: 4,
          polygon: [
            [rightColW1 + gHalf, midSplitY + gHalf],
            [w - g, midSplitY + gHalf],
            [w - g, h - g],
            [rightColW1 + gHalf, h - g]
          ]
        }
      ];
    }
  },

  slash: {
    id: "slash",
    name: "Diagonal Action Slash",
    slotsCount: 3,
    slots: [
      { id: 0, name: "Left Angular Wedge", defaultSample: "sample-1.jpg" },
      { id: 1, name: "Center Dynamic Slash", defaultSample: "sample-3.jpg" },
      { id: 2, name: "Right Angular Wedge", defaultSample: "sample-2.jpg" }
    ],
    getPolygons: (w, h, gap = 12) => {
      const g = gap;
      const slashAngleOffset = w * 0.18;
      const p1Top = w * 0.32;
      const p1Bot = p1Top - slashAngleOffset;
      const p2Top = w * 0.68;
      const p2Bot = p2Top - slashAngleOffset;

      return [
        // Left wedge
        {
          id: 0,
          polygon: [
            [g, g],
            [p1Top - g, g],
            [p1Bot - g, h - g],
            [g, h - g]
          ]
        },
        // Center dynamic band
        {
          id: 1,
          polygon: [
            [p1Top + g, g],
            [p2Top - g, g],
            [p2Bot - g, h - g],
            [p1Bot + g, h - g]
          ]
        },
        // Right wedge
        {
          id: 2,
          polygon: [
            [p2Top + g, g],
            [w - g, g],
            [w - g, h - g],
            [p2Bot + g, h - g]
          ]
        }
      ];
    }
  }
};

/**
 * Creates clipping path on canvas 2D context for a given polygon
 */
export function clipToPolygon(ctx, polygon) {
  if (!polygon || polygon.length < 3) return;
  ctx.beginPath();
  ctx.moveTo(polygon[0][0], polygon[0][1]);
  for (let i = 1; i < polygon.length; i++) {
    ctx.lineTo(polygon[i][0], polygon[i][1]);
  }
  ctx.closePath();
  ctx.clip();
}

/**
 * Draws crisp comic book borders and gutter strokes around panels
 */
export function drawGutterBorders(ctx, layoutName, width, height, borderWidth = 8, borderColor = "#0a0911") {
  const layout = LAYOUT_DEFINITIONS[layoutName] || LAYOUT_DEFINITIONS.quad;
  const panels = layout.getPolygons(width, height, borderWidth * 1.5);

  ctx.save();
  ctx.lineWidth = borderWidth;
  ctx.strokeStyle = borderColor;
  ctx.lineJoin = "miter";
  ctx.miterLimit = 4;

  for (const panel of panels) {
    const poly = panel.polygon;
    ctx.beginPath();
    ctx.moveTo(poly[0][0], poly[0][1]);
    for (let i = 1; i < poly.length; i++) {
      ctx.lineTo(poly[i][0], poly[i][1]);
    }
    ctx.closePath();
    ctx.stroke();

    // Subtle inner neon hairline for depth
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "rgba(255, 42, 133, 0.4)";
    ctx.stroke();
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = borderColor;
  }

  // Draw master canvas outer frame
  ctx.lineWidth = borderWidth * 2;
  ctx.strokeStyle = borderColor;
  ctx.strokeRect(0, 0, width, height);

  ctx.restore();
}
