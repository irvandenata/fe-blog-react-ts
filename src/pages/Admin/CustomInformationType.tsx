import DynamicModal from "@/components/Modals/DynamicModal";
import CustomTable from "@/components/Tables/CustomTable";
import { ICustomInformationTypeTable } from "@/interfaces/customInformation";
import { setMenu } from "@/redux/slices/menuSlice";
import {
    endProccess,
    setModal,
    startProccess,
} from "@/redux/slices/modalSlice";
import {
    createData,
    deleteDataById,
    fetchData,
    getDataById,
    updateData,
} from "@/services/customInformations";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const CustomInformation = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setMenu("Custom Information"));
    });
    const [onProccess, setOnProccess] = useState(false);
    const [data, setData] = useState<ICustomInformationTypeTable>();
    const [query, setQuery] = useState({
        page: 1,
        per_page: 10,
        sort: "asc",
        search: "",
    });
    const nameField = useRef<any>("");

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
        nameField.current.value = "";
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
        dispatch(startProccess());
        toast
            .promise(
                createData({
                    name: nameField.current.value,
                }),
                {
                    loading: "Loading...",
                    success: "Data has been created",
                    error: "Error when loading data",
                }
            )
            .then((_) => {
                loadData();
                setOnProccess(false);
                dispatch(
                    setModal({
                        isOpen: false,
                    })
                );
                dispatch(endProccess());
                nameField.current.value = "";
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

        getDataById(id).then((res) => {
            nameField.current.disabled = false;
            nameField.current.value = res.data.name;
            dispatch(endProccess());
        });
    };

    const handleUpdate = (id: number) => {
        //validation
        if (!nameField.current.value) {
            toast.error("Name is required");
            nameField.current.focus();
            return;
        }
        dispatch(startProccess());
        toast
            .promise(
                updateData(
                    {
                        name: nameField.current.value,
                    },
                    id
                ),
                {
                    loading: "Loading...",
                    success: "Data has been updated",
                    error: "Error when loading data",
                }
            )
            .then((_) => {
                loadData();
                setOnProccess(false);
                dispatch(
                    setModal({
                        isOpen: false,
                        keyId: 0,
                    })
                );
                dispatch(endProccess());
                nameField.current.value = "";
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

    const fieldTable: string[] = ["No", "Name", "Action"];

    return (
        <>
            <DynamicModal
                onSubmit={handleSubmit}
                onUpdate={handleUpdate}
                onClose={handleCloseModal}
            >
                <div className="mx-2">
                    <form>
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
                    </form>
                </div>
            </DynamicModal>

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
};

export default CustomInformation;
