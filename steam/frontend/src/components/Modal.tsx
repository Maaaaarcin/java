interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    loading?: boolean;
    hideCancel?: boolean;
    children?: React.ReactNode;
}

function Modal({
                   isOpen,
                   onClose,
                   onConfirm,
                   title = "Are you sure?",
                   description = "",
                   confirmLabel = "Confirm",
                   cancelLabel = "Cancel",
                   loading = false,
                   hideCancel = false,
                   children,
               }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg max-w-md w-full">
                <div className="text-center">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                    <p className="mb-5 text-sm text-gray-500 dark:text-gray-300">{description}</p>

                    {children}

                    <div className="mt-4">
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 disabled:opacity-50"
                        >
                            {loading ? "Processing..." : confirmLabel}
                        </button>
                        {!hideCancel && (
                            <button
                                onClick={onClose}
                                className="ml-3 px-5 py-2.5 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white rounded-lg"
                            >
                                {cancelLabel}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Modal;
