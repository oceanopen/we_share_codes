# 按 Promises/A+ 规范实现一个 Promise (ES6版)

## 1. 理解一些基础概念

原型链，类，实例， 类属性，类方法， 实例属性，实例方法。

```js
class A {
    static b = '1';
    static classMethod() {
        return 'hello';
    }
}

const a = new A();
a.c = 5;
a.sayHello = function () {
    console.log('welcome');
};
```

- A: 类
- A.b: 类属性
- A.classMethod: 类方法

- a: 实例
- a.c: 实例属性
- a.sayHello: 实例方法

**ES6 的类**

static：静态属性指的是 Class 本身的属性，即 Class.propName，而不是定义在实例对象（this）上的属性。

## 2. Promise 简单介绍

"君子一诺千金，承诺的事情一定会去执行。"

> 要想自己实现一个 Promise，我们首先要对 Promise 的用法有所了解；

### 2.1 使用场景

- 使用 Promise 能够有效的解决 js 异步回调地狱问题；
- 能够将业务逻辑与数据处理分隔开使代码更优雅，方便阅读，更有利于代码维护；

### 2.2 基本用法

```js
function promiseTest() {
    const promise = new Promise((resolve, reject) => {
        const r = Number.parseInt(Math.random() * 10);
        if (r % 2 === 0) {
            resolve('成功');
        }
        else {
            reject(new Error('失败'));
        }
    });
    return promise;
}
const promise = promiseTest();
promise
    .then((data) => {
        console.log(data);
    })
    .catch((err) => {
        console.log(err);
    });
```

### 2.3 Promise 的规范

- `Promise` 有三种状态：`pending`，`fulfilled`，`rejected`。

  - `pending` 代表等待的状态，在此状态下，可能执行 resolve() 的方法，也可能执行 reject() 方法。
  - `fulfilld` 代表成功态，此状态下执行 resolve() 方法。
  - `rejected` 代表失败态，此状态下执行 reject() 方法，一旦成功了就不能失败，反过来也是一样。

- 每个 `Promise` 都有一个 `then` 方法。
- 如果 `new Promise` 报错了会走失败态（throw new Error（'报错'）也会走失败态）。

