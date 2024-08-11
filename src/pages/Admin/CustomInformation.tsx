import { fetchSettingData, updateSettingData } from "@/services/setting";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const CustomInformation = () => {
    //get data from api
    const [data, setData] = useState<any>([]);
    const [oldData, setOldData] = useState<any>([]);
    const [imageData, setImageData] = useState<any>([]);
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
                changeField();
                setData(res.data);
                setOldData(res.data);
                isLoading.current = false;
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
        formData.append("header_title", data.header.title);
        formData.append("header_description", data.header.description);
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
                setImageData(null);
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
                                Data List
                            </h3>
                        </div>
                        <div className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left  dark:bg-dark rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-900 dark:border-graydark border-b dark:bg-slate-800 uppercase dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Product name
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Color
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Category
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Price
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-white dark:border-graydark border-b dark:bg-dark-custom-900">
                                        <th
                                            scope="row"
                                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                        >
                                            Apple MacBook Pro 17"
                                        </th>
                                        <td className="px-6 py-4">Silver</td>
                                        <td className="px-6 py-4">Laptop</td>
                                        <td className="px-6 py-4">$2999</td>
                                    </tr>
                                    <tr className="bg-white dark:border-graydark border-b dark:bg-dark-custom-900">
                                        <th
                                            scope="row"
                                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                        >
                                            Apple MacBook Pro 17"
                                        </th>
                                        <td className="px-6 py-4">Silver</td>
                                        <td className="px-6 py-4">Laptop</td>
                                        <td className="px-6 py-4">$2999</td>
                                    </tr>
                                    
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CustomInformation;
