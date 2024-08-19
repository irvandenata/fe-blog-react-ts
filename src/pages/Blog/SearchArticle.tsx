import Card3D from "@/components/Cards/Card3D";
import AnimateSection from "@/components/UI/AnimateSection";
import { Button } from "@/components/UI/moving-border";
import { IArticle } from "@/interfaces/article";
import { setActiveMenu } from "@/redux/slices/landingSlice";
import { fetchDataNoAuth } from "@/services/article";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const SearchArticlePage = () => {
    const dispatch = useDispatch();
    const [isMobile, setIsMobile] = useState(false);
    dispatch(setActiveMenu("blogs"));

    const [articles, setArticles] = useState<IArticle[]>([]);
    const [query, setQuery] = useState({
        page: 1,
        per_page: 9,
        sort: "asc",
        search: "",
    });

    const loadData = () => {
        fetchDataNoAuth(query).then((res) => {
            setArticles([...res.data]);
            setQuery({
                ...query,
                page: res.meta.current_page + 1,
            });
        });
    };

    const loadOtherData = () => {
        fetchDataNoAuth(query).then((res) => {
            setArticles([...articles, ...res.data]);
            if (!(res.meta.current_page === res.meta.last_page)) {
                setQuery({
                    ...query,
                    page: res.meta.current_page + 1,
                });
            }
        });
    };

    useEffect(() => {
        loadOtherData();
    }, [query]);
    useEffect(() => {
        loadData();
    }, []);

    return (
        <div id="article-content">
            <div id="home" className="flex flex-col items-center text-bodydark1  justify-center relative z-10 mt-40 mb-20">
                <p className="bg-primary py-1 px-2 mb-4 rounded-lg">
                    Read My Mind
                </p>
                <h1 className="text-4xl">Browse The Resources</h1>
                <p>
                    Dedication to the thoughts and ideas that have ever stopped
                    by in my head
                </p>
                {/* input for search with icon */}
                <div className="flex w-full my-10">
                    <form className="w-[60%] mx-auto ">
                        <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
                            Search
                        </label>
                        <div className="relative z-10">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg
                                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                    />
                                </svg>
                            </div>
                            <input
                                type="text"
                                style={{
                                    appearance: "none",
                                }}
                                id="default-search"
                                className="block w-full  p-4 ps-10 text-sm text-gray-900  border-gray-300 rounded-lg bg-gray-dark focus:ring-primary focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary border-2"
                                placeholder="Search everything ..."
                                required
                            />
                            <button
                                type="submit"
                                className="text-white absolute end-2.5 z-999 bottom-2.5 bg-background1 hover:bg-primary focus:ring-4 focus:outline-none focus:ring-primary font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-primary "
                            >
                                Search
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="content relative z-10">
                <div className="container mx-auto w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-3 gap-5 ">
                        {articles.map((item: IArticle, index: number) => (
                            <div key={index + "-articles"} className="">
                                <div
                                    className={`animate-fade-in `}
                                    style={{
                                        transitionDelay:  `${index * 1}s`,
                                    }}
                                >
                                    <Card3D
                                        title={item.title}
                                        category={item.category.name}
                                        image_url={item.image_url ?? ""}
                                        slug={item.slug ?? ""}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchArticlePage;
