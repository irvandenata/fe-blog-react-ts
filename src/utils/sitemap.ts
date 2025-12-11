/**
 * Sitemap Generation Utilities
 * Generate dynamic XML sitemap from application data
 */

export interface SitemapURL {
    loc: string;
    lastmod?: string;
    changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
    priority?: number;
}

/**
 * Escape XML special characters
 */
const escapeXml = (unsafe: string): string => {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
};

/**
 * Format date to W3C Datetime format (ISO 8601)
 */
const formatDate = (date: string | Date): string => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toISOString();
};

/**
 * Generate single URL entry for sitemap
 */
const generateUrlEntry = (url: SitemapURL): string => {
    let entry = `  <url>\n`;
    entry += `    <loc>${escapeXml(url.loc)}</loc>\n`;

    if (url.lastmod) {
        entry += `    <lastmod>${formatDate(url.lastmod)}</lastmod>\n`;
    }

    if (url.changefreq) {
        entry += `    <changefreq>${url.changefreq}</changefreq>\n`;
    }

    if (url.priority !== undefined) {
        entry += `    <priority>${url.priority.toFixed(1)}</priority>\n`;
    }

    entry += `  </url>\n`;
    return entry;
};

/**
 * Generate complete XML sitemap
 */
export const generateSitemapXML = (urls: SitemapURL[]): string => {
    console.log("generateSitemapXML called with:", urls.length, "URLs");
    console.log("URLs to generate:", urls);

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    urls.forEach((url, index) => {
        console.log(`Generating XML entry ${index + 1}/${urls.length}:`, url.loc);
        xml += generateUrlEntry(url);
    });

    xml += "</urlset>";
    console.log("Final XML length:", xml.length, "characters");
    console.log("Final XML:", xml.substring(0, 500) + "...");
    return xml;
};

/**
 * Get base URL from window location
 */
export const getBaseUrl = (): string => {
    if (typeof window !== "undefined") {
        return window.location.origin;
    }
    // Fallback untuk server-side rendering
    return "https://yourdomain.com";
};

/**
 * Generate static pages URLs for sitemap
 */
export const generateStaticPages = (): SitemapURL[] => {
    const baseUrl = getBaseUrl();

    return [
        {
            loc: `${baseUrl}/`,
            changefreq: "weekly",
            priority: 1.0,
        },
        {
            loc: `${baseUrl}/blogs`,
            changefreq: "monthly",
            priority: 0.8,
        },
    ];
};

/**
 * Generate article URLs for sitemap from API data
 */
export const generateArticlePages = (articles: any[]): SitemapURL[] => {
    const baseUrl = getBaseUrl();

    console.log("generateArticlePages called with:", articles.length, "articles");
    console.log("Base URL:", baseUrl);
    console.log("First article:", articles[0]);

    const result = articles.map((article) => {
        const url = {
            loc: `${baseUrl}/blogs/${article.slug}`,
            lastmod: article.updated_at || article.created_at,
            changefreq: "monthly" as const,
            priority: 0.8,
        };
        console.log("Generated URL for article:", article.slug, "->", url);
        return url;
    });

    console.log("Total article URLs generated:", result.length);
    return result;
};

/**
 * Generate category URLs for sitemap
 */
export const generateCategoryPages = (categories: any[]): SitemapURL[] => {
    const baseUrl = getBaseUrl();

    return categories.map((category) => ({
        loc: `${baseUrl}/blogs?category=${category.id}`,
        lastmod: new Date().toISOString(),
        changefreq: "weekly" as const,
        priority: 0.7,
    }));
};
