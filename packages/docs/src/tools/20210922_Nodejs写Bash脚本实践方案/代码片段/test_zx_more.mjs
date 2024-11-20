import { promises as fs } from 'node:fs';
import process from 'node:process';
import chalk from 'chalk';

// 可以通过显式导入来使用 $ 和其他函数
import { $, cd, nothrow, question, sleep } from 'zx';

const count = Number.parseInt(await $`ls -1 | wc -l`);
console.log(`Files count: ${count}`); // Files count: 11

try {
    await $`exit 1`;
}
catch (p) {
    console.log(`Exit code: ${p.exitCode}`); // Exit code: 1
    console.log(`Error: ${p.stderr}`); // Error:
}

// pipe() 方法可用于重定向标准输出：
await $`cat file.txt`.pipe(process.stdout); // 哈哈哈%

// 更改当前工作目录
cd('./');
await $`pwd`; // outputs 等价于当前目录下执行`$ pwd`

// node-fetch 包。
const resp = await fetch('https://www.baidu.com');
if (resp.ok) {
    console.log(await resp.text());
}

// readline包
const bear = await question('What kind of bear is best? '); // What kind of bear is best? dd
console.log('bear:', bear); // dd

// 基于setTimeout 函数
await sleep(1000);
console.log(1000); // 1S

// 将 $ 的行为更改, 如果退出码不是0，不跑出异常.
await nothrow($`grep 哈哈 file.txt`); // 哈哈哈
await nothrow($`grep something from-file`); // grep: from-file: No such file or directory

console.log(chalk.blue('Hello world!'));
const content = await fs.readFile('./file.txt');
console.log(content.toString()); // 哈哈哈

// 传递环境变量
process.env.FOO = 'bar';
await $`echo $FOO`;

await $`date`; // 2021年11月22日 星期一 19时34分55秒 CST
