// 执行上下文对象
const ctx = {
  func: (variable) => {
    console.log(variable);
  },
  foo: 'foo',
};

// 非常简陋的沙箱
function veryPoorSandbox(_code, _ctx) {
  // Parsing error: 'with' in strict mode eslint
  // with (_ctx) {
  //    // Add with
  //    eval(_code)
  // }
}

// 待执行程序
const code = `
  foo = 'bar'
  func(foo)
`;

veryPoorSandbox(code, ctx); // bar
