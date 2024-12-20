# 引用类型

## 前言

`引用类型的值(对象)` 是引用类型的一个实例。
在 `ECMAScript` 中，引用类型是--种数据结构，用于将数据和功能组织在一起。

它也常被称为类，但这种称呼并不妥当。尽管 `ECMAScript` 从技术上讲是一门面向对象的语言，但它`不具备`传统的面向对象语言所支持的`类和接口等基本结构`。
引用类型有时候也被称为`对象定义`，因为它们描述的是`一类对象所具有的属性和方法`。
虽然引用类型与类看起来相似，但它们并不是相同的概念。为避免混淆，本书将不使用类这个概念。

如前所述，对象是某个特定引用类型的实例。
新对象是使用 `new 操作符`后跟一个`构造函数`来创建的。构造函数本身就是个函数，只不过该函数是出于创建新对象的目的而定义的。

请看下面这行代码：

```javascript
const person = new Object();
```

这行代码创建了 `Object` 引用类型的一个新实例，然后把该实例保存在了变量 `person` 中。
使用的构造函数是 `Object`，它只为新对象定义了默认的属性和方法。
`ECMAScript` 提供了很多原生引用类型(例如 `Object`)，以便开发人员用以实现常见的计算任务。

## 一、Object 类型

### 1. 创建实例

创建 object 实例方式有两种：

```javascript
const person = new Object();
person.name = 'Nicholas';
person.age = 29;
```

> 或者

```javascript
const person = {
  name: 'Nicholas',
  age: 29,
};
```

在下面例子中，`左边的花括号({)` 表示 `对象字面量的开始`，因为它出现在了`表达式上下文 (expression context)`中。
`ECMAScript` 中的表达式上下文指的是`能够返回一个值(表达式)`。`赋值操作符`表示后面是一个值，所以`左花括号`在这里表示`一个表达式的开始`。

同样的花括号，如果出现在一个`语句上下文(statement context)`中，例如跟在 `if 语句条件`的后面，则表示`一个语句块的开始`。

> 在通过对象字面量定义对象时，实际上不会调用 `Object` 构造函数。

### 2. 函数传参应用

对象传参的模式最适合需要向函数传入大量`可选参数`的情形。
一般来讲，命名参数虽然容易处理，但在有多个可选参数的情况下就会显示不够灵活。
最好的做法是对那些`必需值`使用`命名参数`，而使用`对象字面量`来封装`多个可选参数`。

## 二、Array 类型

### 1. 创建实例

```javascript
// 使用Array构造函数
let colors = new Array();

// 预先知道数组要保存的项目数量
colors = Array.from({ length: 20 });

// 如果传递的是其他类型的参数，则会创建包含那个值的只有一项的数组。
let names = ['Greg']; // 创建一个包含1项，即字符串"Greg"的数组

// 也可以省略new操作符
names = ['Greg']; // 与上面等价
```

> 与对象一样，在使用数组字面量表示法时，也不会调用 `Array` 构造函数。

**利用 length 属性也可以方便地在数组末尾添加新项，如下所示：**

```javascript
// 创建一个包含 3 个字苻串的数组
const colors = ['red', 'blue', 'green'];

// length属性就会自动更新
colors[colors.length] = 'black';
colors[colors.length] = 'brown';
```

### 2. 检测数组

```javascript
if (Array.isArray(value)) {
  // 对数组执行某些操作
}
```

或者

```javascript
if (Array.isArray(value)) {
  // 对数组执行某些操作
}
```

### 3. 转换方法

**前言**

所有对象都具有 `toLocaleString()`、`toString()` 和 `valueOf()` 方法。
其中，调用数组的 `toString()` 方法会返回由数组中`每个值的字符串形式`拼接而成的一个`以逗号分隔`的字符串。
实际上，为了创建这个字符串会调用数组每一项的 `toString()` 方法。
而调用 `valueOf()` 返回的还是数组。

> 当调用数组的 `toLocaleString()` 方法时，它也会创建一个数组值的以逗号分隔的字符串。
> 而与前两个方法唯一的不同之处在于，这一次为了取得每一项的值，调用的是毎-项的 `toLocaleString()` 方法，而不是 `toString()` 方法。

请看下面这个例子。

```javascript
const personl = {
  toLocaleString() {
    return 'Nikolaos';
  },
  toString() {
    return 'Nicholas';
  },
};
const person2 = {
  toLocaleString() {
    return 'Grigorioa';
  },
  toString() {
    return 'Greg';
  },
};
const people = [personl, person2];

console.log(people); // Nicholas,Greg

console.log(people.toString()); // Nicholas,Greg

console.log(people.toLocaleString()); // Nikolaos,Grigorioa
```

**join 方法**

> 如果数组中的某一项的值是 `null` 或者 `undefined`，那么该值在 `join()`、 `toLocaleString()`、`toString()` 和 `valueOf()` 方法返回的结果中以`空字符串`表示。

```javascript
const people = ['Nick', 'Back', null, 'Test'];

console.log(people.join()); // Nick,Back,,Test

console.log(people.join('|')); // Nick|Back||Test
```

### 4. 栈和队列方法

`栈` 是一种 `LIFO (Last-In-First-Out, 后进先出)` 的数据结构。
`队列` 数据结构的访问规则是 `FIFO( First-In-First-Out, 先进先出)`。

- 尾部推入: `push()` 方法
- 尾部弹出: `pop()` 方法
- 首部推入: `unshift()` 方法
- 首部弹出: `shift()` 方法

```javascript
const colors = ['yellow']; // 创建一个数组

const count = colors.push('red', 'green'); // 尾部推入两顼
// 返回数组的长度
console.log(count); // 3

colors.unshift('red', 'green'); // 首部推入两项
```

### 5. 重排序方法

数组中已经存在两个可以直接用来重排序的方法：`reverse()` 和 `sort()`。

> `reverse()` 和 `sort()` 方法的返回值是经过排序之后的数组，且自身也会改变。

```javascript
const colors = ['red', 'green', 'yellow'];

colors.reverse();
console.log(colors); // ["yellow", "green", "red"]

colors.sort();
console.log(colors); // ["green", "red", "yellow"]
```

在默认情况下，`sort()` 方法按升序排列数组项——即最小的值位于最前面，最大的值排在最后面。
为了实现排序，`sort()` 方法会调用每个数组项的 `toString()` 转型方法，然后比较得到的字符串，以确定如何排序。
即使数组中的每一项都是数值，`sort()`方法比较的也是字符串，如下所示。

```javascript
const values = [0, 1, 5, 10, 15];

values.sort();
console.log(values); // [0, 1, 10, 15, 5]
```

可见，即使例子中值的顺序没有问题，但 `sort()` 方法也会根据测试字符申的结果改变原来的顺序。
因为`数值 5` 虽然小于 `10`，但在进行字符串比较时，`"10"`则位于`"5"`的前面，于是数组的顺序就被修改了。
不用说，这种排序方式在很多情况下都不是最佳方案。

> 因此 `sort()` 方法可以接收一个比较函数作为参数，以便我们指定哪个值位于哪个值的前面。
> 比较函数接收两个参数，
>
> - 如果第一个参数应该位于第二个之前则返回一个负数；
> - 如果两个参数相等 则返回 0；
> - 如果第一个参数应该位于第二个之后则返回一个正数。

以下就是一个简単的`升序排序`比较函数：

