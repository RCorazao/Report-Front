export interface Errors {
    [key: string]: string[];
}

export interface BaseResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    errors?: Errors;
}