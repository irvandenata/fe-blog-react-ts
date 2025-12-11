import CustomTable from "@/components/Tables/CustomTable";
import { IArticleTable } from "@/interfaces/article";
import { setMenu } from "@/redux/slices/menuSlice";
import { setAction } from "@/redux/slices/actionSlice";
import { deleteDataById, fetchData } from "@/services/article";
import { useEffect, useState, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

interface QueryParams {
    page: number;
    per_page: number;
    sort: "asc" | "desc";
    search: string;
}

const Article = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [onProcess, setOnProcess] = useState(false);
    const [data, setData] = useState<IArticleTable | undefined>(undefined);
    const [query, setQuery] = useState<QueryParams>({
        page: 1,
        per_page: 10,
        sort: "asc",
        search: "",
    });

    const fieldTable = useMemo(
        () => [
            { field: "title", name: "Title" },
            { field: "category_name", name: "Category" },
            { field: "slug", name: "Slug" },
            { field: "status", name: "Status" },
            { field: "image_url", name: "Cover", type: "image" },
        ],
        []
    );

    const loadData = useCallback(async () => {
        try {
            setOnProcess(true);
            const response = await toast.promise(fetchData(query), {
                loading: "Loading articles...",
                success: "Articles loaded successfully",
                error: "Failed to load articles",
            });

            setData({
                data: response.data,
                ...response.meta,
            });
        } catch (error: any) {
            toast.error(error.message || "An error occurred");
        } finally {
            setOnProcess(false);
        }
    }, [query]);

    useEffect(() => {
        dispatch(setAction({ name: "view-data" }));
        dispatch(setMenu("Article"));
    }, [dispatch]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleCreate = useCallback(() => {
        dispatch(setAction({ name: "create" }));
        navigate("/admin/article/posts/action");
    }, [dispatch, navigate]);

    const handleEdit = useCallback(
        (id: number) => {
            dispatch(setAction({ name: "edit" }));
            navigate(`/admin/article/posts/action?type=${id}`);
        },
        [dispatch, navigate]
    );

    const handleDelete = useCallback(
        async (id: number) => {
            try {
                setOnProcess(true);
                await toast.promise(deleteDataById(id), {
                    loading: "Deleting article...",
                    success: "Article deleted successfully",
                    error: "Failed to delete article",
                });
                await loadData();
            } catch (error: any) {
                toast.error(error.message || "Failed to delete article");
            } finally {
                setOnProcess(false);
            }
        },
        [loadData]
    );

    return (
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
            <div className="flex flex-col gap-9">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex justify-between items-center">
                        <h3 className="font-medium text-black dark:text-white">
                            Article Management
                        </h3>
                        <div className="flex gap-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Total: {data?.total_data || 0} articles
                            </span>
                        </div>
                    </div>
                    <CustomTable
                        fieldTable={fieldTable}
                        data={data}
                        onProccess={onProcess}
                        setQuery={setQuery}
                        query={query}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    >
                        <button
                            onClick={handleCreate}
                            disabled={onProcess}
                            className={`px-4 py-2 rounded-xl bg-primary text-white hover:bg-opacity-90 transition-all ${
                                onProcess ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            <span className="flex items-center gap-2">
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                                Create New Article
                            </span>
                        </button>
                    </CustomTable>
                </div>
            </div>
        </div>
    );
};

export default Article;
