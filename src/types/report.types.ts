import type { BaseResponse } from "./api.types";

export interface Report {
    id: number;
    title: string;
    report_link: string;
    download_url: string;
    created_at: string;
}

export interface GenerateReportRequest {
    title: string;
    start_date: string;
    end_date: string;
}

export interface GenerateReportResponse extends BaseResponse<void> { }
export interface GetReportResponse extends BaseResponse<Report> { }
export interface ListReportsResponse extends BaseResponse<Report[]> { }