# JS 复杂判断的更优雅写法

## 1. 前言

我们平时编写 JS 代码时经常遇到复杂逻辑判断的情况，通常大家可以用 if/else 或者 switch 来实现多个条件判断。
但这样会有个问题，随着逻辑复杂度的增加，代码中的 if/else 或者 switch 会变得越来越臃肿，越来越难以维护。
那么如何更优雅的写判断逻辑呢？详看下文。

## 2. 写法

### 2.1 一元判断

```javascript
/**
 * 按钮点击事件
 * @param {number} status 活动状态：1-开团进行中；2-开团失败；3-商品售罄；4-开团成功；5-系统取消；
 */
function onButtonClick(status) {
  if (status === 1) {
    console.log('processing');
  }
  else if (status === 2) {
    console.log('fail');
  }
  else if (status === 3) {
    console.log('fail');
  }
  else if (status === 4) {
    console.log('success');
  }
  else if (status === 5) {
    console.log('cancel');
  }
  else {
    console.log('other');
  }
}
```

通过代码可以看到这个按钮的点击逻辑：根据不同活动状态，打印日志。
大家可以很轻易的提出这段代码的改写方案，接下来，switch 出场。

```javascript
/**
 * 按钮点击事件
 * @param {number} status 活动状态：1-开团进行中；2-开团失败；3-商品售罄；4-开团成功；5-系统取消；
 */
function onButtonClick(status) {
  switch (status) {
    case 1:
      console.log('processing');
      break;
    case 2:
    case 3:
      console.log('fail');
      break;
    case 4:
      console.log('success');
      break;
    case 5:
      console.log('cancel');
      break;
    default:
      console.log('other');
      break;
  }
}
```

嗯，这样看起来比 if/else 清晰多了。
细心的同学也发现了小技巧：case 2 和 case 3 逻辑一样的时候，可以省去执行语句和 break，则 case 2 的情况自动执行 case 3 的逻辑。

这时有同学会说，还有更简单的写法，请看下文。

```javascript
const actions = {
  1: ['processing'],
  2: ['fail'],
  3: ['fail'],
  4: ['success'],
  5: ['cancel'],
  default: ['other'],
};
/**
 * 按钮点击事件
 * @param {number} status 活动状态：1-开团进行中；2-开团失败；3-商品售罄；4-开团成功；5-系统取消；
 */
function onButtonClick(status) {
  const action = actions[status] || actions.default;

  console.log(action[0]);
}
```

上面代码确实看起来更清爽了，这种方法的聪明之处在于：
将判断条件作为对象的属性名，将处理逻辑作为对象的属性值，在按钮点击的时候，通过对象属性查找的方式来进行逻辑判断，这种写法特别适合一元条件判断的情况。

是不是还有其他写法呢？有的，请看下文。

```javascript
const actions = new Map([
  [1, ['processing']],
  [2, ['fail']],
  [3, ['fail']],
  [4, ['success']],
  [5, ['cancel']],
  ['default', ['other']],
]);
/**
 * 按钮点击事件
 * @param {number} status 活动状态：1-开团进行中；2-开团失败；3-商品售罄；4-开团成功；5-系统取消；
 */
function onButtonClick(status) {
  const action = actions.get(status) || actions.get('default');

  console.log(action[0]);
}
```

> 这样写用到了 es6 里的 Map 对象。Map 对象和 Object 对象有什么异同呢？

- 相同点

  - 都可以表示键值对；
  - 一个对象通常都有自己的原型，所以一个对象总有一个`prototype`键，Map 对象也不例外；

- 不同点

  - 一个对象的键只能是`字符串或者 Symbols`，但一个 Map 的键可以是`任意值`；
  - 可以通过 size 属性很容易地得到一个 Map 的键值对个数，而对象的键值对个数只能手动确认；

### 2.2 多元判断

我们需要把问题升级一下，以前按钮点击时候只需要判断 status，现在还需要判断用户的身份，该如何处理呢？举个例子。

> 具体逻辑就不写了，要不然代码比较冗长。

```javascript
/**
 * 按钮点击事件
 * @param {number} status 活动状态：1-开团进行中；2-开团失败；3-商品售罄；4-开团成功；5-系统取消；
 * @param {string} identity 身份标识：guest-客态；master-主态；
 */
function onButtonClick(status, identity) {
  if (identity === 'guest') {
    if (status === 1) {
      // do sth
    }
    else if (status === 2) {
      // do sth
    }
    else if (status === 3) {
      // do sth
    }
    else if (status === 4) {
      // do sth
    }
    else if (status === 5) {
      // do sth
    }
    else {
      // default
    }
  }
  else if (identity === 'master') {
    if (status === 1) {
      // do sth
    }
    else if (status === 2) {
      // do sth
    }
    else if (status === 3) {
      // do sth
    }
    else if (status === 4) {
      // do sth
    }
    else if (status === 5) {
      // do sth
    }
    else {
      // default
    }
  }
  else {
    // default
  }
}
```

> 原谅我又用了 if/else，因为常规写法也是大多数写法，依然在用 if/else 写这种大段的逻辑判断。

从上面的例子我们可以看到，当你的逻辑升级为二元判断时，你的判断量会加倍，你的代码量也会加倍，这时怎么写更清爽呢？

