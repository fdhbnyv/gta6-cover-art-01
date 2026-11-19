import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const PORT = parseInt(process.env.PORT || "3000", 10);
const APP_DIR = resolve(process.cwd(), "app");

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const reqUrl = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    let pathname = decodeURIComponent(reqUrl.pathname);

    if (pathname === "/") {
      pathname = "/index.html";
    }

    const filePath = join(APP_DIR, pathname);

    // Prevent directory traversal
    if (!filePath.startsWith(APP_DIR)) {
      res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("403 Forbidden");
      return;
    }

    const fileStat = await stat(filePath).catch(() => null);

    if (!fileStat || !fileStat.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 Not Found");
      return;
    }

    const ext = extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    const data = await readFile(filePath);

    res.writeHead(200, {
      "Content-Type": contentType,
      "Content-Length": data.byteLength,
      "Cache-Control": "no-cache",
      "Access-Control-Allow-Origin": "*",
    });
    res.end(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[server error]", message);
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("500 Internal Server Error");
  }
});

server.listen(PORT, () => {
  console.log(`[server] GTA 6 Cover Art Studio running at http://localhost:${PORT}`);
  console.log(`[server] Serving static assets from ${APP_DIR}`);
});
