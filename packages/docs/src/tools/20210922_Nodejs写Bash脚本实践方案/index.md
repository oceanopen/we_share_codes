# Nodejs 写 Bash 脚本实践方案

## 1. 前言

最近在学习 `bash` 脚本语法，但是如果对 `bash` 语法不是熟手的话，感觉非常容易出错。
比如说：显示未定义的变量。
`shell` 中变量没有定义，仍然是可以使用的，但是它的结果可能不是你所预期的。举个例子：

```bash
touch 未定义变量使用.sh
```

内容如下：

```shell
#！/bin/bash

# 这里是判断变量 var 是否等于字符串 abc，但是 var 这个变量并没有声明
if [ "$var" = "abc" ]
then
   # 如果 if 判断里是 true 就在控制台打印 "not abc"
   echo  "not abc"
else
   # 如果 if 判断里是 false 就在控制台打印 "is abc"
   echo "is abc"
fi
```

授权执行权限：

```bash
chmod -R 777 ./未定义变量使用.sh
```

执行结果：

```bash
./未定义变量使用.sh
# is abc
```

结果是打印了 `is abc`, 但问题是，这个脚本应该报错啊，变量并没有赋值算是错误吧。

为了弥补这些错误，我们学会在脚本开头加入：`set -u` 这句命令的意思是脚本在头部加上它，遇到不存在的变量就会报错，并停止执行。

再次运行就会提示：

```bash
set -u ./未定义变量使用.sh
# ./未定义变量使用.sh: line 6: var: unbound variable
```

再想象一下，你本来想删除：`rm -rf $dir/*` 然后 `dir` 是空的时候，变成了什么？
`rm -rf` 是删除命令，`$dir` 是空的话，相当于执行 `rm -rf /*`，这是删除所有文件和文件夹...

如果是 `node` 或者浏览器环境，我们直接 `var === 'abc'` 肯定是会报错的，
也就是说很多 `javascript` 编程经验无法复用到 `bash` 来，如果能复用的话，该多好啊。

后来就开始探索，如果用 `node` 脚本代替 `bash` 该多好啊，然后逐渐发现一个神器, `Google` 旗下的 `zx` 库。
先不介绍这个库，我们先看看目前主流用 `node` 如何编写 `bash` 脚本，就知道为啥它是神器了。

## 2. 勉强解决方案：child_process API

例如 `child_process` 的 `API` 里面 `exec` 命令。

```js
// child_process.js

const { exec } = require('node:child_process');

exec('ls -la', (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});

console.log('async run');
```

执行结果如下：

```bash
node child_process.js
# async run
# stdout: total 16
# 17:47 .
# 21:16 ..
# 17:37 child_process.js
# 17:54 未定义变量使用.sh
```

这里需要注意的是，首先 `exec` 是 `异步` 的，但是我们 `bash` 脚本命令很多都是 `同步` 的。

> `error` 对象不同于 `stderr`.
> `error` 当 `child_process` 模块无法执行命令时，该对象不为空。例如，查找一个文件找不到该文件，则 `error` 对象不为空。
> 但是，如果命令成功运行并将消息写入标准错误流，则该 `stderr` 对象不会为空。

当然我们可以使用同步的 `exec` 命令, `execSync`:

```js
const { execSync } = require('node:child_process');

try {
    const stdout = execSync('ls -la');
    console.log(`stdout: ${stdout}`);
}
catch (err) {
    console.log(`err: ${err}`);
}

console.log('sync run');
```

执行结果如下：

```bash
node child_process_sync.js
# stdout: total 24
# 18:03 .
# 21:16 ..
# 18:01 child_process.js
# 18:04 child_process_sync.js
# 17:54 未定义变量使用.sh

# sync run
```

再简单介绍一下 `child_process` 的其它能够执行 `bash` 命令的 `api`:

- `spawn`: 启动一个子进程来执行命令
- `exec`: 启动一个子进程来执行命令，与 `spawn` 不同的是，它有一个回调函数能知道子进程的情况
- `execFile`: 启动一子进程来执行可执行文件
- `fork`: 与 `spawn` 类似，不同点是它需要指定子进程需要需执行的 javascript 文件

> `exec` 跟 `ececFile` 不同的是, `exec` 适合执行命令, `eexecFile` 适合执行文件。

## 3. node 执行 bash 脚本: 进阶方案 shelljs

环境准备：

```bash
npm install -D shelljs
```

文件内容：

```js
// shelljs.js

const shell = require('shelljs');

if (!shell.which('git')) {
    shell.echo('Sorry, this script requires git');
    shell.exit(1);
}
else {
    shell.echo('which git:', shell.which('git'));
}

// 遍历文件
shell.cd('./');
shell.ls('*.js').forEach((file) => {
    console.log('filename:', file);
});

shell.echo('run complete');
```

执行结果：

```bash
node shelljs.js
# which git: /usr/bin/git
# filename: child_process_sync.js
# filename: child_process.js
# filename: shelljs.js
# run complete
```

从上面代码上来看, `shelljs` 真的已经算是非常棒的 `nodejs` 写 `bash` 脚本的方案了。
用法详见[这里](https://www.npmjs.com/package/shelljs)。

我们接着看下本文的主角 `zx`.

## 4. zx 库使用

[官方网址](https://www.npmjs.com/package/zx)查看更多。

我们先看看怎么用：

### 4.1 全局安装

文件内容：

> 将脚本写入扩展名为 `.mjs` 的文件中，以便能够在顶层使用 `await`。

```bash
#!/usr/bin/env zx

console.log('start')

await Promise.all([$`sleep 1; echo 1`, $`sleep 2; echo 2`, $`sleep 3; echo 3`])

console.log('end')
```

执行全局命令：

```bash
npm install -g zx
```

执行结果：

```bash
chmod +x test_zx_env.mjs
./test_zx_env.mjs
# start
# $ sleep 1; echo 1
# $ sleep 2; echo 2
# $ sleep 3; echo 3
# 1
# 2
# 3
# end
```

### 4.2 局部安装

文件内容：

```mjs
console.log('start');

await Promise.all([$`sleep 1; echo 1`, $`sleep 2; echo 2`, $`sleep 3; echo 3`]);

console.log('end');
```

执行安装：

```bash
npm install -D zx
```

执行结果：

```bash
npx zx test_zx.mjs
# start
# $ sleep 1; echo 1
# $ sleep 2; echo 2
# $ sleep 3; echo 3
# 1
# 2
# 3
# end
```

### 4.3 ts 支持

文件内容：

```ts
import { $ } from 'zx';
// Or
// import 'zx/globals'

void (async function () {
    console.log('start');

    await Promise.all([$`sleep 1; echo 1`, $`sleep 2; echo 2`, $`sleep 3; echo 3`]);

    console.log('end');
})();
```

执行结果：

```bash
zx ./test_zx_ts.ts
# start
# $ sleep 1; echo 1
# $ sleep 2; echo 2
# $ sleep 3; echo 3
# 1
# 2
# 3
# end
```

> `zx` 会先把 `ts` 编译为 `mjs` 后自动执行。

或者通过 `ts-node` 执行：

```bash
npx ts-node test_zx_ts.ts
# start
# $ sleep 1; echo 1
# $ sleep 2; echo 2
# $ sleep 3; echo 3
# 1
# 2
# 3
# end
```

## 5. 参考链接

- [👏 nodejs 写 bash 脚本终极方案！](https://juejin.cn/post/6979989936137043999)
