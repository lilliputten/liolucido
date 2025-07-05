// @ts-check

import js from '@eslint/js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import prettierConfig from 'eslint-config-prettier';
import { readGitignoreFiles } from 'eslint-gitignore';
import prettierPlugin from 'eslint-plugin-prettier';
import pluginReact from 'eslint-plugin-react';
import tailwindcssPlugin from 'eslint-plugin-tailwindcss';
import pluginYml from 'eslint-plugin-yml';
import globals from 'globals';
import * as tseslint from 'typescript-eslint';
import yamlParser from 'yaml-eslint-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  {
    ignores: [...readGitignoreFiles({ cwd: __dirname }), '**/*.{css,scss}'],
  },

  // TypeScript configuration
  ...tseslint.configs.recommended,

  // Base JS configuration for all JavaScript/TypeScript files
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    ignores: ['**/*.{css,scss}'],
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      semi: ['warn', 'always'],
      'no-console': 'warn',
      'no-debugger': 'warn',
      'no-extra-semi': 'warn',
      'no-redeclare': 'warn',
      'no-undef': 'error',
      'no-unreachable': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'prefer-const': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },

  // React configuration with version specified
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: ['**/*.{css,scss}'],
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // Override for root config files
  {
    files: ['*.{js,mjs,cjs,ts}'],
    ignores: [
      // Ignored files...
      'src/**',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        module: 'writable',
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  // Jest test files
  {
    files: ['**/*.test.{js,ts}', '**/*.spec.{js,ts}'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },

  // Override for source files to disable specific rules
  {
    files: ['src/**/*.{js,ts}'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-unused-vars': 'off',
    },
  },

  // YAML configuration
  {
    files: ['**/*.{yml,yaml}'],
    plugins: {
      yml: pluginYml,
    },
    languageOptions: {
      parser: yamlParser,
    },
    rules: {
      ...pluginYml.configs.recommended.rules,
      '@typescript-eslint/no-unused-expressions': 'off',
      'no-unused-expressions': 'off',
    },
  },

  // Tailwind CSS configuration
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      tailwindcss: tailwindcssPlugin,
    },
    rules: {
      ...tailwindcssPlugin.configs.recommended.rules,
    },
  },

  // Prettier integration
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...prettierConfig.rules,
      'prettier/prettier': 'warn',
    },
  },
];
