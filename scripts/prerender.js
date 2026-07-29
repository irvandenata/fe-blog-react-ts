/**
 * Prerender Script
 *
 * Renders every public route in headless Chrome after `vite build` and writes
 * the resulting HTML to dist/<route>/index.html.
 *
 * Why this exists: this app is a client-rendered SPA. Without prerendering,
 * dist/index.html ships an empty <div id="root">, so any crawler that does not
 * execute JavaScript — Bingbot and essentially every AI/LLM crawler (GPTBot,
 * ClaudeBot, PerplexityBot, Google-Extended) — sees no content at all.
 * Rendering in real Chrome (rather than renderToString) means existing
 * components that touch window/document keep working untouched.
 *
 * Usage: node scripts/prerender.js
 */

import fs from "fs";
import path from "path";
import http from "http";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.join(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const seoConfig = JSON.parse(
    fs.readFileSync(path.join(ROOT, "public", "seo-config.json"), "utf8")
);

const API_BASE_URL =
    process.env.VITE_API_ENDPOINT && process.env.VITE_API_VERSION
        ? `${process.env.VITE_API_ENDPOINT}/${process.env.VITE_API_VERSION}`
        : "https://api.ivd.my.id/api/v1";
const SITE_URL = process.env.VITE_SITE_URL || seoConfig.siteUrl;
const PORT = Number(process.env.PRERENDER_PORT || 4183);

// Chrome gets this long per route before we give up on it.
const ROUTE_TIMEOUT_MS = 30000;
// Minimum rendered text length that counts as "the app actually painted".
const MIN_CONTENT_CHARS = 200;

const MIME = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".webp": "image/webp",
    ".avif": "image/avif",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
};

/**
 * Static server over dist/ with SPA fallback, so client routes resolve to
 * index.html exactly as they will in production.
 */
function startServer() {
    const server = http.createServer((req, res) => {
        const urlPath = decodeURIComponent(req.url.split("?")[0]);
        let filePath = path.join(DIST, urlPath);

        if (!filePath.startsWith(DIST)) {
            res.writeHead(403).end("Forbidden");
            return;
        }

        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
            filePath = path.join(filePath, "index.html");
        }
        if (!fs.existsSync(filePath)) {
            filePath = path.join(DIST, "index.html"); // SPA fallback
        }

        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
        fs.createReadStream(filePath).pipe(res);
    });

    return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

/**
 * Returns the list of article slugs, or null when the API could not be
 * reached — the caller treats null as a build failure rather than "no posts".
 */
async function fetchArticleSlugs() {
    try {
        const res = await fetch(`${API_BASE_URL}/data/articles?all_data=1&per_page=1000`);
        if (!res.ok) throw new Error(`API responded ${res.status}`);
        const json = await res.json();
        const slugs = (json.data || []).map((a) => a.slug).filter(Boolean);
        console.log(`  ✓ ${slugs.length} article routes from API`);
        return slugs;
    } catch (error) {
        console.error(`  ✗ Could not fetch articles: ${error.message}`);
        return null;
    }
}

/**
 * The app derives absolute URLs from window.location.origin, which during
 * prerender is this local server. Rewrite those to the real site URL so
 * canonical/og/JSON-LD links are correct in the shipped HTML.
 */
function rewriteOrigin(html) {
    return html.split(`http://localhost:${PORT}`).join(SITE_URL);
}

/**
 * index.html carries a static fallback <meta name="description">. Once Helmet
 * injects the route-specific one, both are present; keep only Helmet's.
 */
function dedupeDescription(html) {
    const tags = html.match(/<meta[^>]*name="description"[^>]*>/g);
    if (!tags || tags.length < 2) return html;
    // Helmet appends its tags last, so the earlier one is the static fallback.
    return html.replace(tags[0], "");
}

/**
 * Write rendered HTML. "/" overwrites dist/index.html; every other route
 * becomes dist/<route>/index.html so static hosts serve it directly.
 */
function writeRoute(route, html) {
    const target =
        route === "/" ? path.join(DIST, "index.html") : path.join(DIST, route, "index.html");
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, html, "utf8");
}

async function prerenderRoute(browser, route) {
    const page = await browser.newPage();
    try {
        await page.setViewport({ width: 1280, height: 900 });
        await page.goto(`http://localhost:${PORT}${route}`, {
            waitUntil: "networkidle0",
            timeout: ROUTE_TIMEOUT_MS,
        });

        // Content arrives asynchronously after the app's API calls resolve, so
        // wait for real text rather than a fixed delay.
        await page.waitForFunction(
            (min) => {
                const root = document.getElementById("root");
                return root && root.innerText.trim().length > min;
            },
            { timeout: ROUTE_TIMEOUT_MS },
            MIN_CONTENT_CHARS
        );

        // A route that redirected to /not-found rendered the 404 view; writing
        // it would publish an error page under a real article URL.
        const finalPath = new URL(page.url()).pathname;
        if (finalPath !== route && finalPath.includes("not-found")) {
            console.log(`  ⚠ ${route} — skipped (redirected to ${finalPath})`);
            return false;
        }

        const html = dedupeDescription(rewriteOrigin(await page.content()));
        writeRoute(route, html);
        console.log(`  ✓ ${route} (${(html.length / 1024).toFixed(1)} KB)`);
        return true;
    } catch (error) {
        console.error(`  ✗ ${route} — ${error.message}`);
        return false;
    } finally {
        await page.close();
    }
}

async function main() {
    console.log("\n🧩 Prerendering routes...\n");

    if (!fs.existsSync(path.join(DIST, "index.html"))) {
        console.error("dist/index.html not found — run `vite build` first.");
        return 1;
    }

    const slugs = await fetchArticleSlugs();
    if (slugs === null && !process.env.PRERENDER_ALLOW_EMPTY) {
        console.error(
            "\n❌ Aborting: article routes could not be fetched, so blog pages\n" +
                "   would ship without prerendered content.\n" +
                "   Set PRERENDER_ALLOW_EMPTY=1 to build anyway.\n"
        );
        return 1;
    }

    const routes = ["/", "/blogs", ...(slugs || []).map((s) => `/blogs/${s}`)];
    console.log(`\nRendering ${routes.length} routes (site: ${SITE_URL})\n`);

    const server = await startServer();
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-dev-shm-usage"],
    });

    let ok = 0;
    try {
        // Sequential on purpose: parallel tabs race the same API, and the
        // machine running the build is usually a small CI box.
        for (const route of routes) {
            if (await prerenderRoute(browser, route)) ok++;
        }
    } finally {
        await browser.close();
        server.close();
    }

    console.log(`\n✓ Prerendered ${ok}/${routes.length} routes\n`);
    return ok === routes.length ? 0 : 1;
}

main()
    .then((code) => process.exit(code))
    .catch((error) => {
        console.error("Fatal prerender error:", error);
        process.exit(1);
    });
