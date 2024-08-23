"use client";

import { createComment, fetchComments } from "@/services/article";
import { convertDate } from "@/utils/common";
import { useState } from "react";
import toast from "react-hot-toast";

const CommentCard: React.FC<{ articleId: string; slug: string }> = ({
    articleId,
    slug,
}) => {
    const [captchaText, setCaptchaText] = useState("");
    const [username, setUsername] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);

    const [comments, setComments] = useState<any[]>([]);
    useState(() => {
        const captcha = Math.random().toString(36).substring(2, 7);
        setCaptchaText(captcha);
    });

    const getComments = async (slug: string) => {
        fetchComments(slug).then((res) => {
            setComments(res.data);
        });
    };

    useState(() => {
        //get cookies username and password
        const cookie = document.cookie;
        const username = cookie
            .split(";")
            .find((item) => item.trim().startsWith("username="));
        const password = cookie
            .split(";")
            .find((item) => item.trim().startsWith("password="));
        if (username && password) {
            setUsername(username.split("=")[1]);
            setPassword(password.split("=")[1]);
        }


        
        //get comments
        getComments(slug);
    });

    const changeUser = () => {
        setUsername(null);
        setPassword(null);
        //remove cookies
        document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        document.cookie = "password=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        // disable button submit
        e.target.querySelector("button").disabled = true;
        if (e.target.captcha.value === captchaText) {
            const data = new FormData();

            if (username === null) {
                data.append("username", e.target.username.value);
                data.append("password", e.target.password.value);
            } else {
                data.append("username", username);
                data.append("password", password ?? "");
            }
            data.append("comment", e.target.comment.value);
            data.append("article_id", articleId);

            toast
                .promise(
                    createComment(data),
                    {
                        loading: "Sending comment...",
                        success: "Comment sent successfully",
                        error: "Failed to send comment",
                    },
                    {
                        duration: 3000,
                    }
                )
                .then((_) => {
                    // create cookies and store the username and password
                    if (username === null) {
                        document.cookie = `username=${e.target.username.value}`;
                        document.cookie = `password=${e.target.password.value}`;
                        setUsername(e.target.username.value);
                    }
                    const captcha = Math.random().toString(36).substring(2, 7);
                    setCaptchaText(captcha);
                    e.target.reset();
                    e.target.querySelector("button").disabled = false;
                    getComments(slug);
                })
                .catch((err) => {
                    e.target.querySelector("button").disabled = false;
                    toast.error(err.message);
                });
        } else {
            toast.error("Captcha is not correct !");
            e.target.querySelector("button").disabled = false;
        }
    };
    return (
        <div className="w-full mt-10  ">
            <div className="text-2xl font-bold text-center mb-3 dark:text-white text-dark">
                Comments
            </div>

            {comments.map((comment, index) => (
                <div
                    key={"comment-" + index}
                    className={`border-2 rounded-lg border-gray-dark p-5 mb-2
                    ${username === comment.username ? "bg-slate-600" : ""}
                    `}
                >
                    <b className="dark:text-white text-dark text-lg">
                        {comment.username}
                    </b>
                    <p className="text-justify">
                        <i>{comment.comment}</i>
                    </p>
                    <small>
                        {convertDate(comment.created_at, "MM DD, YYYY")}
                    </small>
                </div>
            ))}

            <form
                className="mt-6 w-full grid grid-cols-2 gap-2 text-black dark:bg-dark dark:border-gray-dark bg-slate-50 border-2 border-bodydark  p-6 rounded-lg mx-auto"
                id="form-article"
                onSubmit={handleSubmit}
            >
                <h3 className="text-2xl col-span-2 mb-6 font-bold dark:text-white text-dark">
                    Leave a Comment
                </h3>
                <input
                    type="hidden"
                    name="_token"
                    value="uq52npNjJSdPH13hzQifh2GrShmXd8iVdGi9X8rb"
                />
                {username !== null ? (
                    <>
                        <div className="col-span-2">
                            <h4 className=" dark:text-white text-dark">
                                You are logged in as <br />
                                <b className="text-[24px]">{username}</b>
                            </h4>
                        </div>
                        {/* change account */}
                        <div className="col-span-2">
                            <button
                                type="button"
                                onClick={changeUser}
                                className="text-black dark:bg-slate-400  dark:text-white bg-blue-700 hover:bg-blue-800 bg-background focus:ring-4 dark:hover:bg-primary hover:bg-primary focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                Change Account
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="mb-6 ">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white ">
                                Your Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                autoComplete="off"
                                className="bg-gray-50 border-2 border-bodydark  text-gray-900 text-sm rounded-lg focus:outline-primary  block w-full p-2.5 dark:bg-gray-700 dark:border-bodydark -600 dark:placeholder-gray-400 dark:text-dark dark:focus:border-bodydark  "
                                placeholder="your username"
                                onChange={(e) => {
                                    //remove space
                                    e.target.value = e.target.value.replace(
                                        / /g,
                                        ""
                                    );
                                }}
                                required
                            />
                        </div>
                        <div className="mb-6 ">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Your Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                autoComplete="off"
                                className="bg-gray-50 border-2 border-bodydark  text-gray-900 text-sm rounded-lg focus:outline-primary  block w-full p-2.5 dark:bg-gray-700 dark:border-bodydark -600 dark:placeholder-gray-400 dark:text-dark dark:focus:border-bodydark  "
                                placeholder="your password"
                                required
                            />
                        </div>
                    </>
                )}

                <div className="mb-6 col-span-2 ">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Your Comment
                    </label>
                    <textarea
                        id="comment"
                        className=" bg-gray-50 border-2 border-bodydark  text-gray-900 text-sm rounded-lg focus:outline-primary focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-bodydark -600 dark:placeholder-gray-400 dark:text-dark dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        spellCheck="false"
                        required
                    ></textarea>
                </div>
                <div className="mb-6 col-span-2">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Captcha
                    </label>
                    <div className="text-dark flex  my-2 dark:text-white text-center">
                        <div className="text-lg font-bold p-2 bg-bodydark rounded-lg dark:text-white">
                            {captchaText}
                        </div>
                    </div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white ">
                        Are you human? This website just for human only, if you
                        are jin, ghost, or robot, please go away
                    </label>
                    <input
                        type="text"
                        id="captcha"
                        autoComplete="off"
                        className="bg-gray-50 border-2 border-bodydark  text-gray-900 text-sm rounded-lg focus:outline-primary  block w-full p-2.5 dark:bg-gray-700 dark:border-bodydark -600 dark:placeholder-gray-400 dark:text-dark dark:focus:border-bodydark  "
                        placeholder="Type the captcha"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="text-black dark:bg-slate-400  dark:text-white bg-blue-700 hover:bg-blue-800 bg-background focus:ring-4 dark:hover:bg-primary hover:bg-primary focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
        </div>
    );
};

export default CommentCard;
