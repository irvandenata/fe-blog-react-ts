import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense, type ReactNode } from "react";
import LandingPage from "../pages/Landing";
import { checkAuthLoader, ifLogin, logout } from "@/utils/auth";
import MainLayout from "@/components/Layouts/MainLayout";
import ErrorPage from "@/pages/Error";
import { middlewareLoader } from "@/utils/middleware";
import SearchArticlePage from "@/pages/Blog/SearchArticle";
import ArticleDetailPage from "@/pages/Blog/ArticleDetail";
import NotFoundPage from "@/pages/404";

/**
 * Admin and auth screens are lazy-loaded so their heavy dependencies
 * (TinyMCE, draft-js, PrimeReact tables) stay out of the public bundle.
 * Public routes are imported eagerly — they are what gets prerendered and
 * what visitors and crawlers actually land on.
 */
const AdminLayout = lazy(() => import("../components/Layouts/AdminLayout"));
const LoginPage = lazy(() => import("../pages/Auth/Login"));
const DashboardPage = lazy(() => import("../pages/Admin/Dashboard"));
const SettingPage = lazy(() => import("../pages/Admin/Setting"));
const SeoPage = lazy(() => import("../pages/Admin/Seo"));
const CustomInformationPage = lazy(() => import("../pages/Admin/CustomInformation"));
const CustomInformationTypePage = lazy(() => import("../pages/Admin/CustomInformationType"));
const ArticlePage = lazy(() => import("../pages/Admin/Article"));
const ArticleCategoryPage = lazy(() => import("../pages/Admin/ArticleCategory"));
const ArticleTagPage = lazy(() => import("../pages/Admin/ArticleTag"));
const ArticleCreateOrEdit = lazy(() => import("@/pages/Admin/ArticleCreateOrEdit"));

const withSuspense = (node: ReactNode) => (
    <Suspense
        fallback={
            <div className="grid min-h-screen place-content-center dark:text-white">
                Loading…
            </div>
        }
    >
        {node}
    </Suspense>
);

export default createBrowserRouter(
    [
        {
            path: "/",
            element: <MainLayout />,
            errorElement: <ErrorPage />,
            children: [
                {
                    path: "/",
                    element: <LandingPage />,
                },
                {
                    path: "/not-found",
                    element: <NotFoundPage />,
                },
                {
                    path: "login",
                    element: withSuspense(<LoginPage />),
                    loader: ifLogin,
                },
                {
                    path: "logout",
                    loader: logout,
                    element: <></>,
                },
                {
                    path: "blogs",
                    children: [
                        {
                            path: "",
                            element: <SearchArticlePage />,
                        },
                        {
                            path: ":slug",
                            element: <ArticleDetailPage />,
                        },
                    ],
                },
            ],
        },
        {
            path: "admin",
            element: withSuspense(<AdminLayout />),
            errorElement: <ErrorPage />,
            loader: checkAuthLoader,
            action: () => {
                return null;
            },
            children: [
                {
                    path: "dashboard",
                    element: withSuspense(<DashboardPage />),
                    loader: middlewareLoader,
                },
                {
                    path: "settings",
                    element: withSuspense(<SettingPage />),
                    loader: middlewareLoader,
                },
                {
                    path: "seo",
                    element: withSuspense(<SeoPage />),
                    loader: middlewareLoader,
                },
                {
                    path: "custom-informations/items",
                    element: withSuspense(<CustomInformationPage />),
                    loader: middlewareLoader,
                },
                {
                    path: "custom-informations/types",
                    element: withSuspense(<CustomInformationTypePage />),
                    loader: middlewareLoader,
                },
                {
                    path: "article",
                    loader: middlewareLoader,
                    children: [
                        {
                            path: "posts",
                            element: withSuspense(<ArticlePage />),
                        },
                        {
                            path: "posts/action",
                            element: withSuspense(<ArticleCreateOrEdit />),
                        },
                        {
                            path: "categories",
                            element: withSuspense(<ArticleCategoryPage />),
                        },
                        {
                            path: "tags",
                            element: withSuspense(<ArticleTagPage />),
                        },
                    ],
                },
            ],
        },
    ],
    {}
);
