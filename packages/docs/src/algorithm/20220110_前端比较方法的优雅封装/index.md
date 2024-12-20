# 前端比较方法的优雅封装

> 我们一般项目里面做排序处理的时候，都会有比较两个变量大小的处理，所以这里就做下比较方法的优雅封装。

## 1. 分析

先列下常见的比较场景：

- 是否相等
- 是否大于
- 是否小于
- 是否小于等于（小于 || 相等）
- 是否大于等于（大于 || 相等）

另外，默认一般都是比较字符串和数字的大小，所以我们可以做一个默认的比较函数。
当然啦，也可以传一个自定义的比较函数，以便做个性化比较处理。

## 2. 实现

```ts
// Comparator.ts

// It just assumes that "a" and "b" are strings or numbers.
type TypeCompareParam = string | number;

type TypeCompareFun = (a: TypeCompareParam, b: TypeCompareParam) => number;

export default class Comparator {
  private compare: TypeCompareFun;

  /**
   * Constructor.
   * @param compareFunction - It may be custom compare function that, let's say may compare custom objects together.
   */
  constructor(compareFunction?: (a: any, b: any) => number) {
    this.compare = compareFunction || Comparator.defaultCompareFunction;
  }

  /**
   * Default comparison function.
   */
  static defaultCompareFunction(a: TypeCompareParam, b: TypeCompareParam): number {
    if (a === b) {
      return 0;
    }

    return a < b ? -1 : 1;
  }

  /**
   * Checks if two variables are equal.
   */
  equal(a: TypeCompareParam, b: TypeCompareParam): boolean {
    return this.compare(a, b) === 0;
  }

  /**
   * Checks if variable "a" is less than "b".
   */
  lessThan(a: TypeCompareParam, b: TypeCompareParam): boolean {
    return this.compare(a, b) < 0;
  }

  /**
   * Checks if variable "a" is greater than "b".
   */
  greaterThan(a: TypeCompareParam, b: TypeCompareParam): boolean {
    return this.compare(a, b) > 0;
  }

  /**
   * Checks if variable "a" is less than or equal to "b".
   */
  lessThanOrEqual(a: TypeCompareParam, b: TypeCompareParam): boolean {
    return this.lessThan(a, b) || this.equal(a, b);
  }

  /**
   * Checks if variable "a" is greater than or equal to "b".
   */
  greaterThanOrEqual(a: TypeCompareParam, b: TypeCompareParam): boolean {
    return this.greaterThan(a, b) || this.equal(a, b);
  }

  /**
   * Reverses the comparison order.
   */
  reverse() {
    const compareOriginal = this.compare;
    this.compare = (a: TypeCompareParam, b: TypeCompareParam) => compareOriginal(b, a);
  }
}
```

## 3. 测试用例

安装测试工具：

```bash
yarn add -D typescript jest
yarn add -D ts-jest @types/jest
yarn ts-jest config:init
```

执行测试命令为：

```bash
yarn jest

# 或者
yarn test __test__/Comparator.test.ts
```

`tsconfig.json` 需要补充配置:

```json
{
  // ...
  "compilerOptions": {
    "types": [
      "jest" // 或者其他您使用的测试运行器的名称
    ]
  }
  // ...
}
```

测试脚本：

```ts
// __test__/Comparator.test.ts

import Comparator from '../Comparator';

describe('Comparator', () => {
  it('should compare with default comparator function', () => {
    const comparator = new Comparator();

    expect(comparator.equal(0, 0)).toBe(true);
    expect(comparator.equal(0, 1)).toBe(false);
    expect(comparator.equal('a', 'a')).toBe(true);
    expect(comparator.lessThan(1, 2)).toBe(true);
    expect(comparator.lessThan(-1, 2)).toBe(true);
    expect(comparator.lessThan('a', 'b')).toBe(true);
    expect(comparator.lessThan('a', 'ab')).toBe(true);
    expect(comparator.lessThan(10, 2)).toBe(false);
    expect(comparator.lessThanOrEqual(10, 2)).toBe(false);
    expect(comparator.lessThanOrEqual(1, 1)).toBe(true);
    expect(comparator.lessThanOrEqual(0, 0)).toBe(true);
    expect(comparator.greaterThan(0, 0)).toBe(false);
    expect(comparator.greaterThan(10, 0)).toBe(true);
    expect(comparator.greaterThanOrEqual(10, 0)).toBe(true);
    expect(comparator.greaterThanOrEqual(10, 10)).toBe(true);
    expect(comparator.greaterThanOrEqual(0, 10)).toBe(false);
  });

  it('should compare with custom comparator function', () => {
    const comparator = new Comparator((a, b) => {
      if (a.length === b.length) {
        return 0;
      }

      return a.length < b.length ? -1 : 1;
    });

    expect(comparator.equal('a', 'b')).toBe(true);
    expect(comparator.equal('a', '')).toBe(false);
    expect(comparator.lessThan('b', 'aa')).toBe(true);
    expect(comparator.greaterThanOrEqual('a', 'aa')).toBe(false);
    expect(comparator.greaterThanOrEqual('aa', 'a')).toBe(true);
    expect(comparator.greaterThanOrEqual('a', 'a')).toBe(true);

    comparator.reverse();

    expect(comparator.equal('a', 'b')).toBe(true);
    expect(comparator.equal('a', '')).toBe(false);
    expect(comparator.lessThan('b', 'aa')).toBe(false);
    expect(comparator.greaterThanOrEqual('a', 'aa')).toBe(true);
    expect(comparator.greaterThanOrEqual('aa', 'a')).toBe(false);
    expect(comparator.greaterThanOrEqual('a', 'a')).toBe(true);
  });
});
```

运行看下测试结果：

```bash
yarn test
# yarn run v1.23.0-20200205.1242
# warning package.json: No license field
# $ jest
#  PASS  __test__/Comparator.test.ts

# Test Suites: 1 passed, 1 total
# Tests:       2 passed, 2 total
# Snapshots:   0 total
# Time:        1.558 s
# Ran all test suites.
# ✨  Done in 2.92s.
```

## 4. 后记

到这里，就可以基于我们封装好的比较方法做一些排序等变量比较的处理了。

## 5. 参考

- [ts-jest](https://github.com/kulshekhar/ts-jest)
- [JavaScript 算法与数据结构](https://github.com/trekhleb/javascript-algorithms/tree/master/src/utils/comparator)
