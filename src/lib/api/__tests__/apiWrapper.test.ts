import { toast } from 'sonner';

import { ApiResponse } from '@/shared/types/api';

import { handleApiResponse, handleServerAction } from '../apiWrapper';

// Mock sonner toast
jest.mock('sonner', () => {
  const mockToastFn = jest.fn();
  const mockToast = {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
  };
  return {
    toast: Object.assign(mockToastFn, mockToast),
  };
});

const mockToast = toast as jest.Mocked<typeof toast>;
const mockToastFn = toast as jest.MockedFunction<typeof toast>;

describe('handleApiResponse', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // eslint-disable-next-line no-console
    console.log = jest.fn();
    // eslint-disable-next-line no-console
    console.warn = jest.fn();
  });

  it('handles successful response with data', async () => {
    const mockResponse = new Response(
      JSON.stringify({
        data: { id: '1', name: 'test' },
        ok: true,
      }),
      { status: 200 },
    );

    const result = await handleApiResponse(Promise.resolve(mockResponse));

    expect(result).toEqual({
      data: { id: '1', name: 'test' },
      ok: true,
    });
  });

  it('handles error response with error details', async () => {
    const mockResponse = new Response(
      JSON.stringify({
        data: null,
        ok: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details: { field: 'name' },
        },
      }),
      { status: 400 },
    );

    const onError = jest.fn();
    const result = await handleApiResponse(Promise.resolve(mockResponse), { onError });

    expect(result).toEqual({
      data: null,
      ok: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        details: { field: 'name' },
      },
    });
    expect(onError).toHaveBeenCalledWith({
      code: 'VALIDATION_ERROR',
      message: 'Invalid input',
      details: { field: 'name' },
    });
  });

  it('processes service messages', async () => {
    const mockResponse = new Response(
      JSON.stringify({
        data: { id: '1' },
        ok: true,
        messages: [
          { type: 'success', message: 'Success message', duration: 3000 },
          { type: 'warning', message: 'Warning message' },
          { type: 'info', message: 'Info message' },
        ],
      }),
      { status: 200 },
    );

    const onMessages = jest.fn();
    await handleApiResponse(Promise.resolve(mockResponse), { onMessages });

    expect(mockToast.success).toHaveBeenCalledWith('Success message', { duration: 3000 });
    expect(mockToast.warning).toHaveBeenCalledWith('Warning message', { duration: 4000 });
    expect(mockToast.info).toHaveBeenCalledWith('Info message', { duration: 4000 });
    expect(onMessages).toHaveBeenCalledWith([
      { type: 'success', message: 'Success message', duration: 3000 },
      { type: 'warning', message: 'Warning message' },
      { type: 'info', message: 'Info message' },
    ]);
  });

  it('handles invalidation keys', async () => {
    const mockResponse = new Response(
      JSON.stringify({
        data: { id: '1' },
        ok: true,
        invalidateKeys: ['users', 'user-1', 'profile'],
      }),
      { status: 200 },
    );

    const onInvalidateKeys = jest.fn();
    await handleApiResponse(Promise.resolve(mockResponse), { onInvalidateKeys });

    expect(onInvalidateKeys).toHaveBeenCalledWith(['users', 'user-1', 'profile']);
    // eslint-disable-next-line no-console
    expect(console.log).toHaveBeenCalledWith('[apiWrapper] Invalidate keys:', [
      'users',
      'user-1',
      'profile',
    ]);
  });

  it('handles non-JSON response', async () => {
    const mockResponse = new Response('Not JSON', { status: 200 });

    const onError = jest.fn();
    const result = await handleApiResponse(Promise.resolve(mockResponse), { onError });

    expect(result.ok).toBe(false);
    expect(result.error?.code).toBe('PARSE_ERROR');
    expect(result.error?.message).toBe('Invalid response format');
    expect(onError).toHaveBeenCalled();
  });

  it('handles network errors', async () => {
    const networkError = new Error('Network failed');
    const onError = jest.fn();

    const result = await handleApiResponse(Promise.reject(networkError), { onError });

    expect(result).toEqual({
      data: null,
      ok: false,
      error: {
        code: 'SYSTEM_ERROR',
        message: 'Network or system error occurred',
        details: { error: 'Network failed' },
      },
    });
    expect(onError).toHaveBeenCalled();
  });

  it('handles all message types', async () => {
    const mockResponse = new Response(
      JSON.stringify({
        data: null,
        ok: true,
        messages: [
          { type: 'error', message: 'Error message' },
          { type: 'unknown', message: 'Unknown type' },
        ],
      }),
      { status: 200 },
    );

    await handleApiResponse(Promise.resolve(mockResponse));

    expect(mockToast.error).toHaveBeenCalledWith('Error message', { duration: 4000 });
    expect(mockToastFn).toHaveBeenCalledWith('Unknown type', { duration: 4000 });
  });
});

describe('handleServerAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // eslint-disable-next-line no-console
    console.log = jest.fn();
  });

  it('handles successful server action', async () => {
    const apiResponse: ApiResponse<{ id: string }> = {
      data: { id: '1' },
      ok: true,
    };

    const result = await handleServerAction(Promise.resolve(apiResponse));

    expect(result).toEqual({
      data: { id: '1' },
      ok: true,
    });
  });

  it('handles server action with error', async () => {
    const apiResponse: ApiResponse<null> = {
      data: null,
      ok: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Internal error',
      },
    };

    const onError = jest.fn();
    const result = await handleServerAction(Promise.resolve(apiResponse), { onError });

    expect(result).toEqual({
      data: null,
      ok: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Internal error',
      },
    });
    expect(onError).toHaveBeenCalled();
  });

  it('processes invalidation keys and messages', async () => {
    const apiResponse: ApiResponse<{ id: string }> = {
      data: { id: '1' },
      ok: true,
      invalidateKeys: ['topics', 'topic-1'],
      messages: [{ type: 'success', message: 'Updated successfully' }],
    };

    const onInvalidateKeys = jest.fn();
    const onMessages = jest.fn();

    await handleServerAction(Promise.resolve(apiResponse), {
      onInvalidateKeys,
      onMessages,
    });

    expect(onInvalidateKeys).toHaveBeenCalledWith(['topics', 'topic-1']);
    expect(onMessages).toHaveBeenCalledWith([{ type: 'success', message: 'Updated successfully' }]);
    expect(mockToast.success).toHaveBeenCalledWith('Updated successfully', { duration: 4000 });
  });

  it('handles server action promise rejection', async () => {
    const actionError = new Error('Action failed');
    const onError = jest.fn();

    const result = await handleServerAction(Promise.reject(actionError), { onError });

    expect(result).toEqual({
      data: null,
      ok: false,
      error: {
        code: 'ACTION_ERROR',
        message: 'Server action failed',
        details: { error: 'Action failed' },
      },
    });
    expect(onError).toHaveBeenCalled();
  });

  it('handles non-Error rejection', async () => {
    const onError = jest.fn();

    const result = await handleServerAction(Promise.reject('String error'), { onError });

    expect(result.error?.details?.error).toBe('String error');
  });
});
