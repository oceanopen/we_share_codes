module.exports = {
    extends: ['stylelint-config-standard', 'stylelint-config-rational-order', 'stylelint-prettier/recommended'],
    plugins: ['stylelint-scss', 'stylelint-declaration-block-no-ignored-properties'],
    // https://stylelint.docschina.org/user-guide/rules/
    rules: {
        'no-empty-source': null, // 允许空文件
        'at-rule-no-unknown': null, // 允许未知的@规则。
    },
    ignoreFiles: [],
};
