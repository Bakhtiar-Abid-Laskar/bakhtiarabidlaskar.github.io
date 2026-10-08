import nextPlugin from '@next/eslint-plugin-next';
import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    ignores: [
      '.next/**',
      'out/**',
      'node_modules/**',
      'legacy/**',
      'reports/**',
      'public/**',
      'scripts/**',
    ],
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
      react: reactPlugin,
      'react-hooks': hooksPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      '@next/next/no-img-element': 'off',
      'no-restricted-globals': [
        'error',
        {
          name: 'localStorage',
          message:
            'localStorage is prohibited in components per architectural specification.',
        },
        {
          name: 'sessionStorage',
          message:
            'sessionStorage is prohibited in components per architectural specification.',
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/^#(?:[0-9a-fA-F]{3}){1,2}$/]',
          message:
            'Raw hex colors are prohibited. All colors must be read from tokens.css via var(--color-*).',
        },
      ],
    },
  },
];
