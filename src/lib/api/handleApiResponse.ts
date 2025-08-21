import { QueryKey } from '@tanstack/react-query';

import {
  APIError,
  TApiDebugDetails,
  TApiError,
  TApiResponse,
  TApiWrapperResult,
  TServiceMessage,
} from '@/shared/types/api';

import { processMessages } from './processMessages';

// Helper types for the wrapper function
export interface TApiWrapperOptions {
  onInvalidateKeys?: (keys: QueryKey[]) => void;
  onMessages?: (messages: TServiceMessage[]) => void;
  onError?: (error: TApiError) => void;
  debugDetails?: TApiDebugDetails;
  useConsole?: boolean;
}

/** Wrapper function to handle API responses with error checking and service data processing */
export async function handleApiResponse<T>(
  responsePromise: Promise<Response>,
  options: TApiWrapperOptions = {},
): Promise<TApiWrapperResult<T>> {
  const { onInvalidateKeys, onMessages, onError, debugDetails, useConsole = true } = options;

  try {
    const response = await responsePromise;
    const body = await response.text();

    // Parse response body
    let apiResponse: TApiResponse<T>;
    try {
      apiResponse = JSON.parse(body); // await response.json();
    } catch (parseError) {
      // Handle non-JSON responses
      const systemError: TApiError = {
        code: 'PARSE_ERROR',
        message: 'Invalid response format',
        details: { parseError: String(parseError), originalContent: body },
      };
      const apiError = new APIError(systemError, debugDetails);
      if (useConsole) {
        // eslint-disable-next-line no-console
        console.warn('[handleApiResponse:handleApiResponse] Parse error:', apiError.message, {
          apiError,
          parseError,
          systemError,
          debugDetails,
        });
      }
      // debugger; // eslint-disable-line no-debugger
      if (onError) {
        onError(systemError);
        return { data: null, ok: false, error: systemError };
      } else {
        throw apiError;
      }
    }

    // Check HTTP status vs response ok field
    const isHttpSuccess = response.ok;
    const isResponseOk = apiResponse.ok;

    if (isHttpSuccess !== isResponseOk) {
      if (useConsole) {
        // eslint-disable-next-line no-console
        console.warn('[handleApiResponse] HTTP status and response.ok mismatch', {
          httpStatus: response.status,
          responseOk: isResponseOk,
        });
      }
    }

    // Process invalidation keys
    if (apiResponse.invalidateKeys?.length) {
      onInvalidateKeys?.(apiResponse.invalidateKeys);
      // TODO: Integrate with React Query invalidation. Remove `invalidateReactQueryKeys` calls from the taget components?
    }

    // Process service messages
    if (apiResponse.messages?.length) {
      processMessages(apiResponse.messages);
      onMessages?.(apiResponse.messages);
    }

    // Handle errors
    if (!apiResponse.ok && apiResponse.error) {
      const responseError = apiResponse.error;
      const apiError = new APIError(responseError, debugDetails);
      if (useConsole) {
        // eslint-disable-next-line no-console
        console.warn('[handleApiResponse:handleApiResponse] API error:', apiError.message, {
          apiError,
          responseError,
          debugDetails,
          apiResponse,
        });
        // debugger; // eslint-disable-line no-debugger
      }
      if (onError) {
        onError(apiError);
        return {
          data: apiResponse.data,
          ok: false,
          error: responseError,
        };
      } else {
        // Throw error to be caught in final catch section
        throw apiError;
      }
    }

    return {
      data: apiResponse.data,
      ok: apiResponse.ok,
    };
  } catch (systemError) {
    // Handle network errors, timeouts, etc.
    const error: TApiError = {
      code: 'SYSTEM_ERROR',
      message:
        systemError instanceof Error ? systemError.message : 'Network or system error occurred',
      // details: {
      //   error: systemError instanceof Error ? systemError.message : String(systemError),
      // },
    };
    if (typeof systemError == 'object') {
      Object.assign(error, systemError);
    }

    const apiError = new APIError(error, debugDetails);

    if (useConsole) {
      // eslint-disable-next-line no-console
      console.error('[handleApiResponse:handleApiResponse] Final catch:', apiError.message, {
        apiError,
        error,
        systemError,
        debugDetails,
      });
      debugger; // eslint-disable-line no-debugger
    }

    if (onError) {
      onError(error);
      return { data: null, ok: false, error };
    } else {
      throw new APIError(error, debugDetails);
    }
  }
}
