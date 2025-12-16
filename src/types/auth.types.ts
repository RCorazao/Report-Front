import type { BaseResponse } from "./api.types";

export interface User {
    id: string | number;
    name: string;
    email: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

interface AuthData {
    user: User;
    token: string;
}

export interface AuthResponse extends BaseResponse<AuthData> { }
