/* eslint-env jest */

import { ExtendedUser } from '@/@types/next-auth';

/* // NOTE: Using the local db for tests. Make sure all the data is cleaning.
 * // Test db. Ensure if it has been created
 * const DATABASE_URL = 'file:.data/test.db';
 * // Set it for prisma also
 * process.env.DATABASE_URL = DATABASE_URL;
 */

// Mocks...

jest.mock('@/jest/test/bare', () => ({
  getBare: jest.fn(() => 'initial mocked bare'),
}));

jest.mock('@/lib/session', () => ({
  getCurrentUser: jest.fn() as jest.MockedFunction<() => Promise<ExtendedUser | undefined>>,
}));
