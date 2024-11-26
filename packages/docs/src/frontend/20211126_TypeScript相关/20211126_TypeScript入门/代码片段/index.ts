/* eslint-disable ts/no-unsafe-function-type */
/* eslint-disable no-lone-blocks */
/* eslint-disable ts/no-unused-expressions */
/* eslint-disable ts/prefer-as-const */
/* eslint-disable ts/no-empty-object-type */
/* eslint-disable prefer-const */
/* eslint-disable unused-imports/no-unused-vars */

/**
 * 文件执行命令
 * npx ts-node index.ts
 */

// JS 的八种内置类型
{
    const str: string = 'jimmy';
    const num: number = 24;
    const bool: boolean = false;
    const u: undefined = undefined;
    const n: null = null;
    const obj: object = { x: 1 };
    const big: bigint = 100n;
    const sym: symbol = Symbol('me');
}

{
    // null 和 undefined 赋值给 string
    let str: string = '666';
    // str = null; // 不能将类型“null”分配给类型“string”。
    // str = undefined; // 不能将类型“undefined”分配给类型“string”。

    // null 和 undefined 赋值给 number
    let num: number = 666;
    // num = null; // 不能将类型“null”分配给类型“number”。
    // num = undefined; // 不能将类型“undefined”分配给类型“number”。

    // null 和 undefined 赋值给 object
    let obj: object = {};
    // obj = null; // 不能将类型“null”分配给类型“object”。
    // obj = undefined; // 不能将类型“undefined”分配给类型“object”。

    // null 和 undefined 赋值给 Symbol
    let sym: symbol = Symbol('me');
    // sym = null; // 不能将类型“null”分配给类型“symbol”。
    // sym = undefined; // 不能将类型“undefined”分配给类型“symbol”。

    // null 和 undefined 赋值给 boolean
    let isDone: boolean = false;
    // isDone = null; // 不能将类型“null”分配给类型“boolean”。
    // isDone = undefined; // 不能将类型“undefined”分配给类型“boolean”。

    // null 和 undefined 赋值给 bigint
    let big: bigint = 100n;
    // big = null; // 不能将类型“null”分配给类型“bigint”。
    // big = undefined; // 不能将类型“undefined”分配给类型“bigint”。
}

{
    let big: bigint = 100n;
    let num: number = 6;
    // big = num; // 不能将类型“number”分配给类型“bigint”。ts(2322)
    // num = big; // 不能将类型“bigint”分配给类型“number”。ts(2322)
}

{
    const arr: string[] = ['1', '2'];
    const arr2: Array<string> = ['1', '2'];

    let arr3: (number | string)[] = [];
    // 表示定义了一个名称叫做 arr 的数组,
    // 这个数组中将来既可以存储数值类型的数据, 也可以存储字符串类型的数据
    arr3 = [1, 'b', 2, 'c'];

    interface Arrobj {
        name: string;
        age: number;
    }
    const arr4: Arrobj[] = [{ name: 'jimmy', age: 22 }];
}

{
    function sum(x: number, y: number): number {
        return x + y;
    }

    const mySum: (x: number, y: number) => number = function (x: number, y: number): number {
        return x + y;
    };

    interface SearchFunc {
        (source: string, subString: string): boolean;
    }
    const myFunc: SearchFunc = (source: string, subString: string): boolean => {
        return true;
    };

    function buildName(firstName: string, lastName?: string) {
        if (lastName) {
            return `${firstName} ${lastName}`;
        } else {
            return firstName;
        }
    }
    const tomcat = buildName('Tom', 'Cat');
    const tom = buildName('Tom');

    function buildName2(firstName: string, lastName: string = 'Cat') {
        return `${firstName} ${lastName}`;
    }
    const tomcat2 = buildName('Tom', 'Cat');
    const tom2 = buildName('Tom');

    function push(array: any[], ...items: any[]) {
        items.forEach((item) => {
            array.push(item);
        });
    }
    const a: any[] = [];
    push(a, 1, 2, 3);

    /**
     * Parameter 'x' implicitly has an 'any' type.
     * Parameter 'y' implicitly has an 'any' type.
     */
    function add(x, y) {
        return x + y;
    }
    add(1, 2); // 3
    add('1', '2'); // "12"

  type Combinable = string | number;
  function add2(a: Combinable, b: Combinable) {
      if (typeof a === 'string' || typeof b === 'string') {
          return a.toString() + b.toString();
      }
      return a + b;
  }
  add2(1, 2); // 3
  add2('1', '2'); // "12"
  const result = add2('Semlinker', ' Kakuqo');

  /**
   * Error:
   * 类型“string | number”上不存在属性“split”。
   * Property 'split' does not exist on type 'number'.
   */
  // result.split(' ');

  type Types = number | string;
  function add3(a: number, b: number): number;
  function add3(a: string, b: string): string;
  function add3(a: string, b: number): string;
  function add3(a: number, b: string): string;
  function add3(a: Types, b: Types) {
      if (typeof a === 'string' || typeof b === 'string') {
          return a.toString() + b.toString();
      }
      return a + b;
  }
  const result2 = add3('Semlinker', ' Kakuqo');
  result2.split(' ');
}

