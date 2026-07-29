import { Helmet } from "react-helmet-async";
import { SEOConfig, seoConfig, getAbsoluteUrl, getSiteUrl } from "@/utils/seo";

interface SEOHeadProps extends SEOConfig {
    structuredData?: object[];
}

/**
 * Renders every meta tag for a page. Values default to `public/seo-config.json`
 * so pages only pass what actually differs.
 */
const SEOHead: React.FC<SEOHeadProps> = ({
    title,
    description,
    keywords = [],
    author = seoConfig.author.name,
    image,
    url,
    type = "website",
    publishedTime,
    modifiedTime,
    canonical,
    noindex = false,
    structuredData = [],
}) => {
    // getSiteUrl falls back to the configured siteUrl in Node, where this
    // component is also rendered during prerender.
    const currentUrl = url || getSiteUrl();
    const canonicalUrl = canonical || currentUrl;
    const ogImage = getAbsoluteUrl(image || seoConfig.defaultImage);
    const robots = noindex ? "noindex, nofollow" : seoConfig.robots;

    return (
        <Helmet prioritizeSeoTags>
            {/* Primary */}
            <html lang={seoConfig.locale.split("_")[0]} />
            <title>{title}</title>
            <meta name="description" content={description} />
            {keywords.length > 0 && <meta name="keywords" content={keywords.join(", ")} />}
            <meta name="author" content={author} />
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={title} />
            <meta property="og:site_name" content={seoConfig.siteName} />
            <meta property="og:locale" content={seoConfig.locale} />
            {type === "article" && publishedTime && (
                <meta property="article:published_time" content={publishedTime} />
            )}
            {type === "article" && modifiedTime && (
                <meta property="article:modified_time" content={modifiedTime} />
            )}
            {type === "article" && <meta property="article:author" content={author} />}

            {/* Twitter */}
            <meta name="twitter:card" content={seoConfig.twitter.card} />
            <meta name="twitter:url" content={currentUrl} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />
            {seoConfig.twitter.site && (
                <meta name="twitter:site" content={seoConfig.twitter.site} />
            )}
            {seoConfig.twitter.creator && (
                <meta name="twitter:creator" content={seoConfig.twitter.creator} />
            )}

            {/* Crawling. max-snippet:-1 lets AI/LLM crawlers quote the full text. */}
            <meta name="robots" content={robots} />
            <meta name="googlebot" content={robots} />
            <meta name="bingbot" content={robots} />

            {/* Search engine ownership verification */}
            {seoConfig.verification.google && (
                <meta name="google-site-verification" content={seoConfig.verification.google} />
            )}
            {seoConfig.verification.bing && (
                <meta name="msvalidate.01" content={seoConfig.verification.bing} />
            )}
            {seoConfig.verification.yandex && (
                <meta name="yandex-verification" content={seoConfig.verification.yandex} />
            )}

            {/* Structured data — the primary signal for AI/LLM crawlers */}
            {structuredData.map((data, index) => (
                <script key={`structured-data-${index}`} type="application/ld+json">
                    {JSON.stringify(data)}
                </script>
            ))}
        </Helmet>
    );
};

export default SEOHead;
