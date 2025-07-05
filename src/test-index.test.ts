import { test } from '@/test-index';

describe('index', () => {
  it('should export test as a numeric value', () => {
    expect(typeof test).toBe('number');
    expect(test).toBe(1);
  });
});