{
    // 类型必须匹配且个数必须为2
    let x: [string, number];

    x = ['hello', 10];

    /**
     * Error:
     * 不能将类型“[string, number, number]”分配给类型“[string, number]”。
     * 源具有 3 个元素，但目标仅允许 2 个。ts(2322)
     */
    // x = ['hello', 10, 10];

    /**
     * Error:
     * 不能将类型“number”分配给类型“string”。ts(2322)
     * 不能将类型“string”分配给类型“number”。ts(2322)
     */
    // x = [10, 'hello'];

    const employee: [number, string] = [1, 'Semlinker'];
    const [id, username] = employee;
    console.log(`id: ${id}`); // id: 1
    console.log(`username: ${username}`); // username: Semlinker

    const employee2: [number, string] = [1, 'Semlinker'];

    /**
     * Error:
     * Tuple type '[number, string]' of length '2' has no element at index '2'.
     * 长度为 "2" 的元组类型 "[number, string]" 在索引 "2" 处没有元素。ts(2493)
     */
    // const [id2, username2, age2] = employee;

    let optionalTuple: [string, boolean?];
    optionalTuple = ['Semlinker', true];
    console.log(`optionalTuple : ${optionalTuple}`); // optionalTuple : Semlinker,true
    optionalTuple = ['Kakuqo'];
    console.log(`optionalTuple : ${optionalTuple}`); // optionalTuple : Kakuqo

    type Point = [number, number?, number?];
    const pointX: Point = [10]; // 一维坐标点
    const pointXy: Point = [10, 20]; // 二维坐标点
    const pointXyz: Point = [10, 20, 10]; // 三维坐标点
    console.log(pointX.length); // 1
    console.log(pointXy.length); // 2
    console.log(pointXyz.length); // 3

    type RestTupleType = [number, ...string[]];
    const restTuple: RestTupleType = [666, 'Semlinker', 'Kakuqo', 'Lolo'];
    console.log(restTuple[0]); // 666
    console.log(restTuple[1]); // Semlinker

    const point: readonly [number, number] = [10, 20];

    // Cannot assign to '0' because it is a read-only property.
    // point[0] = 1;

    // Property 'push' does not exist on type 'readonly [number, number]'.
    // point.push(0);

    // Property 'pop' does not exist on type 'readonly [number, number]'.
    // point.pop();

    // Property 'splice' does not exist on type 'readonly [number, number]'.
    // point.splice(1, 1);
}

{
    let a: void;

    // 不能将类型“void”分配给类型“number”。ts(2322)
    // const b: number = a;

    // a = null; // 不能将类型“null”分配给类型“void”。
    a = undefined;

    // 其声明类型不为 "void" 或 "any" 的函数必须返回值。ts(2355)
    function fun(): undefined {
        console.log('this is TypeScript');
    }
}

{
    // 异常
    function err(msg: string): never {
        throw new Error(msg);
    }

    // 死循环
    function loopForever(): never {
        while (true) { /* ... */ }
    }

    let a: never;
    // const n: never = a; // 在赋值前使用了变量“a”。
    // const b: null = a; // 在赋值前使用了变量“a”。
    // const c: undefined = a; // 在赋值前使用了变量“a”。
    // const d: unknown = a; // 在赋值前使用了变量“a”。
    // const e: any = a; // 在赋值前使用了变量“a”。

    let b = null;
    // a = b; // 不能将类型“null”分配给类型“never”。ts(2322)

    let c: undefined;
    // a = c; // 不能将类型“undefined”分配给类型“never”。

    let e: any;
    // a = e; // 不能将类型“any”分配给类型“never”。ts(2322)

    type Foo = string | number;
    function controlFlowAnalysisWithNever(foo: Foo) {
        if (typeof foo === 'string') {
        // 这里 foo 被收窄为 string 类型
        } else if (typeof foo === 'number') {
        // 这里 foo 被收窄为 number 类型
        } else {
        // foo 在这里是 never
            const check: never = foo;
        }
    }

    type Foo2 = string | number | boolean;
    function controlFlowAnalysisWithNever2(foo: Foo2) {
        if (typeof foo === 'string') {
        // 这里 foo 被收窄为 string 类型
        } else if (typeof foo === 'number') {
        // 这里 foo 被收窄为 number 类型
        } else {
            // const check: never = foo; // 不能将类型“boolean”分配给类型“never”。ts(2322)
        }
    }
}

{
    let a: string = 'seven';

    // a = 7; // 不能将类型“number”分配给类型“string”。ts(2322)
    // a = null; // 不能将类型“null”分配给类型“string”。
    // a = undefined; // 不能将类型“undefined”分配给类型“string”。

    let b: any = 666;
    b = 'Semlinker';
    b = false;
    b = 66;
    b = undefined;
    b = null;
    b = [];
    b = {};

    const anyThing: any = 'hello';
    console.log(anyThing.myName); // undefined
    // console.log(anyThing.myName.firstName) // TypeError: Cannot read property 'firstName' of undefined
    // anyThing.setName('Jerry') // TypeError: anyThing.setName is not a function
    // anyThing.setName('Jerry').sayHello() // TypeError: anyThing.setName is not a function
    // anyThing.myName.setFirstName('Cat') // TypeError: Cannot read property 'setFirstName' of undefined

    // 隐式 any 类型
    let anyThing2;
    anyThing2 = 100;
    anyThing2 = 'hello';

    // 类型“string”上不存在属性“setName”。ts(2339)
    // anyThing2.setName('Herry') // TypeError: anyThing2.setName is not a function
}

{
    let notSure: unknown = 4;
    notSure = 'maybe a string instead';
    notSure = false;

    const notSure2: unknown = 4;
    const uncertain2: any = notSure2;
    const notSure3: any = 4;
    const uncertain3: unknown = notSure3;
    const notSure4: unknown = 4;

    // 不能将类型“unknown”分配给类型“number”。ts(2322)
    // const uncertain4: number = notSure4;

    function getDog() {
        return '123';
    }
    const dog: unknown = { hello: getDog };

    // 类型“unknown”上不存在属性“hello”。ts(2339)
    // dog.hello();

    function getDogName() {
        let x: unknown;
        return x;
    }
    const dogName = getDogName();

    // 直接使用
    // 类型“unknown”上不存在属性“toLowerCase”。ts(2339)
    // const upName = dogName.toLowerCase() // TypeError: Cannot read property 'toLowerCase' of undefined

    // typeof
    if (typeof dogName === 'string') {
        const upName2 = dogName.toLowerCase();
    }

    // 类型断言
    // const upName3 = (dogName as string).toLowerCase() // TypeError: Cannot read property 'toLowerCase' of undefined
}

