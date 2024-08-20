import { IArticle } from "@/interfaces/article";
import { setActiveMenu } from "@/redux/slices/landingSlice";
import { getDataBySlug } from "@/services/article";
import { convertDate } from "@/utils/common";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {  useNavigate, useParams } from "react-router-dom";

const ArticleDetailPage = () => {
    const [article, setArticle] = useState<IArticle | null>(null);
    const param = useParams<{ slug: string }>();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(setActiveMenu("blogs"));
        getDataBySlug(param.slug ?? "")
            .then((res) => {
                setArticle(res.data);
            })
            .catch((_) => {
                navigate("/not-found");
            });
    }, []);

    //set direction to top
    window.scrollTo(0, 0);
    return article ? (
        <>
            <div className="w-full min-h-screen relative z-10 dark:bg-dark bg-white  lg:pt-30 text-dark  dark:text-white">
                <div className="text-center py-20">
                    <h1 className="text-3xl font-bold mb-4">
                        {article?.title}
                    </h1>
                    <h2 className="text-lg font-medium mb-4">
                        {article?.category_name}
                    </h2>
                    <div className="w-full flex justify-center">
                        <p className="text-xs w-39 text-white dark:text-white font-bold p-1 rounded-lg bg-primary">
                            {article
                                ? convertDate(
                                      article?.created_at ?? "",
                                      "MMMM DD, YYYY"
                                  )
                                : ""}
                        </p>
                    </div>

                    <div className="flex gap-4 justify-center mt-6">
                        {article?.tags.map((tag, index) => (
                            <div
                                key={"tag-" + index}
                                className="px-3 py-1 border border-yellow dark:text-white font-bold grid place-content-center rounded-lg"
                            >
                                <h3 className="text-xs align-middle">
                                    {tag.name}
                                </h3>
                            </div>
                        ))}
                    </div>
                </div>
                <div
                    id="article-image"
                    className="w-full lg:px-5 md:px-5 lg:mb-20 mb:mb-20 mb-10  lg:h-[600px] md:h-[600px] animate-fade-on"
                >
                    <img
                        src={
                            article?.image_url ??
                            "https://picsum.photos/id/237/200/300"
                        }
                        alt="article"
                        className="w-full   rounded-xl border-2 border-bodydark2 h-full object-cover"
                    />
                </div>
                <div
                    className="w-full lg:pb-40 mb:pb-40 pb-30 lg:px-60"
                    style={{
                        // width: "calc(100% - 100px)",
                        // margin: "0 auto",
                        textAlign: "justify",
                    }}
                    dangerouslySetInnerHTML={{
                        __html: article?.content ?? "",
                    }}
                ></div>
            </div>
        </>
    ) : (
        <div className="w-full min-h-screen relative z-10 dark:bg-dark text-white">
            <div className="w-full h-screen grid place-content-center  text-dark dark:text-white">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="50"
                    height="50"
                    className="animate-spin"
                    viewBox="0 0 512 512"
                    fill="currentColor"
                >
                    <path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"></path>
                </svg>
            </div>
        </div>
    );
};

export default ArticleDetailPage;