```javascript
function compare(value1, value2) {
  if (value1 < value2) {
    return -1;
  }
  // 交换顺序，则返回正数
  else if (value1 > value2) {
    return 1;
  }
  else {
    return 0;
  }
}

// 测试结果如下：
const values = [0, 1, 5, 10, 15];

values.sort(compare);
console.log(values); // [0, 1, 5, 10, 15]
```

同理：对于数值类型或者其`valueOf()`方法会返回数值类型的对象类型，可以使用一个更简单的`倒序排序`比较函数。

```javascript
function compare(value1, value2) {
  return value2 - value1;
}

// 测试结果如下：
const values = [0, 1, 5, 10, 15];

values.sort(compare);
console.log(values); // [15, 10, 5, 1, 0]
```

### 6. 操作方法

**A. concat()**

`concat()`方法可以基于当前数组中的所有项`创建一个新数组`。

具体来说，

1. 这个方法会先创建当前数组一个副本，
2. 然后将接收到的参数添加到这个副本的末尾，最后返回新构建的数组。

在没有给 `concat()` 方法传递参数的情况下，它只是复制当前数组并返回副本。

如果传递给 `concat()` 方法的是一或多个数组，则该方法会将这些`数组中的每一项`都添加到结果数组中。
如果传递的值不是数组，这些值就会被简单地`添加到结果数组的末尾`。

例子：

```javascript
const colors = ['red', 'green', 'blue'];
const colors2 = colors.concat('yellow', ['black', 'brown']);

console.log(colors); // (3) ["red", "green", "blue"]
console.log(colors2); // (6)  ["red", "green", "blue", "yellow", "black", "brown"]
```

**B. slice()**

它能够基于当前数组中的一或多个项`创建一个新数组`。

`slice`方法可以接受一或两个参数，即要返回项的`起始`和`结束位置`。

- 在只有一个参数的情况下，slice 方法返回从该参数指定位置开始到当前数组末尾的所有项。
- 如果有两个参数，该方法返回起始和结束位置之间的项————但不包括結束位置的项。

> 注意，slice 方法不会影响原始数组。

例子：

```javascript
const colors = ['red', 'green', 'blue', 'yellow', 'purple'];
const colors2 = colors.slice(1);
const colors3 = colors.slice(1, 4);

alert(colors2); // green,blue,yellow,purple
alert(colors3); // green,blue,yellow
```

> `slice`方法的参数中有一个`负数`，则用`数组长度``加上该数`来确定相应的`位置`。
> 例如，在一个包含 5 项的数组上调用`slice(-2, -1)`与调用`slice(3, 4)`得到的结果相同。
> 如果结束位置`小于`起始位置，则返回`空数组`。

**C. splice()**

> `splice`的主要用途是`向数组的中部插入项`，但使用这种方法的方式则有如下 3 种：

- _删除_：可以删除任意数量的项，只需指定 2 个参数：要删除的第一项的位置和要删除的项数。

> 例如，`splice(0, 2)`会删除数组中的前两项。

- _插入_：可以向指定位置插入任意数量的项，只需提供 3 个参数：起始位置、0(要删除的项数) 和要插入的项。

> 如果要插入多个项，可以再传入第四、第五，以至任意多个项。
> 例如，`splice(2, 0, "red", "green")`会从当前数组的位置 2 开始插入字符串`"red"`和`"green"`。

- _替换_：可以向指定位置插入任意数量的项，且同时删除任意数量的项，只需指定 3 个参数：起始位置、要删除的项数和要插入的任意数量的项。

> 插入的项数不必与删除的项数相等。
> 例如，`splice(2, 1, "red", "green")`会删除当前数组位置 2 的项，然后再从位置 2 开始插入字符串`"red"`和`"green"`。
> `splice`方法始终都会返回一个数组，该数组中包含从原始数组中删除的项(如果没有删除任何项，则返回一个空数组)。

### 7. 位置方法

ECMAScript5 为数组实例添加了两个位置方法：`indexOf()`和 `lastlndexOf()`。

这两个方法都接收两个参数：`要查找的项`和`(可选的)表示査找起点位置的索引`。
其中`indexOf()`方法从数蛆的开头(位置 0)开始向后査找，`lastlndexOf()`方法则从数组的末尾开始向前査找。

这两个方法都返回要査找的项在数组中的位置，或者在没找到的情况下返冋-1。
在比较第一个参数与数组中的每一项时，会使用`全等操作符`；

### 8. 迭代方法

ECMAScript5 为数组定义了 5 个迭代方法。
每个方法都接收两个参数：`要在每一项上运行的函数`和 `(可选的)`运行该函数的`作用域对象`——影响 this 的值。

传入这些方法中的函数会接收三个参数：`数组项的值`、`该项在数组中的位置`和`数组对象本身`。

> 以下是这 5 个迭代方法的作用：

- `every()`：对数组中的每一项运行给定函数，如果该函数对每一项都返回 true,则返回 true„
- `filter()`：对数组中的每一项运行给定函数，返回该函数会返回 true 的项组成的数组。
- `forEach()`：对数组中的每一项运行给定函数。这个方法没有返回值。
- `map()`：对数组中的每一项运行给定函数，返冋每次函数调用的结果组成的数组。
- `some()`：对数组中的每一项运行给定函数，如果该函数对任一项返回 true,则返回 true。

> 以上方法都不会修改数组中的包含的值。

### 9. 归并方法

ECMAScript5 还新增了两个归并数组的方法：`reduce()`和 `reduceRight()`。
这两个方法都会迭代数组的所有项，然后构建一个最终返回的值。

其中，`reduce()`方法从数组的第一项开始，逐个遍历到最后。
而 `reduceRight()`则从数组的最后一项开始，向前遍历到第一项。

这两个方法都接收两个参数：一个在`每一项上调用的函数`和`(可选的)作为归并基础的初始值`。
传给 `reduce()`和 `reduceRight()`的函数接收 4 个参数：`前-个值`、`当前值`、`项的索引`和`数组对象`。

这个函数返回的`任何值`都会作为`第一个参数`自动传给下一项。

> 没有初始值的情况下，`第一次迭代`发生在数组的第二项上，因此第一个参数是数组的第一项，第二个参数就是数组的第二项。
> 求数组中所有值之和的操作，比如：

```javascript
const values = [1, 2, 3, 4, 5];
const sum = values.reduce((prev, cur, index, array) => {
  return prev + cur;
});

alert(sum); // 15
```

> 有初始值的情况，`第一次迭代`发生在数组的第一项上，因此第一个参数是初始值，第二个参数就是数组的第一项。
> 比如：

```javascript
const values = [1, 2, 3, 4, 5];
const sum = values.reduce((prev, cur, index, array) => {
  console.log('index:', index, ' | prev:', prev, ' | cur:', cur);
  return prev + cur;
}, 100);
console.log(sum);

// index: 0  | prev: 100  | cur: 1
// index: 1  | prev: 101  | cur: 2
// index: 2  | prev: 103  | cur: 3
// index: 3  | prev: 106  | cur: 4
// index: 4  | prev: 110  | cur: 5
// 115
```

## 三、 Date 类型

ECMAScript 中的 Date 类型是在早期 Java 中的 java.util.Date 类基础上构建的。、
为此，Date 类型使用自 UTC (Coordinated Universal Time,国际协调时间)1970 年 1 月 1 日午夜(零时)开始经过的毫秒数来保存日期。
在使用这种数据存储格式的条件下，Date 类型保存的日期能够精确到 1970 年 1 月 1 日之前或之后的 285 616 年。

