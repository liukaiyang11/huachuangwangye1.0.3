
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { UserData } from '../types';

// --- Standards: Types Definition ---
export interface ApiResponse<T = any> {
    code: number;
    message: string;
    data: T;
    timestamp?: number;
}

// --- Constants ---
const DB_STORAGE_KEY = 'omnicube_enterprise_db_v1';
const CURRENT_USER_KEY = 'omnicube_current_user_email';
const AUTH_HEADER_KEY = 'Authorization';

// --- Core Axios Class ---
class Request {
    private instance: AxiosInstance;

    constructor(config: AxiosRequestConfig) {
        this.instance = axios.create(config);

        // Request Interceptor
        this.instance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                // Security: Attach Token (Mock)
                const token = localStorage.getItem(CURRENT_USER_KEY);
                if (token && config.headers) {
                    config.headers[AUTH_HEADER_KEY] = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response Interceptor
        this.instance.interceptors.response.use(
            (response: AxiosResponse) => {
                // Unpack data if backend follows standard format
                const res = response.data as ApiResponse;
                if (res.code && res.code !== 200) {
                    // Handle business errors
                    return Promise.reject(new Error(res.message || 'Error'));
                }
                return response.data;
            },
            this.handleMockLogic // Inject Mock Logic for Demo purposes
        );
    }

    // Encapsulated Methods
    public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return this.instance.get(url, config);
    }

    public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return this.instance.post(url, data, config);
    }

    public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return this.instance.put(url, data, config);
    }

    public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return this.instance.delete(url, config);
    }

    // --- Mock Logic (Simulation of Backend Middleware) ---
    private async handleMockLogic(error: any): Promise<any> {
        const { config } = error;
        if (!config) return Promise.reject(error);

        console.log(`[Mock API] ${config.method.toUpperCase()} ${config.url}`);

        // Mock Latency
        await new Promise(r => setTimeout(r, 600));

        try {
            // 1. Auth: Login
            if (config.url === '/auth/login' && config.method === 'post') {
                const { email } = JSON.parse(config.data);
                const db = JSON.parse(localStorage.getItem(DB_STORAGE_KEY) || '{}');
                if (db[email]) {
                    localStorage.setItem(CURRENT_USER_KEY, email);
                    // Standard Response Structure
                    return { code: 200, message: 'Success', data: db[email] };
                }
                return Promise.reject({ message: "账户不存在或密码错误" });
            }

            // 2. Auth: Register
            if (config.url === '/auth/register' && config.method === 'post') {
                const { email, initialData } = JSON.parse(config.data);
                const db = JSON.parse(localStorage.getItem(DB_STORAGE_KEY) || '{}');
                if (db[email]) return Promise.reject({ message: "该用户已存在" });
                
                db[email] = initialData;
                localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(db));
                localStorage.setItem(CURRENT_USER_KEY, email);
                return { code: 200, message: 'Success', data: initialData };
            }

            // 3. User: Sync Data
            if (config.url === '/user/sync' && config.method === 'post') {
                const { email, data } = JSON.parse(config.data);
                const db = JSON.parse(localStorage.getItem(DB_STORAGE_KEY) || '{}');
                if (db[email]) {
                    db[email] = { ...db[email], ...data };
                    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(db));
                    return { code: 200, message: 'Synced', data: null };
                }
            }
            
            // 4. Default 404
            return Promise.reject({ message: `Mock 404: ${config.url}` });

        } catch (mockError) {
            return Promise.reject(mockError);
        }
    }
}

export const request = new Request({
    baseURL: '/api/v1',
    timeout: 10000,
});

// --- Modular API Services (Service Layer) ---

export const AuthService = {
    login: (email: string) => request.post<UserData>('/auth/login', { email }),
    register: (data: any) => request.post<UserData>('/auth/register', data),
    logout: () => {
        localStorage.removeItem(CURRENT_USER_KEY);
        // Can add server-side logout call here
    },
    getCurrentUserEmail: () => localStorage.getItem(CURRENT_USER_KEY),
};

export const UserService = {
    sync: (email: string, data: any) => request.post('/user/sync', { email, data }),
};
