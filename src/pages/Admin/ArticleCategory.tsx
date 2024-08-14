import DynamicModal from "@/components/Modals/DynamicModal";
import CustomTable from "@/components/Tables/CustomTable";
import { IArticleCategoryTable } from "@/interfaces/article";
import { setMenu } from "@/redux/slices/menuSlice";
import {
    endProccess,
    setModal,
    startProccess,
} from "@/redux/slices/modalSlice";

import { openModal as openModalImage } from "@/redux/slices/imageModalSlice";

import {
    createData,
    deleteDataById,
    fetchData,
    getDataById,
    updateData,
} from "@/services/articleCategory";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const ArticleCategory = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setMenu("Article Category"));
    });

    const [onProccess, setOnProccess] = useState(false);
    const [data, setData] = useState<IArticleCategoryTable>();
    const [query, setQuery] = useState({
        page: 1,
        per_page: 10,
        sort: "asc",
        search: "",
    });

    const [imageFile, setImageData] = useState<File>();
    const preview = useRef<any>();

    const nameField = useRef<any>("");
    const imageField = useRef<any>("");

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

    const handleCreate = () => {
        nameField!.current.value = "";
        preview.current!.hidden = true;
        imageField.current.value = "";
        setImageData(undefined);
        dispatch(
            setModal({
                isOpen: true,
                title: "Create New Item",
            })
        );
    };

    const handleSubmit = () => {
        //validation
        if (!nameField.current.value) {
            toast.error("Name is required");
            nameField.current.focus();
            return;
        }

        const formData = new FormData();
        formData.append("name", nameField.current.value);
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
                dispatch(
                    setModal({
                        isOpen: false,
                    })
                );
                dispatch(endProccess());
                resetFields();
            })
            .catch((err) => {
                toast.error(err.message);
                setOnProccess(false);
                dispatch(endProccess());
            });
    };

    const handleCloseModal = () => {
        dispatch(
            setModal({
                isOpen: false,
            })
        );
    };

    const resetFields = () => {
        nameField.current.value = "";
        setImageData(undefined);
        preview.current!.src = "";
        preview.current!.hidden = true;
    };

    const handleEdit: (id: number) => void = (id: number) => {
        dispatch(
            setModal({
                isOpen: true,
                title: "Edit Item",
                isUpdate: true,
                keyId: id,
            })
        );
        dispatch(startProccess());
        nameField.current.disabled = true;
        nameField.current.value = "Please wait...";
        imageField.current.disabled = true;
        preview.current.hidden = true;

        getDataById(id).then((res) => {
            nameField.current.disabled = false;
            nameField.current.value = res.data.name;
            imageField.current.disabled = false;
            preview.current.src = res.data.image_url;
            preview.current.hidden = false;
            dispatch(endProccess());
        });
    };

    const handleUpdate = (id: number) => {
        if (!nameField.current.value) {
            toast.error("Name is required");
            nameField.current.focus();
            return;
        }

        const formData = new FormData();
        formData.append("name", nameField.current.value);
        if (imageFile) {
            formData.append("image", imageFile);
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
                dispatch(
                    setModal({
                        isOpen: false,
                        isUpdate: false,
                        keyId: 0,
                    })
                );
                dispatch(endProccess());
                resetFields();
            })
            .catch((err) => {
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
        { field: "name", name: "Name" },
        { field: "slug", name: "Slug" },
        { field: "image_url", name: "Image", type: "image" },
    ];

    const handleFieldImageChange = (e: any) => {
        const file = e.target.files[0];
        setImageData(file);
        preview.current!.src = URL.createObjectURL(file);
        preview.current!.hidden = false;
    };

    return (
        <>
            <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
                <DynamicModal
                    onSubmit={handleSubmit}
                    onUpdate={handleUpdate}
                    onClose={handleCloseModal}
                >
                    <div className="mx-2">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmit();
                            }}
                        >
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    className="shadow dark:bg-slate-200 dark:text-dark appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="name"
                                    placeholder="Name"
                                    required
                                    ref={nameField}
                                />
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
                                                            preview.current.src,
                                                    })
                                                )
                                            }
                                            ref={preview}
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </DynamicModal>
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
};

export default ArticleCategory;