> 创建当期时间对象：

```javascript
const now = new Date();
```

> 或者创建指定时间对象：

```javascript
console.log(new Date('2021-04-18')); // Sun Apr 18 2021 08:00:00 GMT+0800 (中国标准时间)
console.log(new Date('04/18/2021')); // Sun Apr 18 2021 00:00:00 GMT+0800 (中国标准时间)

// 等价于
console.log(new Date(Date.parse('2021-04-18'))); // Sun Apr 18 2021 08:00:00 GMT+0800 (中国标准时间)
```

### 1. Date.parse()

`Date.parse()`方法接收一个表示日期的字符串参数，然后尝试根据这个字符串返回相应日期的毫秒数。

> 如果直接将表示日期的字符串传递给 Date 构造函数，也会在后台调用 Date.parse()。

### 2. 获取当前时间毫秒数

- `Date.now()`
- `+new Date()`
- `new Date().getTime()`

```javascript
console.log(Date.now()); // 1618736991485
console.log(+new Date()); // 1618736991485
console.log(new Date().getTime()); // 1618736991485
```

### 3. 继承的方法

`Date` 类型的的`valueOf()`方法，不返回字符串，而是返回日期的毫秒表示。

### 4. 日期/时间组件方法

> 以下仅列举常用的方法：

| 方法          | 说明                                                    |
| ------------- | ------------------------------------------------------- |
| getTime()     | 返回表示日期的臺秒数；与 valueOfO 方法返回的值相同      |
| getFullYear() | 取得 4 位数的年份（如 2007 而非仅 07）                  |
| getMonth()    | 日期中的月份，其中 0 表示一月，11 表示十二月            |
| getDate()     | 返回日期月份中的天数（1 到 31）                         |
| getDay()      | 返冋日期中星期的星期几（其中 0 表示星期日，6 表示星期六 |
| getHours()    | 返回日期中的小时数（0 到 23）                           |
| getMinutes()  | 返回日期中的分钟数（0 到 59）                           |
| getSeconds()  | 返回日期中的秒数（0 到 59）                             |

## 四、 RegExp 类型

ECMAScript 通过 RegExp 类型来支持正则表达式。

使用下面类似 Perl 的语法，就可以创建一个正则表达式。

```
var expression = /pattern/flags
```

其中的 `模式(pattern)` 部分可以是任何简单或复杂的正则表达式，可以包含字符类、限定符、分组、 向前査找以及反向引用。
每个正则表达式都可带有一个或多个 `标志(flags)`，用以标明正则表达式的行为。

> 正则表达式的`匹配模式`支持下列 3 个标志：

- `g`：表示`全局(global)模式`，即模式将被应用于所有字符串，而非在发现第一个匹配项时立即
  停止;
- `i`：表示`不区分大小写(case-insensitive)模式`，即在确定匹配项时忽略模式与字符串的大小写；
- `m`：表示`多行(multiline)模式`，即在到达一行文本末尾时还会继续査找下一行中是否存在与模式匹配的项。

因此，`一个正则表达式`就是`一个模式`与`上述 3 个标志`的`组合体`。

`RegExp构造函数`，它接收两个参数：一个是要匹配的`字符串模式`，另一个是可选的`标志字符串`。
可以使用字面量定义的任何表达式，都可以使用构造函数来定义。

> 举个例子：

```javascript
/*
 * 匹配第一个"bat"或"cat",不区分大小写
 */
const pattern1 = /[be]at/i;
/*
 * 与pattern1 相关同，只不过是使用构造函数创建的
 */
const pattern2 = new RegExp('[be]at', 'i');
```

在此，pattern1 和 pattern2 是两个完全等价的正则表达式。

> 要注意的是，传递给 RegExp 构造函数的两个参数都是字符申（不能把正则表达式字面量传递给 RegExp 构造函数）。
> 由于 RegExp 构造函数的模式参数是字符串，所以在某些情况下要对字符进行双重转义。

| 字面量模式         | 等价的字符串            |
| ------------------ | ----------------------- |
| `/\(bc\]at/`       | `"\\[bc\\]at"`          |
| `/\.at/`           | `"\\.at"`               |
| `/name\/age/`      | `"name\\/age"`          |
| `/\d.\d(1,2)/`     | `"\\d.\\d(1,2)"`        |
| `/\w\\hello\\123/` | `"\\w\\\\hello\\\\123"` |

> ECMAScript5 明确规定，使用正则表达式字面量必须像直接调用 RegExp 构造函数一样，每次都`创建新的 RegExp 实例`。

### 1. RegExp 实例属性

RegExp 的每个实例都具有下列属性，通过这些属性可以取得有关模式的各种信息。

- `global`：布尔值，表示是否设置了 g 标志。
- `ignoreCase`：布尔值，表示是否设置了 i 标志。
- `lastIndex`：整数，表示开始搜索下一个匹配项的字符位置，从 0 算起。
- `multiline`：布尔值，表示是否设置了 m 标志。
- `source`：正则表达式的字符串表示，按照`字面量形式`而非传入构造函数中的`字符串模式`返回。

```javascript
const pattern1 = /\[bc\]at/i;
console.log(pattern1.source); // "\[bc\]at"

const pattern2 = new RegExp('\\[bc\\]af', 'i');
console.log(pattern2.source); // "\[bc\]at"
```

### 2. RegExp 实例方法

**A. exec()**

> 该方法是专门为捕获组而设计的。

- `exec()` 接受一个参数，即要应用模式的字符串，然后返回包含`第一个匹配项信息`的数组；或者在没有匹配项的情况下返回 null。
- 返回的数组虽然是 Array 的实例，但包含两个额外的属性：index 和 input。
- 其中，index 表示匹配项在字符串中的位置，而 input 表示应用正则表达式的字符串。
- 在数组中，第一项是与`整个模式匹配`的字符串，其他项是与模式中的`捕获组匹配`的字符串(如果模式中`没有捕获组`，则该数组`只包含一项`)。

举个例子：

```javascript
const text = 'mom and dad and baby';

// eslint-disable-next-line regexp/no-useless-flag
const pattern1 = /mom( and dad( and baby)?)?/gi;
const matches1 = pattern1.exec(text);

// eslint-disable-next-line regexp/no-useless-flag
const pattern2 = /hahaha/gi;
const matches2 = pattern2.exec(text);

console.log(matches1.index); // 0
console.log(matches1.input); // "mom and dad and baby"
console.log(matches1[0]); // "mom and dad and baby"
console.log(matches1[1]); // " and dad and baby"
console.log(matches1[2]); // " and baby"

console.log(matches2); // null
```

对于 `exec()` 方法而言，即使在模式中设置了`全局标志(g)`,它每次也只会返回一个匹配项。
在`不设置`全局标志的情况下，在同一个字符串上`多次调用` exec() 将始终返回`第一个匹配项`的信息。
而在`设置`全局标志的情况下，每次调用 exec() 则都会在字符串中`继续査找``新匹配项`，

