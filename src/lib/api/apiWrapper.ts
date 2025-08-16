import { toast } from 'sonner';

import {
  ApiError,
  ApiResponse,
  ApiWrapperOptions,
  ApiWrapperResult,
  ServiceMessage,
} from '@/shared/types/api';

/** Process service messages - display toasts based on message type */
function processMessages(messages: ServiceMessage[]): void {
  messages.forEach((message) => {
    const { type, message: text, duration = 4000 } = message;
    switch (type) {
      case 'success':
        toast.success(text, { duration });
        break;
      case 'error':
        toast.error(text, { duration });
        break;
      case 'warning':
        toast.warning(text, { duration });
        break;
      case 'info':
        toast.info(text, { duration });
        break;
      default:
        toast(text, { duration });
    }
  });
}

/** Wrapper function to handle API responses with error checking and service data processing */
export async function handleApiResponse<T>(
  responsePromise: Promise<Response>,
  options: ApiWrapperOptions = {},
): Promise<ApiWrapperResult<T>> {
  const { onInvalidateKeys, onMessages, onError } = options;

  try {
    const response = await responsePromise;
    const body = await response.text();

    // Parse response body
    let apiResponse: ApiResponse<T>;
    try {
      apiResponse = JSON.parse(body); // await response.json();
    } catch (parseError) {
      // Handle non-JSON responses
      const systemError: ApiError = {
        code: 'PARSE_ERROR',
        message: 'Invalid response format',
        details: { parseError: String(parseError), originalContent: body },
      };
      onError?.(systemError);
      return { data: null, ok: false, error: systemError };
    }

    // Check HTTP status vs response ok field
    const isHttpSuccess = response.ok;
    const isResponseOk = apiResponse.ok;

    if (isHttpSuccess !== isResponseOk) {
      // eslint-disable-next-line no-console
      console.warn('[apiWrapper] HTTP status and response.ok mismatch', {
        httpStatus: response.status,
        responseOk: isResponseOk,
      });
    }

    // Process invalidation keys
    if (apiResponse.invalidateKeys?.length) {
      onInvalidateKeys?.(apiResponse.invalidateKeys);
      // TODO: Integrate with React Query invalidation
      // eslint-disable-next-line no-console
      console.log('[apiWrapper] Invalidate keys:', apiResponse.invalidateKeys);
    }

    // Process service messages
    if (apiResponse.messages?.length) {
      processMessages(apiResponse.messages);
      onMessages?.(apiResponse.messages);
    }

    // Handle errors
    if (!apiResponse.ok && apiResponse.error) {
      onError?.(apiResponse.error);
      return {
        data: apiResponse.data,
        ok: false,
        error: apiResponse.error,
      };
    }

    return {
      data: apiResponse.data,
      ok: apiResponse.ok,
    };
  } catch (systemError) {
    // Handle network errors, timeouts, etc.
    const error: ApiError = {
      code: 'SYSTEM_ERROR',
      message: 'Network or system error occurred',
      details: {
        error: systemError instanceof Error ? systemError.message : String(systemError),
      },
    };

    onError?.(error);
    return { data: null, ok: false, error };
  }
}

/** Helper for server actions that return ApiResponse directly */
export async function handleServerAction<T>(
  actionPromise: Promise<ApiResponse<T>>,
  options: ApiWrapperOptions = {},
): Promise<ApiWrapperResult<T>> {
  const { onInvalidateKeys, onMessages, onError } = options;

  try {
    const apiResponse = await actionPromise;

    // Process invalidation keys
    if (apiResponse.invalidateKeys?.length) {
      onInvalidateKeys?.(apiResponse.invalidateKeys);
      // TODO: Integrate with React Query invalidation
      // eslint-disable-next-line no-console
      console.log('[serverAction] Invalidate keys:', apiResponse.invalidateKeys);
    }

    // Process service messages
    if (apiResponse.messages?.length) {
      processMessages(apiResponse.messages);
      onMessages?.(apiResponse.messages);
    }

    // Handle errors
    if (!apiResponse.ok && apiResponse.error) {
      onError?.(apiResponse.error);
    }

    return {
      data: apiResponse.data,
      ok: apiResponse.ok,
      error: apiResponse.error,
    };
  } catch (systemError) {
    const error: ApiError = {
      code: 'ACTION_ERROR',
      message: 'Server action failed',
      details: {
        error: systemError instanceof Error ? systemError.message : String(systemError),
      },
    };

    onError?.(error);
    return { data: null, ok: false, error };
  }
}
