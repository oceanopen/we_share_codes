# 浅析 JavaScript 沙箱

## 1. 什么是沙箱

在计算机安全中，`沙箱（Sandbox）` 是一种用于隔离正在运行程序的安全机制。
通常用于执行未经测试或不受信任的程序或代码，它会为待执行的程序创建一个独立的执行环境，内部程序的执行不会影响到外部程序的运行。

例如，下列场景就涉及了沙箱这一抽象的概念：

- 我们开发的页面程序运行在浏览器中，程序只能修改浏览器允许我们修改的那部分接口，我们无法通过这段脚本影响到浏览器之外的状态，在这个场景下浏览器本身就是一个沙箱。
- 浏览器中每个标签页运行一个独立的网页，每个标签页之间互不影响，这个标签页就是一个沙箱。
- ......

## 2. 沙箱有什么应用场景

上述介绍了一些较为宏观的沙箱场景，其实在日常的开发中也存在很多的场景需要应用这样一个机制：

- 执行 `JSONP` 请求回来的字符串时或引入不知名第三方 `JS` 库时，可能需要创造一个沙箱来执行这些代码。
- `Vue` 模板表达式的计算是运行在一个沙盒之中的，在模板字符串中的表达式只能获取部分全局对象，这一点[官方文档](https://cn.vuejs.org/v2/guide/syntax.html)有提到，详情可参阅[源码](https://github.com/vuejs/vue/blob/v2.6.10/src/core/instance/proxy.js)。

  ![](./images/001_vue官方沙盒说明.png)

- 在线代码编辑器，如 [CodeSanbox](https://codesandbox.io/) 等在线代码编辑器在执行脚本时都Object.prototype.hasOwnProperty.call(target, nProperty.call(target, nProperty.call(target, 主页面。
- `vue` 的服务端渲染：`vue` 的服务端渲染实现中，通过创建沙箱执行前端的 `bundle` 文件；
  在调用 `createBundleRenderer` 方法时候，允许配置 `runInNewContext` 为 `true` 或 `false` 的形式，判断是否传入一个新创建的 `sandbox` 对象以供 `vm` 使用；

总而言之，只要遇到不可信的第三方代码，我们就可以使用沙箱将代码进行隔离，从而保障外部程序的稳定运行。
如果不做任何处理地执行不可信代码，在前端中最直观的副作用/危害就是污染、篡改全局 `window` 状态，影响主页面功能甚至被 XSS 攻击。

```js
// 子应用代码
window.location.href = 'www.diaoyu.com';

// eslint-disable-next-line no-extend-native
Object.prototype.toString = () => {
    console.log('You are a fool :)');
};

document.querySelectorAll('div').forEach(node => node.classList.add('hhh'));

sendRequest(document.cookie);
```

## 3. 如何实现一个 JS 沙箱

要实现一个沙箱，其实就是去制定一套程序执行机制，在这套机制的作用下`沙箱内部程序的运行不会影响到外部程序的运行`。

### 3.1 最简陋的沙箱

要实现这样一个效果，最直接的想法就是程序中访问的`所有变量均来自可靠或自主实现的上下文环境而不会从全局的执行环境中取值`， 那么要实现变量的访问均来自一个可靠上下文环境，我们需要为待执行程序构造一个作用域：

```js
// poorestSandbox.js

// 执行上下文对象
const ctx = {
    func: (variable) => {
        console.log(variable);
    },
    foo: 'foo',
};

// 最简陋的沙箱
function poorestSandbox(code, ctx) {
    // eslint-disable-next-line no-eval
    eval(code); // 为执行程序构造了一个函数作用域
}

// 待执行程序
const code = `
  ctx.foo = 'bar'
  ctx.func(ctx.foo)
`;

poorestSandbox(code, ctx); // bar
```

这样的一个沙箱要求源程序在获取任意变量时都要加上执行上下文对象的前缀，这显然是非常不合理的，因为我们没有办法控制第三方的行为。
是否有办法去掉这个前缀呢？

### 3.2 非常简陋的沙箱（With）

使用 [with](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/with) 声明可以帮我们去掉这个前缀。
`with` 会在作用域链的顶端添加一个新的作用域，该作用域的变量对象会加入 `with` 传入的对象。
因此相较于外部环境其内部的代码在查找变量时会优先在该对象上进行查找。

```js
// veryPoorSandbox.js

// 省略...

// 非常简陋的沙箱
function veryPoorSandbox(_code, _ctx) {
    // Parsing error: 'with' in strict mode eslint
    // with (_ctx) {
    //    // Add with
    //    eval(_code)
    // }
}

// 省略...
```

这样一来就`实现了执行程序中的变量在沙箱提供的上下文环境中查找先于外部执行环境`的效果。

问题来了，在`提供的上下文对象`中没有找到某个变量时，代码仍会`沿着作用域链一层一层向上查找`，这样的一个沙箱仍然无法控制内部代码的执行。
我们希望沙箱中的代码只在`手动提供的上下文对象`中查找变量，如果上下文对象中不存在该变量则直接报错或返回 undefined。

### 3.3 没那么简陋的沙箱（With + Proxy）

为了解决上述抛出的问题，我们借助 `ES2015` 的一个新特性—— [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)，Proxy 可以代理一个对象，从而拦截并定义对象的基本操作。

`Proxy` 中的 `get` 和 `set` 方法只能拦截已存在于代理对象中的属性，对于代理对象中不存在的属性这两个钩子是无感知的。
因此这里我们使用 `Proxy.has()` 来拦截 `with` 代码块中的任意变量的访问，并设置一个白名单，在白名单内的变量可以正常走作用域链的访问方式，不在白名单内的变量会继续判断是否存在沙箱自行维护的上下文对象中，存在则正常访问，不存在则直接报错。

由于 `has` 会拦截 `with` 代码块中所有的变量访问，而我们只是想监控被执行代码块中的程序，因此还需要转换一下手动执行代码的形式 ：

```js
// littlePoorSandbox.js

// 构造一个 with 来包裹需要执行的代码，返回 with 代码块的一个函数实例
function withedYourCode(code) {
    code = `with(globalObj) {${code}}`;
    return new Function('globalObj', code);
}

// 可访问全局作用域的白名单列表
const access_white_list = ['Math', 'Date', 'console'];

// 待执行程序
const code = `
  console.log(Math.random())
  func(foo)
  location.href = 'xxx'
`;

// 执行上下文对象
const ctx = {
    func: (variable) => {
        console.log(variable);
    },
    foo: 'foo',
};

// 执行上下文对象的代理对象
const ctxProxy = new Proxy(ctx, {
    has: (target, prop) => {
    // has 可以拦截 with 代码块中任意属性的访问
        if (access_white_list.includes(prop)) {
            // 在可访问的白名单内，可沿着作用域链继续向上查找
            return false;
        }

        if (!Object.prototype.hasOwnProperty.call(target, prop)) {
            throw new Error(`Invalid expression - ${prop}! You can not do that!`);
        }

        return true;
    },
});

// 没那么简陋的沙箱
function littlePoorSandbox(code, ctx) {
    // 将 this 指向手动构造的全局代理对象
    // 将 with 作用域 指向手动构造的全局代理对象
    withedYourCode(code).call(ctx, ctx);
}

littlePoorSandbox(code, ctxProxy);

// Uncaught Error: Invalid expression - location! You can not do that!
```

到这一步，其实很多较为简单的场景就可以覆盖了（eg: `Vue` 的模板字符串）。
那如果想要实现 `CodeSanbox` 这样的 web 编辑器呢？在这样的编辑器中我们可以任意使用诸如 document、location 等全局变量且不会影响主页面。

从而又衍生出另一个问题——如何让子程序使用所有全局对象的同时不影响外部的全局状态呢？

### 3.4 天然的优质沙箱（iframe）

`iframe` 标签可以创造一个独立的浏览器原生级别的运行环境，这个环境由浏览器实现了与主环境的隔离。
在 `iframe` 中运行的脚本程序访问到的全局对象均是当前 `iframe` 执行上下文提供的，不会影响其父页面的主体功能，因此使用 `iframe` 来实现一个沙箱是目前最方便、简单、安全的方法。

试想一个这样的场景：一个页面中有多个沙箱窗口，其中有一个沙箱需要与主页面共享几个全局状态（eg: 点击浏览器回退按钮时子应用也会跟随着回到上一级），另一个沙箱需要与主页面共享另外一些全局状态（eg: 共享 `cookie` 登录态）。

虽然浏览器为主页面和 `iframe` 之间提供了 `postMessage` 等方式进行通信，但单单使用 `iframe` 来实现这个场景是比较困难且不易维护的。

### 3.5 应该能用的沙箱（With + Proxy + iframe）

为了实现上述场景，我们把上述方法聚合一下即可：

利用 `iframe` 对全局对象的天然隔离性，将 `iframe.contentWindow` 取出作为当前沙箱执行的全局对象。
将上述沙箱全局对象作为 `with` 的参数限制内部执行程序的访问，同时使用 `Proxy` 监听程序内部的访问。
维护一个`共享状态列表`，列出需要与外部共享的全局状态，在 `Proxy` 内部实现访问控制。

```js
// maybeAvailableSandbox.js

// 沙箱全局代理对象类
class SandboxGlobalProxy {
    constructor(sharedState) {
    // 创建一个 iframe 对象，取出其中的原生浏览器全局对象作为沙箱的全局对象
        const iframe = document.createElement('iframe', { url: 'about:blank' });
        iframe.style.display = 'none'; // 不可见
        document.body.appendChild(iframe);
        const sandboxGlobal = iframe.contentWindow; // 沙箱运行时的全局对象

        return new Proxy(sandboxGlobal, {
            has: (target, prop) => {
                // has 可以拦截 with 代码块中任意属性的访问
                if (sharedState.includes(prop)) {
                    // 如果属性存在于共享的全局状态中，则让其沿着作用域链在外层查找
                    return false;
                }

                if (!Object.prototype.hasOwnProperty.call(target, prop)) {
                    throw new Error(`Invalid expression - ${prop}! You can not do that!`);
                }

                return true;
            },
        });
    }
}

function maybeAvailableSandbox(code, ctx) {
    // 将 this 指向手动构造的全局代理对象
    // 将 with 作用域 指向手动构造的全局代理对象
    withedYourCode(code).call(ctx, ctx);
}

const code_1 = `
  console.log(history == window.history) // false

  window.abc = 'sandbox'

  Object.prototype.toString = () => {
    console.log('Traped!')
  }

  console.log(window.abc) // sandbox
`;

const sharedGlobal_1 = ['history']; // 希望与外部执行环境共享的全局对象
const globalProxy_1 = new SandboxGlobalProxy(sharedGlobal_1); // 每一个全局上下文对象都是独立的 iframe.contentWindow，以免相互污染
maybeAvailableSandbox(code_1, globalProxy_1);

// 验证外部变量有没被污染
console.log(window.abc); // undefined
Object.prototype.toString(); // [object Object] 并没有打印 Traped
```

从实例代码的结果可以看到借用 `iframe` 天然的环境隔离优势和 `with + Proxy` 强大的控制力，我们实现了沙箱内全局对象和外层的全局对象的隔离，并实现了共享部分全局属性。

### 3.6 沙箱逃逸（Sandbox Escape）

**沙箱于作者而言是一种安全策略，但于使用者而言可能是一种束缚。**
脑洞大开的开发者们尝试用各种方式摆脱这种束缚，也称之为沙箱逃逸。
因此一个沙箱程序最大的挑战就是如何检测并禁止这些预期之外的程序执行。

上面实现的沙箱似乎已经满足了我们的功能，大功告成了吗？其实不然，下列操作均会对沙箱之外的环境造成影响，实现沙箱逃逸：

- `访问沙箱执行上下文中某个对象内部属性`时， `Proxy` 无法捕获到这个属性的访问操作。
  例如我们可以直接在沙箱的执行上下文中通过 `window.parent` 拿到外层的全局对象。

  ```js
  // escapeSandbox.js

  const code_1 = `
    window.parent.abc = 'sandbox'
    console.log(window.parent.abc) // sandbox
  `;
  console.log(window.abc); // sandbox 预期是 undefined
  ```

- `通过访问原型链实现逃逸`，`JS` 可以直接声明一个字面量，沿着该字面量的原型链向上查找原型对象即可访问到外层的全局对象，这种行为亦是无法感知的。

  ```js
  // escapeSandbox.js

  const code_1 = `
    ;({}).constructor.prototype.toString = () => {
      console.log('Escape!')
    }
  `;
  Object.prototype.toString() // Escape!  预期是 [object Object]
  ;({}.toString()); // Escape!  预期是 [object Object]
  ```

### 3.7 “无瑕疵”的沙箱（Customize Interpreter）

通过上述的种种方式来实现一个沙箱或多或少存在一些缺陷，那是否存在一个趋于完备的沙箱呢？

其实有不少开源库已经在做这样一件事情，也就是分析源程序结构从而手动控制每一条语句的执行逻辑，通过这样一种方式无论是指定程序运行时的上下文环境还是捕获妄想逃脱沙箱控制的操作都是在掌控范围内的。
实现这样一个沙箱本质上就是实现一个自定义的解释器。

```js
function almostPerfectSandbox(code, ctx, illegalOperations) {
    return myInterpreter(code, ctx, illegalOperations); // 自定义解释器
}
```

## 4. 总结

本文主要介绍了沙箱的基本概念、应用场景以及引导各位思考如何去实现一个 `JavaScript` 沙箱。
沙箱的实现方式并不是一成不变的，应当结合具体的场景分析其需要达成的目标。
除此之外，沙箱逃逸的防范同样是一件任重而道远的事，因为很难在构建的初期就覆盖所有的执行 `case`。
没有一个沙箱的组装是一蹴而就的。

## 5. 参考

- [浅析 JavaScript 沙箱](https://mp.weixin.qq.com/s/PWVzD9IzwbPiwQ1Ghj83kQ)
- [说说 JS 中的沙箱](https://juejin.cn/post/6844903954074058760#heading-1)
