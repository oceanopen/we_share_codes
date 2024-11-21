const generator = require('@babel/generator');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse');
const types = require('@babel/types');

// 源代码
const code = `
function funA() {
  console.log(1)
} 
`;

// 1. 源代码解析成 ast
const ast = parser.parse(code);

// 2. 转换
const visitor = {
    // 当遍历到 CallExpression 时候触发
    CallExpression(path) {
        const callee = path.node.callee;
        /**
      "callee": {
        "type": "MemberExpression",
        "start": 20,
        "end": 31,
        "object": {
          "type": "Identifier",
          "start": 20,
          "end": 27,
          "name": "console"
        },
        "property": {
          "type": "Identifier",
          "start": 28,
          "end": 31,
          "name": "log"
        },
        "computed": false,
        "optional": false
      }
         */
        // 判断当前执行的函数是否是 MemberExpression
        if (types.isMemberExpression(callee)) {
            const { object, property } = callee;
            if (types.isIdentifier(object, { name: 'console' }) && types.isIdentifier(property, { name: 'log' })) {
                /**
          "type": "FunctionDeclaration",
          "id": {
            "type": "Identifier",
            "start": 9,
            "end": 13,
            "name": "funA"
          }
                 */
                // 查找最接近的父函数或程序
                const parent = path.getFunctionParent();
                const parentFunName = parent.node.id.name;
                /**
          "arguments": [
            {
              "type": "Literal",
              "start": 32,
              "end": 53,
              "value": "from function funA:",
              "raw": "'from function funA:'"
            },
            {
              "type": "Literal",
              "start": 55,
              "end": 56,
              "value": 1,
              "raw": "1"
            }
          ],
                 */
                path.node.arguments.unshift(types.stringLiteral(`from function ${parentFunName}`));
            }
        }
    },
};
traverse.default(ast, visitor);

// 3. 生成
const result = generator.default(ast, {}, code);
console.log(result.code);

// 4. 日志输出
// function funA() {
//   console.log("from function funA", 1);
// }
