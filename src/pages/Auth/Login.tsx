import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/aceternity";
import { Label } from "@/components/UI/label";
import { Input } from "@/components/UI/input";
import toast, { Toaster } from "react-hot-toast";
import { login } from "@/services/auth";
import { ILogin } from "@/interfaces/auth";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { decodeJwt } from "@/utils/jwt";
import { useDispatch } from "react-redux";
import { resetDataUserState, setDataUserState } from "@/redux/slices/userSlice";
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    let Router = useNavigate();
    const dispatch = useDispatch();
    let loading = false;
    const loader = useRef<SVGSVGElement | null>(null);
    const btnSubmit = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        dispatch(resetDataUserState());
    }, []);
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        const data: ILogin = {
            email,
            password,
        };
        e.preventDefault();
        loader?.current?.classList.remove("hidden");
        btnSubmit?.current?.classList.add("cursor-not-allowed");
        btnSubmit?.current?.classList.add("opacity-50");
        if (loading) return;
        loading = true;
        await login(data)
            .then((result) => {
                loading = false;
                toast.success("Success login, Hola Master 👋");
                const { token } = result.data;
                //decode token and get payload
                const decoded = decodeJwt(token);

                // Mengambil payload
                dispatch(
                    setDataUserState({
                        email: decoded.email,
                        name: decoded.name,
                    })
                );

                const tokenBase64 = btoa(token);
                Cookies.set("token", tokenBase64, { expires: 1 });
                loading = false;
                loader?.current?.classList.add("hidden");
                btnSubmit?.current?.classList.remove("cursor-not-allowed");
                setTimeout(() => {
                    Router("/admin/dashboard");
                }, 1000);
            })
            .catch((error) => {
                toast.error(error.message);
                loading = false;
                loader?.current?.classList.add("hidden");
                btnSubmit?.current?.classList.remove("cursor-not-allowed");
                btnSubmit?.current?.classList.remove("opacity-50");
            });
    };
    return (
        <div className="w-full relative z-10 h-screen grid place-content-center">
            <Toaster
                toastOptions={{
                    className:
                        "dark:bg-dark-custom-200 dark:text-white text-sm",
                }}
            />
            <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
                <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
                    Hola Master 👋
                </h2>

                <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
                    Login to be able to access the dark side of the force
                </p>

                <form className="my-8" onSubmit={handleSubmit}>
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            placeholder="hacker@master.com"
                            type="email"
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </LabelInputContainer>
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            placeholder="••••••••"
                            type="password"
                            value={password}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </LabelInputContainer>
                    <button
                        className="bg-gradient-to-br  relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                        type="submit"
                        ref={btnSubmit}
                    >
                        <div>
                            <div className="relativ h-10">
                                <svg
                                    ref={loader}
                                    x-show="loading"
                                    className="animate-spin ml-3 my-3 mr-3 h-4 w-4 text-white absolute left-0 top-0 hidden"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                <div className="my-2">Login &rarr;</div>
                            </div>
                            <BottomGradient />
                        </div>
                    </button>

                    <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
                </form>
            </div>
        </div>
    );
};

const BottomGradient = () => {
    return (
        <>
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        </>
    );
};

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("flex flex-col space-y-2 w-full", className)}>
            {children}
        </div>
    );
};

export default Login;
