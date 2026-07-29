/**
 * Generate default brand images.
 *
 * Produces the fallback artwork referenced by seo-config.json and used
 * whenever an article has no cover:
 *
 *   public/og-image.png        1200x630 social preview (Open Graph / Twitter)
 *   public/logo.png            512x512  Organization logo for JSON-LD
 *   public/default-cover.svg   16:9     inline fallback for article covers
 *
 * SVG is rendered to PNG with headless Chrome (already a devDependency for
 * prerendering), so this adds no new image toolchain. The design is
 * deliberately minimal — brand colours, wordmark, thin rules — so it stays
 * legible at thumbnail size in a social card.
 *
 * Usage: node scripts/generate-images.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");

const seoConfig = JSON.parse(
    fs.readFileSync(path.join(PUBLIC_DIR, "seo-config.json"), "utf8")
);

// Brand palette, matching tailwind.config.js (primary + dark).
const AMBER = "#FBBA16";
const DARK = "#171717";
const DARK_SOFT = "#1F1F1F";
const MUTED = "#8A8A8A";

const SITE_NAME = seoConfig.siteName || "Irvan Denata";
const TAGLINE = seoConfig.author?.jobTitle || "Full Stack Developer";
const DOMAIN = (seoConfig.siteUrl || "https://ivd.my.id").replace(/^https?:\/\//, "");

/** Initials for the monogram, e.g. "Irvan Denata" -> "ID". */
const initials = SITE_NAME.split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

const escapeXml = (s) =>
    String(s).replace(/[<>&"']/g, (c) =>
        ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" }[c])
    );

/**
 * Faint diagonal hatch, used at low opacity so the artwork has texture
 * without competing with the text.
 */
const hatchPattern = (id, stroke, opacity) => `
    <pattern id="${id}" width="14" height="14" patternUnits="userSpaceOnUse"
             patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="14" stroke="${stroke}" stroke-width="1"
            opacity="${opacity}" />
    </pattern>`;

/** 1200x630 Open Graph card. */
const ogSvg = () => `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    ${hatchPattern("hatch", AMBER, "0.06")}
  </defs>

  <!-- Flat fill + hard-edged shapes only: gradients dither badly in PNG and
       inflate a mostly-solid image to several hundred kB. -->
  <rect width="1200" height="630" fill="${DARK}"/>
  <rect width="1200" height="630" fill="url(#hatch)"/>

  <!-- Concentric arcs in the top-right corner give the card depth -->
  <g fill="none" stroke="${AMBER}" stroke-opacity="0.16" stroke-width="2">
    <circle cx="1090" cy="90" r="120"/>
    <circle cx="1090" cy="90" r="190"/>
    <circle cx="1090" cy="90" r="260"/>
  </g>

  <!-- Accent bar anchors the left edge -->
  <rect x="0" y="0" width="10" height="630" fill="${AMBER}"/>

  <!-- Monogram -->
  <rect x="90" y="96" width="96" height="96" rx="22" fill="none"
        stroke="${AMBER}" stroke-width="3"/>
  <text x="138" y="160" font-family="Nunito, Inter, Helvetica, Arial, sans-serif"
        font-size="44" font-weight="800" fill="${AMBER}" text-anchor="middle">${escapeXml(
            initials
        )}</text>

  <!-- Wordmark -->
  <text x="90" y="330" font-family="Nunito, Inter, Helvetica, Arial, sans-serif"
        font-size="88" font-weight="800" fill="#FFFFFF">${escapeXml(SITE_NAME)}</text>

  <line x1="90" y1="376" x2="290" y2="376" stroke="${AMBER}" stroke-width="6"
        stroke-linecap="round"/>

  <text x="90" y="440" font-family="Nunito, Inter, Helvetica, Arial, sans-serif"
        font-size="38" font-weight="500" fill="${MUTED}">${escapeXml(TAGLINE)}</text>

  <text x="90" y="556" font-family="Nunito, Inter, Helvetica, Arial, sans-serif"
        font-size="26" font-weight="600" fill="${AMBER}"
        letter-spacing="2">${escapeXml(DOMAIN)}</text>
</svg>`;

/** 512x512 square logo for structured data. */
const logoSvg = () => `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="${DARK}"/>
  <rect x="8" y="8" width="496" height="496" rx="104" fill="none"
        stroke="${AMBER}" stroke-width="10"/>
  <text x="256" y="322" font-family="Nunito, Inter, Helvetica, Arial, sans-serif"
        font-size="210" font-weight="800" fill="${AMBER}"
        text-anchor="middle">${escapeXml(initials)}</text>
</svg>`;

/**
 * 16:9 article cover fallback. Kept as SVG (not PNG) because it renders
 * inline at varying sizes and weighs about 1 kB.
 */
const coverSvg = () => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675" role="img" aria-label="${escapeXml(
    SITE_NAME
)}">
  <defs>
    <linearGradient id="c" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${DARK}"/>
      <stop offset="100%" stop-color="${DARK_SOFT}"/>
    </linearGradient>
    ${hatchPattern("ch", AMBER, "0.06")}
  </defs>
  <rect width="1200" height="675" fill="url(#c)"/>
  <rect width="1200" height="675" fill="url(#ch)"/>
  <rect x="0" y="0" width="1200" height="6" fill="${AMBER}"/>
  <rect x="536" y="268" width="128" height="128" rx="30" fill="none" stroke="${AMBER}" stroke-width="4"/>
  <text x="600" y="356" font-family="Nunito, Inter, Helvetica, Arial, sans-serif" font-size="58" font-weight="800" fill="${AMBER}" text-anchor="middle">${escapeXml(
      initials
  )}</text>
  <text x="600" y="470" font-family="Nunito, Inter, Helvetica, Arial, sans-serif" font-size="30" font-weight="600" fill="${MUTED}" text-anchor="middle" letter-spacing="3">${escapeXml(
      DOMAIN
  )}</text>
</svg>`;

async function renderPng(browser, svg, width, height, outPath) {
    const page = await browser.newPage();
    try {
        await page.setViewport({ width, height, deviceScaleFactor: 1 });
        await page.setContent(`<html><body style="margin:0">${svg}</body></html>`, {
            waitUntil: "networkidle0",
        });
        await page.screenshot({ path: outPath, type: "png" });
    } finally {
        await page.close();
    }
    const kb = (fs.statSync(outPath).size / 1024).toFixed(1);
    console.log(`  ✓ ${path.basename(outPath)} (${width}x${height}, ${kb} KB)`);
}

async function main() {
    console.log("\n🎨 Generating default images...\n");

    // Written first so it ships even if PNG rendering fails.
    const coverPath = path.join(PUBLIC_DIR, "default-cover.svg");
    fs.writeFileSync(coverPath, `${coverSvg()}\n`, "utf8");
    console.log(
        `  ✓ default-cover.svg (${(fs.statSync(coverPath).size / 1024).toFixed(1)} KB)`
    );

    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-dev-shm-usage"],
    });
    try {
        await renderPng(browser, ogSvg(), 1200, 630, path.join(PUBLIC_DIR, "og-image.png"));
        await renderPng(browser, logoSvg(), 512, 512, path.join(PUBLIC_DIR, "logo.png"));
    } finally {
        await browser.close();
    }

    console.log("\n✓ Done\n");
    return 0;
}

main()
    .then((code) => process.exit(code))
    .catch((error) => {
        console.error("Failed to generate images:", error);
        process.exit(1);
    });