{
    let lowerCaseObject: object;

    // 不能将类型“number”分配给类型“object”。ts(2322)
    // lowerCaseObject = 1;

    // 不能将类型“string”分配给类型“object”。ts(2322)
    // lowerCaseObject = 'a';

    // 不能将类型“boolean”分配给类型“object”。ts(2322)
    // lowerCaseObject = true;

    // lowerCaseObject = null; // 不能将类型“null”分配给类型“object”。
    // lowerCaseObject = undefined; // 不能将类型“undefined”分配给类型“object”。
    lowerCaseObject = {};

    let upperCaseObject: object;
    // upperCaseObject = 1; // 不能将类型“number”分配给类型“object”。
    // upperCaseObject = 'a'; // 不能将类型“string”分配给类型“object”。
    // upperCaseObject = true; // 不能将类型“boolean”分配给类型“object”。ts(2322)
    // upperCaseObject = null; // 不能将类型“null”分配给类型“object”。ts(2322)
    // upperCaseObject = undefined; // 不能将类型“undefined”分配给类型“object”。ts(2322)
    upperCaseObject = {};

    type isLowerCaseObjectExtendsUpperCaseObject = object extends object ? true : false; // true
    type isUpperCaseObjectExtendsLowerCaseObject = object extends object ? true : false; // true
    upperCaseObject = lowerCaseObject;
    lowerCaseObject = upperCaseObject;

    let ObjectLiteral: {};
    ObjectLiteral = 1;
    ObjectLiteral = 'a';
    ObjectLiteral = true;
    // ObjectLiteral = null; // 不能将类型“null”分配给类型“{}”。
    // ObjectLiteral = undefined; // 不能将类型“undefined”分配给类型“{}”。
    ObjectLiteral = {};
    type isLiteralCaseObjectExtendsUpperCaseObject = {} extends object ? true : false; // true
    type isUpperCaseObjectExtendsLiteralCaseObject = object extends {} ? true : false; // true
    upperCaseObject = ObjectLiteral;
    ObjectLiteral = upperCaseObject;
}

{
    let str: string = 'this is string';

    let num: number = 1;

    let bool: boolean = true;
}
{
    const str: string = 'this is string';
    const num: number = 1;
    const bool: boolean = true;
}

{
    let str = 'this is string'; // 等价

    let num = 1; // 等价

    let bool = true; // 等价
}
{
    const str = 'this is string'; // 不等价
    const num = 1; // 不等价
    const bool = true; // 不等价
}

{
    /** 根据参数的类型，推断出返回值的类型也是 number */
    function inferAdd1(a: number, b: number) {
        return a + b;
    }
    const x1 = inferAdd1(1, 1); // 推断出 x1 的类型也是 number

    /** 推断参数 b 的类型是数字或者 undefined，返回值的类型也是数字 */
    function inferAdd2(a: number, b = 1) {
        return a + b;
    }
    const x2 = inferAdd2(1);
    // 类型“string”的参数不能赋给类型“number”的参数。ts(2345)
    // const x3 = inferAdd2(1, '1');
}

{
    let myFavoriteNumber;
    myFavoriteNumber = 'seven';
    myFavoriteNumber = 7;
}

{
    // 尖括号 语法
    const someValue1: any = 'this is a string';
    const strLength1: number = (<string>someValue1).length;

    // as 语法
    const someValue2: any = 'this is a string';
    const strLength2: number = (someValue2 as string).length;
}

{
    let mayNullOrUndefinedOrString: null | string;
    // 虽然这行代码不会报错，但构建的时候还是会报错的，因为没有赋值为字符串
    // mayNullOrUndefinedOrString!.toString()
    // strictNullChecks 模式下 Error：对象可能为 "null"。ts(2531)
    // 虽然这行代码不会报错，但构建的时候还是会报错的，因为没有赋值为字符串
    // mayNullOrUndefinedOrString.toString()

  type NumGenerator = () => number;

  function myFunc(numGenerator: NumGenerator | undefined) {
      // 对象可能为“未定义”。ts(2532)
      // 不能调用可能是“未定义”的对象。ts(2722)
      // const num1 = numGenerator();
      const num2 = numGenerator!();
  }
}

{
    let x: number;
    initialize1();

    // strictNullChecks 模式下 Error：在赋值前使用了变量“x”。ts(2454)
    // console.log(2 * x * x);
    function initialize1() {
        x = 10;
    }

    let y!: number;
    initialize2();
    console.log(2 * y);

    function initialize2() {
        y = 10;
    }
}

{
    const specifiedStr: 'this is string' = 'this is string';
    const specifiedNum: 1 = 1;
    const specifiedBoolean: true = true;

    let specifiedStr2: 'this is string' = 'this is string';
    let str: string = 'any string';
    // 不能将类型“string”分配给类型“"this is string"”。ts(2322)
    // specifiedStr2 = str;
    str = specifiedStr2;

    let hello: 'hello' = 'hello';
    // 不能将类型“"hi"”分配给类型“"hello"”。ts(2322)
    // hello = 'hi';

    type Direction = 'up' | 'down';
    function move(dir: Direction) {
        // ...
    }
    move('up');
    // 类型“"right"”的参数不能赋给类型“Direction”的参数。ts(2345)
    // move('right');

    interface Config {
        size: 'small' | 'big';
        isEnable: true | false;
        margin: 0 | 2 | 4;
    }
}

