#!/usr/bin/env zx

// 可以通过显式导入来使用 $ 和其他函数
import { $ } from 'zx';

console.log('start');

await Promise.all([$`sleep 1; echo 1`, $`sleep 2; echo 2`, $`sleep 3; echo 3`]);

console.log('end');
