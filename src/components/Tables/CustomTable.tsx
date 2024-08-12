import { ICustomInformation } from "@/interfaces/customInformation";
import { usePagination } from "@/hooks/usePagination";
import { useRef, useState } from "react";
import { CustomTableProps } from "@/interfaces/common";
import AlertDialog from "../Modals/AlertDialog";
import { useDispatch } from "react-redux";
import { openModal as openModalImage } from "@/redux/slices/imageModalSlice";

export const CustomTable: React.FC<CustomTableProps> = ({
    fieldTable,
    data,
    onProccess,
    onDelete,
    onEdit,
    setQuery,
    query,
    children,
}) => {
    const pagination = usePagination({
        totalCount: data?.total,
        pageSize: data?.per_page,
        siblingCount: 1,
        currentPage: data?.current_page,
    });

    const dispatch = useDispatch();

    const handleChangePage = (page: number) => {
        if (page === data?.current_page) return;
        setQuery({
            ...query,
            page: page,
        });
    };

    const debounceTimeoutRef = useRef(0);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = setTimeout(() => {
            setQuery({
                ...query,
                search: value,
            });
        }, 500);
    };

    const deleteId = useRef<number>(0);
    const handleDelete = () => {
        onDelete!(deleteId.current);
        setIsDialogOpen(false);
    };

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <div className="">
            <AlertDialog
                isOpen={isDialogOpen}
                title="Are you sure?"
                message="Do you really want to delete this item? This process cannot be undone."
                icon='<?xml version="1.0" ?><svg baseProfile="tiny"
                color="#FEA80B" fill="#FEA80B"
                height="80px" width="80px" id="Layer_1" version="1.2" viewBox="0 0 24 24"  xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M21.171,15.398l-5.912-9.854C14.483,4.251,13.296,3.511,12,3.511s-2.483,0.74-3.259,2.031l-5.912,9.856  c-0.786,1.309-0.872,2.705-0.235,3.83C3.23,20.354,4.472,21,6,21h12c1.528,0,2.77-0.646,3.406-1.771  C22.043,18.104,21.957,16.708,21.171,15.398z M12,17.549c-0.854,0-1.55-0.695-1.55-1.549c0-0.855,0.695-1.551,1.55-1.551  s1.55,0.696,1.55,1.551C13.55,16.854,12.854,17.549,12,17.549z M13.633,10.125c-0.011,0.031-1.401,3.468-1.401,3.468  c-0.038,0.094-0.13,0.156-0.231,0.156s-0.193-0.062-0.231-0.156l-1.391-3.438C10.289,9.922,10.25,9.712,10.25,9.5  c0-0.965,0.785-1.75,1.75-1.75s1.75,0.785,1.75,1.75C13.75,9.712,13.711,9.922,13.633,10.125z"/></svg>'
                onConfirm={handleDelete}
                onCancel={() => setIsDialogOpen(false)}
                confirmText="Yes, delete it!"
                cancelText="No, cancel!"
            />
            <div className="mx-4 my-4 flex">
                <div>{children}</div>
                <div className="flex-grow"></div>
                <div>
                    <input
                        type="text"
                        placeholder="Search..."
                        onChange={handleSearch}
                        className="px-4 py-2 border dark:bg-slate-200 dark:text-dark border-gray-300 dark:border-graydark rounded-md"
                    />
                </div>
            </div>
            <div className="overflow-x-auto scrollbar-thin dark:scrollbar-thumb-black dark:scrollbar-track-slate-500">
                <table
                    style={{ minWidth: "100%" }}
                    className="text-sm text-left
             dark:bg-dark rtl:text-right text-gray-500 dark:text-gray-400"
                >
                    <thead className="text-xs text-gray-900 dark:border-graydark border-slate-300 border-b dark:bg-slate-800 uppercase dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3 w-1/12">
                                No
                            </th>
                            {fieldTable.map((field: any, index: any) => {
                                return (
                                    <th
                                        key={index}
                                        scope="col"
                                        className="px-6 py-3"
                                    >
                                        {field.name}
                                    </th>
                                );
                            })}
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {!onProccess &&
                            data?.data.map(
                                (field: ICustomInformation, index: number) => {
                                    return (
                                        <tr
                                            key={index}
                                            className="bg-white dark:border-graydark border-slate-200 border-b dark:bg-slate-900"
                                        >
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {(data?.current_page - 1) *
                                                    data?.per_page +
                                                    index +
                                                    1}
                                            </td>
                                            {fieldTable.map(
                                                (value: any, index: number) => {
                                                    return (
                                                        (field[
                                                            value!
                                                                .field as keyof ICustomInformation
                                                        ] != undefined ||
                                                            field[
                                                                value!
                                                                    .field as keyof ICustomInformation
                                                            ] === null) && (
                                                            <td
                                                                key={index}
                                                                className="px-6 py-4 whitespace-nowrap dark:text-white"
                                                            >
                                                                {value.type ===
                                                                "image" ? (
                                                                    field[
                                                                        value.field as keyof ICustomInformation
                                                                    ] ? (
                                                                        <img
                                                                        onClick={() =>
                                                                            dispatch(
                                                                                openModalImage({
                                                                                    imageUrl: field[value.field as keyof ICustomInformation] as string,
                                                                                })
                                                                            )
                                                                        }
                                                                            src={
                                                                                `${
                                                                                    field[
                                                                                        value.field as keyof ICustomInformation
                                                                                    ]
                                                                                }` ??
                                                                                ""
                                                                            }
                                                                            alt={
                                                                                `${
                                                                                    field[
                                                                                        value.field as keyof ICustomInformation
                                                                                    ]
                                                                                }` ??
                                                                                ""
                                                                            }
                                                                            className="w-10 h-10 rounded"
                                                                        />
                                                                    ) : (
                                                                        "-"
                                                                    )
                                                                ) : (
                                                                    field[
                                                                        value.field as keyof ICustomInformation
                                                                    ] ?? "N/A"
                                                                )}
                                                            </td>
                                                        )
                                                    );
                                                }
                                            )}
                                            <td className="px-6 py-4 w-1/4">
                                                <button
                                                    onClick={() =>
                                                        onEdit
                                                            ? onEdit(field.id)
                                                            : null
                                                    }
                                                    className="px-2 py-1 my-1 rounded-md bg-warning hover:bg-primary hover:text-white text-white mx-2"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        onDelete
                                                            ? (deleteId.current =
                                                                  field.id) &&
                                                              setIsDialogOpen(
                                                                  true
                                                              )
                                                            : null
                                                    }
                                                    className="px-2 py-1 rounded-md my-1 bg-danger hover:bg-primary hover:text-white text-white mx-2"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                }
                            )}
                        {!onProccess && data?.data.length === 0 && (
                            <tr>
                                <td colSpan={fieldTable.length + 2}>
                                    <div className="text-center py-4">
                                        No data available
                                    </div>
                                </td>
                            </tr>
                        )}
                        {onProccess && (
                            <tr>
                                <td colSpan={fieldTable.length + 2}>
                                    <div className="text-center py-4 w-full">
                                        Loading...
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* pagination */}
            <div className="flex justify-between items-center px-6 py-4 border-t border-stroke dark:border-strokedark">
                <div>
                    <span className="text-gray-500 dark:text-gray-400">
                        Page {data?.current_page} of {data?.last_page}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleChangePage(data?.current_page - 1)}
                        className={`px-3 py-1 rounded-md  ${
                            data?.current_page === 1
                                ? "cursor-not-allowed"
                                : "hover:bg-yellow hover:text-dark-custom-100"
                        } bg-white text-gray-500 dark:text-gray-400  text-boxdark font-bold`}
                        disabled={data?.current_page === 1}
                    >
                        Previous
                    </button>
                    {pagination!.map((page, index) => {
                        return (
                            <button
                                onClick={() => handleChangePage(page)}
                                key={index}
                                className={`px-3 py-1 rounded-md ${
                                    page === data?.current_page
                                        ? "bg-primary text-white font-bold"
                                        : "bg-white text-gray-500 dark:text-gray-400 hover:bg-yellow hover:text-dark-custom-100 text-boxdark font-bold"
                                }`}
                            >
                                {page}
                            </button>
                        );
                    })}
                    <button
                        onClick={() => handleChangePage(data?.current_page + 1)}
                        className={`px-3 py-1 rounded-md bg-white text-gray-500  dark:text-gray-400 ${
                            data?.current_page === data?.last_page
                                ? "cursor-not-allowed"
                                : "hover:bg-yellow hover:text-dark-custom-100"
                        } text-boxdark font-bold`}
                        disabled={data?.current_page === data?.last_page}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    ); // This component doesn't render anything
};

export default CustomTable;
