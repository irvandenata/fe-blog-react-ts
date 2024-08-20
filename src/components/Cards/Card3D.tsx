"use client";

import { Link } from "react-router-dom";
import { CardBody, CardContainer, CardItem } from "../UI/3d-card";

export const Card3D: React.FC<{
    title: string;
    content?: string;
    category: any;
    image_url: string;
    slug: string;
}> = ({ title, content, category, image_url, slug }) => {
    return (
        <CardContainer className="inter-var w-full">
            <CardBody className="bg-gray-50 relative group/card  dark:hover :shadow-2xl dark:hover:shadow-emerald-500/[0.1] bg-slate-100 dark:bg-dark dark:border-gray-dark dark:border-2 border-bodydark2 w-full  h-auto rounded-xl p-6 border-2  ">
                <CardItem translateZ="100" className="w-full">
                    <img
                        src={image_url}
                        height="1000"
                        width="1000"
                        className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                        alt="thumbnail"
                    />
                </CardItem>
                <CardItem
                    translateZ="50"
                    className="py-2 mt-4 text-xl font-extrabold text-dark dark:text-white"
                >
                    {title}
                </CardItem>
                <CardItem
                    translateZ="60"
                    className="  rounded-xl font-bold  text-md  dark:text-white text-neutral-800"
                >
                    {category}
                </CardItem>

                {content && (
                    <CardItem
                        as="p"
                        translateZ="60"
                        className="text-neutral-500 text-sm max-w-sm dark:text-neutral-300"
                    >
                        <div
                            dangerouslySetInnerHTML={{
                                __html:
                                    // cut the content to 100 characters
                                    content.length > 200
                                        ? content.substring(0, 200) + "..."
                                        : content,
                            }}
                        ></div>
                    </CardItem>
                )}

                <div className="flex justify-between items-center mt-8">
                    <Link to={`/blogs/${slug}`}>
                        <CardItem
                            translateZ={20}
                            as="button"
                            className="px-4 py-2 rounded-xl bg-black dark:bg-white  hover:bg-primary dark:hover:bg-primary dark:hover:text-white dark:text-black text-white text-xs font-bold"
                        >
                            Read More <span className="ml-2">→</span>
                        </CardItem>
                    </Link>
                </div>
            </CardBody>
        </CardContainer>
    );
};

export default Card3D;
