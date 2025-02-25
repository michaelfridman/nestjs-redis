module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module'
    },
    plugins: ['@typescript-eslint', 'eslint-plugin-tsdoc', 'deprecation'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:jest/recommended',
        'plugin:jest/style',
        'plugin:prettier/recommended'
    ],
    root: true,
    env: {
        node: true,
        jest: true
    },
    ignorePatterns: ['.eslintrc.js', 'dist/*', 'health/*', 'health.ts', 'compat.js'],
    reportUnusedDisableDirectives: true,
    rules: {
        'tsdoc/syntax': 'warn',
        'deprecation/deprecation': 'warn'
    }
};
