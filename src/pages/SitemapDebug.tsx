import { useEffect, useState } from "react";
import { fetchDataNoAuth } from "@/services/article";
import { fetchData as fetchCategories } from "@/services/articleCategory";

/**
 * Sitemap Debug Page
 * Shows API response for debugging
 */
const SitemapDebugPage = () => {
    const [articlesData, setArticlesData] = useState<any>(null);
    const [categoriesData, setCategoriesData] = useState<any>(null);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Fetching data...");

                const [articlesRes, categoriesRes] = await Promise.all([
                    fetchDataNoAuth({ all_data: 1 }),
                    fetchCategories({ all_data: 1 }),
                ]);

                console.log("Articles response:", articlesRes);
                console.log("Categories response:", categoriesRes);

                setArticlesData(articlesRes);
                setCategoriesData(categoriesRes);
                setLoading(false);
            } catch (err: any) {
                console.error("Error:", err);
                setError(err?.message || "Unknown error");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div style={{ padding: "20px" }}>Loading...</div>;
    }

    return (
        <div style={{ padding: "20px", fontFamily: "monospace", fontSize: "12px" }}>
            <h1>Sitemap Debug Info</h1>

            {error && (
                <div style={{ background: "#fee", padding: "10px", marginBottom: "20px", color: "red" }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            <h2>Articles Response:</h2>
            <pre style={{ background: "#f5f5f5", padding: "10px", overflow: "auto", maxHeight: "400px" }}>
                {JSON.stringify(articlesData, null, 2)}
            </pre>

            <h2>Categories Response:</h2>
            <pre style={{ background: "#f5f5f5", padding: "10px", overflow: "auto", maxHeight: "400px" }}>
                {JSON.stringify(categoriesData, null, 2)}
            </pre>

            <h2>Analysis:</h2>
            <ul>
                <li>
                    Articles count:{" "}
                    {articlesData?.data ? articlesData.data.length : "No data array"}
                </li>
                <li>
                    Categories count:{" "}
                    {categoriesData?.data ? categoriesData.data.length : "No data array"}
                </li>
                <li>
                    Articles has slug?{" "}
                    {articlesData?.data?.[0]?.slug ? "Yes" : "No"}
                </li>
                <li>
                    First article slug: {articlesData?.data?.[0]?.slug || "N/A"}
                </li>
            </ul>
        </div>
    );
};

export default SitemapDebugPage;
