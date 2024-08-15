"use client";
import { BackgroundGradient } from "@/components/UI/background-gradient";

const GlowBackgroundCard: React.FC<{
    title: string;
    category: any;
    content: string;
    image_url: string;
    slug: string;
}> = ({ title, category, content, image_url, slug }) => {
    return (
        <div>
            <BackgroundGradient className="rounded-[22px] relative min-h-[430px]  p-4 sm:p-10 bg-white dark:bg-zinc-900">
                <div className="h-[160px]">
                    <img
                        src={image_url}
                        alt="card"
                        className="absolute top-0 left-0 w-full max-h-[200px] object-cover rounded-tl-[22px] rounded-tr-[22px]"
                    />
                </div>

                <p className="text-xl  font-extrabold sm:text-xl text-black mt-4 mb-1 dark:text-neutral-200">
                    {title}
                </p>
                <p className="mb-4" >
                    <span className="text-md font-bold dark:text-danger text-neutral-600 ">
                        {category.name}
                    </span>
                </p>

                <div
                    className="text-sm text-neutral-600 dark:text-neutral-400"

                    // cut the content to 100 characters
                    dangerouslySetInnerHTML={{
                        __html: content.length > 300
                            ? content.substring(0, 300) + "..."
                            : content,
                    }}
                ></div>

                <button className="absolute bottom-[30px] rounded-full pl-4 pr-4 py-2 text-white hover:bg-primary flex items-center space-x-1 border-2 border-primary mt-4 text-xs font-bold ">
                   Read More
                </button>
            </BackgroundGradient>
        </div>
    );
};

export default GlowBackgroundCard;
