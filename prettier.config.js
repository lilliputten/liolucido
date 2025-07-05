// @ts-check

/** @type {import('prettier').Config} */
module.exports = {
  bracketSpacing: true,
  endOfLine: 'lf',
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  printWidth: 100,
  importOrder: [
    '@shared',
    '',
    '^(react/(.*)$)|^(react$)',
    '^(next/(.*)$)|^(next$)',
    '^(jest/(.*)$)|^(jest)',
    '@testing-library',
    '@[A-Za-z]',
    '<BUILTIN_MODULES>', // Node.js built-in modules
    '<THIRD_PARTY_MODULES>',
    '',
    '^@/env(.*)$',
    '^@/shared/types/(.*)$',
    '^@/config/(.*)$',
    '^@/lib/(.*)$',
    '^@/hooks/(.*)$',
    '^@/components/ui/(.*)$',
    '^@/components/(.*)$',
    '^@/styles/(.*)$',
    '^@/app/(.*)$',
    '^@/',
    '',
    '^[./]',
    '',
    '^[./].*.(css|less|scss)$',
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  plugins: [
    // Organize imports, @see https://www.npmjs.com/package/@ianvs/prettier-plugin-sort-imports#options
    '@ianvs/prettier-plugin-sort-imports',
    // 'prettier-plugin-tailwindcss',
  ],
};
