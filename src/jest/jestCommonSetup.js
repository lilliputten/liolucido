/* eslint-env jest */

/** Test db. Ensure if it has been created */
const DATABASE_URL = 'file:.data/test.db';

// Set it for prisma also
process.env.DATABASE_URL = DATABASE_URL;
