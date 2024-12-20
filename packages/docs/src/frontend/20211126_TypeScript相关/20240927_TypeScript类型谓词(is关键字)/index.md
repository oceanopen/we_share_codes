### TypeScript 类型谓词(is 关键字)

`TypeScript` 中的 `is` 关键字，它被称为`类型谓词`，用来判断一个变量属于某个接口或类型。

#### 1. 场景

`is` 关键字一般用于函数返回值类型中，判断参数是否属于某一类型，并根据结果返回对应的布尔类型。

例如: 通过判断将字符串类型并转为大写。

```typescript
{
  // 判断参数是否为 string 类型, 返回布尔值
  const isString = (s: unknown): boolean => {
    return typeof s === 'string';
  };

  // 直接使用转大写方法, 报错
  const upperCase = (str: unknown) => {
    // str.toUpperCase()
    // 类型“unknown”上不存在属性“toUpperCase”。
  };

  // 判断参数是否为字符串, 若是, 则再调用转大写方法, 依然报错
  const ifUpperCase = (str: unknown) => {
    // 这种虽然没有问题, 但遇到复杂的类型判断, 就难以处理了
    if (typeof str === 'string') {
      str.toUpperCase();
    }

    if (isString(str)) {
      // str.toUpperCase()
      // 报错:类型“unknown”上不存在属性“toUpperCase”
    }
  };
}
```

示例中我们虽然判断了参数 `str` 是 `string` 类型, 但是条件为 `true` 时, 参数 `str` 的类型还是 `unknown`。
也就是说这个条件判断并没有更加明确 `str` 的具体类型。

#### 2. 使用类型谓词

可以在判断是否为 `string` 类型的函数返回值类型使用 `is` 关键词(即类型谓词)，即可解决上面的类型判断问题。

```typescript
{
  // 判断参数是否为string类型, 返回布尔值
  const isString = (s: unknown): s is string => {
    return typeof s === 'string';
  };

  // 判断参数是否为字符串,是在调用转大写方法
  const ifUpperCase = (str: unknown) => {
    if (isString(str)) {
      str.toUpperCase();
      // (parameter) str: string
    }
  };
}
```

`s is string` 不仅返回 `boolean` 类型判断参数 `s` 是不是 `string` 类型, 同时明确的 `string` 类型返回到条件为 `true` 的代码块中.
因此当我们判断条件为 `true`, 即 `str` 为 `string` 类型时, 代码块中 `str` 类型也转为更明确的 `string` 类型。
类型谓词的主要特点是：

- 返回类型谓词，如 `s is string`；
- 包含可以准确确定给定变量类型的逻辑语句，如 `typeof s === 'string'`。

接下来看一个联合类型的问题。

#### 3. 联合类型场景

在 `TypeScript` 中，我们往往会定义一个联合类型，来解决一些业务中复杂数据的处理。

```typescript
{
  // 接口 A
  interface IA {
    name: string;
    age: number;
  }

  // 接口 B
  interface IB {
    name: string;
    phone: number;
  }

  // 推断类型
  const obj1 = { name: 'andy', age: 2 };
  // const obj1: { name: string; age: number; }

  const obj2 = { name: 'andy', phone: 2 };
  // const obj2: { name: string; phone: number; }

  // 手动定义 arr 为联合类型数组
  const arr = new Array<IA | IB>(obj1, obj2);
  // const arr: (IA | IB)[]

  // 自动推断 arr2 为联合类型数组
  const arr2 = [<IA>obj1, <IB>obj2];
  // const arr2: (IA | IB)[]

  // 或者, 自动推断 arr3 为联合类型数组
  const arr3 = [...Array.from({ length: 1 }).fill(obj1), ...(<IB[]>[obj2])];
  // const arr3: (IA | IB)[]

  const target = arr[0];
  // const target: IA | IB

  // Ok 获取两个结构共有的属性
  console.log(target.name);

  // 获取两个接口不同的属性报错:
  console.log(target.phone);
  // 报错: 类型“IA | IB”上不存在属性“phone”。类型“IA”上不存在属性“phone”。

  console.log(target.age);
  // 报错:  类型“IA | IB”上不存在属性“age”。类型“IB”上不存在属性“age”。
}
```

示例代码中我们定义了一个接口 `IA`，一个接口 `IB`，他们各自对应一个具体的数据类型，但我们有时需要将这 `2` `个类型的数据合并到一个数组中，TypeScript` 会自动推断这个数据的类型为`联合类型数组`。

```typescript
const arr: (IA | IB)[];
```

当我们通过数组操作取出数组里的元素时，这个`元素的类型`其实也是这个`联合类型 IA | IB`。
取值的时候，由于 `name` 属于 `IA` 和 `IB` 共有的，即交叉属性，`TypeScript` 判定无风险，可用。
但我们使用 `phone` 或者 `age` 这种不交叉的属性时候，`TypeScript` 会报错，报错信息如下：

```typescript
// 类型“IA | IB”上不存在属性“phone”。
// 类型“IA”上不存在属性“phone”。ts(2339)
```

#### 4. 解决联合类型问题的方法

##### 4.1 使用断言

```typescript
// 使用断言
console.log((target as IB).phone);
console.log((<IA>target).age);
```

不是特别好，因为在一个作用域下，每次取值都要断言，有维护成本且有风险。

##### 4.2 条件判断

使用 `in` 运算符判断属性是否属于当前对象。

```typescript
/**
 * 通过使用in运算符 的条件判断, 缩小 target 类型
 */
if ('phone' in target) {
  console.log(target.phone);
  // const target: IB
}
if ('age' in target) {
  console.log(target.age);
  // const target: IA
}
```

缺点和断言一样, 每次都需要判断。

##### 4.3 类型谓词

我们需要创建一个函数，在这个函数的方法体中，我们不仅要检查 `target` 变量是否含有 `age` 属性，而且还要告诉 `TypeScript` 编译器，如果上述逻辑语句的返回结果是 `true`，那么当前判断的 `target` 变量值的类型是 `interfaceA` 类型。

```typescript
/**
 * 类型谓词
 */
type IUnionAB = IA | IB; // 联合类型
// 自定义类型保护函数
function isIA(item: IUnionAB): item is IA {
  return (item as IA).age !== undefined;
}
function isIB(item: IUnionAB): item is IB {
  return (item as IB).phone !== undefined;
}
// 判断target 属于哪个类型
if (isIA(target)) {
  console.log(target.age); // target 的类型为 IA
} else if (isIB(target)) {
  console.log(target.phone); // target 的类型为 IB
}
```

#### 5. 通过泛型解决类型谓词复用问题

如果要检查的类型很多，那么为每种类型创建和维护唯一的类型保护可能会变得很繁琐。
针对这个问题，我们可以利用 `TypeScript` 的另一个特性 —— `泛型`，来解决复用问题。

```typescript
/**
 * 通过泛型定义通用类型保护函数
 */
function isOfType<T>(target: unknown, prop: keyof T): target is T {
  return (target as T)[prop] !== undefined;
}
// 类型保护
if (isOfType<IA>(target, 'age')) {
  console.log(target.age);
} else if (isOfType<IB>(target, 'phone')) {
  console.log(target.phone);
}
```

示例中通过使用类型保护函数来缩窄类型。

#### 6. 参考

- [第十六节: TypeScript 类型谓词( is 关键字 )](https://www.jianshu.com/p/57df3cb66d3d)