{
    const str = 'this is string'; // str: 'this is string'
    const num = 1; // num: 1
    const bool = true; // bool: true

    let str2 = 'this is string'; // str2: string

    let num2 = 1; // num2: number

    let bool2 = true; // bool2: boolean

    str2 = 'any string';
    num2 = 2;
    bool2 = false;
}

{
    let str = 'this is string'; // 类型是 string

    let strFun = (str = 'this is string') => str; // 类型是 (str?: string) => string
    const specifiedStr = 'this is string'; // 类型是 'this is string'

    let str2 = specifiedStr; // 类型是 'string'

    let strFun2 = (str = specifiedStr) => str; // 类型是 (str?: string) => string

    const specifiedStr2: 'this is string' = 'this is string'; // 类型是 '"this is string"'

    let str3 = specifiedStr2; // 即便使用 let 定义，类型也是 'this is string'
}

{
    let x = null; // 类型拓宽成 any

    let y; // 类型拓宽成 any

    /** -----分界线------- */
    const z = null; // 类型是 any
    const m = undefined; // 类型是 any

    /** -----分界线------- */

    let anyFun = (param = null) => param; // 类型是 (param?: any) => any

    let z2 = z; // 类型是 any

    let x2 = x; // 类型是 any

    let y2 = y; // 类型是 any
}

{
    interface Vector3 {
        x: number;
        y: number;
        z: number;
    }

    function getComponent(vector: Vector3, axis: 'x' | 'y' | 'z') {
        return vector[axis];
    }

    let x = 'x';

    let vec = { x: 10, y: 20, z: 30 };
    // 类型“string”的参数不能赋给类型“"x" | "y" | "z"”的参数。ts(2345)
    // getComponent(vec, x);

    const x2 = 'x'; // 类型是 "x"
    getComponent(vec, x2);
}

{
    const arr = ['x', 1]; // 类型是 (string | number)[]
}

{
    let x = 'semlinker'; // 类型是 string
    x = 'kakuqo';
    x = 'lolo';
}

{
    const x = 'x'; // type  is "x"
    const vec = { x: 10, y: 20, z: 30 };
    getComponent(vec, x); // OK
}

{
    const obj = {
        x: 1,
    };

    obj.x = 6; // OK

    // 不能将类型“string”分配给类型“number”。ts(2322)
    // obj.x = '6';

    // 类型“{ x: number; }”上不存在属性“y”。ts(2339)
    // obj.y = 8;

    // 类型“{ x: number; }”上不存在属性“name”。ts(2339)
    // obj.name = 'semlinker';
}

{
    // Type is { x: 1 | 3 | 5; }
    const obj: { x: 1 | 3 | 5 } = {
        x: 1,
    };
}

{
    // Type is { x: number; y: number; }
    const obj1 = {
        x: 1,
        y: 2,
    };
    // Type is { x: 1; y: number; }
    const obj2 = {
        x: 1 as const,
        y: 2,
    };
    // Type is { readonly x: 1; readonly y: 2; }
    const obj3 = {
        x: 1,
        y: 2,
    } as const;
}

{
    // Type is number[]
    const arr1 = [1, 2, 3];
    // Type is readonly [1, 2, 3]
    const arr2 = [1, 2, 3] as const;
}

{
    // const func: (anything: any) => string | number
    const func = (anything: any) => {
        if (typeof anything === 'string') {
            return anything; // 类型是 string
        } else if (typeof anything === 'number') {
            return anything; // 类型是 number
        }
        return null;
    };

    // const func2: (anything: string | number) => string | number
    const func2 = (anything: string | number) => {
        if (typeof anything === 'string') {
            return anything; // 类型是 string
        } else {
            return anything; // 类型是 number
        }
    };

  type Goods = 'pen' | 'pencil' | 'ruler';
  const getPenCost = (item: 'pen') => 2;
  const getPencilCost = (item: 'pencil') => 4;
  const getRulerCost = (item: 'ruler') => 6;
  // const getRulerCost: (item: 'ruler') => number
  const getCost = (item: Goods) => {
      if (item === 'pen') {
          return getPenCost(item); // const getPenCost: (item: 'pen') => number
      } else if (item === 'pencil') {
          return getPencilCost(item); // const getPencilCost: (item: 'pencil') => number
      } else {
          return getRulerCost(item); // const getRulerCost: (item: 'ruler') => number
      }
  };

  // const getCost2: (item: Goods) => "pen" | "pencil" | "ruler"
  const getCost2 = (item: Goods) => {
      if (item === 'pen') {
          item; // (parameter) item: "pen"
      } else {
          item; // (parameter) item: "pencil" | "ruler"
      }
  };

  // 构建的时候提示 ReferenceError: document is not defined，所以注释掉
  // tsconfig.json 中 "strictNullChecks": true
  // const el: HTMLElement | null
  // const el = document.getElementById('foo')
  // if (typeof el === 'object') {
  //   el // const el: HTMLElement | null
  // }

  // function foo(x?: string | number | null | undefined): string | number | null | undefined
  function foo(x?: number | string | null) {
      if (!x) {
          return x; // (parameter) x: string | number | null | undefined
      }
  }

  interface UploadEvent {
      type: 'upload';
      filename: string;
      contents: string;
  }
  interface DownloadEvent {
      type: 'download';
      filename: string;
  }
  type AppEvent = UploadEvent | DownloadEvent;
  function handleEvent(e: AppEvent) {
      switch (e.type) {
          case 'download':
              e; // (parameter) e: DownloadEvent
              break;
          case 'upload':
              e; // (parameter) e: UploadEvent
              break;
      }
  }
}

