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
    },
});
