const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

type ApiFetchOptions = RequestInit & {
    token?: string;
};

export class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
    const { token, headers, ...rest } = options;

    const response = await fetch(`${API_BASE}${path}`, {
        ...rest,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
    });

    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const message = typeof body.error === "string" ? body.error : `Error ${response.status}`;
        throw new ApiError(message, response.status);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}
