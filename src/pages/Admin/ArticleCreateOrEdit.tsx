import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Editor } from "@tinymce/tinymce-react";
import { MultiSelect } from "primereact/multiselect";
// Imported here rather than globally: this is the only page that renders a
// PrimeReact component, and the theme pulls in ~1 MB of CSS and fonts.
import "primereact/resources/themes/lara-light-blue/theme.css";

import SearchableSelect from "@/components/Forms/SearchAbleSelect";
import { setMenu } from "@/redux/slices/menuSlice";
import { endProccess, startProccess } from "@/redux/slices/modalSlice";
import { openModal as openModalImage } from "@/redux/slices/imageModalSlice";
import { setAction } from "@/redux/slices/actionSlice";
import { storeDataState, setOnLoadSelectedOption } from "@/redux/slices/dataSlice";

import { createData, getDataById, updateData } from "@/services/article";
import { fetchData as getDataCategory } from "@/services/articleCategory";
import { fetchData as getDataTag } from "@/services/articleTag";

interface ArticleTag {
    id: number;
    name: string;
}

const ArticleCreateOrEdit = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Refs for category (SearchableSelect uses ref)
    const categoryField = useRef<HTMLInputElement>(null);
    const preview = useRef<HTMLImageElement>(null);

    // Controlled form state
    const [formData, setFormData] = useState({
        id: "",
        title: "",
        status: "",
        categoryId: "",
        categoryName: "",
    });

    // Other state
    const [content, setContent] = useState<string>("");
    const [articleTags, setArticleTags] = useState<{ name: string; value: number }[]>([]);
    const [selectedTags, setSelectedTags] = useState<number[]>([]);
    const [onProcess, setOnProcess] = useState(false);
    const [imageFile, setImageFile] = useState<File | undefined>(undefined);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [isInitialized, setIsInitialized] = useState(false);
    const [categoryKey, setCategoryKey] = useState(0); // Key to force SearchableSelect re-render

    const action = useSelector((state: any) => state.action.name);

    // Get article ID from URL
    const articleId = useMemo(() => {
        const params = new URLSearchParams(location.search);
        const id = params.get("type");
        return id ? parseInt(id) : null;
    }, [location.search]);

    // Load tags
    const loadTags = useCallback(async () => {
        try {
            const response = await getDataTag({ all_data: 1 });
            const formattedTags = response.data.map((tag: ArticleTag) => ({
                name: tag.name,
                value: tag.id,
            }));
            setArticleTags(formattedTags);
            dispatch(storeDataState({ tags: response.data }));
        } catch (error) {
            toast.error("Failed to load tags");
        }
    }, [dispatch]);

    // Reset form
    const resetForm = useCallback(() => {
        setFormData({
            id: "",
            title: "",
            status: "",
            categoryId: "",
            categoryName: "",
        });
        setContent("");
        setImageFile(undefined);
        setSelectedTags([]);
        setPreviewUrl("");
        setCategoryKey(0); // Reset category key
        if (categoryField.current) {
            categoryField.current.value = "";
            categoryField.current.setAttribute("data-id", "0");
        }
        if (preview.current) preview.current.hidden = true;
    }, []);

    // Validate form
    const validateForm = useCallback((): boolean => {
        if (!formData.title.trim()) {
            toast.error("Title is required");
            return false;
        }

        if (!categoryField.current?.value?.trim()) {
            toast.error("Category is required");
            categoryField.current?.focus();
            return false;
        }

        if (!formData.status) {
            toast.error("Status is required");
            return false;
        }

        if (!content?.trim()) {
            toast.error("Content is required");
            return false;
        }

        return true;
    }, [formData, content]);

    // Build form data
    const buildFormData = useCallback((): FormData => {
        const data = new FormData();

        data.append("title", formData.title.trim());
        data.append("status", formData.status);
        data.append("content", content);

        const categoryId = categoryField.current?.getAttribute("data-id");
        if (categoryId) {
            data.append("category_id", categoryId);
        }

        if (selectedTags.length > 0) {
            selectedTags.forEach((id) => {
                data.append("tags[]", id.toString());
            });
        }

        if (imageFile) {
            data.append("image", imageFile);
        }

        return data;
    }, [formData, content, selectedTags, imageFile]);

    // Handle submit (create)
    const handleSubmit = useCallback(async () => {
        console.log("handleSubmit called");

        if (!validateForm()) {
            console.log("Validation failed");
            return;
        }

        try {
            setOnProcess(true);
            dispatch(startProccess());

            const data = buildFormData();
            console.log("FormData built for create");

            await toast.promise(createData(data), {
                loading: "Creating article...",
                success: "Article created successfully",
                error: "Failed to create article",
            });

            console.log("Article created successfully");
            navigate("/admin/article/posts");
        } catch (error: any) {
            console.error("Create error:", error);
            toast.error(error.message || "Failed to create article");
            setOnProcess(false);
            dispatch(endProccess());
        }
    }, [validateForm, buildFormData, dispatch, navigate]);

    // Handle update
    const handleUpdate = useCallback(
        async (id: number) => {
            console.log("handleUpdate called with ID:", id);

            if (!id || isNaN(id)) {
                toast.error("Invalid article ID");
                console.error("Invalid ID provided to handleUpdate:", id);
                return;
            }

            if (!validateForm()) {
                console.log("Validation failed for update");
                return;
            }

            try {
                setOnProcess(true);
                dispatch(startProccess());

                const data = buildFormData();
                console.log("FormData built for update, ID:", id);

                await toast.promise(updateData(data, id), {
                    loading: "Updating article...",
                    success: "Article updated successfully",
                    error: "Failed to update article",
                });

                console.log("Article updated successfully");
                setOnProcess(false);
                dispatch(endProccess());
            } catch (error: any) {
                console.error("Update error:", error);
                toast.error(error.message || "Failed to update article");
                setOnProcess(false);
                dispatch(endProccess());
            }
        },
        [validateForm, buildFormData, dispatch]
    );

    // Handle image change
    const handleFieldImageChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                setImageFile(file);
                const url = URL.createObjectURL(file);
                setPreviewUrl(url);
            }
        },
        []
    );

    // Handle back navigation
    const handleBack = useCallback(() => {
        navigate("/admin/article/posts");
    }, [navigate]);

    // Handle form submission
    const handleFormSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();

            console.log("Form submitted, action:", action);
            console.log("Form ID:", formData.id);
            console.log("Article ID from URL:", articleId);

            // Check if we have an article ID (edit mode)
            const currentArticleId = formData.id || articleId;

            if (currentArticleId) {
                // Edit mode
                console.log("Edit mode - updating article:", currentArticleId);
                handleUpdate(typeof currentArticleId === 'string' ? parseInt(currentArticleId) : currentArticleId);
            } else {
                // Create mode
                console.log("Create mode - creating new article");
                handleSubmit();
            }
        },
        [action, articleId, formData.id, handleSubmit, handleUpdate]
    );

    // Image upload handler for TinyMCE - Convert to base64
    const handleEditorImageUpload = useCallback(
        (blobInfo: any, progress: (percent: number) => void): Promise<string> => {
            return new Promise((resolve, reject) => {
                try {
                    const reader = new FileReader();

                    reader.onloadstart = () => {
                        progress(0);
                    };

                    reader.onprogress = (e) => {
                        if (e.lengthComputable) {
                            progress((e.loaded / e.total) * 100);
                        }
                    };

                    reader.onload = () => {
                        const base64 = reader.result as string;
                        progress(100);
                        resolve(base64);
                    };

                    reader.onerror = () => {
                        toast.error("Failed to read image");
                        reject(new Error("Failed to read image"));
                    };

                    reader.readAsDataURL(blobInfo.blob());
                } catch (error) {
                    toast.error("Failed to process image");
                    reject(error);
                }
            });
        },
        []
    );

    // Initialize
    useEffect(() => {
        const initializeCreate = async () => {
            console.log("Initializing create mode");
            resetForm();
            dispatch(setAction({ name: "create" }));
            await loadTags();
            setIsInitialized(true);
        };

        const initializeEdit = async (id: number) => {
            try {
                console.log("Initializing edit mode for ID:", id);
                dispatch(setAction({ name: "update" }));
                dispatch(startProccess());
                dispatch(setOnLoadSelectedOption(true));

                await loadTags();
                const response = await getDataById(id);
                const article = response.data;

                console.log("Article loaded:", article);
                console.log("Category object:", article.category);

                // Populate form with controlled state
                setFormData({
                    id: article.id.toString(),
                    title: article.title,
                    status: article.status,
                    categoryId: article.category?.id?.toString() || "",
                    categoryName: article.category?.name || "",
                });

                console.log("FormData set:", {
                    id: article.id.toString(),
                    title: article.title,
                    status: article.status,
                    categoryId: article.category?.id?.toString() || "",
                    categoryName: article.category?.name || "",
                });

                // Set content
                setContent(article.content);

                // Set tags
                const tagIds = article.tags.map((tag: ArticleTag) => tag.id);
                setSelectedTags(tagIds);
                dispatch(storeDataState({ selectedOption: tagIds }));

                // Set preview image
                if (article.image_url) {
                    setPreviewUrl(article.image_url);
                }

                dispatch(setOnLoadSelectedOption(false));
                dispatch(endProccess());

                // Increment key to force SearchableSelect re-render with new data
                setCategoryKey(prev => prev + 1);

                setIsInitialized(true);

                console.log("Form populated successfully");
            } catch (error) {
                console.error("Failed to load article:", error);
                toast.error("Failed to load article");
                dispatch(endProccess());
                initializeCreate();
            }
        };

        dispatch(setMenu("Article"));

        if (articleId) {
            initializeEdit(articleId);
        } else {
            initializeCreate();
        }
    }, [articleId, dispatch, loadTags, resetForm]);

    // Set category field when formData changes (for edit mode)
    useEffect(() => {
        if (formData.categoryId && formData.categoryName && categoryField.current) {
            // Use setTimeout to ensure SearchableSelect has rendered
            setTimeout(() => {
                if (categoryField.current) {
                    categoryField.current.setAttribute("data-id", formData.categoryId);
                    categoryField.current.value = formData.categoryName;
                    console.log("Category field updated:", formData.categoryName, "ID:", formData.categoryId);
                }
            }, 100);
        }
    }, [formData.categoryId, formData.categoryName, categoryKey]);

    if (!isInitialized) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
            <div className="flex flex-col gap-9">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            {action === "create" ? "Create Article" : "Edit Article"}
                        </h3>
                    </div>

                    <div className="form p-4">
                        <form onSubmit={handleFormSubmit}>
                            {/* Title */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="shadow dark:bg-slate-200 dark:text-dark appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-primary"
                                    placeholder="Enter article title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            {/* Category */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <SearchableSelect
                                    key={categoryKey}
                                    field={categoryField}
                                    getData={getDataCategory}
                                    placeholder="Select Category"
                                />
                            </div>

                            {/* Status */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                                    Status <span className="text-red-500">*</span>
                                </label>
                                <select
                                    className="shadow dark:bg-slate-200 dark:text-dark appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-primary"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="">Select status</option>
                                    <option value="draft">Draft</option>
                                    <option value="publish">Publish</option>
                                </select>
                            </div>

                            {/* Cover Image */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                                    Cover Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFieldImageChange}
                                    className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-not-allowed disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                                />

                                {previewUrl && (
                                    <div className="mt-2">
                                        <div className="grid place-content-center mb-4">
                                            <img
                                                alt="preview"
                                                src={previewUrl}
                                                className="h-40 cursor-pointer hover:opacity-90 transition-opacity rounded-lg"
                                                onClick={() => {
                                                    dispatch(
                                                        openModalImage({
                                                            imageUrl: previewUrl,
                                                        })
                                                    );
                                                }}
                                                ref={preview}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Tags */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                                    Tags
                                </label>
                                <MultiSelect
                                    style={{
                                        backgroundColor: "var(--highlight-bg)",
                                        color: "black",
                                        borderRadius: "var(--border-radius)",
                                    }}
                                    value={selectedTags}
                                    onChange={(e) => setSelectedTags(e.value)}
                                    options={articleTags}
                                    optionLabel="name"
                                    optionValue="value"
                                    placeholder="Select Tags"
                                    className="w-full"
                                    display="chip"
                                />
                            </div>

                            {/* Content Editor */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                                    Content <span className="text-red-500">*</span>
                                </label>
                                <Editor
                                    apiKey="i1nnds4l5jeoaufjhsu6l45pa8zxzdwc4vwh9dktv8d5gig4"
                                    value={content}
                                    onEditorChange={(newContent) => setContent(newContent)}
                                    init={{
                                        height: 500,
                                        menubar: false,
                                        plugins:
                                            "preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons accordion",
                                        toolbar:
                                            "undo redo | accordion accordionremove | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link image media | table | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | pagebreak anchor codesample | ltr rtl",
                                        autosave_ask_before_unload: true,
                                        autosave_interval: "30s",
                                        autosave_prefix: "{path}{query}-{id}-",
                                        autosave_restore_when_empty: false,
                                        autosave_retention: "2m",
                                        image_advtab: true,
                                        images_upload_handler: handleEditorImageUpload,
                                        automatic_uploads: true,
                                        file_picker_types: "image",
                                        image_caption: true,
                                        quickbars_selection_toolbar:
                                            "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
                                        noneditable_class: "mceNonEditable",
                                        toolbar_mode: "sliding",
                                        contextmenu: "link image table",
                                        content_style:
                                            "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
                                    }}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-2 p-4 dark:border-graydark border-t">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    disabled={onProcess}
                                    className={`bg-slate-500 text-white px-6 py-2 rounded-lg hover:bg-slate-600 transition-all ${
                                        onProcess ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                >
                                    Back
                                </button>

                                <button
                                    type="submit"
                                    disabled={onProcess}
                                    className={`bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-all ${
                                        onProcess ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                >
                                    {onProcess
                                        ? "Processing..."
                                        : action === "create"
                                        ? "Create Article"
                                        : "Update Article"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleCreateOrEdit;
