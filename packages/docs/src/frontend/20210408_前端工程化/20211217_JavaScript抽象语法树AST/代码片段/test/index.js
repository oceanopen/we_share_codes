const parser = require('@babel/parser');
const traverse = require('@babel/traverse');

// 源代码
const code = `
import { foo as foo2 } from 'mod'
`;

// 1. 源代码解析成 ast
const ast = parser.parse(code, {
    allowImportExportEverywhere: true,
});

// 2. 转换
const visitor = {
    ImportDeclaration(path) {
        console.log('node:', path.node);
        console.log('imported:', path.node.specifiers[0].imported);
        console.log('local:', path.node.specifiers[0].local);
    // do something
    },
};
traverse.default(ast, visitor);
