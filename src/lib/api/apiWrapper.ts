import { toast } from 'sonner';

import {
  APIError,
  TApiError,
  TApiResponse,
  TApiWrapperOptions,
  TApiWrapperResult,
  TServiceMessage,
} from '@/shared/types/api';

// Track displayed messages to prevent duplicates in Strict Mode
const displayedMessages = new Set<string>();

/** Process service messages - display toasts based on message type */
function processMessages(messages: TServiceMessage[]): void {
  messages.forEach((message) => {
    const { type, message: text } = message;
    const messageKey = `${type}:${text}`;

    // Skip if already displayed recently
    if (displayedMessages.has(messageKey)) {
      return;
    }

    // Mark as displayed and auto-remove after duration
    displayedMessages.add(messageKey);
    setTimeout(() => displayedMessages.delete(messageKey), 1000);

    switch (type) {
      case 'success':
        toast.success(text);
        break;
      case 'error':
        toast.error(text);
        break;
      case 'warning':
        toast.warning(text);
        break;
      case 'info':
        toast.info(text);
        break;
      default:
        toast(text);
    }
  });
}

/** Wrapper function to handle API responses with error checking and service data processing */
export async function handleApiResponse<T>(
  responsePromise: Promise<Response>,
  options: TApiWrapperOptions = {},
): Promise<TApiWrapperResult<T>> {
  const { onInvalidateKeys, onMessages, onError, debugDetails } = options;

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
      const apiError = new APIError(systemError);
      // eslint-disable-next-line no-console
      console.error('[apiWrapper:handleApiResponse] Parse error', apiError.message, {
        apiError,
        parseError,
        systemError,
        debugDetails,
      });
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
      const responseError = apiResponse.error;
      const apiError = new APIError(responseError);
      // eslint-disable-next-line no-console
      console.error('[apiWrapper:handleApiResponse] API error', apiError.message, {
        apiError,
        responseError,
        debugDetails,
        apiResponse,
      });
      // debugger; // eslint-disable-line no-debugger
      if (onError) {
        onError(responseError);
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

    const apiError = new APIError(error);

    // eslint-disable-next-line no-console
    console.error('[apiWrapper:handleApiResponse] Final catch', apiError.message, {
      apiError,
      error,
      systemError,
      debugDetails,
    });
    debugger; // eslint-disable-line no-debugger

    if (onError) {
      onError(error);
      return { data: null, ok: false, error };
    } else {
      throw new APIError(error);
    }
  }
}

/** Helper for server actions that return TApiResponse directly */
export async function handleServerAction<T>(
  actionPromise: Promise<TApiResponse<T>>,
  options: TApiWrapperOptions = {},
): Promise<TApiWrapperResult<T>> {
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
    const error: TApiError = {
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
