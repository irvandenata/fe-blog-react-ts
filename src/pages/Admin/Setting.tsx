import { ISetting } from "@/interfaces/setting";
import { setMenu } from "@/redux/slices/menuSlice";
import { useDispatch } from "react-redux";
import { fetchSettingData, updateSettingData } from "@/services/setting";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const SettingPage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setMenu("Settings"));
    });
    
    //get data from api
    const [data, setData] = useState<ISetting>();
    const [oldData, setOldData] = useState<ISetting>();
    const [imageData, setImageData] = useState<File>();
    const preview = useRef<HTMLImageElement | null>(null);
    const isLoading = useRef(false);
    const fieldImage = useRef<any>("");
    const fieldTitle = useRef<any>("");
    const fieldDescription = useRef<any>("");

    useEffect(() => {
        isLoading.current = true;
        toast
            .promise(fetchSettingData(), {
                loading: "Loading...",
                success: "Data has been loaded",
                error: "Error when loading data",
            })
            .then((res) => {
                
                setData({
                    header_title: res.data.header.title,
                    header_description: res.data.header.description,
                    header_image: res.data.header.image,
                });
                setOldData({
                    header_title: res.data.header.title,
                    header_description: res.data.header.description,
                    header_image: res.data.header.image,
                });
                isLoading.current = false;

                changeField();

            });
    }, []);

    const resetData = (e: any) => {
        e.preventDefault();
        setData(oldData);
        toast.success("Data has been reset");
    };

    const changeField = () => {
        if (!isLoading.current) {
            fieldImage.current.disabled = false;
            fieldTitle.current.disabled = false;
            fieldDescription.current.disabled = false;
        } else {
            fieldImage.current.disabled = true;
            fieldTitle.current.disabled = true;
            fieldDescription.current.disabled = true;
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (isLoading.current) {
            toast.loading("Wait...", {
                duration: 500,
            });
            return;
        }

        //disable button save

        // call api to update data
        isLoading.current = true;
        changeField();
        const formData = new FormData();
        formData.append("header_title", data!.header_title);
        formData.append("header_description", data!.header_description);
        if (imageData) {
            formData.append("header_image", imageData);
        }
        toast
            .promise(updateSettingData(formData), {
                loading: "Updating...",
                success: "Data has been updated",
                error: "Error when updating data",
            })
            .then((res) => {
                console.log(res);
                setOldData(res);
                isLoading.current = false;
                setImageData(undefined);
                changeField();
            });
    };

    const handleFieldImageChange = (e: any) => {
        const file = e.target.files[0];
        setImageData(file);
        preview.current!.src = URL.createObjectURL(file);
    };

    return (
        <>
            <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
                <div className="flex flex-col gap-9">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                Landing Page Settings
                            </h3>
                        </div>
                        <form onSubmit={handleSubmit} method="post">
                            <div className="flex flex-col gap-5.5 p-6.5">
                                <div>
                                    <label className="mb-3 block text-black dark:text-white">
                                        Header Title
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Header Title"
                                        value={data?.header_title || ""}
                                        onChange={(e) =>
                                            setData({
                                                ...data!,
                                                header_title: e.target.value,
                                            })
                                        }
                                        ref={fieldTitle}
                                        required
                                        disabled
                                        className="w-full disabled rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-not-allowed disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>

                                <div>
                                    <label className="mb-3 block text-black dark:text-white">
                                        Header Description
                                    </label>
                                    <textarea
                                        rows={6}
                                        placeholder="Header Description"
                                        value={data?.header_description || ""}
                                        onChange={(e) =>
                                            setData({
                                                ...data!,
                                                header_description:
                                                    e.target.value,
                                            })
                                        }
                                        ref={fieldDescription}
                                        disabled
                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-not-allowed disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="mb-3 block text-black dark:text-white">
                                        Header Image
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFieldImageChange}
                                        disabled
                                        ref={fieldImage}
                                        className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-not-allowed disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                                    />
                                </div>

                                <div
                                    id="previewImage"
                                    className="grid place-content-center mb-4"
                                >
                                    <img
                                        src={data?.header_image || ""}
                                        alt="preview"
                                        className="w-[400px]"
                                        ref={preview}
                                    />
                                </div>
                                <div className="flex justify-end gap-4.5">
                                    <button
                                        className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                                        onClick={(e) => resetData(e)}
                                    >
                                        Reset
                                    </button>
                                    <button
                                        className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                                        type="submit"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SettingPage;