```javascript
const text = 'cat, bat, sat, fat';
const pattern1 = /.at/;
let matches = pattern1.exec(text);

console.log(matches.index); // 0
console.log(matches[0]); // cat
console.log(pattern1.lastIndex); // 0

matches = pattern1.exec(text);
console.log(matches.index); // 0
console.log(matches[0]); // cat
console.log(pattern1.lastIndex); // 0

const pattern2 = /.at/g;
matches = pattern2.exec(text);
console.log(matches.index); // 0
console.log(matches[0]); // cat
console.log(pattern2.lastIndex); // 3

matches = pattern2.exec(text);
console.log(matches.index); // 5
console.log(matches[0]); // bat
console.log(pattern2.lastIndex); // 8
```

> 这个例子中的第一个模式`pattern1``不是全局模式`，因此每次调用`exec()`返回的都是第一个匹配项("cat")。
> 而第二个模式`pattern2``是全局模式`，因此每次调用`exec()`都会返回字符串中的`下一个匹配项`，直至搜索到`字符串末尾`为止。
> 此外，还应该注意模式的`lastIndex`属性的变化情况。
> 在`全局匹配模式`下，`lastIndex`的值在每次调用`exec()`后都会增加，而在`非全局模式`下则始终`保持不变`。

**B. test()**

> 它接受一个字符串参数。
> 在模式与该参数`匹配`的情况下返回 `true`; 否则，返冋`false`。
> 在只想知道`目标字符串`与某个模式`是否匹配`，但`不需要`知道`其文本内容`的情况下，使用这个方法非常方便。

举个例子：

```javascript
const text = '000-00-0000';
const pattern = /\d{3}-\d{2}-\d{4}/;
if (pattern.test(text)) {
  console.log('The pattern was matched.');
}
```

**C. toString()**

> RegExp 实例继承的 `toLocaleString()` 和 `toString()`方法都会返回正则表达式的字面量，与创建正则表达式的方式无关。例如：

```javascript
const pattern = new RegExp('\\[bc\\]at', 'gi');
console.log(pattern.toString()); // "/\[bc\]at/gi"
console.log(pattern.toLocaleString()); // "/\[bc\]at/gi"
```

### 3. RegExp 构造函数属性

> `RegExp 构造函数`包含一些属性(这些属性在其他语言中被看成是静态属性)。
> 这些属性适用于`作用域中`的`所有正则表达式`，并且基于所执行的`最近-次`正则表达式操作而`变化`。
> 关于这些属性的另一个独特之处，就是可以通过两种方式访问它们。
> 换句话说，这些属性分别有一个`长属性名`和一个`短属性名`

下表列出了 RegExp 构造函数的属性：

| 长属性名     | 短属性名 | 说明                                  |
| ------------ | -------- | ------------------------------------- |
| input        | `$_`     | 最近一次要匹配的字符串。              |
| lastMatch    | `S&`     | 最近一次的匹配项。                    |
| lastParen    | `$+`     | 最近一次匹配的捕获组。                |
| leftContext  | $`       | input 字符串中 lastMatch 之前的文本。 |
| rightContext | `$'`     | input 字符串中 lastMatch 之后的文本。 |

使用这些属性可以从 `exec()`或 `test()`执行的操作中提取出更具体的信息。

```javascript
const text = 'this has been a short summer';
// eslint-disable-next-line regexp/no-useless-flag
const pattern = /(.)hort/g;

if (pattern.test(text)) {
  // eslint-disable-next-line regexp/no-legacy-features
  console.log(RegExp.input); // this has been a short summer
  // eslint-disable-next-line regexp/no-legacy-features
  console.log(RegExp.leftContext); // this has been a
  // eslint-disable-next-line regexp/no-legacy-features
  console.log(RegExp.rightContext); // " summer"
  // eslint-disable-next-line regexp/no-legacy-features
  console.log(RegExp.lastMatch); // short
  // eslint-disable-next-line regexp/no-legacy-features
  console.log(RegExp.lastParen); // s
}
```

如前所述，例子使用的长属性名都可以用相应的短属性名来代替。

```javascript
const text = 'this has been a short summer';
// eslint-disable-next-line regexp/no-useless-flag
const pattern = /(.)hort/g;

if (pattern.test(text)) {
  // eslint-disable-next-line regexp/no-legacy-features
  console.log(RegExp.$_); // this has been a short summer
  // eslint-disable-next-line regexp/no-legacy-features
  console.log(RegExp['$`']); // this has been a
  // eslint-disable-next-line regexp/no-legacy-features
  console.log(RegExp[`$'`]); // " summer"
  // eslint-disable-next-line regexp/no-legacy-features
  console.log(RegExp['$&']); // short
  // eslint-disable-next-line regexp/no-legacy-features
  console.log(RegExp['$+']); // s
}
```

> 除了上面介绍的几个属性之外，还有多达 9 个用于`存储捕获组`的构造函数属性。
> 访问这些属性的语法是 RegExp.$1、RegExp.$2-RegExp.$9, 分别用于存储第一、第二……第九个匹配的捕获组。
> 在调用 `exec()` 和 `test()` 方法时，这些属性会被自动填充。

举个例子：

```javascript
const text = 'this has been a short summer';
// eslint-disable-next-line regexp/no-useless-flag
const pattern = /(..)or(.)/g;

if (pattern.test(text)) {
  // eslint-disable-next-line regexp/no-legacy-features
  console.log(RegExp.$1); // "sh"
  // eslint-disable-next-line regexp/no-legacy-features
  console.log(RegExp.$2); // "t"
}
```

### 4. 模式的局限性

尽管 ECMAScript 中的正则表达式功能还是比较完备的，但仍然缺少某些语言(特别是 Perl)所支持的高级正则表达式特性。

## 五、Function 类型

> 函数实际上是对象。
> 每个函数都是 Function 类型的实例，而且都与其他引用类型一样具有属性和方法。
> 由于函数是对象，因此函数名实际上也是一个指向函数对象的指针，不会与某个函数绑定。

函数定义方式：

```javascript
// 使用函数声明语法定义
function sum(num1, num2) {
  return num1 + num2;
}
// 函数表达式
sum = function (num1, num2) {
  return num1 + num2;
};
// 使用 Function 构造函数

sum = new Function('num1', 'num2', 'return num1 + num2'); // 不推荐
```

### 1. 没有重载

> 函数变量名，同名覆盖。

### 2. 函数声明与函数表达式

> 实际上，解析器在向执行环境中加载数据时，对函数声明和函数表达式并非一视同仁。
> 解析器会率先读取函数声明，并使其在执行任何代码之前可用(可以访问)；
> 至于函数表达式，则必须等到解析器执行到它所在的代码行，才会真正被解释执行。

举个例子：

```javascript
console.log(sum(10, 10)); // 20

function sum(num1, num2) {
  return num1 + num2;
}
```

以上代码完全可以正常运行。

> 因为在代码开始执行之前，解析器就已经通过一个名为`函数声明提升(function declaration hoisting)`的过程，读取并将`函数声明`添加到`执行环境`中。
> 对代码求值时，`JavaScript 引擎`在第一遍会`声明函数`并将它们放到`源代码树的顶部`。
> 所以，即使声明函数的代码在调用它的代码后面，`JavaScript 引擎`也能把函数声明`提升到顶部`。

### 3. 作为值的函数

因为 ECMAScript 中的`函数名`本身就是`变量`，所以函数也可以作为`值`来使用。
也就是说，不仅可以像`传递参数`一样把一个函数`传递`给另一个函数，而且可以将一个函数作为另一个函数的`结果`返回。

### 4. 函数内部属性

> 在函数内部，有两个特殊的对象：`arguments` 和 `this`。
> 其中，arguments 是一个类数组对象，包含着传入函数中的所有参数。
> 虽然 arguments 的主要用途是保存函数参数，但这个对象还有一个名叫 `callee` 的属性，该属性是一个指针，指向拥有这个 arguments 对象的函数。

以实现阶乘函数为例：

```javascript
function factorial1(num) {
  if (num <= 1) {
    return 1;
  }
  else {
    return num * factorial1(num - 1);
  }
}

