// Core API response types
export interface ApiResponse<T = unknown> {
  data: T | null;
  ok: boolean;
  error?: ApiError;
  invalidateKeys?: string[];
  messages?: ServiceMessage[];
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ServiceMessage {
  type: 'error' | 'success' | 'warning' | 'info';
  message: string;
  code?: string;
  duration?: number;
}

// Helper types for the wrapper function
export interface ApiWrapperOptions {
  onInvalidateKeys?: (keys: string[]) => void;
  onMessages?: (messages: ServiceMessage[]) => void;
  onError?: (error: ApiError) => void;
}

export interface ApiWrapperResult<T> {
  data: T | null;
  ok: boolean;
  error?: ApiError;
}
