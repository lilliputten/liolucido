// @ts-check

import { fixupPluginRules } from '@eslint/compat';
import pluginJs from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import prettierConfig from 'eslint-config-prettier';
import { readGitignoreFiles } from 'eslint-gitignore';
import prettierPlugin from 'eslint-plugin-prettier';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import tailwindcssPlugin from 'eslint-plugin-tailwindcss';
import pluginYml from 'eslint-plugin-yml';
import globals from 'globals';
import * as tseslint from 'typescript-eslint';
import yamlParser from 'yaml-eslint-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  {
    ignores: [
      // Ignore `.gitignore` specified fiels etc...
      ...readGitignoreFiles({ cwd: __dirname }),
      '.next/**',
    ],
  },

  // TypeScript configuration
  ...tseslint.configs.recommended,

  // Base JS configuration for all JavaScript/TypeScript files
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      semi: ['warn', 'always'],
      'no-console': 'warn',
      'no-debugger': 'warn',
      'no-extra-semi': 'warn',
      'no-redeclare': 'warn',
      'no-undef': 'error',
      'no-unreachable': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'prefer-const': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-constant-binary-expression': 'off',
    },
  },

  // Tailwind CSS configuration
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    plugins: {
      tailwindcss: tailwindcssPlugin,
      'react-hooks': fixupPluginRules(pluginReactHooks),
    },
    rules: {
      ...tailwindcssPlugin.configs.recommended.rules,
      'tailwindcss/no-custom-classname': ['warn', { callees: ['twMerge'] }],
      ...pluginReactHooks.configs.recommended.rules,
    },
  },

  // React configuration with version specified
  {
    files: ['**/*.{jsx,tsx}'],
    ...pluginReact.configs.flat.recommended,
    plugins: {
      react: pluginReact,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
    },
  },

  // Typescript files
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-constant-binary-expression': 'off',
      'no-undef': 'off', // Disable for TypeScript files - TypeScript handles this
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