{
    let myFavoriteNumber: string | number;
    myFavoriteNumber = 'seven';
    myFavoriteNumber = 7;

    // const sayHello: (name: string | undefined) => void
    const sayHello = (name: string | undefined) => {
    /* ... */
    };
    sayHello('semlinker');
    sayHello(undefined);

    const num: 1 | 2 = 1;
  type EventNames = 'click' | 'scroll' | 'mousemove';
}

{
  type Message = string | string[];
  const greet = (message: Message) => {
      // ...
  };
}

{
  // type Useless = never
  type Useless = string & number;

  type IntersectionType = { id: number; name: string } & { age: number };
  const mixed: IntersectionType = {
      id: 1,
      name: 'name',
      age: 18,
  };

  type IntersectionTypeConfict = { id: number; name: string } & { age: number; name: number };
  // const mixedConflict: IntersectionTypeConfict = {
  //   id: 1,
  //   // 不能将类型“number”分配给类型“never”。ts(2322)
  //   name: 2,
  //   age: 2,
  // }

  type IntersectionTypeNotConfict = { id: number; name: 2 } & { age: number; name: number };
  const mixedNotConflict: IntersectionTypeNotConfict = {
      id: 1,
      name: 2,
      age: 2,
  };
  // const mixedNotConflict2: IntersectionTypeNotConfict = {
  //   id: 1,
  //   name: 22, // 不能将类型“22”分配给类型“2”。ts(2322)
  //   age: 2,
  // }

  interface A {
      x: { d: true };
  }
  interface B {
      x: { e: string };
  }
  interface C {
      x: { f: number };
  }
  type ABC = A & B & C;
  const abc: ABC = {
      x: {
          d: true,
          e: '',
          f: 666,
      },
  };
}

{
    interface Person {
        name: string;
        age: number;
    }
    const tom: Person = {
        name: 'Tom',
        age: 25,
    };

    // 类型 "{ name: string; }" 中缺少属性 "age"，但类型 "Person2" 中需要该属性。ts(2741)
    // const tom2: Person = {
    //   name: 'Tom',
    // }

    // 不能将类型“{ name: string; age: number; gender: string; }”分配给类型“Person”。
    // 对象文字可以只指定已知属性，并且“gender”不在类型“Person”中。ts(2322)
    // const tom3: Person = {
    //   name: 'Tom',
    //   age: 25,
    //   gender: 'male',
    // }

    interface Person2 {
        readonly name: string;
        age?: number;
    }

    let a: number[] = [1, 2, 3, 4];
    const ro: ReadonlyArray<number> = a;
    // 类型“readonly number[]”中的索引签名仅允许读取。ts(2542)
    // ro[0] = 12

    // 类型“readonly number[]”上不存在属性“push”。ts(2339)
    // ro.push(5)

    // 无法分配到 "length" ，因为它是只读属性。ts(2540)
    // ro.length = 100

    // 类型 "readonly number[]" 为 "readonly"，不能分配给可变类型 "number[]"。ts(4104)
    // a = ro

    interface Person3 {
        name: string;
        age?: number;
        [propName: string]: any;
    }
    const tom4: Person3 = {
        name: 'Tom',
        age: 25,
        gender: 'male',
    };

    // 类型“number”的属性“age”不能赋给“string”索引类型“string”。ts(2411)
    // interface Person4 {
    //   name: string
    //   age?: number
    //   [propName: string]: string
    // }

    interface Person5 {
        name: string;
        age?: number; // 这里真实的类型应该为：number | undefined
        [propName: string]: string | number | undefined;
    }
    const tom5: Person5 = {
        name: 'Tom',
        age: 25,
        gender: 'male',
    };

    interface LabeledValue {
        label: string;
    }
    function printLabel(labeledObj: LabeledValue) {
        console.log(labeledObj.label);
    }
    const myObj = { size: 10, label: 'Size 10 Object' };
    const myObj2: { size: number; label: string } = { size: 10, label: 'Size 10 Object' };
    printLabel(myObj);
    printLabel(myObj2);
    // 类型“{ size: number; label: string; }”的参数不能赋给类型“LabeledValue”的参数。
    // 对象文字可以只指定已知属性，并且“size”不在类型“LabeledValue”中。ts(2345)
    // printLabel({ size: 10, label: 'Size 10 Object' })

    interface Props {
        name: string;
        age: number;
        money?: number;
    }
    const p: Props = {
        name: '兔神',
        age: 25,
        money: -100000,
        girl: false,
    } as Props;

    interface Props2 {
        name: string;
        age: number;
        money?: number;
        [key: string]: any;
    }
    const p2: Props2 = {
        name: '兔神',
        age: 25,
        money: -100000,
        girl: false,
    };
}

{
    interface Point {
        x: number;
        y: number;
    }
    interface SetPoint {
        (x: number, y: number): void;
    }

    interface Point2 {
        x: number;
        y: number;
    }
  type SetPoint2 = (x: number, y: number) => void;

  // primitive
  type Name = string;

  // object
  interface PartialPointX { x: number }
  interface PartialPointY { y: number }

  // union
  type PartialPoint = PartialPointX | PartialPointY;
  const partialPoint1: PartialPoint = { x: 1 };
  const partialPoint2: PartialPoint = { y: 2 };
  const partialPoint3: PartialPoint = { x: 1, y: 2 };

  // tuple
  type Data = [number, string];

  // dom
  // ReferenceError: document is not defined
  // const div = document.createElement('div') // const div: HTMLDivElement
  // type B = typeof div // type B = HTMLDivElement

  interface Point3 {
      x: number;
  }
  interface Point3 {
      y: number;
  }
  const point: Point3 = { x: 1, y: 2 };
}