> 详见这里[Promises/A+规范文档](https://promisesaplus.com/)。

### 2.4 Promise.then 的特点

- 如果返回一个普通的值，我们就将这个普通值传递给下一个 then。
- 如果返回一个 `Promise` 对象，我们就将这个 `Promise` 对象执行结果返回到下一个 then。

### 2.5 Promise.resolve 的特点

- 参数是一个 `Promise` 实例, 那么 `Promise.resolve` 将不做任何修改、原封不动地返回这个实例。
- 如果参数是一个原始值，或者是一个不具有 then 方法的对象，则 `Promise.resolve` 方法返回一个新的 `Promise` 对象，状态为 `resolved`。

### 2.6 Promise.all 的特点

- `Promise.all` 方法接受一个数组作为参数，p1、p2、p3 都是 `Promise` 实例，如果不是，就会先调用上面讲到的 `Promise.resolve` 方法，将参数转为 `Promise` 实例，再进一步处理。
- 返回值组成一个数组。

### 2.7 Promise.race 的特点

- `Promise.race` 方法的参数与 Promise.all 方法一样，如果不是 `Promise` 实例，就会先调用上面讲到的 `Promise.resolve` 方法，将参数转为 `Promise` 实例，再进一步处理。
- 返回那个率先改变的 `Promise` 实例的返回值。

## 3. 代码实现

### 3.1 同步基础实现

```js
class MyPromise {
    constructor(executor) {
        this.status = 'pending'; // 状态值
        this.value = undefined; // 成功的返回值
        this.reason = undefined; // 失败的返回值

        // 成功
        const resolve = (value) => {
            // pending 最屏蔽的，resolve 和 reject 只能调用一个，不能同时调用，这就是 pending 的作用
            if (this.status === 'pending') {
                this.status = 'fullFilled';
                this.value = value;
            }
        };
        // 失败
        const reject = (reason) => {
            // pending 最屏蔽的，resolve 和 reject 只能调用一个，不能同时调用，这就是 pending 的作用
            if (this.status === 'pending') {
                this.status = 'rejected';
                this.reason = reason;
            }
        };
        try {
            // 执行函数
            executor(resolve, reject);
        }
        catch (err) {
            // 失败则直接执行 reject 函数
            reject(err);
        }
    }

    then(onFullFilled, onRejected) {
    // 状态为 fulfuilled，执行 onFullFilled，传入成功的值
        if (this.status === 'fullFilled') {
            onFullFilled(this.value);
        }
        // 状态为 rejected，执行 onRejected，传入失败的值
        if (this.status === 'rejected') {
            onRejected(this.reason);
        }
    }
}
```

测试代码如下：

```js
const p11 = new MyPromise((resolve, reject) => {
    // resolve('success')   // 走了成功就不会走失败了
    // throw new Error('失败'); // 失败了就走resolve
    reject(new Error('failed')); // 走了失败就不会走成功
});
p11.then(
    (res) => {
        console.log('onFullFilled:', res);
    },
    (err) => {
        console.log('onRejected:', err);
    }
);
```

执行结果如下：

```
onRejected: Error: 失败
```

我们发现同步调用是正常的。
但是当碰到异步调用的时候，上面的代码就会卡在 pending 状态，无法继续执行。

测试代码如下：

```js
const p12 = new MyPromise((resolve, reject) => {
    // 异步调用的时候，this.status 一直是 pending 状态，不会执行代码了。
    setTimeout(() => {
        resolve('success');
    }, 1000);
});
p12.then(
    (res) => {
        console.log('onFullFilled:', res);
    },
    (err) => {
        console.log('onRejected:', err);
    }
);
```

我们发现 `then` 调用一直没有执行。
因为同步执行 `then` 方法的时候，`status` 为 `pending` 状态，就不会执行 `onFullFilled` 和 `onRejected` 回调。

那么接下来就要解决异步执行的问题。

### 3.2 异步基础实现

此时我们使用一个发布订阅者模式，在 `pending` 状态的时候将成功的函数和失败的函数存到各自的回调队列数组中。
等一旦 `fulFilled` 或者 `rejected`，就调用它们：

- 在 `pending` 态的时候将所有的要在成功态执行的方法都存到 `onResolveCallbacks` 数组中。
- 在 `pending` 态的时候将所有的要在失败态执行的方法都存到 `onRejectedCallbacks` 数组中。

```js
class MyPromise {
    constructor(executor) {
    // ...

        this.onResolvedCallbacks = []; // 保存成功态要执行的函数
        this.onRejectedCallbacks = []; // 存放失败态要执行的函数

        // ...

        // 成功
        const resolve = (value) => {
            if (this.status === 'pending') {
                // ...

                // 发布执行函数
                this.onResolvedCallbacks.forEach(fn => fn());
            }
        };
        // 失败
        const reject = (reason) => {
            if (this.status === 'pending') {
                // ...

                // 发布执行函数
                this.onRejectedCallbacks.forEach(fn => fn());
            }
        };

    // ...
    }
}
```

当状态变化的时候，就执行发布他们。

```js
class MyPromise {
    // ...
    then(onFullFilled, onRejected) {
    // ...

        // 异步：状态为 pending 时，将成功的函数和失败的函数存到各自的回调队列数组中
        if (this.status === 'pending') {
            // 在 pending 状态的时候先订阅
            this.onResolvedCallbacks.push(() => {
                onFulFilled(this.value);
            });
            this.onRejectedCallbacks.push(() => {
                onRejected(this.reason);
            });
        }

    // ...
    }
    // ...
}
```

测试代码如下：

```js
const p21 = new MyPromise((resolve, reject) => {
    // 异步调用的时候，this.status 一直是 pending 状态，不会执行代码了。
    setTimeout(() => {
    // resolve('success')
        reject('failed');
    }, 1000);
});
// 这里测试改装成发布订阅者模式调用是否正常
p21.then(
    (res) => {
        console.log('onFullFilled:', res);
    },
    (err) => {
        console.log('onRejected:', err);
    }
);
// 这里测试执行完毕后，调用 then 是否执行正常
setTimeout(() => {
    p21.then(
        (res) => {
            console.log('onFullFilled:', res);
        },
        (err) => {
            console.log('onRejected:', err);
        }
    );
}, 2000);
```

执行结果如下：

```
onRejected: failed
onRejected: failed
```

### 3.3 链式调用实现

要达到链式调用我们就要采用递归函数实现了。

我们先来回味一下两个经典的故事感受下`递归函数`的调用：

- 老和尚给小和尚讲故事

  - “老和尚给小和尚讲故事：从前有座山，山里有座庙，庙里有个老和尚还有一个小和尚。有一天，老和尚给小和尚讲故事：从前有座山，山里有座庙......”

- 愚公移山

  - 愚公说：“虽我之死，有子存焉；子又生孙，孙又生子；子又有子，子又有孙；子子孙孙无穷匮也，而山不加增，何苦而不平”

下面先来分析一下链式调用的用法，以及 `then` 里面可能出现的情况：

```js
const promise = new MyPromise((resolve, reject) => {
    resolve(100);
});
promise
    .then(
        (data) => {
            return 100 * data;
        },
        (err) => {
            console.log('error:', err);
        }
    )
    .then((data) => {
        return new MyPromise((resolve, reject) => {
            console.log('data:', data); // data:10000
            resolve(data);
        });
    })
    .then((data) => {
        console.log('result:', data); // result:10000
        return data;
    });
```

根据原生 promise 的 then 的用法，我们总结一下：

- then 方法如果返回一个普通的值，我们就将这个普通值传递给下一个 then。
- then 方法如果返回一个 promise 对象，我们就将这个 promise 对象执行结果返回到下一个 then。

#### 3.3.1 普通的值传递

普通的值传递很好办，我们将第一次 then 的 onFulfilled 函数返回的值存到 x 变量里面，在然后 resolve 出去就可以了：

```js
class MyPromise {
    // ...

    then(onFullFilled, onRejected) {
    // 这样就是一个递归
        const nextPromise = new MyPromise((resolve, reject) => {
            // 函数里面调函数就跟第一次使用一样，主要的是这里面的 this 指向怎么变化的

            // 保存同步返回
            let x; // 这一步 x 只能处理普通值

            if (this.status === 'fullFilled') {
                x = onFullFilled(this.value); // 箭头函数，this 一直是指向最外层的对象
                resolve(x);
            }
            if (this.status === 'rejected') {
                x = onRejected(this.reason);
                reject(x);
            }

            // 异步
            if (this.status === 'pending') {
                // 在 pending 状态的时候先订阅
                this.onResolvedCallbacks.push(() => {
                    x = onFullFilled(this.value);
                    resolve(x);
                });
                this.onRejectedCallbacks.push(() => {
                    x = onRejected(this.reason);
                    resolve(x);
                });
            }
        });

        return nextPromise;
    }
}
```

测试代码如下：

```js
const promise = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(100);
    });
});
promise
    .then(
        (data) => {
            return 100 * data;
        },
        (err) => {
            console.log('error:', err);
        }
    )
    .then((data) => {
        data = 100 * data;
        console.log('result:', data); // result:1000000
        return data;
    });
```

#### 3.3.2 Promise 对象传递

因为返回的 `promise` 的我们要判断他执行的状态，来决定是走成功态，还是失败态，这时候我们就要写一个判断的函数：

```js
resolvePromise(nextPromise, x, resolve, reject);
```

来完成这个判断。

```js
class MyPromise {
    // ...

    then(onFullFilled, onRejected) {
    // 这样就是一个递归
        const nextPromise = new MyPromise((resolve, reject) => {
            // 箭头函数，this 一直是指向最外层的对象

            // 保存同步返回
            let x;

            if (this.status === 'fullFilled') {
                // 同步无法使用 nextPromise，所以借用 setiTimeout 异步的方式
                setTimeout(() => {
                    try {
                        x = onFullFilled(this.value);
                        // 添加一个 resolvePromise() 的方法来判断 x 跟 nextPromise 的状态，决定 nextPromise 是走成功还是失败
                        resolvePromise(nextPromise, x, resolve, reject);
                    }
                    catch (err) {
                        // 中间任何一个环节报错都要走 reject()
                        reject(err);
                    }
                }, 0); // MDN 0>=4ms
            }
            if (this.status === 'rejected') {
                // 同步无法使用 nextPromise，所以借用 setiTimeout 异步的方式
                setTimeout(() => {
                    try {
                        x = onRejected(this.reason);
                        // 添加一个 resolvePromise() 的方法来判断 x 跟 nextPromise 的状态，决定 nextPromise 是走成功还是失败
                        resolvePromise(nextPromise, x, resolve, reject);
                    }
                    catch (err) {
                        // 中间任何一个环节报错都要走 reject()
                        reject(err);
                    }
                }, 0); // MDN 0>=4ms
            }

            // 异步
            if (this.status === 'pending') {
                // 在 pending 状态的时候先订阅
                this.onResolvedCallbacks.push(() => {
                    // 同步无法使用 nextPromise，所以借用 setiTimeout 异步的方式
                    setTimeout(() => {
                        try {
                            x = onFullFilled(this.value);
                            // 添加一个 resolvePromise() 的方法来判断 x 跟 nextPromise 的状态，决定 nextPromise 是走成功还是失败
                            resolvePromise(nextPromise, x, resolve, reject);
                        }
                        catch (err) {
                            // 中间任何一个环节报错都要走 reject()
                            reject(err);
                        }
                    }, 0); // MDN 0>=4ms
                });
                this.onRejectedCallbacks.push(() => {
                    // 同步无法使用 nextPromise，所以借用 setiTimeout 异步的方式
                    setTimeout(() => {
                        try {
                            x = onRejected(this.reason);
                            // 添加一个 resolvePromise() 的方法来判断 x 跟 nextPromise 的状态，决定 nextPromise 是走成功还是失败
                            resolvePromise(nextPromise, x, resolve, reject);
                        }
                        catch (err) {
                            // 中间任何一个环节报错都要走 reject()
                            reject(err);
                        }
                    }, 0); // MDN 0>=4ms
                });
            }
        });

        return nextPromise;
    }
}
```

下面再来实现核心的 `resolvePromise` 方法。这个方法的主要作用是：

- 用来判断 `x` 的值，如果 `x` 的值是一个普通的值，就直接返回 `x` 的值。
- 如果 `x` 的值是一个 `promise`，就要返回 `x.then()` 执行的结果。

```js
function resolvePromise(nextPromise, x, resolve, reject) {
    // x 和 nextPromise 不能是同一个Promise实例，如果是同一个就报错，这里作为异常校验，正常不会出现这种情况
    if (nextPromise === x) {
        return reject(new TypeError('Chaining cycle detected for promise #<promise>'));
    }

    // 判断如果 x 是否是对象，判断变量类型的方法有：typeof instanceof constructor toString
    if (typeof x === 'object' && x != null) {
        try {
            // 预防取 .then 的时候错误
            const then = x.then; // Object.definePropertype

            if (typeof then === 'function') {
                then.call(
                    x,
                    (y) => {
                        resolve(y); // 采用 promise 的成功结果，并且向下传递
                    },
                    (r) => {
                        reject(r); // 采用 promise 的失败结果，并且向下传递
                    }
                );
            }
            else {
                resolve(x); // x 是一个普通对象
            }
        }
        catch (err) {
            reject(err);
        }
    }
    else {
    // x 是一个普通值
        resolve(x);
    }
}
```

测试代码如下：

```js
const promise = new MyPromise((resolve, reject) => {
    resolve(100);
});
promise
    .then(
        (data) => {
            return 100 * data;
        },
        (err) => {
            console.log('error:', err);
        }
    )
    .then((data) => {
        return new MyPromise((resolve, reject) => {
            console.log('data:', data); // data:10000
            resolve(data);
        });
    })
    .then((data) => {
        console.log('result:', data); // result:10000
        return data;
    });
```

#### 3.3.3 Promise 对象嵌套传递

此时基本的情况都已经实现的差不多了，下面还有一种如下的情况，x 的值里面包含有 promise：

```js
const p2 = p.then((data) => {
    return new MyPromise((resolve, reject) => {
        resolve(
            new MyPromise((resolve, reject) => {
                setTimeout(() => {
                    // 这里很可能又是一个 promise 函数
                    resolve(data * 1000);
                }, 1000);
            })
        );
    });
});
```

我们只需要在判断 x 的值的时候多调用一个回调，就可以解决以上的问题：

```js
function resolvePromise(nextPromise, x, resolve, reject) {
    // ...
    if (typeof then === 'function') {
        then.call(
            x,
            (y) => {
                // y 有可能是一个 promise，那么我们就要继续使用回调函数,直到解析出来的值是一个普通值
                resolvePromise(nextPromise, y, resolve, reject);
            },
            (r) => {
                reject(r); // 采用 promise 的失败结果，并且向下传递
            }
        );
    }
    // ...
}
```

测试代码：

```js
const promise = new MyPromise((resolve, reject) => {
    resolve(100);
});
promise
    .then(
        (data) => {
            return 100 * data;
        },
        (err) => {
            console.log('error:', err);
        }
    )
    .then((data) => {
        return new MyPromise((resolve, reject) => {
            resolve(
                new MyPromise((resolve, reject) => {
                    setTimeout(() => {
                        data = data * 100;
                        console.log('data:', data); // data:1000000
                        resolve(data);
                    }, 1000);
                })
            );
        });
    })
    .then((data) => {
        console.log('result:', data); // result:1000000
        return data;
    });
```

#### 3.3.4 防止多次调用

需要加一个开关，防止多次调用失败和成功，跟 pending 状态值一样的逻辑一样，走了失败就不能走成功了，走了成功一定不能在走失败。

```js
function resolvePromise(nextPromise, x, resolve, reject) {
    // ...

    // 判断如果 x 是否是对象，判断变量类型的方法有：typeof instanceof constructor toString
    if (typeof x === 'object' && x != null) {
        let called; // 加一个开关，防止多次调用失败和成功

        try {
            // 预防取 .then 的时候错误
            const then = x.then; // Object.definePropertype

            if (typeof then === 'function') {
                then.call(
                    x,
                    (y) => {
                        if (called) {
                            console.log('已经执行过，则忽略处理');
                            return;
                        }
                        called = true;

                        // ...
                    },
                    (r) => {
                        if (called) {
                            console.log('已经执行过，则忽略处理');
                            return;
                        }
                        called = true;

                        // ...
                    }
                );
            }
            else {
                if (called) {
                    console.log('已经执行过，则忽略处理');
                    return;
                }
                called = true;

                // ...
            }
        }
        catch (err) {
            if (called) {
                console.log('已经执行过，则忽略处理');
                return;
            }
            called = true;

            // ...
        }
    }

    // ...
}
```

## 静态方法实现

```js
// catch 方法
MyPromise.prototype.catch = function (onReJected) {
    // 返回一个没有第一个参数的 then 方法
    return this.then(undefined, onReJected);
};

// static all 方法
MyPromise.all = (lists) => {
    // 返回一个 promise
    return new MyPromise((resolve, reject) => {
        const resArr = []; // 存储处理的结果的数组
        // 判断每一项是否处理完了
        let index = 0;

        function processData(i, data) {
            resArr[i] = data;
            index += 1;
            if (index === lists.length) {
                // 处理异步，要使用计数器，不能使用 resArr == lists.length
                resolve(resArr);
            }
        }
        for (let i = 0; i < lists.length; i++) {
            if (isPromise(lists[i])) {
                lists[i].then(
                    (data) => {
                        processData(i, data);
                    },
                    (err) => {
                        reject(err); // 只要有一个传入的 promise 没执行成功就走 reject
                    }
                );
            }
            else {
                processData(i, lists[i]);
            }
        }
    });
};

// promise 的 race 方法
// 两个方法赛跑，哪个赢了就先返回哪个的状态
MyPromise.race = (lists) => {
    return new MyPromise((resolve, reject) => {
        for (let i = 0; i < lists.length; i++) {
            if (isPromise(lists[i])) {
                lists[i].then(
                    (data) => {
                        resolve(data); // 哪个先完成就返回哪一个的结果
                    },
                    (err) => {
                        reject(err);
                    }
                );
            }
            else {
                resolve(lists[i]);
            }
        }
    });
};

// 静态 resolve 方法
MyPromise.resolve = (value) => {
    // 如果是一个 promise 对象就直接将这个对象返回
    if (isPromise(value)) {
        return value;
    }
    else {
    // 如果是一个普通值就将这个值包装成一个 promise 对象之后返回
        return new MyPromise((resolve, reject) => {
            resolve(value);
        });
    }
};

// 静态 reject 方法
MyPromise.reject = (value) => {
    return new MyPromise((resolve, reject) => {
        reject(value);
    });
};

// 终极方法 finally finally 其实就是一个 promise 的 then 方法的别名，在执行 then 方法之前，先处理 callback 函数
MyPromise.prototype.finally = function (cb) {
    return this.then(
        value => MyPromise.resolve(cb()).then(() => value),
        reason =>
            MyPromise.reject(cb()).then(() => {
                throw reason;
            })
    );
};
```

## 5. 自定义测试

### 5.1 Promise.then

```js
const p = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        console.log('resolve');
        resolve(222);
    }, 1000);
});

p.then((data) => {
    setTimeout(() => {
        console.log('data:', data);
    });
    return 3333;
})
    .then((data2) => {
        console.log('data2:', data2);
    })
    .catch((err) => {
        console.error('err:', err);
    });

// resolve
// data2: 3333
// data: 222
```

### 5.2 Promise.reject

```js
const p1 = MyPromise.reject('出错了');

p1.then(null, (err) => {
    console.error('err:', err); // 出错了
});

// err: 出错了
```

### 5.3 Promise.all && Promise.race

```js
const q1 = new MyPromise((resolve, reject) => {
    resolve('hello');
});
const q2 = new MyPromise((resolve, reject) => {
    resolve('world');
});

MyPromise.all([q1, q2]).then((res) => {
    console.log(res); // ['hello', 'world']
});
MyPromise.race([q1, q2]).then((res) => {
    console.log(res); // hello
});
```

## 6. 插件自动测试

### 6.1 安装插件

```
$ npm install promises-aplua-tests -D
```

### 6.2 增加测试插件支持代码

```js
MyPromise.defer = MyPromise.deferred = function () {
    const dfd = {};
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
};
module.exports = MyPromise;
```

### 6.3 执行测试命令

```bash
npx promises-aplus-tests MyPromise.js
```

> 根据插件测试结果，我们发现全部测试通过了。

## 7. 参考

- [史上最完整 promise 源码手写实现](https://www.cnblogs.com/xinggood/p/11836096.html)
- [简单实现一个 Promise](https://mp.weixin.qq.com/s/b2F8US1VarELU6dqPFQTXQ)
