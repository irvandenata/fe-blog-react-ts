import { ICustomInformationType } from "@/interfaces/customInformation";
import { usePagination } from "@/hooks/usePagination";
import { useRef, useState } from "react";
import { CustomTableProps } from "@/interfaces/common";
import AlertDialog from "../Modals/AlertDialog";

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
                icon="⚠️"
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
            <table className="w-full text-sm text-left  dark:bg-dark rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-900 dark:border-graydark border-slate-300 border-b dark:bg-slate-800 uppercase dark:text-gray-400">
                    <tr>
                        {fieldTable.map((field, index) => (
                            <th key={index} scope="col" className="px-6 py-3">
                                {field}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {!onProccess &&
                        data?.data.map(
                            (field: ICustomInformationType, index: number) => {
                                return (
                                    <tr
                                        key={index}
                                        className="bg-white dark:border-graydark border-slate-200 border-b dark:bg-dark"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {(data?.current_page - 1) *
                                                data?.per_page +
                                                index +
                                                1}
                                        </td>
                                        <td className="px-6 py-4">
                                            {field.name}
                                        </td>
                                        <td className="px-6 py-4 w-1/4">
                                            <button
                                                onClick={() =>
                                                    onEdit
                                                        ? onEdit(field.id)
                                                        : null
                                                }
                                                className="px-2 py-1 rounded-md bg-warning hover:bg-primary hover:text-white text-white mx-2"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    onDelete
                                                        ? (deleteId.current =
                                                              field.id) &&
                                                          setIsDialogOpen(true)
                                                        : null
                                                }
                                                className="px-2 py-1 rounded-md bg-danger hover:bg-primary hover:text-white text-white mx-2"
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
                            <td colSpan={fieldTable.length}>
                                <div className="text-center py-4">
                                    No data available
                                </div>
                            </td>
                        </tr>
                    )}
                    {onProccess && (
                        <tr>
                            <td colSpan={fieldTable.length}>
                                <div className="text-center py-4">
                                    Loading...
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
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
