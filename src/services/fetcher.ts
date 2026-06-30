import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";


export const baseUrl = `${import.meta.env.VITE_API_BASE_URL || ""}`;

const instance = axios.create({
    withCredentials: true,
    timeout: 10000,
});

instance.interceptors.request.use((config) => {
    (
        config as AxiosRequestConfig & { metadata?: { startTime: number; startedAt: string } }
    ).metadata = {
        startTime: Date.now(),
        startedAt: new Date().toISOString(),
    };

    return config;
});

export const unwrapApiResponse = <T>(response: AxiosResponse<{ success: boolean; data?: T; message?: string }>): T => {
    if (response.data.success && response.data.data !== undefined) {
        return response.data.data;
    }
    throw new ApiError(response.data.message || "API request failed");
};

export class ApiError extends Error {
    public code?: string;
    public details?: unknown;
    public status?: number;

    constructor(message: string, code?: string, details?: unknown, status?: number) {
        super(message);
        this.name = "ApiError";
        this.code = code;
        this.details = details;
        this.status = status;
    }
}

instance.interceptors.response.use(
    (response) => {
        const metadata = (
            response.config as AxiosRequestConfig & {
                metadata?: { startTime: number; startedAt: string };
            }
        ).metadata;


        return response;
    },
    (error) => {
        const metadata = (
            error?.config as AxiosRequestConfig & {
                metadata?: { startTime: number; startedAt: string };
            }
        )?.metadata;



        const status = error?.response?.status;
        const showToast = error?.config?.headers?.showToast !== false;

        if (status === 401) {
            if (showToast) {
                console.error("Authentication failed. Please log in again.");
            }

            return Promise.reject(
                new ApiError("Authentication failed", "AUTH_ERROR", error.response?.data, status),
            );
        }

        if (status === 403) {
            if (showToast) {
                console.error("Access denied.");
            }

            const errorMessage = getErrorMessage(error.response?.data);

            return Promise.reject(
                new ApiError(
                    errorMessage,
                    error.response?.data?.error_code || error.response?.data?.code,
                    error.response?.data,
                    status,
                ),
            );
        }

        if (status >= 400) {
            const errorMessage = getErrorMessage(error.response?.data);

            if (showToast && error?.config?.method !== "get") {
                if (status === 429) {
                    console.error("Request limit exceeded.");
                } else if (status >= 500) {
                    console.error("Server error occurred.");
                } else if (status >= 400 && status < 500) {
                    console.error(errorMessage);
                }
            }

            const errorCode = error.response?.data?.error_code || error.response?.data?.code;

            return Promise.reject(new ApiError(errorMessage, errorCode, error.response?.data, status));
        }

        if (error.message === "Network Error") {
            if (showToast) {

                console.error("Network error occurred. Please check your internet connection.");
            }

            return Promise.reject(new ApiError("Network error", "NETWORK_ERROR", error, 0));
        }

        if (error.code === "ECONNABORTED") {
            if (showToast) {
                console.error("Request timeout. Please try again.");
            }

            return Promise.reject(new ApiError("Request timeout", "TIMEOUT_ERROR", error, 0));
        }

        return Promise.reject(error);
    },
);

type ErrorObject = {
    message?: string;
    response?: string;
    error_code?: string;
    code?: string;
    details?: unknown;
    errors?: Array<{ message?: string } | string>;
};

type ErrorLike = ErrorObject | string | unknown;

const getErrorMessage = (data: ErrorLike): string => {
    if (typeof data === "string") {
        return data;
    }
    if (data && typeof data === "object") {
        const obj = data as ErrorObject;

        if (typeof obj.message === "string") {
            return obj.message;
        }
        if (typeof obj.response === "string") {
            return obj.response;
        }
        if (Array.isArray(obj.errors) && obj.errors.length > 0) {
            const first = obj.errors[0];

            return (typeof first === "string" ? first : first.message) || "An error occurred";
        }
    }

    return "An error occurred";
};

export const REQUEST_METHODS = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
};

export const REQUEST_CONTENT_TYPE = {
    JSON: "application/json",
    MULTIPART: "multipart/form-data",
};

export const doFetch = async <TBody = unknown>(
    url: string,
    method: string = REQUEST_METHODS.GET,
    body: TBody | undefined = undefined,
    otherOptions?: {
        contentType?: string;
        showToast?: boolean;
    } & AxiosRequestConfig,
) => {
    const { contentType, signal, showToast, ...others } = otherOptions ?? {};
    const apiUrl = `${baseUrl}${url}`;
    const options: AxiosRequestConfig & {
        headers: Record<string, string> & { showToast?: boolean };
    } = {
        ...others,
        url: apiUrl,
        method,
        withCredentials: true,
        headers: {
            "Content-Type": contentType ?? REQUEST_CONTENT_TYPE.JSON,
        } as Record<string, string> & { showToast?: boolean },
    };

    const token = localStorage.getItem("token");

    if (token) {
        options.headers["Authorization"] = `Bearer ${token}`;
    }

    if (showToast !== undefined) {
        options.headers.showToast = showToast;
    }

    // signal to cancel request
    if (signal) {
        options.signal = signal;
    }

    if (contentType?.includes("json")) {
        options.data = JSON.stringify((body ?? {}) as TBody);
    } else {
        options.data = (body ?? {}) as TBody;
    }

    const response = await instance(options);

    return response;
};
