/* eslint-disable ts/no-unsafe-function-type */
/* eslint-disable ts/no-empty-object-type */
/* eslint-disable unused-imports/no-unused-vars */
export type MyPartial<T> = {
    [K in keyof T]?: T[K]
};

export type MyRequired<T> = {
    [K in keyof T]-?: T[K]
};

export type MyReadonly<T> = {
    readonly [K in keyof T]: T[K]
};

function pick<T extends object, U extends keyof T>(obj: T, keys: U[]): T[U][] {
    return keys.map(key => obj[key]);
}
console.log(pick({ a: 123, b: 'name' }, ['a', 'b'])); // [ 123, 'name' ]

interface A {
    a: boolean;
    b: string;
    c: number;
    d: () => void;
}

export type MyPick<T, K extends keyof T> = {
    [P in K]: T[P]
};
// 期望用法
/**
 * 期望结果：
 * {
 *    a: boolean;
 *    b: string;
 * }
 */
type Part = MyPick<A, 'a' | 'b'>;

// "3" | "4" | "5"
type LeftFields = Exclude<'1' | '2' | '3' | '4' | '5', '1' | '2'>;

export type MyExclude<T, U> = T extends U ? never : T;
// "3" | "4" | "5"
type MyLeftFields = MyExclude<'1' | '2' | '3' | '4' | '5', '1' | '2'>;

export type MyOmit<T, K extends keyof any> = MyPick<T, MyExclude<keyof T, K>>;
// 期望用法
/**
 * 期望结果：
 * {
 *    c: number;
      d: () => void;
 * }
 */
type OmitPart = MyOmit<A, 'a' | 'b'>;

export type MyExtract<T, U> = T extends U ? T : never;
// "1" | "2"
type MyExtractFields = MyExtract<'1' | '2' | '3' | '4' | '5', '1' | '2'>;

type MyNav = 'a' | 'b' | 'c';
interface INavWidgets {
    widgets: string[];
    title?: string;
    keepAlive?: boolean;
}
const router: Record<MyNav, INavWidgets> = {
    a: { widgets: [''] },
    b: { widgets: [''] },
    c: { widgets: [''] },
};

// K extends keyof any 约束 K 必须为联合类型
export type MyRecord<K extends keyof any, T> = {
    [P in K]: T
};
const myRouter: MyRecord<MyNav, INavWidgets> = {
    a: { widgets: [''] },
    b: { widgets: [''] },
    c: { widgets: [''] },
};
const myRouter2: MyRecord<string, unknown> = {
    a: { widgets: [''] },
    b: { widgets: [''] },
    c: { widgets: [''] },
};

function foo(name: string, sex: string): string {
    return `${name}_${sex}`;
}
export type MyReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : any;
// string
type FooReturnType = MyReturnType<typeof foo>;

export type MyParameters<T extends (...args: any[]) => any> = T extends (...args: infer P) => any ? P : never;
// [ name: string, sex: string ]
type FooParameters = MyParameters<typeof foo>;

class ClassB {
    constructor(public name: string) {
        this.name = name;
    }
}
export type MyConstructorParameters<T extends new (...args: any[]) => any> = T extends new (...args: infer P) => any
    ? P
    : never;
// [ name: string ]
type ClassBConstructorParameters = MyConstructorParameters<typeof ClassB>;

export type MyInstanceType<T extends new (...args: any[]) => any> = T extends new (...args: any[]) => infer R ? R : any;
// ClassB
type ClassBInstanceType = MyInstanceType<typeof ClassB>;

// 基础类型别名
export type Primitive = string | number | bigint | boolean | symbol | null | undefined;

// 判断是否是基础类型
export function isPrimitive(val: unknown): val is Primitive {
    if (val === null || val === undefined) {
        return true;
    }

    // "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"
    const typeDef = typeof val;

    const primitiveNonNullishTypes = ['string', 'number', 'bigint', 'boolean', 'symbol'];

    return primitiveNonNullishTypes.includes(typeDef);
}

// null 或 undefined 别名
export type Nullish = null | undefined;
// 非 undefined
export type NonUndefined<A> = A extends undefined ? never : A;
// 非 null
export type NonNullable<T> = T extends null ? never : T;

export const isString = (arg: unknown): arg is string => typeof arg === 'string';
console.log(isString('name'));

export type Falsy = false | '' | 0 | null | undefined;
export const isFalsy = (val: unknown): val is Falsy => !val;
const myFalse: Falsy = null;
console.log(isFalsy(myFalse)); // true

function fooPromise(): Promise<string> {
    return new Promise((resolve, reject) => {
        resolve('name');
    });
}
export type PromiseType<T extends Promise<any>> = T extends Promise<infer U> ? U : never;
// Promise<string>
type FooPromiseReturnType = ReturnType<typeof fooPromise>;
// string
type NakedFooPromiseReturnType = PromiseType<FooPromiseReturnType>;

// 对象嵌套场景
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
};

interface IObjWithFuncKeys {
    a: string;
    b: number;
    c: boolean;
    d: () => void;
    e: () => void;
}
export type FunctTypeKeys<T extends object> = {
    [K in keyof T]-?: T[K] extends Function ? K : never
}[keyof T];
// "d" | "e"
type FunKeys = FunctTypeKeys<IObjWithFuncKeys>;

// "N"
type JUDGE1 = {} extends { prop: number } ? 'Y' : 'N';
// "Y"
type JUDGE2 = {} extends { prop?: number } ? 'Y' : 'N';

interface IObjKeys {
    a?: string;
    b: number;
    c: boolean;
}
export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends MyPick<T, K> ? never : K
}[keyof T];
// "b" | "c"
type IObjRequiredKeys = RequiredKeys<IObjKeys>;

export type OptionalKeys<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? K : never
}[keyof T];
// "a"
type IObjOptionalKeys = OptionalKeys<IObjKeys>;

interface IEqualKeys {
    a?: string;
    b: number;
    c: boolean;
}
export type Equal<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? A : B;
// "never"
type EqualKeys1 = Equal<IEqualKeys, { [P in keyof IEqualKeys]-?: IEqualKeys[P] }>;
// "hahaha"
type EqualKeys2 = Equal<
    { [P in keyof IEqualKeys]-?: IEqualKeys[P] },
    { [P in keyof IEqualKeys]-?: IEqualKeys[P] },
    'hahaha'
>;

interface IReadonlyKeys {
    readonly a: string;
    b: number;
    c: boolean;
}
// 非只读的 Keys
export type MutableKeys<T extends object> = {
    [P in keyof T]-?: Equal<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P, never>
}[keyof T];
// "b" | "c"
type MutableKeys1 = MutableKeys<IReadonlyKeys>;

export type IMmutableKeys<T extends object> = {
    [P in keyof T]-?: Equal<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, never, P>
}[keyof T];
// "a"
type MutableKeys2 = IMmutableKeys<IReadonlyKeys>;

interface IValueTypeKeys {
    a: string;
    b: number;
    c: boolean;
}
export type PickByValueType<T, ValueType> = Pick<
    T,
    { [Key in keyof T]-?: T[Key] extends ValueType ? Key : never }[keyof T]
>;
// { a: string; }
type PickByValueType1 = PickByValueType<IValueTypeKeys, string>;

export type OmitByValueType<T, ValueType> = Pick<
    T,
    { [Key in keyof T]-?: T[Key] extends ValueType ? never : Key }[keyof T]
>;
// { b: number; c: boolean; }
type PickByValueType2 = OmitByValueType<IValueTypeKeys, string>;
