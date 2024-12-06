import { ApiResponse, ApiError as IApiError } from '../types/api';

class ApiError extends Error {
  constructor(
    public message: string,
    public status: number,
    public code: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const API_URL = import.meta.env.VITE_API_URL;

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const error = isJson ? data.error : 'An unexpected error occurred';
    throw new ApiError(
      error.message || 'An unexpected error occurred',
      response.status,
      error.code || 'UNKNOWN_ERROR'
    );
  }

  return data as T;
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  try {
    const { params, ...init } = options;
    
    // Build URL with query parameters
    const url = new URL(endpoint, API_URL);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    // Default headers
    const headers = new Headers(init.headers);
    if (!headers.has('Content-Type') && init.method !== 'GET') {
      headers.set('Content-Type', 'application/json');
    }
    
    // Add API key if available
    const apiKey = import.meta.env.VITE_API_KEY;
    if (apiKey) {
      headers.set('Authorization', `Bearer ${apiKey}`);
    }

    const response = await fetch(url.toString(), {
      ...init,
      headers,
    });

    const data = await handleResponse<T>(response);

    return {
      data,
      status: response.status,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      500,
      'INTERNAL_ERROR'
    );
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};

// Rate limiting utility
export class RateLimiter {
  private queue: Array<() => Promise<void>> = [];
  private processing = false;

  constructor(private requestsPerSecond: number) {}

  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      if (!this.processing) {
        this.process();
      }
    });
  }

  private async process() {
    this.processing = true;
    const delay = 1000 / this.requestsPerSecond;

    while (this.queue.length > 0) {
      const fn = this.queue.shift();
      if (fn) {
        await fn();
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    this.processing = false;
  }
}

// Create rate-limited API instance
const rateLimiter = new RateLimiter(10); // 10 requests per second

export const rateLimitedApi = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    rateLimiter.add(() => api.get<T>(endpoint, options)),

  post: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    rateLimiter.add(() => api.post<T>(endpoint, data, options)),

  put: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    rateLimiter.add(() => api.put<T>(endpoint, data, options)),

  patch: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    rateLimiter.add(() => api.patch<T>(endpoint, data, options)),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    rateLimiter.add(() => api.delete<T>(endpoint, options)),
};
