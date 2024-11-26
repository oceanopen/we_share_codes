/* eslint-disable ts/no-unsafe-function-type */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable ts/no-unused-expressions */
function foo1<T>(args: T): T {
    return args;
}
foo1<string>('linbudu').length;
foo1('linbudu').length;

const foo2 = <T>(arg: T): T => arg;
foo2<string>('linbudu').length;
foo2('linbudu').length;

class Foo<T, U> {
    constructor(public arg1: T, public arg2: U) {}

    public method(): T {
        return this.arg1;
    }
}

let numOrStrProp: number | string;

/* -------- */

export const isString1 = (arg: unknown): boolean => typeof arg === 'string';
function useIt1(numOrStr: number | string) {
    if (isString1(numOrStr)) {
        // 类型“string | number”上不存在属性“length”。类型“number”上不存在属性“length”。ts(2339)
        // console.log(numOrStr.length);
    }
}

export const isString2 = (arg: unknown): arg is string => typeof arg === 'string';
function useIt2(numOrStr: number | string) {
    if (isString2(numOrStr)) {
        console.log(numOrStr.length);
    }
}

class A {
    public a() {}

    public useA() {
        return 'A';
    }
}
class B {
    public b() {}

    public useB() {
        return 'B';
    }
}
function useIt3(arg: A | B): string {
    return 'a' in arg ? arg.useA() : arg.useB();
}
console.log(useIt3(new A())); // A

interface IBoy {
    name: 'mike';
    gf: string;
}
interface IGirl {
    name: 'sofia';
    bf: string;
}
function getLover(child: IBoy | IGirl): string {
    if (child.name === 'mike') {
        return child.gf;
    } else {
        return child.bf;
    }
}
console.log(getLover({ name: 'mike', gf: 'value' })); // value

interface ILogInUserProps {
    isLogin: boolean;
    name: string;
}
interface IUnLoginUserProps {
    isLogin: boolean;
    from: string;
}
type UserProps1 = ILogInUserProps | IUnLoginUserProps;
function getUserInfo1(user: UserProps1): string {
    return 'name' in user ? user.name : user.from;
}
console.log(getUserInfo1({ isLogin: true, name: 'John' })); // John

interface ICommonUserProps {
    type: 'common';
    accountLevel: string;
}
interface IVIPUserProps {
    type: 'vip';
    vipLevel: string;
}
type UserProps2 = ICommonUserProps | IVIPUserProps;
function getUserInfo2(user: UserProps2): string {
    return user.type === 'common' ? user.accountLevel : user.vipLevel;
}
console.log(getUserInfo2({ type: 'common', accountLevel: '2' })); // 2

function pickSingleValue1<T>(obj: T, key: keyof T) {
    return obj[key];
}
console.log(pickSingleValue1({ a: 123 }, 'a')); // 123
// 类型“"b"”的参数不能赋给类型“"a"”的参数。ts(2345)
// console.log(pickSingleValue1({ a: 123 }, 'b'));

interface foo {
    a: number;
    b: string;
}
type KEY_OF_FOO = keyof foo; // "a" | "b"

function pickSingleValue2<T>(obj: T, key: keyof T): T[keyof T] {
    return obj[key];
}
console.log(pickSingleValue2({ a: 123 }, 'a')); // 123

interface OBJ_T {
    a: number;
    b: string;
}
type TKeys = keyof OBJ_T; // "a" | "b"
type PropAType = OBJ_T['a']; // number

function pickSingleValue3<T extends object, U extends keyof T>(obj: T, key: U): T[U] {
    return obj[key];
}
console.log(pickSingleValue3({ a: 123 }, 'a')); // 123

function pick<T extends object, U extends keyof T>(obj: T, keys: U[]): T[U][] {
    return keys.map(key => obj[key]);
}
console.log(pick({ a: 123, b: 'name' }, ['a', 'b'])); // [ 123, 'name' ]

interface Foo3 {
    [key: string]: string;
}
const foo3: Foo3 = { name: 'cat' };
const foo3_2: Foo3 = {
    1: '北京',
};
console.log(foo3_2[1] === foo3_2['1']); // true

interface Foo4 {
    [key: number]: string;
}
const foo4: Foo4 = {
    1: '北京',
};
// console.log(foo4[1] === foo4['1']) // error TS7015: Element implicitly has an 'any' type because index expression is not of type 'number'.

interface A2 {
    a: boolean;
    b: string;
    c: number;
    d: () => void;
}
type StringifyA2<T> = {
    [K in keyof T]: string
};
const B2: StringifyA2<A2> = {
    a: '1',
    b: '2',
    c: '3',
    d: '4',
};

type ClonedA2<T> = {
    [K in keyof T]: T[K]
};
const B2_1: ClonedA2<A2> = {
    a: true,
    b: '2',
    c: 3,
    d: () => {},
};

type Partial<T> = {
    [K in keyof T]?: T[K]
};
const B2_2: Partial<A2> = {
    a: false,
};

type ConditionType<T, U, X, Y> = T extends U ? X : Y;

declare function strOrNum<T extends boolean>(x: T): T extends true ? string : number;
strOrNum(true).length;

type TypeName<T> = T extends string
    ? 'string'
    : T extends number
        ? 'number'
        : T extends boolean
            ? 'boolean'
            : T extends undefined
                ? 'undefined'
                : T extends Function
                    ? 'function'
                    : 'object';
const strA: TypeName<string> = 'string';

