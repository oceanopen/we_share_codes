// ESLint 检查 .vue 文件需要单独配置编辑器：
// https://eslint.vuejs.org/user-guide/#editor-integrations
module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        sourceType: 'module',
    },
    // 全局变量
    globals: {
        module: true,
        process: true,
        require: true,
        __dirname: true,
        exports: true,
    },
    extends: ['prettier', 'plugin:@typescript-eslint/eslint-recommended'],
    // 插件
    plugins: ['prettier', '@typescript-eslint'],
    // 规则
    rules: {
        'prettier/prettier': 'warn',
        'no-undef': 0,
        'comma-dangle': ['warn', 'only-multiline'],
        'spaced-comment': [
            'warn',
            'always',
            {
                line: {
                    markers: ['/'],
                    exceptions: ['-', '+', '='],
                },
                block: {
                    markers: ['!'],
                    exceptions: ['*', '='],
                    balanced: true,
                },
            },
        ],
    },
};
