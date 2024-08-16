import { Button } from "./UI/moving-border";
const SocialMediaButton: React.FC<{
    icon: string;
    id: string;
    link: string;
    label: string;
}> = ({ icon, link, label, id }) => {
    const onMouseEnter = (e: any) => {
        const captions = document.getElementsByClassName("icon-caption");
        for (let i = 0; i < captions.length; i++) {
            captions[i].classList.add("invisible");
        }

        const caption =
            e.target.parentNode.parentNode.parentNode.nextSibling;
        if (caption) {
            caption.classList.remove("invisible");
        }
    };

    const onMouseLeave = (e: any) => {
        // get all caption and hide
        const captions = document.getElementsByClassName("icon-caption");
        for (let i = 0; i < captions.length; i++) {
            captions[i].classList.add("invisible");
        }
    };
    return (
        <>
            <a
                target="_blank"
                href={link}
                className={` relative text-white font-bold m-2 hover:-translate-y-2 rounded-full shadow-lg transition-all duration-300 ease-in-out ${"opacity-100"}`}
            >
                
                <div className="">
                    <Button
                        key={id + "-sm-button"}
                        borderRadius="1.75rem"
                        className="bg-white w-15 h-15  dark:bg-slate-50 border-4 text-black dark:text-white border-neutral-200 dark:border-slate-800"
                    >
                        <span
                            className="text-white dark:text-white"
                            onMouseEnter={onMouseEnter}
                            onMouseLeave={onMouseLeave}
                            dangerouslySetInnerHTML={{ __html: icon }}
                        ></span>
                    </Button>
                </div>
                <p
                    id={`sm-caption-id-` + id}
                    className="icon-caption top-1 border-2 dark:border-2 -mt-10 dark:border-gray-dark border-bodydark2  text-sm absolute invisible  font-thin text-center bg-slate-10 p-1 rounded"
                >
                    {label}
                </p>
            </a>
        </>
    );
};

export default SocialMediaButton;
