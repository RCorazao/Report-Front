import axios from 'axios';
import type { GenerateReportRequest, GenerateReportResponse, ListReportsResponse, GetReportResponse } from '@/types/report.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const reportService = {
    async generateReport(request: GenerateReportRequest): Promise<GenerateReportResponse> {
        const { data } = await apiClient.post<GenerateReportResponse>('/generate-report', request);
        return data;
    },

    async listReports(): Promise<ListReportsResponse> {
        const { data } = await apiClient.get<ListReportsResponse>('/list-reports');
        return data;
    },

    async getReport(reportId: number): Promise<GetReportResponse> {
        const { data } = await apiClient.get<GetReportResponse>(`/get-report/${reportId}`);
        return data;
    },
};
