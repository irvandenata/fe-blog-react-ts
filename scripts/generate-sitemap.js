/**
 * Generate Sitemap Script
 * Run this script to generate sitemap.xml in public folder
 * Usage: node scripts/generate-sitemap.js
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const API_BASE_URL = process.env.VITE_API_URL || 'https://api.ivd.my.id/api/v1';
const SITE_URL = process.env.VITE_SITE_URL || 'https://ivd.my.id';
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'sitemap.xml');

/**
 * Escape XML special characters
 */
function escapeXml(unsafe) {
    if (!unsafe) return '';
    return unsafe.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

/**
 * Format date to W3C Datetime format (ISO 8601)
 */
function formatDate(date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString();
}

/**
 * Generate single URL entry for sitemap
 */
function generateUrlEntry(url) {
    let entry = '  <url>\n';
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

    entry += '  </url>\n';
    return entry;
}

/**
 * Generate complete XML sitemap
 */
function generateSitemapXML(urls) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    urls.forEach((url) => {
        xml += generateUrlEntry(url);
    });

    xml += '</urlset>';
    return xml;
}

/**
 * Generate static pages URLs
 */
function generateStaticPages() {
    return [
        {
            loc: `${SITE_URL}/`,
            lastmod: new Date().toISOString(),
            changefreq: 'weekly',
            priority: 1.0,
        },
        {
            loc: `${SITE_URL}/blogs`,
            lastmod: new Date().toISOString(),
            changefreq: 'daily',
            priority: 0.9,
        },
    ];
}

/**
 * Fetch articles from API
 */
async function fetchArticles() {
    try {
        console.log('Fetching articles from API...');
        const response = await fetch(`${API_BASE_URL}/data/articles?all_data=1&per_page=1000`);

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`✓ Fetched ${data.data?.length || 0} articles`);
        return data.data || [];
    } catch (error) {
        console.error('Error fetching articles:', error.message);
        return [];
    }
}

/**
 * Fetch categories from API
 */
async function fetchCategories() {
    try {
        console.log('Fetching categories from API...');
        const response = await fetch(`${API_BASE_URL}/data/article-categories?all_data=1&per_page=100`);

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`✓ Fetched ${data.data?.length || 0} categories`);
        return data.data || [];
    } catch (error) {
        console.error('Error fetching categories:', error.message);
        return [];
    }
}

/**
 * Generate article URLs
 */
function generateArticlePages(articles) {
    return articles.map((article) => ({
        loc: `${SITE_URL}/blogs/${article.slug}`,
        lastmod: article.updated_at || article.created_at,
        changefreq: 'monthly',
        priority: 0.8,
    }));
}

/**
 * Generate category URLs
 */
function generateCategoryPages(categories) {
    return categories.map((category) => ({
        loc: `${SITE_URL}/blogs?category=${category.id}`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.7,
    }));
}

/**
 * Main function
 */
async function main() {
    console.log('\n🗺️  Generating Sitemap...\n');
    console.log('Configuration:');
    console.log(`  API URL: ${API_BASE_URL}`);
    console.log(`  Site URL: ${SITE_URL}`);
    console.log(`  Output: ${OUTPUT_PATH}\n`);

    try {
        // Fetch data from API
        const [articles, categories] = await Promise.all([
            fetchArticles(),
            fetchCategories(),
        ]);

        // Generate URLs
        const staticPages = generateStaticPages();
        const articlePages = generateArticlePages(articles);
        const categoryPages = generateCategoryPages(categories);

        // Combine all URLs
        const allUrls = [...staticPages, ...articlePages, ...categoryPages];

        console.log('\nURL Summary:');
        console.log(`  Static pages: ${staticPages.length}`);
        console.log(`  Article pages: ${articlePages.length}`);
        console.log(`  Category pages: ${categoryPages.length}`);
        console.log(`  Total URLs: ${allUrls.length}\n`);

        // Generate XML
        const sitemapXML = generateSitemapXML(allUrls);

        // Ensure public directory exists
        const publicDir = path.join(__dirname, '..', 'public');
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
        }

        // Write sitemap.xml file
        fs.writeFileSync(OUTPUT_PATH, sitemapXML, 'utf8');

        console.log(`✓ Sitemap generated successfully!`);
        console.log(`✓ File saved to: ${OUTPUT_PATH}`);
        console.log(`✓ File size: ${(sitemapXML.length / 1024).toFixed(2)} KB\n`);
        console.log('🎉 Done!\n');

        return 0;
    } catch (error) {
        console.error('\n❌ Error generating sitemap:', error.message);
        console.error(error.stack);
        return 1;
    }
}

// Run the script
main()
    .then((exitCode) => process.exit(exitCode))
    .catch((error) => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
