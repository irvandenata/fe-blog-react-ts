import { convertDate } from "@/utils/common";
import AnimateSection from "../UI/AnimateSection";
import { useEffect, useRef } from "react";

const WorkExperienceCard: React.FC<{ workExperience: any }> = ({
    workExperience,
}) => {
    return (
        <div className="flex-row mx-auto  rounded-xl">
            <ol
                className="relative   border-dark dark:border-gray-dark"
                id="ol-we"
            >
                {workExperience.map((exp: any, index: number) => {
                    return (
                        <AnimateSection
                            key={exp.id + "-work-exp"}
                            className="bg-slate-50 dark:bg-dark p-6 border-gray-dark my-4 rounded-xl border-2"
                            id={exp.id + "-work-exp-card"}
                            parentId="work-experience-container"
                            inAnimate={`animate-fade-in delay-${500 * index}`}
                            outAnimate="animate-go-away"
                            bottom={600}
                        >
                            <li className="lg:mb-6 md:mb-6 ms-6 lg:px-4 md:px-4 ">
                                <span className="absolute border-s-2 dark:border-s-primary flex mt-2 items-center justify-center w-6 h-6 bg-slate-50 dark:bg-dark rounded-full -start-3 ring-8 ring-dark dark:ring-gray-dark dark:border-gray-900 dark:bg-blue-900">
                                    <svg
                                        className="w-2.5 h-2.5 text-dark dark:text-white"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"></path>
                                    </svg>
                                </span>
                                <h3 className="flex items-center mb-1 text-2xl text-black font-bold text-gray-900 dark:text-white">
                                    {exp.title}
                                </h3>
                                <p className="mb-2 text-md font-semibold text-gray-500 dark:text-gray-400">
                                    {exp.subtitle}
                                </p>
                                <time className="block mb-2 text-sm font-semibold leading-none text-gray-400 dark:text-gray-500">
                                    {convertDate(exp.start_date, "mm-yyyy")} -{" "}
                                    {convertDate(exp.end_date, "mm-yyyy")}
                                </time>
                                <p
                                    className="mb-4 text-sm font-thin text-gray-500 dark:text-gray-400"
                                    dangerouslySetInnerHTML={{
                                        __html: exp.description,
                                    }}
                                ></p>
                            </li>
                        </AnimateSection>
                    );
                })}
            </ol>
        </div>
    );
};

export default WorkExperienceCard;