{
    interface PointX {
        x: number;
    }
    interface Point extends PointX {
        y: number;
    }

    interface PointX2 {
        x: number;
    }
    type Point2 = PointX2 & {
        y: number;
    };

    interface Point3 extends PointX2 {
        y: number;
    }

    type Point4 = PointX & {
        y: number;
    };
}

{
    // const identityAny: (arg: any) => any
    const identityAny = arg => arg;

    type idBoolean = (arg: boolean) => boolean;
    type idNumber = (arg: number) => number;
    type idString = (arg: string) => string;
    // ...

    identityAny('string').length;
    // 构建报错，所以注释掉
    // TypeError: identityAny(...).toFixed is not a function
    // identityAny('string').toFixed(2)
    // 构建报错，所以注释掉
    // TypeError: Cannot read property 'toString' of null
    // identityAny(null).toString()
    // ...

    function identity<T>(arg: T): T {
        return arg;
    }

    function identity2<T, U>(value: T, message: U): T {
        console.log(message);
        return value;
    }
    console.log(identity2<number, string>(68, 'Semlinker'));

    console.log(identity2(68, 'Semlinker'));

    function trace<T>(arg: T): T {
        // Property 'size doesn't exist on type 'T'
        // console.log(arg.size)
        return arg;
    }

    interface Sizeable {
        size: number;
    }
    function trace2<T extends Sizeable>(arg: T): T {
        console.log(arg.size);
        return arg;
    }

    interface HasAge { age: number }
    function getOldest(items: HasAge[]): HasAge {
        return items.sort((a, b) => b.age - a.age)[0];
    }
    const things = [{ age: 10 }, { age: 20 }, { age: 15 }];
    const oldestThing = getOldest(things);
    console.log(oldestThing.age); // 20
    interface Person { name: string; age: number }
    const people: Person[] = [
        { name: 'Amir', age: 10 },
        { name: 'Betty', age: 20 },
        { name: 'Cecile', age: 15 },
    ];
    // no type errors
    const oldestPerson = getOldest(people);
    // 类型“HasAge”上不存在属性“name”。ts(2339)
    // console.log(oldestPerson.name)
    const oldestPerson2 = getOldest(people) as Person;
    // no type error
    console.log(oldestPerson2.name);
}

{
    interface Person {
        name: string;
        age: number;
    }
    const sem: Person = { name: 'semlinker', age: 30 };
  type Sem = typeof sem; // type Sem = Person
  const lolo: Sem = { name: 'lolo', age: 5 };

  const Message = {
      name: 'jimmy',
      age: 18,
      address: {
          province: '四川',
          city: '成都',
      },
  };
  /**
    type message = {
      name: string;
      age: number;
      address: {
        province: string;
        city: string;
      };
    }
   */
  type message = typeof Message;

  function toArray(x: number): Array<number> {
      return [x];
  }
  type Func = typeof toArray; // type Func = (x: number) => Array<number>
}

{
    interface Person {
        name: string;
        age: number;
    }
  type K1 = keyof Person; // 等价于："name" | "age"
  type K2 = keyof Person[]; // 等价于："length" | "toString" | "pop" | "push" | "concat" | "join" 等
  type K3 = keyof { [x: string]: Person }; // type K3 = string | number

  // 字符串索引
  interface StringArray1 {
      [index: string]: string;
  }
  // type StringArray11 = string | number
  type StringArray11 = keyof StringArray1;

  // 数字索引
  interface StringArray2 {
      [index: number]: string;
  }
  // type StringArray21 = number
  type StringArray21 = keyof StringArray2;

  type K11 = keyof boolean; // type K11 = "valueOf"
  type K21 = keyof number; // type K21 = "toString" | "toFixed" | "toExponential" | "toPrecision" | "valueOf" | "toLocaleString"
  type K31 = keyof symbol; // type K31 = typeof Symbol.toPrimitive | typeof Symbol.toStringTag | "toString" | "valueOf" | "description"
  type K41 = keyof object; // type K41 = never
}

{
    // tsconfig.json "noImplicitAny": true
    // 元素隐式具有 "any" 类型，因为类型为 "string" 的表达式不能用于索引类型 "{}"。
    // 在类型 "{}" 上找不到具有类型为 "string" 的参数的索引签名。ts(7053)
    function prop(obj: object, key: string) {
        return obj[key];
    }

    function prop2(obj: object, key: string) {
        return (obj as any)[key];
    }

    function prop3<T extends object, K extends keyof T>(obj: T, key: K) {
        return obj[key];
    }

    interface Todo {
        id: number;
        text: string;
        done: boolean;
    }
    const todo: Todo = {
        id: 1,
        text: 'Learn TypeScript keyof',
        done: false,
    };
    const id = prop3(todo, 'id'); // const id: number
    const text = prop3(todo, 'text'); // const text: string
    const done = prop3(todo, 'done'); // const done: boolean
    // 类型“"date"”的参数不能赋给类型“keyof Todo”的参数。ts(2345)
    // const date = prop3(todo, 'date')
}

{
  type Keys = 'a' | 'b' | 'c';

  /**
    type Obj = {
      a: any;
      b: any;
      c: any;
    }
   */
  type Obj = {
      [p in Keys]: any
  };
}

{
  type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
  type Fun = (arg: string) => string;
  // type FunReturnType = string
  type FunReturnType = ReturnType<Fun>;
}