// "string" | "function"
type T1 = TypeName<string | (() => void)>;
// "string" | "object"
type T2 = TypeName<string | string[]>;
// "object"
type T3 = TypeName<string[] | number[]>;

type Naked<T> = T extends boolean ? 'Y' : 'N';
type Wrapped<T> = [T] extends [boolean] ? 'Y' : 'N';
// "N" | "Y"
type Distributed = Naked<number | boolean>;
// "N"
type NotDistributed = Wrapped<number | boolean>;

function foo5(): string {
    return 'name';
}
type ReturnType1<T> = T extends (...args: any[]) => infer R ? R : never;
// string
type FooReturnType1 = ReturnType1<typeof foo5>;
type ReturnType2<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : never;
// string
type FooReturnType2 = ReturnType2<typeof foo5>;

type World = 'world';
// "hello world"
type Greeting = `hello ${World}`;

type SizeRecord<Size extends string> = `${Size}-Record`;
// "Small-Record"
type SmallSizeRecord = SizeRecord<'Small'>;
// "Middle-Record"
type MiddleSizeRecord = SizeRecord<'Middle'>;
// "Huge-Record"
type HugeSizeRecord = SizeRecord<'Huge'>;
// "Small-Record" | "Middle-Record" | "Huge-Record"
type UnionSizeRecord = SizeRecord<'Small' | 'Middle' | 'Huge'>;

// "Small-Record" | "Small-Report" | "Middle-Record" | "Middle-Report" | "Huge-Record" | "Huge-Report"
type SizeRecordOrReport = `${'Small' | 'Middle' | 'Huge'}-${'Record' | 'Report'}`;

// DEMO
type UppercaseType = Uppercase<'Demo'>;
// demo
type LowercaseType = Lowercase<'Demo'>;
// Demo
type CapitalizeType = Capitalize<'demo'>;
// demo
type UncapitalizeType = Uncapitalize<'Demo'>;

type CutStr<Str extends string> = Str extends `${infer Part}World` ? Part : never;
// "Hello"
type Tmp1 = CutStr<'HelloWorld'>;

type ExtractMember<Str extends string> = Str extends `[${infer Member1}, ${infer Member2}, ${infer Member3}]`
    ? [Member1, Member2, Member3]
    : unknown;
// ["1", "2", "3"]
type Tmp2 = ExtractMember<'[1, 2, 3]'>;

type ExtractMember2<Str extends string> = Str extends `[${infer Member1}${infer Member2}${infer Member3}]`
    ? [Member1, Member2, Member3]
    : unknown;
// ["1", ",", " 2, 3"]
type Tmp3 = ExtractMember2<'[1, 2, 3]'>;

type JoinArrayMember<T extends unknown[], D extends string> = T extends []
    ? ''
    : T extends [any]
        ? `${T[0]}`
        : T extends [any, ...infer U]
            ? `${T[0]}${D}${JoinArrayMember<U, D>}`
            : string;
// ""
type Tmp4 = JoinArrayMember<[], '.'>;
// "1"
type Tmp5 = JoinArrayMember<[1], '.'>;
// "1.2.3.4"
type Tmp6 = JoinArrayMember<[1, 2, 3, 4], '.'>;

type SplitArrayMember<S extends string, D extends string> = string extends S
    ? string[]
    : S extends ''
        ? []
        : S extends `${infer T}${D}${infer U}`
            ? [T, ...SplitArrayMember<U, D>]
            : [S];
// ["foo"]
type Tmp7 = SplitArrayMember<'foo', '.'>;
// ["foo", "bar", "baz"]
type Tmp8 = SplitArrayMember<'foo.bar.baz', '.'>;
// ["f", "o", "o", ".", "b", "a", "r"]
type Tmp9 = SplitArrayMember<'foo.bar', ''>;
// string[]
type Tmp10 = SplitArrayMember<any, '.'>;

type PropType<T, Path extends string> = string extends Path
    ? unknown
    : Path extends keyof T
        ? T[Path]
        : Path extends `${infer K}.${infer R}`
            ? K extends keyof T
                ? PropType<T[K], R>
                : unknown
            : unknown;
declare function getPropValue<T, P extends string>(obj: T, path: P): PropType<T, P>;
declare const s: string;
const propTypeObj = {
    a: {
        b: {
            c: 42,
            d: 'hello',
        },
    },
};
getPropValue(propTypeObj, 'a'); // { b: { c: number; d: string; } }
getPropValue(propTypeObj, 'a.b'); // { c: number; d: string; }
getPropValue(propTypeObj, 'a.b.d'); // string
getPropValue(propTypeObj, 'a.b.x'); // unknown
getPropValue(propTypeObj, s); // unknown

type Getters<T> = {
    [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
};
interface Person {
    name: string;
    age: number;
    location: string;
    fun: () => void;
}
// type LazyPerson = {
//   getName: () => string
//   getAge: () => number
//   getLocation: () => string
// }
type LazyPerson = Getters<Person>;

type RemoveKindField<T> = {
    [K in keyof T as Exclude<K, 'kind'>]: T[K]
};
interface Circle {
    kind: 'circle';
    radius: number;
}
// type KindlessCircle = {
//   radius: number
// }
type KindlessCircle = RemoveKindField<Circle>;

type DoubleProp<T> = {
    [P in keyof T & string as `${P}1` | `${P}2`]: T[P]
};
// type TmpDubleProp = {
//   a1: string
//   a2: string
//   b1: number
//   b2: number
// }
type TmpDubleProp = DoubleProp<{ a: string; b: number }>;
