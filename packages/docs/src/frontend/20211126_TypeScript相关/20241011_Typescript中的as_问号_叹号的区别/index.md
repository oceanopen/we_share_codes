# TypeScript 中的 as、?与!的区别

为了保证校验的准确性，将 `tsconfig.json` 配置修改为：

```json
{
    "strictNullChecks": true
}
```

## 1. as 关键字表示断言

在 Typescript 中，可以用 `as` 关键字表示断言有两种方式。一种是扩号表示法：

```typescript
const someValue: any = 123;
const strLength: number = (someValue as string).length;
```

## 2. 问号(?)用于属性定义

问号表示可选的属性，一般用于属性定义，如，用于接口时：

```typescript
interface SquareConfig {
    color: string;
    width?: number;
}
function createSquare(config: SquareConfig) {
    config.color = undefined; // 不能将类型“undefined”分配给类型“string”。ts(2322)
    console.log(config.color);
}
```

发现报错了。再加上问号后：

```typescript
interface SquareConfig {
    color?: string;
    width?: number;
}
function createSquare(config: SquareConfig) {
    config.color = undefined;
    console.log(config.color);
}
```

这时并没有编译报错！明明 config.color 定义的是 string 类型呀？。
如果 改为 `null` 呢？

```typescript
interface SquareConfig {
    color?: string;
    width?: number;
}
function createSquare(config: SquareConfig) {
    config.color = null; // 不能将类型“null”分配给类型“string | undefined”。ts(2322)
    console.log(config.color);
}
```

报错如下：

```
不能将类型“null”分配给类型“string | undefined”。ts(2322)
```

从这句报错中，我们可以得出这样的结论：`可选属性`等价于一个 `union` 类型，`union` 了 undefined；
也就是说，`SquareConfig` 的定义与下面的代码等价：

```typescript
interface SquareConfig {
    color: string | undefined;
    width: number | undefined;
}
```

## 3. 叹号(!)用于属性读取

```typescript
// index.ts

interface SquareConfig {
    color?: string;
    width?: number;
}
function createSquare(config: SquareConfig) {
    console.log('config.color?.length:');
    console.log(config.color?.length);

    console.log('(config.color as string).length:');
    console.log((config.color as string).length);

    console.log('config.color!.length:');
    console.log(config.color!.length);
}
```

编译：

```bash
npx tsc index.ts
```

得到编译结果：

```javascript
// index.js

function createSquare(config) {
    let _a;
    console.log('config.color?.length:');
    // eslint-disable-next-line no-cond-assign
    console.log((_a = config.color) === null || _a === void 0 ? void 0 : _a.length);

    console.log('(config.color as string).length:');
    console.log(config.color.length);

    console.log('config.color!.length:');
    console.log(config.color.length);
}
```

`as` 和 `!` 编译后代码完全一样，`!` 的作用此时与 `as` 是等价的。

然而，`!` 只是用来判断 `null` 和 `undefined`；`as` 则可用于变更（缩小或者放大都可以）类型检测范围，仅当 `as` 后面跟的类型是一个非空类型时，两者才等价。

如下例中，不能将 as 用法改为!。

```typescript
interface Cat {
    action: string;
}
interface Dog {
    action: string;
}
type Animal = Cat | Dog;
const action: Animal = {} as Cat;
```

## 4. 结论

- `as` 和 `!` 用于属性的读取，都可以缩小类型检查范围，都做判空用途时是等价的。
  只是 `!` 具体用于告知编译器此值不可能为空值（`null` 和 `undefined`），而 `as` 不限于此。

- `?` 可用于属性的定义和读取，读取时告诉编译器此值可能为空值（`null` 和 `undefined`），需要做判断。

## 5. 参考

- [Typescript 中的 as、问号与感叹号](https://www.cnblogs.com/bigben0123/p/13883618.html)
