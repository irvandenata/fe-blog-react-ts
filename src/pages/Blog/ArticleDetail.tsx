import CommentCard from "@/components/Cards/CommentCard";
import { IArticle } from "@/interfaces/article";
import { setActiveMenu } from "@/redux/slices/landingSlice";
import { getDataBySlug, fetchDataNoAuth } from "@/services/article";
import { convertDate } from "@/utils/common";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/moving-border";
import SEOHead from "@/components/SEO/SEOHead";
import {
    generateTitle,
    generateExcerpt,
    generateArticleSchema,
    generateBreadcrumbSchema,
    getAbsoluteUrl,
} from "@/utils/seo";

const ArticleDetailPage = () => {
    const param = useParams<{ slug: string }>();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [article, setArticle] = useState<IArticle | null>(null);
    const [articles, setArticles] = useState<IArticle[]>([]);

    const loadData = useCallback(async () => {
        const cookie = document.cookie;
        let count = true;
        const flag = cookie
            .split(";")
            .find((item) => item.trim().startsWith("viwed-" + param.slug));
        if (flag) {
            count = false;
        }
        dispatch(setActiveMenu("blogs"));
        try {
            const res = await getDataBySlug(param.slug ?? "", count);
            setArticle(res.data);

            // Set cookies for view tracking
            const date = new Date();
            date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
            document.cookie = `viwed-${res.data.slug}=true; expires=${date.toUTCString()}; path=/`;

            // Load related articles
            const relatedRes = await fetchDataNoAuth({
                category_id: res.data.category?.id,
                per_page: 3,
            });
            setArticles(relatedRes.data.filter((item: IArticle) => item.id !== res.data.id));
        } catch {
            navigate("/not-found");
        }
    }, [param.slug, dispatch, navigate]);

    useEffect(() => {
        loadData();
    }, [loadData, param.slug]);

    // SEO Data - memoized
    const seoData = useMemo(() => {
        if (!article) {
            return {
                title: generateTitle("Loading Article...", "IRVAN DENATA Blog"),
                description: "Loading article content...",
                keywords: [],
                url: getAbsoluteUrl(`/blogs/${param.slug}`),
                image: "",
            };
        }

        const title = generateTitle(article.title, "IRVAN DENATA Blog");
        const description = generateExcerpt(article.content, 155);
        const keywords = [
            ...article.tags.map((tag) => tag.name),
            article.category?.name || "",
            "blog",
            "article",
        ];

        return {
            title,
            description,
            keywords,
            url: getAbsoluteUrl(`/blogs/${article.slug}`),
            image: article.image_url || `${window.location.origin}/og-image.png`,
            publishedTime: article.created_at,
            modifiedTime: article.updated_at,
            category: article.category?.name,
            tags: article.tags.map((tag) => tag.name),
        };
    }, [article, param.slug]);

    // Structured Data - memoized
    const structuredData = useMemo(() => {
        if (!article) return [];

        const articleSchema = generateArticleSchema({
            title: article.title,
            description: seoData.description,
            image: seoData.image,
            author: "IRVAN DENATA",
            publishedTime: article.created_at,
            modifiedTime: article.updated_at,
            url: seoData.url,
            tags: article.tags.map((tag) => tag.name),
            category: article.category?.name,
        });

        const breadcrumbSchema = generateBreadcrumbSchema([
            { name: "Home", url: getAbsoluteUrl("/") },
            { name: "Blog", url: getAbsoluteUrl("/blogs") },
            { name: article.category?.name || "Article", url: seoData.url },
        ]);

        return [articleSchema, breadcrumbSchema];
    }, [article, seoData]);

    if (!article) {
        return (
            <>
                <SEOHead
                    title={seoData.title}
                    description={seoData.description}
                    keywords={seoData.keywords}
                    url={seoData.url}
                    type="article"
                />
                <div className="w-full min-h-screen relative z-10 dark:bg-dark text-white">
                    <div className="w-full h-screen grid place-content-center text-dark dark:text-white">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="50"
                            height="50"
                            className="animate-spin"
                            viewBox="0 0 512 512"
                            fill="currentColor"
                        >
                            <path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z" />
                        </svg>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <SEOHead
                title={seoData.title}
                description={seoData.description}
                keywords={seoData.keywords}
                image={seoData.image}
                url={seoData.url}
                type="article"
                publishedTime={seoData.publishedTime}
                modifiedTime={seoData.modifiedTime}
                structuredData={structuredData}
            />
            <div className="w-full min-h-screen relative z-10 dark:bg-dark lg:pt-40 md:pt-40 pt-30">
                <div className="lg:px-60 w-full">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold dark:text-white text-dark-custom-200 mb-5">
                            {article.title}
                        </h1>
                        <div className="flex justify-center items-center gap-3 mb-5">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Published on {convertDate(article.created_at)}
                            </p>
                            {article.category && (
                                <>
                                    <span className="text-gray-500">•</span>
                                    <p className="text-sm text-primary font-semibold">
                                        {article.category.name}
                                    </p>
                                </>
                            )}
                        </div>

                        <div className="flex flex-wrap justify-center gap-2 mb-5">
                            {article.tags.map((tag, index) => (
                                <div
                                    key={"tag-" + index}
                                    className="px-3 py-1 border border-yellow dark:text-white font-bold grid place-content-center rounded-lg"
                                >
                                    <h3 className="text-xs align-middle">{tag.name}</h3>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center mt-5">
                            <div className="flex w-auto mx-auto rounded-xl mt-5 px-4 py-2 bg-boxdark text-center">
                                <svg
                                    width="20px"
                                    height="20px"
                                    viewBox="0 0 1024 1024"
                                    className="icon my-auto"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M512 160c320 0 512 352 512 352S832 864 512 864 0 512 0 512s192-352 512-352zm0 64c-225.28 0-384.128 208.064-436.8 288 52.608 79.872 211.456 288 436.8 288 225.28 0 384.128-208.064 436.8-288-52.608-79.872-211.456-288-436.8-288zm0 64a224 224 0 110 448 224 224 0 010-448zm0 64a160.192 160.192 0 00-160 160c0 88.192 71.744 160 160 160s160-71.808 160-160-71.744-160-160-160z"
                                    />
                                </svg>
                                &nbsp;
                                <p className="text-md my-auto font-bold rounded-xl">{article.views} Views</p>
                            </div>
                        </div>
                    </div>

                    <div
                        id="article-image"
                        className="w-full lg:px-5 md:px-5 lg:mb-20 mb:mb-20 mb-10 lg:h-[600px] md:h-[600px] animate-fade-on"
                    >
                        <img
                            src={article.image_url ?? "https://picsum.photos/id/237/200/300"}
                            alt={article.title}
                            className="w-full rounded-xl border-2 border-bodydark2 h-full object-cover"
                        />
                    </div>

                    <article className="w-full">
                        <div
                            className="prose prose-lg dark:prose-invert max-w-none"
                            style={{
                                textAlign: "justify",
                            }}
                            dangerouslySetInnerHTML={{
                                __html: article.content ?? "",
                            }}
                        />
                    </article>

                    <div id="article-related" className="w-full relative grid place-content-center grid-cols-1 z-10 mt-20">
                        <div className="text-2xl py-10 text-center font-bold dark:text-white text-dark-custom-200">
                            Related Articles
                        </div>
                        <div className="w-full" id="projects-container">
                            <div className="grid grid-cols-1 gap-4">
                                {articles.map((item, index) => (
                                    <div key={index + "-projects"} className="lg:mx-6">
                                        <div
                                            className="w-full hover:border-primary hover:scale-105 hover:cursor-pointer border-2 border-bodydark2 dark:border-slate-800 rounded-xl relative overflow-hidden transition-transform duration-300"
                                            onClick={() => {
                                                navigate(`/blogs/${item.slug}`);
                                            }}
                                        >
                                            <div className="place-items-start flex">
                                                <div className="p-4">
                                                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex mt-10">
                                <div className="w-full text-center">
                                    <Button
                                        onClick={() => {
                                            navigate("/blogs");
                                        }}
                                        borderRadius="1.75rem"
                                        className="bg-white px-10 py-2 dark:hover:bg-primary dark:bg-slate-900 text-black font-extrabold dark:text-white border-neutral-200 dark:border-slate-800"
                                    >
                                        More Articles
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:pb-40 w-full mb:pb-40 pb-30 mt-20">
                        <CommentCard articleId={article.id.toString()} slug={article.slug ?? ""} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ArticleDetailPage;
