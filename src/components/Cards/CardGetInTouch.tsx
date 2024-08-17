"use client";

import AnimateSection from "../UI/AnimateSection";

const CardGetInTouch = () => {
    return (
        <div className="w-full lg:p-10 ">
            <AnimateSection
                className=""
                id="content-get-in-touch"
                parentId="get-in-touch"
                inAnimate="animate-fade-on"
                outAnimate="animate-go-away"
                bottom={200}
            >
                <div className="flex justify-center">
                    <h1 className="text-3xl font-bold">
                        Get <span className="text-primary">In</span> Touch
                    </h1>
                </div>
                <div className="flex justify-center text-center mt-4">
                    <p>
                        Feel free to reach out to me <br /> if you'd like to
                        discuss further or collaborate on a project
                    </p>
                </div>
            </AnimateSection>
            <AnimateSection
                className=""
                id="content-get-in-touch"
                parentId="get-in-touch"
                inAnimate="animate-fade-in"
                outAnimate="animate-go-away"
                bottom={200}
            >
            <form
                className="mt-6 lg:w-8/12 sm:w-full text-black dark:bg-dark dark:border-gray-dark bg-slate-50 border-2 border-bodydark  p-6 rounded-lg mx-auto"
                id="form-get-in-touch"
            >
                <input
                    type="hidden"
                    name="_token"
                    value="uq52npNjJSdPH13hzQifh2GrShmXd8iVdGi9X8rb"
                />
                <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Your Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        autoComplete="off"
                        className="bg-gray-50 border-2 border-bodydark  text-gray-900 text-sm rounded-lg focus:outline-primary  block w-full p-2.5 dark:bg-gray-700 dark:border-bodydark -600 dark:placeholder-gray-400 dark:text-white dark:focus:border-bodydark  "
                        placeholder="your name"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Your email
                    </label>
                    <input
                        type="email"
                        id="email"
                        autoComplete="off"
                        className="bg-gray-50 border-2 border-bodydark  text-gray-900 text-sm rounded-lg focus:outline-primary  block w-full p-2.5 dark:bg-gray-700 dark:border-bodydark -600 dark:placeholder-gray-400 dark:text-white dark:focus:border-bodydark  "
                        placeholder="your@email.com"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Your Message
                    </label>
                    <textarea
                        id="message"
                        className=" bg-gray-50 border-2 border-bodydark  text-gray-900 text-sm rounded-lg focus:outline-primary focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-bodydark -600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        spellCheck="false"
                    ></textarea>
                </div>
                <button
                    type="submit"
                    className="text-black dark:bg-slate-400 bg-slate-50 dark:text-white bg-blue-700 hover:bg-blue-800 bg-background focus:ring-4 dark:hover:bg-primary hover:bg-primary focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    Send &nbsp;
                    <svg
                        className="w-3.5 h-3.5 inline-block"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M1 5h12m0 0L9 1m4 4L9 9"
                        ></path>
                    </svg>
                </button>
            </form>
            </AnimateSection>   
        </div>
    );
};

export default CardGetInTouch;
