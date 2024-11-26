// eslint.config.js
import antfu from '@antfu/eslint-config';

export default await antfu({
    ignores: [
        'pnpm-lock.yaml',
        'pnpm-workspace.yaml',
    ],
    stylistic: {
        indent: 4,
        quotes: 'single',
        semi: 'always',
    },
    typescript: true,
    vue: true,
    rules: {
        'curly': ['error', 'multi-line'],
        'vue/block-order': [
            'error',
            {
                order: ['template', 'script', 'style'],
            },
        ],
        'style/member-delimiter-style': [
            'error',
            {
                multiline: {
                    delimiter: 'semi',
                    requireLast: true,
                },
                singleline: {
                    delimiter: 'semi',
                    requireLast: false,
                },
                multilineDetection: 'brackets',
            },
        ],
        'yml/indent': ['error', 4, { indentBlockSequences: true, indicatorValueIndent: 2 }],
        'no-console': 'off',
        'antfu/no-top-level-await': 'off',
        'no-func-assign': 'off',
        'no-useless-constructor': 'off',
        'valid-typeof': 'off',
        'regexp/no-super-linear-backtracking': 'off',
        'eslint-comments/no-unlimited-disable': 'off',
        'regexp/no-unused-capturing-group': 'off',
        'style/no-tabs': 'off', // 兼容 go 代码风格
        'no-array-constructor': 'off',
        'prefer-regex-literals': 'off',
        'style/max-statements-per-line': 'off',
        'no-new-func': 'off',
        'style/brace-style': 'off',
    },
});
