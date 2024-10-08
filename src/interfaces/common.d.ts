export interface ITableField {
    name: string;
    value: string;
}

export interface ITable {
    row: ITableField[];
}

interface DynamicModalProps {
    onSubmit?: () => void;
    children?: React.ReactNode;
    onClose?: () => void;
    onUpdate?: (id:any) => void;
}


interface ImageDetailModalProps {
    onSubmit?: () => void;
    children?: React.ReactNode;
    onClose?: () => void;
    onUpdate?: (id:number) => void;
}


interface CustomTableProps {
    fieldTable:any;
    data: any;
    onProccess?: boolean;
    setQuery: any;
    query?: any;
    children?: React.ReactNode;
    onDelete?: (id:any) => void;
    onEdit?: (id:any) => void;
}


interface AlertDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    icon?: React.ReactNode;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
}