// 这个函数的执行与函数名 factorial 紧紧耦合在了一起。为了消除这种紧密耦合的现象，可简写为：
function factorial2(num) {
  if (num <= 1) {
    return 1;
  }
  else {
    // eslint-disable-next-line no-caller
    return num * arguments.callee(num - 1);
  }
}

console.log(factorial1(5)); // 120
console.log(factorial2(5)); // 120
```

> 当函数在`严格模式`下运行时，访问 `arguments.callee` 会导致错误。这是为了加强这门语言的安全性，这样第三方代码就不能在相同的环境里窥视其他代码了。

### 5. 函数属性和方法

> ECMAScript 中的函数是对象，因此函数也有属性和方法。
> 每个函数都包含两个属性：length 和 prototype。

**length 属性**

其中，`length` 属性表示函数希望`接收的命名参数的个数`，如下面的例子所示。

```javascript
function sayName(name) {
  console.log(name);
}
function sum(num1, mun2) {
  return numl + num2;
}
function sayHi() {
  console.log('hi');
}

console.log(sayName.length); // 1
console.log(sum.length); // 2
console.log(sayHi.length); // 0
```

**prototype 属性**

> 对于 ECMAScript 中的引用类型而言，prototype 是保存它们所有实例方法的真正所在。
> 换句话说，诸如 toString() 和 valueOf() 等方法实际上都保存在 prototype 名下，只不过是通过各自对象的实例访问罢了。
> 在创建自定义引用类型以及实现继承时，prototype 属性的作用是极为重要的。
> 在 ECMAScript 5 中，prototype 属性是不可枚举的，因此使用 for-in 无法发现。

**apply() 和 call()**

> 每个函数都包含两个非继承而来的方法：apply() 和 call() 这两个方法的用途都是`在特定的作用域中``调用函数`，实际上等于设置函数体内` this 对象`的值。

首先，apply() 方法接收两个参数：一个是在其中运行函数的作用域，另一是参数数组。其中，第二个参数可以是 Array 的实例，也可以是 arguments 对象。

> 在严格模式下，未指定环境对象而调用函数，则 this 值不会转型为 window。
> 除非明确把函数添加到某个对象或者调用 apply() 或 call()，否则 this 值将是 undefined。

call() 方法与 apply() 方法的作用相同，它们的区别仅在于接收参数的方式不同。
对于 call() 方法而言，第一个参数是 this 值没有变化，变化的是其余参数都直接传递给函数。换句话说，在使用 call() 方法时，传递给函数的参数必须逐个列举出来，

事实上，传递参数并非 apply() 和 call()真正的用武之地，它们真正强大的地方是能够`扩充`函数赖以运行的`作用域`。

**bind()**

ECMAScript 5 还定义了一个方法：bind()。 这个方法会创建一个函数的实例，其 this 值会被绑定到传给 bind() 函数的值。

## 六、基本包装类型

> 为了便于操作基本类型值，ECMAScript 还提供了 3 个特殊的引用类型：`Boolean`, `Number` 和 `String`。

> 实际上，每当读取一个基本类型值的时候，后台就会创建一个对应的基本包装类型的对象，从而让我们能够调用一些方法来操作这些数据。

来看下面的例子：

```javascript
const s1 = 'some text';
const s2 = s1.substring(2);
```

这个例子中的变量 s1 包含一个字符串，字符串当然是基本类型值。
而下一行调用了 s1 的 substring() 方法，并将返回的结果保存在了 s2 中。

我们知道，基本类型值不是对象，因而从逻辑上讲它们不应该有方法(尽管如我们所愿，它们确实有方法)。
其实，为了让我们实现这种直观的操作，后台已经自动完成了一系列的处理。

> 当第二行代码访问 s1 时，访问过程处于一种读取模式，也就是要从内存中读取这个字符串的值。
> 而在读取模式中访问字符串时，后台都会自动完成下列处理。

1. 创建 String 类型的一个实例；
2. 在实例上调用指定的方法；
3. 销毁这个实例。

可以将以上三个步骤想象成是执行了下列 ECMAScript 代码。

```javascript
// eslint-disable-next-line no-new-wrappers, unicorn/new-for-builtins
let s1 = new String('some text');
const s2 = s1.substring(2);
s1 = null;
```

> 经过此番处理，基本的字符串值就变得跟对象一样了。而且，上面这三个步骤也分别适用于 Boolean 和 Number 类型对应的布尔值和数字值。
> 引用类型与基本包装类型的主要区别就是对象的生存期。
> 使用 new 操作符创建的引用类型的实例， 在执行流离开当前作用域之前都一直保存在内存中。
> 而自动创建的基本包装类型的对象，则只存在于一行代码的执行瞬间，然后立即被销毁。

这意味着我们不能在运行时为基本类型值添加属性和方法。来看下面的例子：

```javascript
const s1 = 'some text';
s1.color = 'red';
console.log(s1.color); // undefined
```

> 在此第二行代码试图为字符串 s1 添加一个 color 属性。
> 但是，当第三行代码再次访问 s1 时， 其 color 属性不见了。
> 问题的原因就是第二行创建的 String 对象在执行第三行代码时已经被销毁了。
> 第三行代码又创建自己的 String 对象，而该对象没有 color 属性。

当然，可以显式地调用 Boolean, Number 和 String 来创建基本包装类型的对象。
不过，应该在绝对必要的情况下再这样做，因为这种做法很容易让人分不清自己是在处理基本类型还是引用类型的值。

对基本包装类型的实例调用 `typeof` 会返回`"object"`，而且所有基本包装类型的对象都会被转换为`布尔值 true`。

举个例子：

```javascript
// eslint-disable-next-line no-new-wrappers, unicorn/new-for-builtins
const a = new String('xxx');
const b = String('xxx');
const c = 'xxx';
// eslint-disable-next-line no-new-wrappers, unicorn/new-for-builtins
const d = new Boolean(0);
const e = Boolean(0);

console.log(a); // String {"xxx"}
console.log(b); // "xxx"
console.log(c); // "xxx"

console.log(typeof a); // object
console.log(typeof b); // string
console.log(typeof c); // string

console.log(typeof d); // object
console.log(Boolean(d)); // true
console.log(typeof e); // boolean
```

`Object 构造函数`也会像`工厂方法`一样，根据`传入值的类型`返回相应`基本包装类型`的`实例`。例如：

```javascript
const str = new Object('some text');
console.log(typeof str); // object
console.log(str instanceof String); // true

const num = new Object(0);
console.log(typeof num); // object
console.log(num instanceof Number); // true

const bool = new Object(true);
console.log(typeof bool); // object
console.log(bool instanceof Boolean); // true
```

> 把字符串传给 Object 构造函数，就会创建 String 的实例；
> 而传入数值参数会得到 Number 的实例，
> 传入布尔值参数就会得到 Boolean 的实例。

要注意的是，使用 new 调用基本包装类型的构造函数，与`直接调用同名的转型函数`是不一样的。 例如：

```javascript
const value = '25';
const number = Number(value); // 转型函敎
console.log(typeof number); // "number"
console.log(number); // 25

