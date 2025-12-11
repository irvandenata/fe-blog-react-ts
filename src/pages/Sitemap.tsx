import { useEffect, useState } from "react";
import { fetchDataNoAuth } from "@/services/article";
import { fetchData as fetchCategories } from "@/services/articleCategory";
import {
    generateSitemapXML,
    generateStaticPages,
    generateArticlePages,
    generateCategoryPages,
    type SitemapURL,
} from "@/utils/sitemap";

/**
 * Sitemap Component
 * Generates dynamic XML sitemap from API data
 * Access via: /sitemap.xml
 */
const SitemapPage = () => {
    const [sitemapXML, setSitemapXML] = useState<string>("");
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const generateSitemap = async () => {
            try {
                console.log("Fetching articles and categories...");

                // Fetch all data in parallel
                // Try different query params if all_data doesn't work
                const [articlesRes, categoriesRes] = await Promise.all([
                    fetchDataNoAuth({ all_data: 1, per_page: 1000 }).catch(() =>
                        fetchDataNoAuth({ per_page: 1000 })
                    ),
                    fetchCategories({ all_data: 1, per_page: 100 }).catch(() =>
                        fetchCategories({ per_page: 100 })
                    ),
                ]);

                console.log("Articles response:", articlesRes);
                console.log("Categories response:", categoriesRes);

                // Check if data exists
                const articles = articlesRes?.data || [];
                const categories = categoriesRes?.data || [];

                console.log("Articles count:", articles.length);
                console.log("Categories count:", categories.length);

                // Generate URLs
                const staticPages = generateStaticPages();
                console.log("Static pages:", staticPages);

                const articlePages = generateArticlePages(articles);
                console.log("Article pages:", articlePages);

                const categoryPages = generateCategoryPages(categories);
                console.log("Category pages:", categoryPages);

                // Combine all URLs
                const allUrls: SitemapURL[] = [...staticPages, ...articlePages, ...categoryPages];
                console.log("Total URLs:", allUrls.length);

                // Generate XML
                const xml = generateSitemapXML(allUrls);
                console.log("Generated XML length:", xml.length);

                setSitemapXML(xml);
            } catch (err: any) {
                console.error("Failed to generate sitemap:", err);
                console.error("Error stack:", err?.stack);
                console.error("Error details:", JSON.stringify(err, null, 2));
                setError(err?.message || "Failed to generate sitemap");

                // Fallback: generate sitemap with static pages only
                console.log("Using fallback: generating static pages only");
                const staticPages = generateStaticPages();
                const xml = generateSitemapXML(staticPages);
                setSitemapXML(xml);
            }
        };

        generateSitemap();
    }, []);

    // Return XML directly
    if (error) {
        return (
            <div style={{ padding: "20px", fontFamily: "monospace" }}>
                <h2>Error generating sitemap</h2>
                <p style={{ color: "red" }}>{error}</p>
                <pre>{sitemapXML}</pre>
            </div>
        );
    }

    if (!sitemapXML) {
        return (
            <div style={{ padding: "20px", textAlign: "center" }}>
                <p>Generating sitemap.xml...</p>
            </div>
        );
    }

    // Return XML as plain text
    // Add debug info before XML
    const showDebug = new URLSearchParams(window.location.search).get("debug") === "1";
    const urlCount = (sitemapXML.match(/<url>/g) || []).length;

    return (
        <div>
            {showDebug && (
                <div style={{ background: "#f0f0f0", padding: "20px", marginBottom: "20px", fontFamily: "monospace", fontSize: "12px" }}>
                    <h3>Debug Info (add ?debug=1 to URL to see this)</h3>
                    <p>Check browser console for detailed logs</p>
                    <p>XML Length: {sitemapXML.length} characters</p>
                    <p>URL Count in XML: {urlCount}</p>
                    {urlCount <= 2 && (
                        <p style={{ color: "red", fontWeight: "bold" }}>
                            WARNING: Only {urlCount} URLs found! Check console for errors.
                        </p>
                    )}
                </div>
            )}
            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{sitemapXML}</pre>
        </div>
    );
};

export default SitemapPage;
