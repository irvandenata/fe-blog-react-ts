export interface ICustomInformation {}

export interface ICustomInformationType {
    name: string;
}

export interface ICustomInformationTypeTable {
    data: ICustomInformationType[];
    current_page: number;
    per_page: number;
    total_data: number;
    last_page: number;
}