// eslint-disable-next-line no-new-wrappers, unicorn/new-for-builtins
const obj = new Number(value); // 构造函数
console.log(typeof obj); // "object"
console.log(obj); // Number {25}
```

在这个例子中，变量 number 中保存的是基本类型的值 25，而变最 obj 中保存的是 Number 的实例。

### 1. Number 类型

**toString()**

toString() 方法传递一个表示基数的参数，告诉它返回几进制数值的字符串形式，如下面的例子所示。

```javascript
const num = 10;
console.log(num.toString()); // "10"
console.log(num.toString(2)); // "1010"
console.log(num.toString(8)); // "12"
console.log(num.toString(10)); // "10"
console.log(num.toString(16)); // "a"
```

### 2. String 类型

**A. 字符方法**

两个用于访问字符串中特定字符的方法是：charAt() 和 charCodeAt()。这两个方法都接收一个参数，即基于 0 的字符位置。

其中，charAt() 方法以单字符字符串的形式返回给定位置的那个字符 (ECMAScript 中没有字符类型)。
如果想得到的不是字符而是字符编码，那么就要使用 charCodeAt() 了。

```javascript
const str1 = 'hello world';
console.log(str1.charAt(1)); // "e"

const str2 = 'hello world';
console.log(str2.charCodeAt(1)); // 101
```

**B. 字符串操作方法**

> 与 `concat()` 方法一样，`slice()`, `substr()` 和 `substring()` 也不会修改字符串本身的值，它们只是返回一个基本类型的字符串值，对原始字符串没有任何影响。

#### 2.1 字符串拼接

- `concat()`：用于将一或多个字符串拼接起来。

#### 2.2 字符串截取

基于子字符串创建新字符串的方法：

> 这三个方法都会返回被操作字符串的一个子字符串，而且也都接受一或两个参数。
> 第一个参数指定子字符串的开始位置，第二个参数(在指定的情况下)表示子字符串到哪里结束。

- `slice()`
- `substr()`
- `substring()`

> `slice()` 和 `substring()` 的第二个参数指定的是子字符串最后一个字符后面的位置。
> 而 `substr()` 的第二个参数指定的则是返回的字符个数。
> 如果没有给这些方法传递第二个参数，则将字符串的长度作为结束位置。

```javascript
const str = 'hello world';

console.log(str.slice(3)); // "lo world"
console.log(str.substring(3)); // "lo world"
console.log(str.substr(3)); // "lo world"

console.log(str.slice(3, 7)); // "lo w"
console.log(str.substring(3, 7)); // "lo w"
console.log(str.substr(3, 7)); // "lo worl"

console.log(str.slice(7, 3)); // ""
console.log(str.substring(7, 3)); // "lo w"
console.log(str.substr(7, 3)); // "orl"
```

> `slice()` 取的是两个参数指定位置区间的字符串。区分区间的方向。所以如果左侧位置大于右侧，则返回为空。
> `substring()` 取的是两个参数指定位置之间的字符串。不区分区间的方向。所以如果左侧位置大于右侧，则取值不变。

在传递给这些方法的参数是负值的情况下，它们的行为就不尽相同了。
其中，
`slice()` 方法会将传入的负值与字符串的长度相加，
`substring()` 方法会把所有负值参数都转换为 0。
最后，
`substr()` 方法将负的第一个参数加上字符串的长度，而将负的第二个参数转换为 0。

```javascript
const str = 'hello world';

console.log(str.slice(-3)); // "rld"
console.log(str.substring(-3)); // "hello world"
console.log(str.substr(-3)); // "rld"

console.log(str.slice(3, -4)); // "lo w"
console.log(str.substring(3, -4)); // "hel"
console.log(str.substr(3, -4)); // ""

console.log(str.slice(-4, 3)); // ""
console.log(str.substring(-4, 3)); // "hel"
console.log(str.substr(-4, 3)); // "orl"

console.log(str.slice(-4, -3)); // "o"
console.log(str.substring(-4, -3)); // ""
console.log(str.substr(-4, -3)); // ""
```

> 综上，只有 `slice()` 推荐用负数作为下标，其他都不推荐。

#### 2.3 字符串位置方法

有两个可以从字符申中査找子字符串的方法：`indexOf()` 和 `lastIndexOf()` 。
这两个方法都是从一个字符串中搜索给定的子字符串，然后返子字符串的位置(如果没有找到该子字符串，则返回-1)。
这两个方法的区别在于：`indexOf()` 方法从字符串的开头向后捜索子字符串，而 `lastIndexOf()` 方法是从字符串的末尾向前搜索子字符串。

#### 2.4 trim()方法

ECMASciipt5 为所有字符串定义了 `trim()` 方法。
这个方法会创建一个字符串的副本，删除前置及后缀的所有空格，然后返回结果。

#### 2.5 字符串大小写转换方法

接下来我们要介绍的是一组与大小写转换有关的方法。
ECMAScript 中涉及字符串大小写转换的方法有 4 个：`toLowerCase()`、`toLocaleLowerCase()`、`toUpperCase()` 和 `toLocaleUpperCase()` 。

`toLocaleLowerCase()` 和 `toLocaleUpperCase()` 方法则是针对特定地区的实现。

> 常规用法，推荐用 `toLowerCase()` 和 `toUpperCase()`，转换结果保持统一。

#### 2.6 字符串的模式匹配方法

**2.6.1 match()**

第一个方法就是 `match()`，在字符串上调用这个方法，本质上与调用 RegExp 的 `exec()` 方法相同。
`match()` 方法只接受一个参数，要么是一个正则表达式，要么是一个 RegExp 对象。

来看下面的例子。

```javascript
const text = 'cat, bat, sat, fat';
const pattern = /.at/;

// 与 pattern.exec(text) 结果相同
const matches = text.match(pattern);

console.log(matches.index); // 0
console.log(matches[0]); // cat
console.log(pattern.lastIndex); // 0

const matches2 = pattern.exec(text);
console.log(matches2.index); // 0
console.log(matches2[0]); // cat
console.log(pattern.lastIndex); // 0
```

本例中的 `match()` 方法返回了一个数组；
如果是调用 RegExp 对象的 `exec()` 方法并传递本例中的字符串作为参数，那么也会得到与此相同的数组：
数组的第一项是与整个模式匹配的字符串，之后的每一项(如果有)保存着与正则表达式中的捕获组匹配的字符串。

**2.6.2 search()**

用于査找模式的方法是 `search()`。这个方法的唯一参数与 `match()` 方法的参数相同：由字符串或 RegExp 对象指定的正则表达式。
`search()` 方法返回字符串中第一个匹配项的索引；
如果没有找到匹配项，则返回 `-1`。而且，`search()` 方法始终是从字符串开头向后査找模式。

```javascript
const text = 'cat, bat, sat, fat';
const pos = text.search(/at/);

console.log(pos); // 1
```

**2.6.3 replace()**

为了简化替换子字符串的操作，ECMAScript 提供了 `replace()` 方法。
这个方法接受两个参数：

- `第一个参数`可以是一个 `RegExp 对象`或者`一个字符串`(这个字符串不会被转换成正则表达式)；
- `第二个参数`可以是`一个字符串`或者`一个函数`。
  - 如果第一个参数是字符串，那么只会替换第一个子字符串。
  - 要想替换所有子字符串，唯一的办法就是提供一个正则表达式，而且要指定全局(g)标志。

如下所示。

```javascript
const text = 'cat, bat, sat, fat';

