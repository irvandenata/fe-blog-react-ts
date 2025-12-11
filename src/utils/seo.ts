/**
 * SEO Utility Functions
 * Provides helper functions for SEO optimization
 */

export interface SEOConfig {
    title: string;
    description: string;
    keywords?: string[];
    author?: string;
    image?: string;
    url?: string;
    type?: string;
    publishedTime?: string;
    modifiedTime?: string;
    tags?: string[];
    category?: string;
    canonical?: string;
}

/**
 * Generate meta title with site name
 */
export const generateTitle = (pageTitle: string, siteName: string = "IRVAN DENATA"): string => {
    return pageTitle ? `${pageTitle} | ${siteName}` : siteName;
};

/**
 * Truncate description to optimal length for SEO
 * Google typically shows 155-160 characters
 */
export const truncateDescription = (text: string, maxLength: number = 155): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + "...";
};

/**
 * Strip HTML tags from content
 */
export const stripHtmlTags = (html: string): string => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
};

/**
 * Generate excerpt from HTML content
 */
export const generateExcerpt = (htmlContent: string, maxLength: number = 155): string => {
    const plainText = stripHtmlTags(htmlContent);
    return truncateDescription(plainText, maxLength);
};

/**
 * Generate keywords array from tags
 */
export const generateKeywords = (tags: string[], additionalKeywords: string[] = []): string[] => {
    return [...new Set([...tags, ...additionalKeywords])];
};

/**
 * Get absolute URL
 */
export const getAbsoluteUrl = (path: string): string => {
    const baseUrl = window.location.origin;
    return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
};

/**
 * Generate structured data for Article (Schema.org)
 */
export const generateArticleSchema = (config: {
    title: string;
    description: string;
    image?: string;
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    url: string;
    tags?: string[];
    category?: string;
}) => {
    return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: config.title,
        description: config.description,
        image: config.image ? [config.image] : [],
        datePublished: config.publishedTime,
        dateModified: config.modifiedTime || config.publishedTime,
        author: {
            "@type": "Person",
            name: config.author || "IRVAN DENATA",
        },
        publisher: {
            "@type": "Organization",
            name: "IRVAN DENATA",
            logo: {
                "@type": "ImageObject",
                url: `${window.location.origin}/logo.png`,
            },
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": config.url,
        },
        keywords: config.tags?.join(", ") || "",
        articleSection: config.category || "",
    };
};

/**
 * Generate structured data for Person (Schema.org)
 */
export const generatePersonSchema = (config: {
    name: string;
    description?: string;
    image?: string;
    url: string;
    jobTitle?: string;
    sameAs?: string[];
}) => {
    return {
        "@context": "https://schema.org",
        "@type": "Person",
        name: config.name,
        description: config.description,
        image: config.image,
        url: config.url,
        jobTitle: config.jobTitle,
        sameAs: config.sameAs || [],
    };
};

/**
 * Generate structured data for Website (Schema.org)
 */
export const generateWebsiteSchema = (config: {
    name: string;
    description: string;
    url: string;
}) => {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: config.name,
        description: config.description,
        url: config.url,
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${config.url}/blogs?search={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
        },
    };
};

/**
 * Generate breadcrumb structured data (Schema.org)
 */
export const generateBreadcrumbSchema = (items: { name: string; url: string }[]) => {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
};

/**
 * Get default SEO config
 */
export const getDefaultSEOConfig = (): SEOConfig => {
    return {
        title: "IRVAN DENATA - Full Stack Developer Portfolio",
        description:
            "Portfolio website showcasing projects, blog articles, and technical expertise in full-stack development. Explore my work in React, TypeScript, Node.js, and more.",
        keywords: [
            "portfolio",
            "developer",
            "full-stack",
            "react",
            "typescript",
            "node.js",
            "web development",
        ],
        author: "IRVAN DENATA",
        type: "website",
        url: getAbsoluteUrl("/"),
    };
};
