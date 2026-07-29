import fs from "fs";
import path from "path";
import type { Plugin } from "vite";

const CONFIG_PATH = path.resolve(process.cwd(), "public", "seo-config.json");
const MAX_PAYLOAD_BYTES = 512_000;

/**
 * Dev-only endpoint that lets the admin SEO form persist to
 * public/seo-config.json.
 *
 * This exists because SEO settings are stored in a JSON file rather than in
 * the backend: a browser cannot write to a static file on its own. In a
 * production build the admin form falls back to downloading the JSON, which
 * is then committed and redeployed. `apply: "serve"` keeps this out of the
 * built site so a deployed app never exposes a file writer.
 */
export function seoConfigApi(): Plugin {
    return {
        name: "seo-config-api",
        apply: "serve",
        configureServer(server) {
            server.middlewares.use("/__seo-config", (req, res) => {
                if (req.method === "GET") {
                    res.setHeader("Content-Type", "application/json");
                    res.end(fs.readFileSync(CONFIG_PATH, "utf8"));
                    return;
                }

                if (req.method !== "POST") {
                    res.statusCode = 405;
                    res.end(JSON.stringify({ error: "Method not allowed" }));
                    return;
                }

                let body = "";
                req.on("data", (chunk) => {
                    body += chunk;
                    // Bound the payload so a malformed request cannot exhaust memory.
                    if (body.length > MAX_PAYLOAD_BYTES) req.destroy();
                });
                req.on("end", () => {
                    try {
                        const parsed = JSON.parse(body);
                        if (!parsed || typeof parsed !== "object" || !parsed.siteUrl) {
                            throw new Error("Invalid SEO config payload");
                        }
                        fs.writeFileSync(
                            CONFIG_PATH,
                            `${JSON.stringify(parsed, null, 2)}\n`,
                            "utf8"
                        );
                        res.setHeader("Content-Type", "application/json");
                        res.end(JSON.stringify({ ok: true }));
                    } catch (error) {
                        res.statusCode = 400;
                        res.end(
                            JSON.stringify({
                                error:
                                    error instanceof Error ? error.message : "Bad request",
                            })
                        );
                    }
                });
            });
        },
    };
}
