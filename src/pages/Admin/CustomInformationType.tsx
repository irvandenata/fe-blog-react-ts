import CustomTable from "@/components/Tables/CustomTable";
import { ICustomInformationTypeTable } from "@/interfaces/customInformation";
import { setMenu } from "@/redux/slices/menuSlice";
import { fetchData } from "@/services/customInformations";
import { createPagination } from "@/utils/createPagination";
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
                //    setPagination(
                //         usePagination({
                //             totalCount: 1500,
                //             pageSize: 10,
                //             siblingCount: 1,
                //             currentPage: 16,
                //         })
                //    );
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

    const fieldTable: string[] = ["No", "Name", "Action"];

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
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default CustomInformation;
