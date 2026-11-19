/**
 * GTA 6 Cover Art Studio - Screenshot Specs & Query Parser
 * Synchronizes URL query parameters with studio render state for headless captures.
 */

export const SHOT_DEFINITIONS = [
  {
    name: "1-cover",
    params: {
      aspect: "16-9",
      layout: "quad",
      filter: "vice-sunset",
      preset: "quad-comic"
    }
  },
  {
    name: "2-editor",
    params: {
      aspect: "16-9",
      layout: "quad",
      filter: "vice-sunset"
    }
  },
  {
    name: "3-cover-square",
    params: {
      aspect: "1-1",
      layout: "slash",
      filter: "neon-noir"
    }
  },
  {
    name: "4-cover-portrait",
    params: {
      aspect: "9-16",
      layout: "epic",
      filter: "comic-punch"
    }
  }
];

/**
 * Parses URL search params and returns state overrides
 */
export function parseUrlState(searchString = window.location.search) {
  const params = new URLSearchParams(searchString);
  const overrides = {};

  if (params.has("aspect")) {
    const asp = params.get("aspect");
    if (["16-9", "1-1", "9-16"].includes(asp)) {
      overrides.aspect = asp;
    }
  }

  if (params.has("layout")) {
    const lay = params.get("layout");
    if (["hero", "triptych", "quad", "epic", "slash"].includes(lay)) {
      overrides.layout = lay;
    }
  }

  if (params.has("filter")) {
    const fil = params.get("filter");
    if (["vice-sunset", "neon-noir", "comic-punch", "golden-hour", "ocean-drive", "natural"].includes(fil)) {
      overrides.filter = fil;
    }
  }

  if (params.has("preset")) {
    overrides.preset = params.get("preset");
  }

  if (params.has("title")) {
    overrides.titleTop = params.get("title");
  }

  if (params.has("sub")) {
    overrides.titleSub = params.get("sub");
  }

  return overrides;
}
