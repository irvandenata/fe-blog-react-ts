import { Helmet } from "react-helmet-async";
import { SEOConfig } from "@/utils/seo";

interface SEOHeadProps extends SEOConfig {
    structuredData?: object[];
}

const SEOHead: React.FC<SEOHeadProps> = ({
    title,
    description,
    keywords = [],
    author = "IRVAN DENATA",
    image,
    url,
    type = "website",
    publishedTime,
    modifiedTime,
    canonical,
    structuredData = [],
}) => {
    const currentUrl = url || window.location.href;
    const canonicalUrl = canonical || currentUrl;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta name="description" content={description} />
            {keywords.length > 0 && <meta name="keywords" content={keywords.join(", ")} />}
            {author && <meta name="author" content={author} />}
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            {image && <meta property="og:image" content={image} />}
            <meta property="og:site_name" content="IRVAN DENATA Portfolio" />
            <meta property="og:locale" content="en_US" />
            {publishedTime && <meta property="article:published_time" content={publishedTime} />}
            {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
            {author && <meta property="article:author" content={author} />}

            {/* Twitter */}
            <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
            <meta name="twitter:url" content={currentUrl} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {image && <meta name="twitter:image" content={image} />}
            <meta name="twitter:creator" content="@IRVAN DENATA" />

            {/* Additional SEO tags */}
            <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
            <meta name="googlebot" content="index, follow" />
            <meta name="bingbot" content="index, follow" />
            <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="language" content="English" />
            <meta name="revisit-after" content="7 days" />

            {/* Mobile Optimization */}
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
            <meta name="theme-color" content="#1a202c" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

            {/* Structured Data (JSON-LD) */}
            {structuredData.map((data, index) => (
                <script key={`structured-data-${index}`} type="application/ld+json">
                    {JSON.stringify(data)}
                </script>
            ))}
        </Helmet>
    );
};

export default SEOHead;
