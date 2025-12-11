import callAPI from "../utils/callApi";
import { API_ENDPOINT } from "@/constants/api";

export interface DashboardStats {
    totalArticles: number;
    totalPublished: number;
    totalDrafts: number;
    totalCategories: number;
    totalTags: number;
    totalViews: number;
    recentArticles: Array<{
        id: number;
        title: string;
        status: string;
        created_at: string;
        views: number;
    }>;
    popularArticles: Array<{
        id: number;
        title: string;
        views: number;
        category_name: string;
    }>;
    categoryDistribution: Array<{
        name: string;
        count: number;
    }>;
}

export async function fetchDashboardStats(): Promise<{ data: DashboardStats }> {
    const url = `${API_ENDPOINT}/dashboard/stats`;
    const response = await callAPI({
        url,
        method: "GET",
        token: true,
    });
    return response;
}

export async function fetchArticleAnalytics(period: 'week' | 'month' | 'year' = 'month'): Promise<any> {
    const url = `${API_ENDPOINT}/dashboard/analytics?period=${period}`;
    const response = await callAPI({
        url,
        method: "GET",
        token: true,
    });
    return response;
}
