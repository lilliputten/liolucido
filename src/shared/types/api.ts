import { QueryKey } from '@tanstack/react-query';

// Core API response types
export interface TApiResponse<T = unknown> {
  data: T | null;
  ok: boolean;
  error?: TApiError;
  invalidateKeys?: QueryKey[];
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

export interface TApiWrapperResult<T> {
  data: T | null;
  ok: boolean;
  error?: TApiError;
}

export type TApiDebugDetails = Record<string, unknown>;

// Custom API Error class
export class APIError extends Error {
  public readonly code: string;
  public readonly details?: TApiDebugDetails;

  constructor(apiError: TApiError, debugDetails?: TApiDebugDetails) {
    super(apiError.message);
    this.name = 'APIError';
    this.code = apiError.code;
    if (debugDetails || apiError.details) {
      this.details = { ...debugDetails, ...apiError.details };
    }
  }
}
