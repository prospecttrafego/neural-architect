import { API_URL, API_VERSION } from './constants';

/**
 * Custom error for API responses
 */
export class ApiError extends Error {
    status: number;
    statusText: string;

    constructor(status: number, statusText: string, message: string) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.statusText = statusText;
    }
}

/**
 * API client with base configuration
 */
class ApiClient {
    private baseUrl: string;

    constructor() {
        this.baseUrl = `${API_URL}/api/${API_VERSION}`;
    }

    /**
     * Make a fetch request with default configuration
     */
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        const config: RequestInit = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        };

        const token = localStorage.getItem('auth-storage')
            ? JSON.parse(localStorage.getItem('auth-storage')!).state.token
            : null;

        if (token) {
            (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, config);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(
                response.status,
                response.statusText,
                errorData.detail || 'An error occurred'
            );
        }

        // Handle empty responses
        if (response.status === 204) {
            return undefined as T;
        }

        return response.json();
    }

    /**
     * GET request
     */
    async get<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    /**
     * POST request
     */
    async post<T>(endpoint: string, data?: unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    /**
     * PATCH request
     */
    async patch<T>(endpoint: string, data?: unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    /**
     * PUT request
     */
    async put<T>(endpoint: string, data?: unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    /**
     * DELETE request
     */
    async delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }
}

export const api = new ApiClient();
