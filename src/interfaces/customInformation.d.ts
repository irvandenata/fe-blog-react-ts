export interface ICustomInformationType {
    id: number;
    name: string;
}

export interface ICustomInformationTypeTable {
    data: ICustomInformationType[];
    current_page: number;
    per_page: number;
    total_data: number;
    last_page: number;
}

export interface ICustomInformationTypeCreate {
    name: string;
}

export interface ICustomInformation {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    image_url?: string;
    icon?: string;
    start_date?: string;
    end_date?: string;
    link?: string;
    created_at: string;
    updated_at: string;
}

export interface ICustomInformationTable {
    data: ICustomInformation[];
    current_page: number;
    per_page: number;
    total_data: number;
    last_page: number;
}

export interface ICustomInformationCreate {
    title: string;
    subtitle: string;
    description: string;
    icon?: string;
    link?: string;
}
