// 执行上下文对象
const ctx = {
    func: (variable) => {
        console.log(variable);
    },
    foo: 'foo',
};

// 最简陋的沙箱
function poorestSandbox(code) {
    // eslint-disable-next-line no-eval
    eval(code); // 为执行程序构造了一个函数作用域
}

// 待执行程序
const code = `
  ctx.foo = 'bar'
  ctx.func(ctx.foo)
`;

poorestSandbox(code, ctx); // bar
