/**
 * GTA 6 Cover Art Studio - Native Pipeline Runner
 * Implements procedural packaging, asset staging, and dossier compilation
 * for headless offline container evaluation.
 */
import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { buildDossier, DOSSIER_MAX_BYTES } from "./vendor/makefun-app.ts";

export interface CoverStudioVerification {
  valid: boolean;
  dossierBytes: number;
  outputDirectory: string;
}

export function auditDossierCaps(sizeBytes: number): boolean {
  return sizeBytes > 0 && sizeBytes <= DOSSIER_MAX_BYTES;
}

export function compileCoverStudioDossier(outPath: string): Uint8Array {
  return buildDossier(outPath, {
    text_max_bytes: 163840,
    screenshots: {
      max: 4,
      max_bytes: 262144,
    },
    app_max_files: 993,
    app_max_bytes: 50331648,
    app_path_max_bytes: 1000,
  });
}

function run(): void {
  const root = resolve(process.cwd());
  const out = process.env.MAKEFUN_OUTPUT_DIR ?? (existsSync("/output") ? "/output" : root);
  console.log(`[cover-studio] Staging assets from workspace root ${root} to target out ${out}`);

  const screenshotsDir = join(out, "screenshots");
  if (!existsSync(screenshotsDir)) {
    mkdirSync(screenshotsDir, { recursive: true });
  }

  const srcScreenshots = join(root, "screenshots");
  if (existsSync(srcScreenshots) && srcScreenshots !== screenshotsDir) {
    cpSync(srcScreenshots, screenshotsDir, { recursive: true });
  }

  const appDir = join(out, "app");
  if (!existsSync(appDir)) {
    mkdirSync(appDir, { recursive: true });
  }
  const srcApp = join(root, "app");
  if (existsSync(srcApp) && srcApp !== appDir) {
    cpSync(srcApp, appDir, { recursive: true });
  }

  const dossier = compileCoverStudioDossier(out);
  const targetDossierPath = join(out, "dossier.json");
  writeFileSync(targetDossierPath, dossier);

  console.log(
    `[cover-studio] Export completed. dossier.json size: ${(dossier.length / 1024).toFixed(1)} KB`
  );
}

run();