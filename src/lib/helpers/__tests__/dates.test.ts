import { getNativeFormattedRelativeDate } from '../dates';

const locale = 'en';

describe('getNativeFormattedRelativeDate', () => {
  const mockNow = new Date('2024-01-15T12:00:00.000Z');

  beforeEach(() => {
    // Mock the current date to ensure consistent test results
    jest.useFakeTimers();
    jest.setSystemTime(mockNow);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('relative dates (within a day)', () => {
    it('should return seconds for very recent dates (less than 1 minute)', () => {
      const recentDate = new Date('2024-01-15T11:59:30.000Z'); // 30 seconds ago
      const result = getNativeFormattedRelativeDate(recentDate, mockNow, locale);
      expect(result).toBe('30 sec. ago');
    });

    it('should return minutes for dates within an hour', () => {
      const withinHourDate = new Date('2024-01-15T11:30:00.000Z'); // 30 minutes ago
      const result = getNativeFormattedRelativeDate(withinHourDate, mockNow, locale);
      expect(result).toBe('30 min. ago');
    });

    it('should return hours for dates within a day', () => {
      const withinDayDate = new Date('2024-01-15T08:00:00.000Z'); // 4 hours ago
      const result = getNativeFormattedRelativeDate(withinDayDate, mockNow, locale);
      expect(result).toBe('4 hr. ago');
    });

    it('should return hours for dates just under 24 hours', () => {
      const justUnderDayDate = new Date('2024-01-14T12:30:00.000Z'); // 23.5 hours ago
      const result = getNativeFormattedRelativeDate(justUnderDayDate, mockNow, locale);
      expect(result).toBe('24 hr. ago'); // RelativeTimeFormat rounds up
    });
  });

  describe('full dates (older than a day)', () => {
    it('should return full date for dates older than 24 hours', () => {
      const olderDate = new Date('2024-01-13T12:00:00.000Z'); // 2 days ago
      const result = getNativeFormattedRelativeDate(olderDate, mockNow, locale);
      expect(result).toBe('Jan 13');
    });

    it('should return full date for dates exactly 24 hours ago', () => {
      const exactlyDayAgo = new Date('2024-01-14T12:00:00.000Z'); // exactly 24 hours ago
      const result = getNativeFormattedRelativeDate(exactlyDayAgo, mockNow, locale);
      expect(result).toBe('Jan 14');
    });

    it('should include year for dates older than 6 months', () => {
      const oldDate = new Date('2023-06-15T12:00:00.000Z'); // 7 months ago
      const result = getNativeFormattedRelativeDate(oldDate, mockNow, locale);
      expect(result).toBe('Jun 15, 2023');
    });

    it('should not include year for dates within 6 months', () => {
      const recentOldDate = new Date('2023-08-15T12:00:00.000Z'); // 5 months ago
      const result = getNativeFormattedRelativeDate(recentOldDate, mockNow, locale);
      expect(result).toBe('Aug 15');
    });
  });

  describe('edge cases', () => {
    it('should handle future dates', () => {
      const futureDate = new Date('2024-01-15T13:00:00.000Z'); // 1 hour in future
      const result = getNativeFormattedRelativeDate(futureDate, mockNow, locale);
      expect(result).toBe('in 1 hr.'); // Should show "in 1 hr." instead of "in 3,600 sec."
    });

    it('should handle future dates in seconds', () => {
      const futureDate = new Date('2024-01-15T12:00:30.000Z'); // 30 seconds in future
      const result = getNativeFormattedRelativeDate(futureDate, mockNow, locale);
      expect(result).toBe('in 30 sec.');
    });

    it('should handle future dates in minutes', () => {
      const futureDate = new Date('2024-01-15T12:30:00.000Z'); // 30 minutes in future
      const result = getNativeFormattedRelativeDate(futureDate, mockNow, locale);
      expect(result).toBe('in 30 min.');
    });

    it('should handle future dates older than a day', () => {
      const futureDate = new Date('2024-01-16T12:00:00.000Z'); // 1 day in future
      const result = getNativeFormattedRelativeDate(futureDate, mockNow, locale);
      expect(result).toBe('Jan 16');
    });

    it('should handle same date and time', () => {
      const sameDate = new Date('2024-01-15T12:00:00.000Z'); // same time
      const result = getNativeFormattedRelativeDate(sameDate, mockNow, locale);
      expect(result).toBe('0 sec. ago');
    });

    it('should use current date when no date is provided', () => {
      const result = getNativeFormattedRelativeDate(undefined, mockNow, locale);
      expect(result).toBe('0 sec. ago');
    });

    it('should use current date when no now parameter is provided', () => {
      const testDate = new Date('2024-01-15T11:00:00.000Z'); // 1 hour ago
      const result = getNativeFormattedRelativeDate(testDate, undefined, locale);
      expect(result).toBe('1 hr. ago');
    });
  });

  describe('formatting consistency', () => {
    it('should use consistent short style formatting', () => {
      const recentDate = new Date('2024-01-15T11:45:00.000Z'); // 15 minutes ago
      const result = getNativeFormattedRelativeDate(recentDate, mockNow, locale);
      expect(result).toMatch(/^\d+ min\. ago$/);
    });

    it('should use consistent date formatting for older dates', () => {
      const oldDate = new Date('2024-01-10T12:00:00.000Z'); // 5 days ago
      const result = getNativeFormattedRelativeDate(oldDate, mockNow, locale);
      expect(result).toMatch(/^[A-Za-z]{3} \d{1,2}$/); // e.g., "Jan 10"
    });
  });
});
