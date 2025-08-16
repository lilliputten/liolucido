// Core API response types
export interface TApiResponse<T = unknown> {
  data: T | null;
  ok: boolean;
  error?: TApiError;
  invalidateKeys?: string[];
  messages?: TServiceMessage[];
}

export interface TApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface TServiceMessage {
  type: 'error' | 'success' | 'warning' | 'info';
  message: string;
  code?: string;
}

// Helper types for the wrapper function
export interface TApiWrapperOptions {
  onInvalidateKeys?: (keys: string[]) => void;
  onMessages?: (messages: TServiceMessage[]) => void;
  onError?: (error: TApiError) => void;
  debugDetails?: Record<string, unknown>;
}

export interface TApiWrapperResult<T> {
  data: T | null;
  ok: boolean;
  error?: TApiError;
}

// Custom API Error class
export class APIError extends Error {
  public readonly code: string;
  public readonly details?: Record<string, unknown>;

  constructor(apiError: TApiError) {
    super(apiError.message);
    this.name = 'APIError';
    this.code = apiError.code;
    this.details = apiError.details;
  }
}