{
    interface Lengthwise {
        length: number;
    }
    function loggingIdentity<T extends Lengthwise>(arg: T): T {
        console.log(arg.length);
        return arg;
    }

    // 类型“number”的参数不能赋给类型“Lengthwise”的参数。ts(2345)
    // loggingIdentity(3)

    loggingIdentity({ length: 10, value: 3 });
}

{
    const person = {
        name: 'musion',
        age: 35,
    };
    function getValues(person: any, keys: string[]) {
        return keys.map(key => person[key]);
    }
    console.log(getValues(person, ['name', 'age'])); // [ 'musion', 35 ]
    console.log(getValues(person, ['gender'])); // [ undefined ]

    function getValues2<T, K extends keyof T>(person: T, keys: K[]): T[K][] {
        return keys.map(key => person[key]);
    }
    interface Person {
        name: string;
        age: number;
    }
    const person2: Person = {
        name: 'musion',
        age: 35,
    };
    console.log(getValues2(person, ['name'])); // [ 'musion' ]
    // 不能将类型“"gender"”分配给类型“"name" | "age"”。ts(2322)
    // console.log(getValues2(person, ['gender']))
}

{
    // T[K] 表示对象 T 的属性 K 所表示的类型，在上述例子中，T[K][] 表示变量 T 取属性 K 的值的数组

    // 通过 [] 索引类型访问操作符, 我们就能得到某个索引的类型
    class Person {
        name: string;
        age: number;
    }
  type MyType = Person['name']; // Person 中 name 的类型为 string // type MyType = string
}

{
    interface TestInterface {
        name: string;
        age: number;
    }

  // 我们可以通过 + / - 来指定添加还是删除。
  type OptionalTestInterface<T> = {
      [p in keyof T]+?: T[p]
  };
  /**
    type newTestInterface = {
      name?: string;
      age?: number;
    }
   */
  type newTestInterface = OptionalTestInterface<TestInterface>;

  type ReadOnlyOptionalTestInterface<T> = {
      +readonly [p in keyof T]+?: T[p]
  };
  /**
    type newTestInterface2 = {
      readonly name?: string;
      readonly age?: number;
    }
   */
  type newTestInterface2 = ReadOnlyOptionalTestInterface<TestInterface>;
}

{
  type Partial<T> = {
      [P in keyof T]?: T[P]
  };

  interface UserInfo {
      id: string;
      name: string;
  }
  // 类型 "{ name: string; }" 中缺少属性 "id"，但类型 "UserInfo" 中需要该属性。ts(2741)
  // const xiaoming: UserInfo = {
  //   name: 'xiaoming',
  // }

  type NewUserInfo = Partial<UserInfo>;
  const xiaoming: NewUserInfo = {
      name: 'xiaoming',
  };

  interface NewUserInfo2 {
      id?: string;
      name?: string;
  }

  interface UserInfo2 {
      id: string;
      name: string;
      fruits: {
          appleNumber: number;
          orangeNumber: number;
      };
  }
  type NewUserInfo3 = Partial<UserInfo2>;
  // 类型 "{ orangeNumber: number; }" 中缺少属性 "appleNumber"，但类型 "{ appleNumber: number; orangeNumber: number; }" 中需要该属性。ts(2741)
  // const xiaoming2: NewUserInfo3 = {
  //   name: 'xiaoming',
  //   fruits: {
  //     orangeNumber: 1,
  //   },
  // }

  type DeepPartial<T> = {
      // 如果是 object，则递归类型
      [U in keyof T]?: T[U] extends object ? DeepPartial<T[U]> : T[U]
  };
  type DeepNewUserInfo = DeepPartial<UserInfo2>;
  const xiaoming2: DeepNewUserInfo = {
      name: 'xiaoming',
      fruits: {
          orangeNumber: 1,
      },
  };
}

{
  type Readonly<T> = {
      readonly [P in keyof T]: T[P]
  };

  interface Todo {
      title: string;
  }
  const todo: Readonly<Todo> = {
      title: 'Delete inactive users',
  };
    // 无法分配到 "title" ，因为它是只读属性。ts(2540)
    // todo.title = 'Hello'
}

{
  type Pick<T, K extends keyof T> = {
      [P in K]: T[P]
  };

  interface Todo {
      title: string;
      description: string;
      completed: boolean;
  }
  type TodoPreview = Pick<Todo, 'title' | 'completed'>;
  const todo: TodoPreview = {
      title: 'Clean room',
      completed: false,
  };
}

{
  type Record<K extends keyof any, T> = {
      [P in K]: T
  };

  interface PageInfo {
      title: string;
  }
  type Page = 'home' | 'about' | 'contact';
  const x: Record<Page, PageInfo> = {
      home: { title: 'home' },
      about: { title: 'about' },
      contact: { title: 'contact' },
  };
}

{
  type ReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : any;

  type Func = (value: number) => string;
  // const foo: string
  const foo: ReturnType<Func> = '1';
}

{
  type Exclude<T, U> = T extends U ? never : T;

  type T0 = Exclude<'a' | 'b' | 'c', 'a'>; // "b" | "c"
  type T1 = Exclude<'a' | 'b' | 'c', 'a' | 'b'>; // "c"
  type T2 = Exclude<string | number | (() => void), Function>; // string | number
  type T3 = Exclude<string | Function, number>; // type T3 = string | Function
}

{
  type Extract<T, U> = T extends U ? T : never;

  type T0 = Extract<'a' | 'b' | 'c', 'a' | 'f'>; // "a"
  type T1 = Extract<string | number | (() => void), Function>; // () => void
}

{
  type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

  interface Todo {
      title: string;
      description: string;
      completed: boolean;
  }
  /**
    type TodoPreview = {
      title: string;
      completed: boolean;
    }
   */
  type TodoPreview = Omit<Todo, 'description'>;
  const todo: TodoPreview = {
      title: 'Clean room',
      completed: false,
  };
}

