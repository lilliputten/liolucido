import 'server-only';

import { PrismaClient } from '@prisma/client';

declare global {
  var cachedPrisma: PrismaClient;
}

export let prisma: PrismaClient;

const isJest = process.env.JEST_WORKER_ID !== undefined;
const isProduction = process.env.NODE_ENV !== 'development';

if (isProduction || isJest) {
  prisma = new PrismaClient();
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient();
  }
  prisma = global.cachedPrisma;
}
