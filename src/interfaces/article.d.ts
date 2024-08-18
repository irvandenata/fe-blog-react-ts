export interface IArticleCategory {
    id: number;
    name: string;
    slug: string;
}

export interface IArticleCategoryTable {
    data: IArticleCategory[];
    current_page: number;
    per_page: number;
    total_data: number;
    last_page: number;
}

export interface IArticleCategoryCreate {
    name: string;
}


export interface IArticleTag {
    id: number;
    name: string;
    slug: string;
}

export interface IArticleTagTable {
    data: IArticleTag[];
    current_page: number;
    per_page: number;
    total_data: number;
    last_page: number;
}

export interface IArticleTagCreate {
    name: string;
}

export interface IArticle {
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
    slug?: string;
    category: IArticleCategory;
}

export interface IArticleTable {
    data: IArticle[];
    current_page: number;
    per_page: number;
    total_data: number;
    last_page: number;
}

export interface IArticleCreate {
    title: string;
    subtitle: string;
    description: string;
    icon?: string;
    link?: string;
}
