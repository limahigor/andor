import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    ignores: ['dist'], // Ignore a pasta de build
    files: ['**/*.{ts,tsx}'], // Aplica regras para arquivos TypeScript e TSX
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser, // Configura globais do navegador
      parser: tsParser, // Usa o parser do TypeScript
      sourceType: 'module', // Define ES Modules como padrão
    },
    plugins: {
      'react-hooks': reactHooks, // Adiciona React Hooks Plugin
      'react-refresh': reactRefresh, // Adiciona React Refresh Plugin
      '@typescript-eslint': tseslint, // Adiciona TypeScript ESLint Plugin
    },
    rules: {
      ...reactHooks.configs.recommended.rules, // Regras recomendadas para React Hooks
      ...tseslint.configs.recommended.rules, // Regras recomendadas para TypeScript
      '@typescript-eslint/no-unused-vars': 'warn', // Adiciona regra para variáveis não usadas
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },
];
