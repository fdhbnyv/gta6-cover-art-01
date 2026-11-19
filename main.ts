import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { buildDossier, DOSSIER_MAX_BYTES } from "./vendor/makefun-app.ts";

/**
 * GTA 6 Cover Art Studio - Dossier Generator
 * Optimized packaging harness with explicit screenshot boundary auditing.
 */
export function auditDossierCaps(sizeBytes: number): boolean {
  return sizeBytes > 0 && sizeBytes <= DOSSIER_MAX_BYTES;
}

function main(): void {
  const root = resolve(process.cwd());
  console.log(`[dossier] Generating dossier for workspace: ${root}`);

  const screenshotsDir = join(root, "screenshots");
  if (!existsSync(screenshotsDir)) {
    mkdirSync(screenshotsDir, { recursive: true });
  }

  // Build the make.fun dossier with safe text boundaries
  const dossierBytes = buildDossier(root, {
    text_max_bytes: Math.floor(DOSSIER_MAX_BYTES * 0.75),
    screenshots: {
      max: 4,
      max_bytes: 4 * 1024 * 1024,
    },
  });

  const targetPath = join(root, "dossier.json");
  writeFileSync(targetPath, dossierBytes);

  console.log(
    `[dossier] Successfully generated dossier.json (${(dossierBytes.length / 1024).toFixed(1)} KB)`
  );
}

main();