{
  type NonNullable<T> = T extends null | undefined ? never : T;

  type T0 = NonNullable<string | number | undefined>; // string | number
  type T1 = NonNullable<string[] | null | undefined>; // string[]
}

{
  type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;

  type A = Parameters<() => void>; // []
  type B = Parameters<typeof Array.isArray>; // [arg: any]
  type C = Parameters<typeof Number.parseInt>; // [string: string, radix?: number]
  type D = Parameters<typeof Math.max>; // number[]
}

{
    interface Person {
        firstName: string;
        lastName: string;
    }

    interface PersonWithBirthDate1 {
        firstName: string;
        lastName: string;
        birth: Date;
    }
    interface PersonWithBirthDate2 extends Person {
        birth: Date;
    }
  type PersonWithBirthDate3 = Person & { birth: Date };
}

{
    const INIT_OPTIONS = {
        width: 640,
        height: 480,
        color: '#00FF00',
        label: 'VGA',
    };

    interface Options {
        width: number;
        height: number;
        color: string;
        label: string;
    }

  type Options2 = typeof INIT_OPTIONS;

  function get(url: string, opts: Options): Promise<string> {
      return new Promise((resolve) => {
          resolve('name');
      });
  }
  function post(url: string, opts: Options): Promise<string> {
      return new Promise((resolve) => {
          resolve('name');
      });
  }

  type HTTPFunction = (url: string, opts: Options) => Promise<string>;
  const get2: HTTPFunction = (url, opts) => {
      return new Promise((resolve) => {
          resolve('name');
      });
  };
  const post2: HTTPFunction = (url, opts) => {
      return new Promise((resolve) => {
          resolve('name');
      });
  };
}

{
    interface Album {
        artist: string; // 艺术家
        title: string; // 专辑标题
        releaseDate: string; // 发行日期：YYYY-MM-DD
        recordingType: string; // 录制类型："live" 或 "studio"
    }

    const dangerous: Album = {
        artist: 'Michael Jackson',
        title: 'Dangerous',
        releaseDate: 'November 31, 1991', // 与预期格式不匹配
        recordingType: 'Studio', // 与预期格式不匹配
    };

    interface Album2 {
        artist: string; // 艺术家
        title: string; // 专辑标题
        releaseDate: Date; // 发行日期：YYYY-MM-DD
        recordingType: 'studio' | 'live'; // 录制类型："live" 或 "studio"
    }
    // const dangerous2: Album2 = {
    //   artist: 'Michael Jackson',
    //   title: 'Dangerous',
    //   // 不能将类型“string”分配给类型“Date”。ts(2322)
    //   releaseDate: 'November 31, 1991',
    //   // 不能将类型“"Studio"”分配给类型“"studio" | "live"”。ts(2322)
    //   recordingType: 'Studio',
    // }
    const dangerous3: Album2 = {
        artist: 'Michael Jackson',
        title: 'Dangerous',
        releaseDate: new Date('1991-11-31'),
        recordingType: 'studio',
    };
}

{
    interface State {
        pageContent: string;
        isLoading: boolean;
        errorMsg?: string;
    }

    function renderPage(state: State) {
        if (state.errorMsg) {
            return `呜呜呜，加载页面出现异常了...${state.errorMsg}`;
        } else if (state.isLoading) {
            return `页面加载中~~~`;
        }
        return `<div>${state.pageContent}</div>`;
    }
    // 输出结果：页面加载中~~~
    console.log(renderPage({ isLoading: true, pageContent: '' }));
    // 输出结果：<div>大家好呀</div>
    console.log(renderPage({ isLoading: false, pageContent: '大家好呀' }));

    async function changePage(state: State, newPage: string) {
        state.isLoading = true;
        try {
            // mock 返回信息
            const response = await {
                ok: true,
                statusText: 'success',
                text() {
                    return 'hello';
                },
            };
            if (!response.ok) {
                throw new Error(`Unable to load ${newPage}: ${response.statusText}`);
            }
            const text = await response.text();
            state.isLoading = false;
            state.pageContent = text;
        } catch (e) {
            state.errorMsg = `${e}`;
        }
    }

    interface RequestPending {
        state: 'pending';
    }
    interface RequestError {
        state: 'error';
        errorMsg: string;
    }
    interface RequestSuccess {
        state: 'ok';
        pageContent: string;
    }
  type RequestState = RequestPending | RequestError | RequestSuccess;
  interface State2 {
      currentPage: string;
      requests: { [page: string]: RequestState };
  }

  function renderPage2(state: State2) {
      const { currentPage } = state;
      const requestState = state.requests[currentPage];
      switch (requestState.state) {
          case 'pending':
              return `页面加载中~~~`;
          case 'error':
              return `呜呜呜，加载第${currentPage}页出现异常了...${requestState.errorMsg}`;
          case 'ok':
              ;`<div>第${currentPage}页的内容：${requestState.pageContent}</div>`;
      }
  }

  async function changePage2(state: State2, newPage: string) {
      state.requests[newPage] = { state: 'pending' };
      state.currentPage = newPage;
      try {
      // mock 返回信息
          const response = await {
              ok: true,
              statusText: 'success',
              text() {
                  return 'hello';
              },
          };
          if (!response.ok) {
              throw new Error(`无法正常加载页面 ${newPage}: ${response.statusText}`);
          }
          const pageContent = await response.text();
          state.requests[newPage] = { state: 'ok', pageContent };
      } catch (e) {
          state.requests[newPage] = { state: 'error', errorMsg: `${e}` };
      }
  }
}
