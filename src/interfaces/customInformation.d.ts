export interface ICustomInformation {}

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


export interface ICustomInformationTypeCrete{
    name: string;
}

