import SearchableSelect from "@/components/Forms/SearchAbleSelect";
import CustomTable from "@/components/Tables/CustomTable";
import { IArticleTable } from "@/interfaces/article";
import { setMenu } from "@/redux/slices/menuSlice";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
    endProccess,
    setModal,
    startProccess,
} from "@/redux/slices/modalSlice";

import { openModal as openModalImage } from "@/redux/slices/imageModalSlice";

import { setAction } from "@/redux/slices/actionSlice";
import {
    createData,
    deleteDataById,
    fetchData,
    getDataById,
    updateData,
} from "@/services/article";

import { fetchData as getDataCategory } from "@/services/articleCategory";
import { fetchData as getDataTag } from "@/services/articleTag";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import TextEditor from "@/components/Forms/TextEditor";
import htmlToDraft from "html-to-draftjs";
import MultiSelect from "@/components/Forms/MultiSelect";
import {
    resetDataState,
    storeDataState,
    setOnLoadSelectedOption,
} from "@/redux/slices/dataSlice";

const Article = () => {
    const dispatch = useDispatch();
    // run for the first time
    useEffect(() => {
        dispatch(setAction({ name: "view-data" }));
        dispatch(setMenu("Article"));
    }, []);
    const [content, setContent] = useState<any>();
    const selectedId = useSelector((state: any) => state.data.selectedOption);

    const [onProccess, setOnProccess] = useState(false);
    const [data, setData] = useState<IArticleTable>();
    const [query, setQuery] = useState({
        page: 1,
        per_page: 10,
        sort: "asc",
        search: "",
    });

    const [imageFile, setImageData] = useState<File>();
    const preview = useRef<any>();

    const idField = useRef<any>("");
    const titleField = useRef<any>("");
    const contentField = useRef<any>();
    const statusField = useRef<any>("");
    const imageField = useRef<any>("");
    const categoryField = useRef<any>("");

    const loadData = () => {
        toast
            .promise(fetchData(query), {
                loading: "Loading...",
                success: "Data has been loaded",
                error: "Error when loading data",
            })
            .then((res) => {
                setData({
                    data: res.data,
                    ...res.meta,
                });
                setOnProccess(false);
            })
            .catch((err) => {
                toast.error(err.message);

                setOnProccess(false);
            });
    };

    useEffect(() => {
        if (!onProccess) {
            setOnProccess(true);
            loadData();
        }
    }, [query]);

    const handleCreate = async () => {
        dispatch(
            setAction({
                name: "create",
            })
        );
        const response = await getDataTag({ all_data: 1 });
        dispatch(storeDataState({ tags: response.data }));
    };

    const resetFields = () => {
        titleField.current.value = "";
        contentField.current = "";
        statusField.current.value = "";
        imageField.current.value = "";
        categoryField.current.value = "";
        setContent("");
        setImageData(undefined);
        preview.current!.src = "";
        preview.current!.hidden = true;
    };

    const handleSubmit = () => {
        //validation
        if (!titleField.current.value) {
            toast.error("Title is required");
            titleField.current.focus();
            return;
        }

        if (!categoryField.current.value) {
            toast.error("Category is required");
            categoryField.current.focus();
            return;
        }

        if (!statusField.current.value) {
            toast.error("Status is required");
            statusField.current.focus();
            return;
        }

        const formData = new FormData();
        formData.append("title", titleField.current.value);
        formData.append("status", statusField.current.value);
        formData.append("content", contentField.current);
        formData.append(
            "category_id",
            categoryField.current.getAttribute("data-id")
        );

        if (selectedId.length > 0) {
            selectedId.forEach((id: any) => {
                formData.append("tags[]", id.toString());
            });
        }
        if (imageFile) {
            formData.append("image", imageFile);
        }
        dispatch(startProccess());
        toast
            .promise(createData(formData), {
                loading: "Loading...",
                success: "Data has been created",
                error: "Error when loading data",
            })
            .then((_) => {
                loadData();
                setOnProccess(false);
                dispatch(endProccess());
                dispatch(
                    setAction({
                        name: "view-data",
                    }),
                    dispatch(resetDataState())
                );
                resetFields();
            })
            .catch((err) => {
                toast.error(err.message);
                setOnProccess(false);
                dispatch(endProccess());
            });
    };

    const handleEdit: (id: number) => Promise<void> = async (id: number) => {
        getDataTag({ all_data: 1 }).then((response) => {
            dispatch(storeDataState({ tags: response.data }));
        });
        await dispatch(
            setAction({
                name: "update",
            })
        );
        dispatch(startProccess());
        titleField.current.disabled = true;
        titleField.current.value = "Please wait...";
        categoryField.current.disabled = true;
        categoryField.current.value = "Please wait...";
        statusField.current.disabled = true;
        statusField.current.value = "Please wait...";
        imageField.current.disabled = true;
        preview.current.hidden = true;
        dispatch(setOnLoadSelectedOption(true));
        getDataById(id).then(async (res) => {
            idField.current.value = res.data.id;
            titleField.current.disabled = false;
            titleField.current.value = res.data.title;
            // contentField.current.disabled = false;
            const blocksFromHtml = htmlToDraft(res.data.content);
            setContent(blocksFromHtml);
            contentField.current = res.data.content;
            statusField.current.disabled = false;
            categoryField.current.setAttribute("data-id", res.data.category_id);
            categoryField.current.value = res.data.category_name;
            categoryField.current.disabled = false;
            statusField.current.value = res.data.status;
            imageField.current.disabled = false;
            dispatch(
                storeDataState({
                    selectedOption: res.data.tags.map((tag: any) => tag.id),
                })
            );
            dispatch(setOnLoadSelectedOption(false));
            if (res.data.image_url) {
                preview.current.src = res.data.image_url;
                preview.current.hidden = false;
            }
            dispatch(endProccess());
        });
    };

    const handleUpdate = (id: number) => {
        //validation

        if (!titleField.current.value) {
            toast.error("Title is required");
            titleField.current.focus();
            return;
        }

        if (!categoryField.current.value) {
            toast.error("Category is required");
            categoryField.current.focus();
            return;
        }

        if (!statusField.current.value) {
            toast.error("Status is required");
            statusField.current.focus();
            return;
        }

        const formData = new FormData();
        formData.append("title", titleField.current.value);
        formData.append("status", statusField.current.value);
        formData.append("content", contentField.current);
        formData.append(
            "category_id",
            categoryField.current.getAttribute("data-id")
        );
        if (imageFile) {
            formData.append("image", imageFile);
        }

        if (selectedId.length > 0) {
            selectedId.forEach((id: any) => {
                formData.append("tags[]", id.toString());
            });
        }
        dispatch(startProccess());
        toast
            .promise(updateData(formData, id), {
                loading: "Loading...",
                success: "Data has been updated",
                error: "Error when loading data",
            })
            .then((_) => {
                loadData();
                setOnProccess(false);
                dispatch(endProccess());
                resetFields();
                dispatch(
                    setAction({
                        name: "view-data",
                    }),
                    dispatch(resetDataState())
                );
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.message);
                setOnProccess(false);
                dispatch(endProccess());
            });
    };

    const handleDelete = (id: number) => {
        setOnProccess(true);
        toast
            .promise(deleteDataById(id), {
                loading: "Loading...",
                success: "Data has been deleted",
                error: "Error when loading data",
            })
            .then((_) => {
                loadData();
            })
            .catch((err) => {
                toast.error(err.message);
                setOnProccess(false);
            });
    };

    const fieldTable: any = [
        { field: "title", name: "Title" },
        { field: "category_name", name: "Category" },
        { field: "slug", name: "Slug" },
        { field: "status", name: "Status" },
        { field: "image_url", name: "Cover", type: "image" },
    ];

    // create handleFieldImageChange function

    const handleFieldImageChange = (e: any) => {
        const file = e.target.files[0];
        setImageData(file);
        preview.current!.src = URL.createObjectURL(file);
        preview.current!.hidden = false;
    };

    const action = useSelector((state: any) => state.action.name);

    if (action === "create" || action === "update") {
        return (
            <>
                <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
                    <div className="flex flex-col gap-9">
                        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                                <h3 className="font-medium text-black dark:text-white">
                                    Create Data
                                </h3>
                            </div>
                            <input type="hidden" ref={idField} />
                            <div className="form p-4">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();

                                        action === "create"
                                            ? handleSubmit()
                                            : handleUpdate(
                                                  idField.current.value
                                              );
                                    }}
                                >
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            className="shadow dark:bg-slate-200 dark:text-dark appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="title"
                                            placeholder="Title"
                                            required
                                            ref={titleField}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Category
                                        </label>
                                        <SearchableSelect
                                            field={categoryField}
                                            getData={getDataCategory}
                                            placeholder="Select Category"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Status
                                        </label>
                                        <select
                                            className="shadow dark:bg-slate-200 dark:text-dark appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="status"
                                            required
                                            ref={statusField}
                                        >
                                            <option value="draft">Draft</option>

                                            <option value="publish">
                                                Publish
                                            </option>
                                        </select>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Image
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFieldImageChange}
                                            ref={imageField}
                                            className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-not-allowed disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                                        />

                                        <div id="preview" className="mt-2">
                                            <div
                                                id="previewImage"
                                                className="grid place-content-center mb-4"
                                            >
                                                <img
                                                    alt="preview"
                                                    className="h-40"
                                                    hidden
                                                    onClick={() =>
                                                        dispatch(
                                                            openModalImage({
                                                                imageUrl:
                                                                    preview
                                                                        .current
                                                                        .src,
                                                            })
                                                        )
                                                    }
                                                    ref={preview}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Tags
                                        </label>
                                        <MultiSelect id="tags"></MultiSelect>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Content
                                        </label>
                                        <TextEditor
                                            content={content}
                                            field={contentField}
                                        />
                                    </div>

                                    <div className="flex justify-end p-4 dark:border-graydark border-t">
                                        <button
                                            onClick={() => {
                                                setContent("");
                                                dispatch(
                                                    setAction({
                                                        name: "view-data",
                                                    })
                                                );
                                                dispatch(resetDataState());
                                            }}
                                            // disabled={modal.onProcess}
                                            className={`bg-blue-500 ${
                                                false
                                                    ? "cursor-not-allowed"
                                                    : ""
                                            } bg-slate-500 ml-2 text-white px-4 py-2 rounded-lg hover:bg-blue-600`}
                                        >
                                            Back
                                        </button>

                                        <button
                                            // disabled={}
                                            className={`bg-blue-500 ${
                                                false
                                                    ? "cursor-not-allowed"
                                                    : ""
                                            } bg-primary ml-2 text-white px-4 py-2 rounded-lg hover:bg-blue-600`}
                                        >
                                            {action === "create"
                                                ? "Create"
                                                : "Update"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <>
                <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
                    <div className="flex flex-col gap-9">
                        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                                <h3 className="font-medium text-black dark:text-white">
                                    List Data
                                </h3>
                            </div>
                            <CustomTable
                                fieldTable={fieldTable}
                                data={data}
                                onProccess={onProccess}
                                setQuery={setQuery}
                                query={query}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            >
                                <button
                                    onClick={handleCreate}
                                    className="px-4 py-2 rounded-xl bg-primary text-white"
                                >
                                    Create New Item
                                </button>
                            </CustomTable>
                        </div>
                    </div>
                </div>
            </>
        );
    }
};

export default Article;
