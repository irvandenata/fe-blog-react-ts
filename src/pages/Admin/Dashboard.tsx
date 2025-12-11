import { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { setMenu } from '@/redux/slices/menuSlice';
import CardDataStats from '@/components/CardDataStats';
import { fetchDashboardStats, DashboardStats } from '@/services/dashboard';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    const loadDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetchDashboardStats();
            setStats(response.data);
        } catch (error: any) {
            toast.error(error.message || 'Failed to load dashboard data');
            // Set default values if API fails
            setStats({
                totalArticles: 0,
                totalPublished: 0,
                totalDrafts: 0,
                totalCategories: 0,
                totalTags: 0,
                totalViews: 0,
                recentArticles: [],
                popularArticles: [],
                categoryDistribution: [],
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        dispatch(setMenu("Dashboard"));
        loadDashboardData();
    }, [dispatch, loadDashboardData]);

    const publishRate = useMemo(() => {
        if (!stats || stats.totalArticles === 0) return '0%';
        return `${Math.round((stats.totalPublished / stats.totalArticles) * 100)}%`;
    }, [stats]);

    const handleNavigateToArticle = useCallback((id: number) => {
        navigate(`/admin/article/posts/action?type=${id}`);
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <>
            <div className="mb-6">
                <h2 className="text-title-md2 font-semibold text-black dark:text-white">
                    Dashboard Overview
                </h2>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
                <CardDataStats
                    title="Total Articles"
                    total={stats?.totalArticles.toString() || '0'}
                    rate={publishRate}
                    levelUp={stats ? stats.totalPublished > stats.totalDrafts : false}
                >
                    <svg
                        className="fill-primary dark:fill-white"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M21.1063 18.0469L19.3875 3.23126C19.2157 1.71876 17.9438 0.584381 16.3969 0.584381H5.56878C4.05628 0.584381 2.78441 1.71876 2.57816 3.23126L0.859406 18.0469C0.756281 18.9063 1.03128 19.7313 1.61566 20.3844C2.20003 21.0375 2.99066 21.3813 3.85003 21.3813H18.1157C18.975 21.3813 19.8 21.0031 20.35 20.3844C20.9 19.7656 21.2094 18.9063 21.1063 18.0469ZM19.2157 19.3531C18.9407 19.6625 18.5625 19.8344 18.15 19.8344H3.85003C3.43753 19.8344 3.05941 19.6625 2.78441 19.3531C2.50941 19.0438 2.37191 18.6313 2.44066 18.2188L4.12503 3.43751C4.19378 2.71563 4.81253 2.16563 5.56878 2.16563H16.4313C17.1532 2.16563 17.7719 2.71563 17.875 3.43751L19.5938 18.2531C19.6282 18.6656 19.4907 19.0438 19.2157 19.3531Z"
                            fill=""
                        />
                        <path
                            d="M14.3345 5.29375C13.922 5.39688 13.647 5.80938 13.7501 6.22188C13.7845 6.42813 13.8189 6.63438 13.8189 6.80625C13.8189 8.35313 12.547 9.625 11.0001 9.625C9.45327 9.625 8.18139 8.35313 8.18139 6.80625C8.18139 6.6 8.21577 6.42813 8.25014 6.22188C8.35327 5.80938 8.07827 5.39688 7.66577 5.29375C7.25327 5.19063 6.84077 5.46563 6.73764 5.87813C6.66889 6.1875 6.63452 6.49688 6.63452 6.80625C6.63452 9.2125 8.5939 11.1719 11.0001 11.1719C13.4064 11.1719 15.3658 9.2125 15.3658 6.80625C15.3658 6.49688 15.3314 6.1875 15.2626 5.87813C15.1595 5.46563 14.747 5.225 14.3345 5.29375Z"
                            fill=""
                        />
                    </svg>
                </CardDataStats>

                <CardDataStats
                    title="Published"
                    total={stats?.totalPublished.toString() || '0'}
                    rate=""
                    levelUp
                >
                    <svg
                        className="fill-primary dark:fill-white"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M11.9999 0.350098C9.65839 0.350098 7.75005 2.25843 7.75005 4.60009C7.75005 6.94175 9.65839 8.85009 11.9999 8.85009C14.3416 8.85009 16.25 6.94175 16.25 4.60009C16.25 2.25843 14.3416 0.350098 11.9999 0.350098ZM11.9999 7.35009C10.5166 7.35009 9.25005 6.08352 9.25005 4.60009C9.25005 3.11666 10.5166 1.85009 11.9999 1.85009C13.4832 1.85009 14.75 3.11666 14.75 4.60009C14.75 6.08352 13.4832 7.35009 11.9999 7.35009Z"
                            fill=""
                        />
                        <path
                            d="M17.5334 13.85H6.46667C4.95417 13.85 3.71667 15.0875 3.71667 16.6V20.65C3.71667 21.0625 4.0375 21.3833 4.45 21.3833C4.8625 21.3833 5.18334 21.0625 5.18334 20.65V16.6C5.18334 15.8583 5.725 15.3167 6.46667 15.3167H17.5334C18.275 15.3167 18.8167 15.8583 18.8167 16.6V20.65C18.8167 21.0625 19.1375 21.3833 19.55 21.3833C19.9625 21.3833 20.2834 21.0625 20.2834 20.65V16.6C20.2834 15.0875 19.0459 13.85 17.5334 13.85Z"
                            fill=""
                        />
                    </svg>
                </CardDataStats>

                <CardDataStats
                    title="Total Views"
                    total={stats?.totalViews.toLocaleString() || '0'}
                    rate=""
                    levelUp
                >
                    <svg
                        className="fill-primary dark:fill-white"
                        width="22"
                        height="16"
                        viewBox="0 0 22 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M11 0C6.55556 0 2.66667 2.72727 0 6.72727C2.66667 10.7273 6.55556 13.4545 11 13.4545C15.4444 13.4545 19.3333 10.7273 22 6.72727C19.3333 2.72727 15.4444 0 11 0ZM11 11.4545C8.74074 11.4545 6.91111 9.62727 6.91111 7.36364C6.91111 5.1 8.74074 3.27273 11 3.27273C13.2593 3.27273 15.0889 5.1 15.0889 7.36364C15.0889 9.62727 13.2593 11.4545 11 11.4545ZM11 5.09091C9.75556 5.09091 8.74074 6.10909 8.74074 7.36364C8.74074 8.61818 9.75556 9.63636 11 9.63636C12.2444 9.63636 13.2593 8.61818 13.2593 7.36364C13.2593 6.10909 12.2444 5.09091 11 5.09091Z"
                            fill=""
                        />
                    </svg>
                </CardDataStats>

                <CardDataStats
                    title="Categories"
                    total={stats?.totalCategories.toString() || '0'}
                    rate=""
                >
                    <svg
                        className="fill-primary dark:fill-white"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M21.1063 18.0469L19.3875 3.23126C19.2157 1.71876 17.9438 0.584381 16.3969 0.584381H5.56878C4.05628 0.584381 2.78441 1.71876 2.57816 3.23126L0.859406 18.0469C0.756281 18.9063 1.03128 19.7313 1.61566 20.3844C2.20003 21.0375 2.99066 21.3813 3.85003 21.3813H18.1157C18.975 21.3813 19.8 21.0031 20.35 20.3844C20.9 19.7656 21.2094 18.9063 21.1063 18.0469ZM19.2157 19.3531C18.9407 19.6625 18.5625 19.8344 18.15 19.8344H3.85003C3.43753 19.8344 3.05941 19.6625 2.78441 19.3531C2.50941 19.0438 2.37191 18.6313 2.44066 18.2188L4.12503 3.43751C4.19378 2.71563 4.81253 2.16563 5.56878 2.16563H16.4313C17.1532 2.16563 17.7719 2.71563 17.875 3.43751L19.5938 18.2531C19.6282 18.6656 19.4907 19.0438 19.2157 19.3531Z"
                            fill=""
                        />
                    </svg>
                </CardDataStats>
            </div>

            {/* Recent and Popular Articles */}
            <div className="mt-7.5 grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
                {/* Recent Articles */}
                <div className="col-span-12 xl:col-span-6">
                    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                            Recent Articles
                        </h4>

                        <div className="flex flex-col">
                            <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-4">
                                <div className="p-2.5 xl:p-5">
                                    <h5 className="text-sm font-medium uppercase xsm:text-base">
                                        Title
                                    </h5>
                                </div>
                                <div className="p-2.5 text-center xl:p-5">
                                    <h5 className="text-sm font-medium uppercase xsm:text-base">
                                        Status
                                    </h5>
                                </div>
                                <div className="p-2.5 text-center xl:p-5">
                                    <h5 className="text-sm font-medium uppercase xsm:text-base">
                                        Views
                                    </h5>
                                </div>
                                <div className="hidden p-2.5 text-center sm:block xl:p-5">
                                    <h5 className="text-sm font-medium uppercase xsm:text-base">
                                        Date
                                    </h5>
                                </div>
                            </div>

                            {stats?.recentArticles && stats.recentArticles.length > 0 ? (
                                stats.recentArticles.map((article, key) => (
                                    <div
                                        className={`grid grid-cols-3 sm:grid-cols-4 cursor-pointer hover:bg-gray-2 dark:hover:bg-meta-4 ${
                                            key === stats.recentArticles.length - 1
                                                ? ''
                                                : 'border-b border-stroke dark:border-strokedark'
                                        }`}
                                        key={article.id}
                                        onClick={() => handleNavigateToArticle(article.id)}
                                    >
                                        <div className="flex items-center gap-3 p-2.5 xl:p-5">
                                            <p className="text-black dark:text-white line-clamp-2">
                                                {article.title}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                                            <span
                                                className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                                                    article.status === 'publish'
                                                        ? 'bg-success text-success'
                                                        : 'bg-warning text-warning'
                                                }`}
                                            >
                                                {article.status}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                                            <p className="text-black dark:text-white">
                                                {article.views || 0}
                                            </p>
                                        </div>

                                        <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                                            <p className="text-black dark:text-white">
                                                {new Date(article.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-5 text-center">
                                    <p className="text-black dark:text-white">No recent articles</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Popular Articles */}
                <div className="col-span-12 xl:col-span-6">
                    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                            Most Popular Articles
                        </h4>

                        <div className="flex flex-col">
                            <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4">
                                <div className="p-2.5 xl:p-5">
                                    <h5 className="text-sm font-medium uppercase xsm:text-base">
                                        Title
                                    </h5>
                                </div>
                                <div className="p-2.5 text-center xl:p-5">
                                    <h5 className="text-sm font-medium uppercase xsm:text-base">
                                        Category
                                    </h5>
                                </div>
                                <div className="p-2.5 text-center xl:p-5">
                                    <h5 className="text-sm font-medium uppercase xsm:text-base">
                                        Views
                                    </h5>
                                </div>
                            </div>

                            {stats?.popularArticles && stats.popularArticles.length > 0 ? (
                                stats.popularArticles.map((article, key) => (
                                    <div
                                        className={`grid grid-cols-3 cursor-pointer hover:bg-gray-2 dark:hover:bg-meta-4 ${
                                            key === stats.popularArticles.length - 1
                                                ? ''
                                                : 'border-b border-stroke dark:border-strokedark'
                                        }`}
                                        key={article.id}
                                        onClick={() => handleNavigateToArticle(article.id)}
                                    >
                                        <div className="flex items-center gap-3 p-2.5 xl:p-5">
                                            <p className="text-black dark:text-white line-clamp-2">
                                                {article.title}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                                            <p className="text-meta-3">{article.category_name}</p>
                                        </div>

                                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                                            <p className="text-meta-5">{article.views}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-5 text-center">
                                    <p className="text-black dark:text-white">No popular articles yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Distribution */}
            {stats?.categoryDistribution && stats.categoryDistribution.length > 0 && (
                <div className="mt-7.5">
                    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
                        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                            Articles by Category
                        </h4>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                            {stats.categoryDistribution.map((cat, index) => (
                                <div
                                    key={index}
                                    className="rounded-sm border border-stroke p-4 dark:border-strokedark"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h5 className="text-lg font-semibold text-black dark:text-white">
                                                {cat.count}
                                            </h5>
                                            <p className="text-sm text-bodydark">{cat.name}</p>
                                        </div>
                                        <div className="h-12 w-12 rounded-full bg-meta-2 dark:bg-meta-4 flex items-center justify-center">
                                            <svg
                                                className="fill-primary dark:fill-white"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"
                                                    fill=""
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DashboardPage;
