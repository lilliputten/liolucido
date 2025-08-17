import { toast } from 'sonner';

import { handleApiResponse } from '../handleApiResponse';

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
  });

  it('handles successful response with data', async () => {
    const mockResponse = new Response(
      JSON.stringify({
        data: { id: '1', name: 'test' },
        ok: true,
      }),
      { status: 200 },
    );
    const result = await handleApiResponse(Promise.resolve(mockResponse), { useConsole: false });
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
    const result = await handleApiResponse(Promise.resolve(mockResponse), {
      onError,
      useConsole: false,
    });
    expect(result).toEqual({
      data: null,
      ok: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        details: { field: 'name' },
      },
    });
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        details: { field: 'name' },
      }),
    );
  });

  it('processes service messages', async () => {
    const mockResponse = new Response(
      JSON.stringify({
        data: { id: '1' },
        ok: true,
        messages: [
          { type: 'success', message: 'Success message' },
          { type: 'warning', message: 'Warning message' },
          { type: 'info', message: 'Info message' },
        ],
      }),
      { status: 200 },
    );
    const onMessages = jest.fn();
    await handleApiResponse(Promise.resolve(mockResponse), { onMessages });
    expect(mockToast.success).toHaveBeenCalledWith('Success message');
    expect(mockToast.warning).toHaveBeenCalledWith('Warning message');
    expect(mockToast.info).toHaveBeenCalledWith('Info message');
    expect(onMessages).toHaveBeenCalledWith([
      { type: 'success', message: 'Success message' },
      { type: 'warning', message: 'Warning message' },
      { type: 'info', message: 'Info message' },
    ]);
  });

  it('handles invalidation keys', async () => {
    const mockResponse = new Response(
      JSON.stringify({
        data: { id: '1' },
        ok: true,
        invalidateKeys: [['users'], ['user-1'], ['profile']],
      }),
      { status: 200 },
    );
    const onInvalidateKeys = jest.fn();
    await handleApiResponse(Promise.resolve(mockResponse), { onInvalidateKeys });
    expect(onInvalidateKeys).toHaveBeenCalledWith([['users'], ['user-1'], ['profile']]);
  });

  it('handles non-JSON response', async () => {
    const mockResponse = new Response('Not JSON', { status: 200 });
    const onError = jest.fn();
    const result = await handleApiResponse(Promise.resolve(mockResponse), {
      onError,
      useConsole: false,
    });
    expect(result.ok).toBe(false);
    expect(result.error?.code).toBe('PARSE_ERROR');
    expect(result.error?.message).toBe('Invalid response format');
    expect(onError).toHaveBeenCalled();
  });

  it('handles network errors', async () => {
    const networkError = new Error('Network failed');
    const onError = jest.fn();
    const result = await handleApiResponse(Promise.reject(networkError), {
      onError,
      useConsole: false,
    });
    expect(result).toEqual({
      data: null,
      ok: false,
      error: {
        code: 'SYSTEM_ERROR',
        message: 'Network failed',
        // details: { error: 'Network failed' },
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
    await handleApiResponse(Promise.resolve(mockResponse), { useConsole: false });
    expect(mockToast.error).toHaveBeenCalledWith('Error message');
    expect(mockToastFn).toHaveBeenCalledWith('Unknown type');
  });
});