let result = text.replace('at', 'ond');
console.log(result); // "cond, bat, satr fat"

result = text.replace(/at/g, 'ond');
console.log(result); // Hcond, bond, sond, fond"
```

如果第二个参数是字符串，那么还可以使用一些特殊的字符序列，将正则表达式操作得到的值插入到结果字符串中。

下表列出了 ECMAScript 提供的这些特殊的字符序列。

| 字符序列 | 替换文本                                                                                                                                                                             |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| $$       | $                                                                                                                                                                                    |
| S&       | 匹配整个模式的子字符串。与`RegExp.lastMatch`的值相同                                                                                                                                 |
| $'       | 匹配的子字符串之前的子字符串。与`RegExp.leftContext`的值相同                                                                                                                         |
| $\`      | 匹配的子字符申之后的子字符串。与`RegExp.rightContext`的值相同                                                                                                                        |
| Sn       | 匹配第 n 个捕获组的子字符串，其中 n 等于 0~9。例如，$1 是匹配第一个捕获组的子字符串，$2 是匹配第二个捕获组的子字符串，以此类推。如果正则表达式中没有定义捕获组，则使用空字符串       |
| $nn      | 匹配第 nn 个捕获组的子字符串，其中 nn 等于 01~99。例如，$01 是匹配第一个捕获组的子字符串，$02 是匹配第二个捕获组的子字符串，以此类推。如果正则表达式中没有定义捕获组，则使用空字符串 |

> 通过这些特殊的字符序列，可以使用最近一次匹配结果中的内容，如下面的例子所示。

```javascript
const text = 'cat, bat, sat, fat';

result = text.replace(/(.at)/g, 'word ($1)');
console.log(result); // word (cat), word (bat), word (sat), word (fat)
```

在此，每个以"at"结尾的单词都被替换了，替换结果是"word"后跟一对圆括号，而圆括号中是被字符序列$1 所替换的单词。

`replace()方法`的`第二个参数`也可以是`一个函数`。
在`只有一个``匹配项(即与模式匹配的字符串)`的情况下，会向这个函数传递 3 个参数：`模式的匹配项`、`模式匹配项在字符申中的位置`和`原始字符串`。
在正则表达式中定义了`多个捕获组`的情况下，传递给函数的参数依次是模式的匹配项、第一个捕获组的匹配项、第二个捕获组的匹配项……，但最后两个参数仍然分别是模式的匹配项在字符串中的位置和原始字符串。
这个函数应该`返冋一个字符串`，表示应该被替换的匹配项。
使用函数作为 `replace()方法`的第二个参数可以实现更加精细的替换操作。

> 请看下面这个例子。

```javascript
function htmlEscape(text) {
  return text.replace(/[<>"&]/g, (match, pos, originalText) => {
    switch (match) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case '"':
        return '&quot;';
    }
  });
}

console.log(htmlEscape('<p class="greeting">Hello world!</p>'));
// &lt;p class=&quot;greeting&quot;&gt;Hello world!&lt;/p&gt;
```

这里，我们为`插入 HTML 代码`定义了函数 `htmlEscape()`，这个函数能够转义 4 个字符：小于号、 大于号、和号以及双引号。
实现这种转义的最简单方式，就是使用正则表达式査找这几个字符，然后定义一个能够针对每个匹配的字符返回`特定 HTML 实体`的函数。

**2.6.4 split()**

最后一个与模式匹配有关的方法是 `split()`，这个方法可以`基于指定的分隔符`将一个字符串分割成多个子字符串，并将结果放在一个数组中。
分隔符可以是`字符串`，也可以是一个 `RegExp 对象`(这个方法不会将字符串看成正则表达式)。
`split() 方法`可以接受可选的第二个参数，用于指定数组的大小，以便确保返回的数组不会超过既定大小。

> 请看下面的例子。

```javascript
const colorText = 'red,blue,green,yellow';
const colors1 = colorText.split(',');
const colors2 = colorText.split(',', 2);
const colors3 = colorText.split(/[^,]+/);

console.log(colors1); // (4)  ["red", "blue", "green", "yellow"]
console.log(colors2); // (2)  ["red", "blue"]
console.log(colors3); // (5)  ["", ",", ",", ",", ""]
```

> 对 `split()`中正则表达式的支持因浏览器而异。在使用这种正则表达式时，一定要在各种浏览器下多做一些测试。

**2.6.5 localeCompare()**

与操作字符串有关的最后一个方法是 `localeCompare()`,这个方法比较两个字符串，并返回下列值中的一个：

- 如果字符串在字母表中应该排在字符串参数之前，则返回一个负数(大多数情况下是-1,具体的值要视实现而定);
- 如果字符串等于字符串参数，则返回 0;
- 如果字符串在字母表中应该排在字符串参数之后，则返回一个正数(大多数情况下是 1,具体的 值同样要视实现而定)。

> 下面是几个例子。

```javascript
const str = 'yellow';

console.log(str.localeCompare('brick')); // 1
console.log(str.localeCompare('yellow')); // 0
console.log(str.localeCompare('zoo')); // -1
```

> 返回的数值取决于浏览器实现，所以需要做下充分的浏览器测试后再使用此方法。

**2.6.5 fromCharCode()**

String 构造函数本身还有一个静态方法：`fromCharCode()` 。
这个方法的任务是接收一或多个字符编码，然后将它们转换成一个字符串。
从本质上来看，这个方法与实例方法 `charCodeAt()` 执行的是相反的操作。
来看一个例子：

```javascript
console.log(String.fromCharCode(104, 101, 108, 108, 111)); // "hello"
```

在这里，我们给 `fromCharCode()` 传递的是字符串"hello"中`每个字母的字符编码`。

**HTML 方法**

> 不建议使用，因为不具有可读性。

早期的 Web 浏览器提供商觉察到了使用 JavaScript `动态格式化 HTML` 的需求。
于是，这些提供商就扩展了标准，实现了一些专门用于简化常见 HTML 格式化任务的方法。

下表列出了这些 HTML 方法。 不过，需要请读者注意的是，应该`尽量不使用`这些方法，因为它们创建的标记通常无法表达语义。

| 方法                        | 输出结果                            |
| --------------------------- | ----------------------------------- |
| "string".anchor("name")     | `<a name="name">string</a>`         |
| "string".big()              | `<big>string</big>`                 |
| "string".bold()             | `<b>string</b>`                     |
| "string".fixed()            | `<tt>string</tt>`                   |
| "string".fontcolor("color") | `<font color="color">string</font>` |
| "string".fontsize("size")   | `<font size="size">string</font>`   |
| "string".italics()          | `<i>string</i>`                     |
| "string".link("url")        | `<a href="url">string</a>`          |
| "string".small()            | `<small>string</small>`             |
| "string".strike()           | `<strike>string</strike>`           |
| "string".sub()              | `<sub>string</sub>`                 |
| "string".sup()              | `<sup>string</sup>`                 |

## 七、单体内置对象

ECMA-262 对内置对象的定义是："`由 ECMAScript 实现`提供的、不依赖于宿主环境的对象，这些对象在 ECMAScript 程序执行之前就已经存在了。”
意思就是说，开发人员不必显式地实例化内置对象，因为它们已经实例化了。

前面我们已经介绍了大多数内置对象，例如 Object. Array 和 String。
ECMA-262 还定义了两个`单体内置对象`：`Global` 和 `Math`。

### 7.1 Global 对象

`Global(全局)对象`可以说是 ECMAScript 中最特别的一个对象了，因为不管你从什么角度上看， 这个对象都是不存在的。
ECMAScript 中的 Global 对象在某种意义上是作为一个终极的“兜底儿对象” 来定义的。
换句话说，不属于任何其他对象的属性和方法，最终都是它的属性和方法。

事实上，没有全局变量或全局函数；所有在全局作用域中定义的属性和函数，都是 Global 对象的属性。

本书前面介绍过的那些函数，诸如 isNaN()、isFinite()、parseInt() 以及 parseFloat()，实际上全都是 Global 对象的方法。
除此之外，Global 对象还包含其他一些方法。

#### 7.1.1 URI 编码方法

Global 对象的 `encodeURI()` 和 `encodeURIComponent()` 方法可以对 `URI (Uniform Resource Identifiers,通用资源标识符)`进行编码，以便发送给浏览器。
有效的 URI 中不能包含某些字符，例如空格。而这两个 URI 编码方法就可以对 URI 进行编码，它们用特殊的 UTF-8 编码替换所有无效的字符，从而让浏览器能够接受和理解。
其中，`encodeURI()`主要用于整个 URI (例如，`http://www.wrox.com/illegal value.htm`)，而 `encodeURIComponent()`主要用于对 URI 中的某一段(例如前面 URI 中的 `illegal value.htm`)进行编码。

