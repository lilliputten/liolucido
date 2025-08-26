import { afterEach, describe, expect, it, jest } from '@jest/globals';

import { getBare } from '@/jest/test/bare';

const mockedGetBare = getBare as jest.MockedFunction<typeof getBare>;

describe('mocking getBare', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    mockedGetBare.mockReset();
  });

  it('should return mocked bare', () => {
    mockedGetBare.mockImplementation(() => 'mocked bare');
    expect(getBare()).toBe('mocked bare');
  });
});
