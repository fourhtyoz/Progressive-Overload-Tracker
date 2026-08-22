// https://docs.expo.dev/guides/using-eslint/
module.exports = {
    extends: ['expo', 'prettier'],
    plugins: ['simple-import-sort', '@typescript-eslint'],
    rules: {
        // Import sorting
        'simple-import-sort/imports': [
            'error',
            {
                groups: [
                    // Side effect imports
                    ['^\\u0000'],
                    // Node.js builtins, packages, and scoped packages
                    ['^(node:|@?\\w)'],
                    // Alias imports (@/)
                    ['^@/'],
                    // Relative imports
                    ['^\\.\\./', '^\\./'],
                ],
            },
        ],
        'simple-import-sort/exports': 'error',

        // TypeScript unused vars (works without type info)
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                caughtErrorsIgnorePattern: '^_',
                ignoreRestSiblings: true,
            },
        ],

        // React hooks
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
    },
    overrides: [
        {
            // Type-aware rules only for TypeScript files
            files: ['**/*.ts', '**/*.tsx'],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                project: './tsconfig.json',
            },
            rules: {
                '@typescript-eslint/no-floating-promises': 'error',
                '@typescript-eslint/await-thenable': 'error',
            },
        },
    ],
};
