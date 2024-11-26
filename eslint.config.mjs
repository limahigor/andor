import { fileURLToPath } from 'url';
import love from 'eslint-config-love';

const __filename = fileURLToPath(import.meta.url);
const __dirname = __filename.substring(0, __filename.lastIndexOf('/'));

export default [
  {
    ...love,
    files: ['**/*.js', '**/*.ts'],
    rules: {
      ...love.rules,
      "@typescript-eslint/strict-boolean-expressions": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-magic-numbers": "off",
      "eslint-comments/require-description": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/class-methods-use-this": "off",
      "@typescript-eslint/no-unsafe-type-assertion": "off",
      "@typescript-eslint/require-await": "off",
    },
  },
  {
    files: ['packages/auth-service/**/*.ts', 'packages/api-gateway/**/*.ts'],
    rules: {
      '@typescript-eslint/no-requires-imports': 'off',
    },
  },
  {
    files: ['packages/frontend/**/*.tsx', 'packages/frontend/**/*.ts', 'packages/frontend/**/*.js'],
    rules: {
      'react/react-in-jsx-scope': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['packages/media-service/**/*.ts', 'packages/channel-service/**/*.ts'],
    rules: {
      'import/extensions': ['error', 'always'],
      "@typescript-eslint/prefer-nullish-coalescing": 'off',
      "@typescript-eslint/prefer-destructuring": 'off',
      "@typescript-eslint/no-unsafe-return": 'off',
      "@typescript-eslint/no-unused-vars": 'off',
      "@typescript-eslint/no-unsafe-argument": 'off',
      "@typescript-eslint/no-unsafe-call": 'off',
      "@typescript-eslint/explicit-function-return-type": 'off',
    },
  },
];
