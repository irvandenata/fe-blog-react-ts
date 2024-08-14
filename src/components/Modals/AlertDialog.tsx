import { AlertDialogProps } from "@/interfaces/common";
import React from "react";

const AlertDialog: React.FC<AlertDialogProps> = ({
    isOpen,
    title,
    message,
    icon,
    onConfirm,
    onCancel,
    confirmText = "OK",
    cancelText = "Cancel",
}) => {
    return (
        <div
            className={`fixed inset-0 ${isOpen ? "" : "hidden"}
         flex items-center justify-center z-50 bg-black bg-opacity-50`}
        >
            <div
                className={`bg-white dark:bg-boxdark  ${
                    isOpen ? "animate-modal-open" : "animate-modal-close hidden"
                }
             rounded-lg shadow-lg overflow-hidden max-w-sm w-full p-6`}
            >
                <div className="flex justify-center mb-4">
                    {icon && <span className="text-2xl">
                      
                      <div dangerouslySetInnerHTML={{ __html: icon }}/>
                      
                      </span>}
                </div>
                <h2 className="text-xl font-semibold text-center mb-2">
                    {title}
                </h2>
                <p className="text-gray-700 text-center mb-4">{message}</p>
                <div className="flex justify-center space-x-4">
                    {onCancel && (
                        <button
                            className="text-black text-gray-700 bg-slate-100 px-4 py-2 rounded hover:bg-gray-400"
                            onClick={onCancel}
                        >
                            {cancelText}
                        </button>
                    )}
                    <button
                        className="bg-blue-500 text-white bg-primary px-4 py-2 rounded hover:bg-blue-600"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertDialog;
