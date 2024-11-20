#!/usr/bin/env zx

// 将脚本写入扩展名为 .mjs 的文件中，以便能够在顶层使用 await。
// 可以通过显式导入来使用 $ 和其他函数
// import { $ } from 'zx';

console.log('start');

// eslint-disable-next-line no-undef
await Promise.all([$`sleep 1; echo 1`, $`sleep 2; echo 2`, $`sleep 3; echo 3`]);

console.log('end');