它们的主要区别在于：

- `encodeURI()`不会对本身属于 URI 的特殊字符进行编码，例如冒号、正斜杠、 问号和井字号；
- 而 `encodeURIComponent()`则会对它发现的任何非标准字符进行编码。

来看下面的例子。

```javascript
const uri = 'http://www.wrox.com/illegal value.htm#start';

console.log(encodeURI(uri)); // http://www.wrox.com/illegal%20value.htm#start

console.log(encodeURIComponent(uri)); // http%3A%2F%2Fwww.wrox.com%2Fillegal%20value.htm%23start
```

使用 `encodeURI()`编码后的结果是`除了空格之外`的其他字符都原封不动，只有空格被替换成了%20；
而 `encodeURIComponent()`方法则会使用对应的编码替换`所有非字母数字`字符。

这也正是可以 对整个 URI 使用 encodeURI()，而只能对附加在`现有 URI 后面的字符串`使用 encodeURIComponent() 的`原因`所在。

> 一般来说，我们使用 `encodeURIComponent()`方法的时候要 比使用 `encodeURI()` `更多`，因为在实践中`更常见`的是对`查询字符串参数`而不是对基础 URI 进行编码。

与 `encodeURI()` 和 `encodeURIComponent()` 方法对应的两个方法分别是 `decodeURI()` 和 `decodeURIComponent()`。
其中，`decodeURI()` 只能对使用 `encodeURI()` 替换的字符进行`解码`。
例如， 它可将`%20`替换成一个`空格`，但不会对 `%23` 作任何处理，因为 `%23` 表示`井字号(#)`，而井字号不是使用 `encodeURI()` 替换的。
同样地，`decodeURIComponent()` 能够解码使用 `encodeURIComponent()` 编码的所有字符，即它可以解码任何特殊字符的编码。

```javascript
const uri = 'http%3A%2F%2Fwww.wrox.com%2Fillegal%20value.htm%23start';

console.log(decodeURI(uri)); // "http%3A%2F%2Fwww.wrox.com%2Fillegal value.htm%23start"

console.log(decodeURIComponent(uri)); // "http://www.wrox.com/illegal value.htm#start"
```

这里，变量 uri 包含着一个由 `encodeURIComponent()` 编码的字符串。
在第一次调用 decodeURI() 输出的结果中，只有 `%20` 被替换成了空格。
而在第二次调用 decodeURIComponent() 输出的结果中，所有特殊字符的编码都被替换成了原来的字符，得到了一个未经转义的字符申(但这个字符申并不是一个有效的 URI)。

> URI 方法 `encodeURI()`、`encodeURIComponent()`、`decodeURI()` 和 `decodeURIComponent()` 用于替代巳经被 ECMA-262 第 3 版废弃的 `escape()` 和 `unescape()` 方法。
> URI 方法能够编码`所有 Unicode 字符`，而`原来`的方法只能正确地编码 `ASCII 字符`。
> 因此在开发实践中，特别是在产品级的代码中，一定`要使用 URI 方法`，不要使用 escape() 和 unescape() 方法。

#### 7.1.2 eval() 方法

现在，我们介绍最后一个一大概也是整个 ECMAScript 语言中最强大的一个方法：`eval()`。
`eval()` 方法就像是`一个完整的ECMAScript解析器`，它只接受`一个参数`，即要执行的`ECMAScript(或JavaScript) 字符串`。

> 看下而的例子：

```javascript
// eslint-disable-next-line no-eval
eval('console.log(\'hi\')');
```

这行代码的作用等价于下面这行代码:

```javascript
console.log('hi');
```

当`解析器`发现代码中调用 `eval()`方法时，它会将传入的参数当作`实际的 ECMAScript 语句`来解析， 然后把`执行结果`插入到`原位置`。
通过 `eval()`执行的代码被认为是包含该次调用的执行环境的一部分， 因此`被执行的代码`具有与`该执行环境``相同的作用域链`。
这意味着通过 `eval()` 执行的代码可以引用在包含环境中定义的变量。

> 举个例子：

```javascript
const msg = 'hello world';
// eslint-disable-next-line no-eval
eval('console.log(msg)'); // "hello world"
```

可见，变量 msg 是在 eval() 调用的环境之外定义的，但其中调用的 console.log() 仍然能够显示"hello world"，这是因为上面第二行代码最终被替换成了一行真正的代码。

同样地，我们也可以在 `eval()` 调用中`定义一个函数`，然后再在`该调用`的`外部代码`中`引用`这个函数：

```javascript
// eslint-disable-next-line no-eval
eval('function sayHi(){ console.log(\'hi\') };');
sayHi(); // "hi"
```

显然，函数 `sayHi()` 是在 `eval()` 内部定义的。
但由于对 `eval()` 的调用最终会`被替换`成定义函数的`实际代码`，因此可以在下一行调用 sayHi()。

> 对于变量也一样：

```javascript
// eslint-disable-next-line no-eval
eval('var msg = \'hello world\';');
console.log(msg); // "hello world"
```

在 eval() 中创建的`任何变量`或`函数`都`不会被提升`，因为在解析代码的时候，它们被包含在一个字符串中；
它们只在 eval() 执行的时候创建。

`严格模式`下，在`外部``访问不到` eval() 中创建的`任何变量或函数`，因此前面两个例子都会导致错误。

同样，在严格模式下，为 eval 赋值也会导致错误：

```javascript
'use strict';
// eval = 'hi' // Error: Uncaught SyntaxError: Unexpected eval or arguments in strict mode
```

> 能够解释代码字符串的能力非常强大，但也非常危险。
> 因此在使用 `eval()` 时必须极为谨慎，特别是在用它`执行用户输入数据`的情况下。
> 否则，可能会有`恶意用户``输入`威胁你的`站点或应用程序安全`的`代码`(即所谓的`代码注入`)。

#### 7.1.3 Global 对象的属性
