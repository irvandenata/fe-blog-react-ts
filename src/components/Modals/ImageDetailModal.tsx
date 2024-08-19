import { ImageDetailModalProps } from "@/interfaces/common";
import React from "react";
import { useSelector } from "react-redux";

const ImageDetailModal: React.FC<ImageDetailModalProps> = ({
    onSubmit,
    onClose,
    onUpdate,
}) => {
    const modal = useSelector((state: any) => state.imageModal);
    const handleSubmit = () => {
        onSubmit!();
    };
    return (
        <div
            className={`fixed h-[100%] overflow-auto
             inset-0 flex items-start  justify-center z-[1000] ${
                 modal.isOpen ? "" : "hidden"
             }`}
        >
            <div className="fixed w-full h-full bg-black  opacity-50"></div>
            <div
                className={`bg-white mt-20 mb-20 dark:bg-gray-dark  ${
                    modal.isOpen ? "animate-modal-open" : "animate-modal-close"
                } rounded-lg overflow-hidden shadow-lg z-[1000] max-w-4xl w-full`}
            >
                <div className="flex justify-between items-center p-4 dark:border-graydark border-b">
                    <h2 className="text-xl font-semibold">{modal.title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        &times;
                    </button>
                </div>
                <div className="p-4">
                    
                    <img src={modal.imageUrl} alt="image" className="w-full  object-cover" />    
                </div>
                <div className="flex justify-end p-4 dark:border-graydark border-t">
                    <button
                        onClick={onClose}
                        disabled={modal.onProcess}
                        className={`bg-blue-500 ${
                            modal.onProcess ? "cursor-not-allowed" : ""
                        } bg-slate-500 ml-2 text-white px-4 py-2 rounded-lg hover:bg-blue-600`}
                    >
                        Close
                    </button>
                    {onSubmit! &&
                        (modal.isUpdate ? (
                            <button
                                onClick={() => onUpdate!(modal!.keyId)}
                                disabled={modal.onProcess}
                                className={`bg-blue-500 
                            ${modal.onProcess ? "cursor-not-allowed" : ""}
                             bg-primary ml-2 text-white px-4 py-2 rounded-lg hover:bg-blue-600`}
                            >
                                Update
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={modal.onProcess}
                                className={`bg-blue-500 ${
                                    modal.onProcess ? "cursor-not-allowed" : ""
                                } bg-primary ml-2 text-white px-4 py-2 rounded-lg hover:bg-blue-600`}
                            >
                                Save
                            </button>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default ImageDetailModal;
