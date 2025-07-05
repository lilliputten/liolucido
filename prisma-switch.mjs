/* eslint-disable no-console */
/**
 * @desc Script to automatically switch prisma database provider from
 * postgresql (for vercel deployment environment) to sqlite (for local
 * development).
 */

import fs from 'fs';

const VERCEL_URL = process.env.VERCEL_URL;
const isVercel = !!VERCEL_URL;

console.log('prisma-switch: VERCEL_URL:', VERCEL_URL);

const prismaFile = 'prisma/schema.prisma';

/** Replace provider for required in the current environment: postgresql is only for vercel */
const requiredProvider = isVercel ? 'postgresql' : 'sqlite';
// TODO: Provider also should depend on a local `DATABASE_URL` environment parameter.<F2>

const providerRegex = /^(\s*provider\s*=\s*)"(sqlite|postgresql)"/m;
const content = fs.readFileSync(prismaFile, 'utf8');
const match = content.match(providerRegex);
const foundProvider = match && match[2];

console.log('prisma-switch: Found provider:', foundProvider);
console.log('prisma-switch: Required provider:', requiredProvider);

if (match && requiredProvider !== foundProvider) {
  console.log('prisma-switch: Replacing...');
  const newContent = content.replace(providerRegex, '$1"' + requiredProvider + '"');
  fs.writeFileSync(prismaFile, newContent);
  console.log('prisma-switch: OK');
} else {
  console.log('prisma-switch: No changes are required, done.');
}