```javascript
const actions = new Map([
  [
    'guest_1',
    () => {
      // do sth
    },
  ],
  // ...
  [
    'master_1',
    () => {
      // do sth
    },
  ],
  // ...
  [
    'default',
    () => {
      // do sth
    },
  ],
]);

/**
 * 按钮点击事件
 * @param {string} identity 身份标识：guest-客态；master-主态；
 * @param {number} status 活动状态：1 开团进行中 2 开团失败 3 开团成功 4 商品售罄 5 有库存未开团
 */
function onButtonClick(identity, status) {
  const action = actions.get(`${identity}_${status}`) || actions.get('default');
  action.call(this);
}
```

上述代码核心逻辑是：把两个条件拼接成字符串，并通过以条件拼接字符串作为键，以处理函数作为值的 Map 对象进行查找并执行。
这种写法在多元条件判断时候尤其好用。

当然上述代码如果用 Object 对象来实现也是类似的：

```javascript
const actions = {
  guest_1: () => {
    // do sth
  },
  guest_2: () => {
    // do sth
  },
  // ...
  default: () => {
    // do sth
  },
};

function onButtonClick(identity, status) {
  const action = actions[`${identity}_${status}`] || actions.default;
  action.call(this);
}
```

如果有些同学觉得把查询条件拼成字符串有点别扭，那还有一种方案，就是用 Map 对象，以 Object 对象作为 key：

```javascript
const actions = new Map([
  [
    { identity: 'guest', status: 1 },
    () => {
      // do sth
    },
  ],
  [
    { identity: 'guest', status: 2 },
    () => {
      // do sth
    },
  ],
  // ...
]);

function onButtonClick(identity, status) {
  const action = [...actions].filter(([key, value]) => key.identity === identity && key.status === status);
  action.forEach(([key, value]) => value.call(this));
}
```

是不是又高级了一点点？

这里也看出来 Map 与 Object 的区别，Map 可以用任何类型的数据作为 key。

我们现在再将难度升级一点点，假如 guest 情况下，status1-4 的处理逻辑都一样怎么办，最差的情况是这样：

```javascript
const actions = new Map([
  [
    { identity: 'guest', status: 1 },
    () => {
      /* functionA */
    },
  ],
  [
    { identity: 'guest', status: 2 },
    () => {
      /* functionA */
    },
  ],
  // ...
  [
    { identity: 'guest', status: 5 },
    () => {
      /* functionB */
    },
  ],
  // ...
]);
```

好一点的写法是将处理逻辑函数进行缓存：

```javascript
function actions() {
  const functionA = () => {
    // do sth
  };
  const functionB = () => {
    // do sth
  };
  return new Map([
    [{ identity: 'guest', status: 1 }, functionA],
    [{ identity: 'guest', status: 2 }, functionA],
    [{ identity: 'guest', status: 3 }, functionA],
    [{ identity: 'guest', status: 4 }, functionA],
    [{ identity: 'guest', status: 5 }, functionB],
    // ...
  ]);
}

function onButtonClick(identity, status) {
  const action = [...actions()].filter(([key, value]) => key.identity === identity && key.status === status);
  action.forEach(([key, value]) => value.call(this));
}
```

这样写已经能满足日常需求了，但认真一点讲，上面重写了 4 次 functionA 还是有点不爽，假如判断条件变得特别复杂，比如 identity 有 3 种状态，status 有 10 种状态，那你需要定义 30 条处理逻辑，而往往这些逻辑里面很多都是相同的，这似乎也是笔者不想接受的，那可以这样实现:

```javascript
function actions() {
  const functionA = () => {
    // do sth
  };
  const functionB = () => {
    // do sth
  };
  return new Map([
    [/^guest_[1-4]$/, functionA],
    [/^guest_5$/, functionB],
    // ...
  ]);
}

function onButtonClick(identity, status) {
  const action = [...actions()].filter(([key, value]) => key.test(`${identity}_${status}`));
  action.forEach(([key, value]) => value.call(this));
}
```

这里 Map 的优势更加凸显，可以用正则类型作为 key 了，这样就有了无限可能。
假如需求变成，凡是 guest 情况都要执行公共的逻辑处理，而不同 status 情况也需要单独的逻辑处理，那我们可以这样写：

```javascript
function actions() {
  const functionA = () => {
    // do single sth
  };
  const functionB = () => {
    // do single sth
  };
  const functionC = () => {
    // do common sth
  };
  return new Map([
    [/^guest_[1-4]$/, functionA],
    [/^guest_5$/, functionB],
    [/^guest_.*$/, functionC],
    // ...
  ]);
}

function onButtonClick(identity, status) {
  const action = [...actions()].filter(([key, value]) => key.test(`${identity}_${status}`));
  action.forEach(([key, value]) => value.call(this));
}
```

也就是说利用数组循环的特性，符合正则条件的逻辑都会被执行，那就可以同时执行公共逻辑和单独逻辑。
因为正则的存在，你可以打开想象力解锁更多的玩法，本文就不赘述了。

## 3. 后记

本文展示了 8 种逻辑判断写法，包括：

- if/else
- switch
- 一元判断时：存到 Object 里
- 一元判断时：存到 Map 里
- 多元判断时：将 condition 拼接成字符串存到 Object 里
- 多元判断时：将 condition 拼接成字符串存到 Map 里
- 多元判断时：将 condition 存为 Object 存到 Map 里
- 多元判断时：将 condition 写作正则存到 Map 里

至此，本文也将告一段落，愿你未来的人生里，不只是有 if/else 和 switch。

## 4. 参考

- [JavaScript 复杂判断的更优雅写法](https://mp.weixin.qq.com/s/YdBVplz7bUrcyXrPk5-oVQ)
