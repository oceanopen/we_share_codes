import type { TypeCompareParam } from '../comparator/Comparator';

// 通过解构运算符进行数据交换
// 本项目中采用此方式
export function swap(arr: TypeCompareParam[], i: number, j: number) {
  ;[arr[j], arr[i]] = [arr[i], arr[j]];
}

// 根据数组下标进行数据交换
// 此方式为传统实现方式
export function swap2(arr: TypeCompareParam[], i: number, j: number) {
  if (i === j) {
    return;
  }
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

/**
 * 用异或运算符实现交换
 *
 * 因为是二进制操作，所以仅支持数字交换，这里用二进制表示其值
 * 如：A: 4(100), B: 2(010)，那么：
 * 第一次：A = A(100) ^ B(010) = 001
 * 第二次：B = A(001) ^ B(010) = 100
 * 第三次：A = A(001) ^ B(100) = 010
 *
 * 注意：此方法要求 i !== j，因为没有中间变量保存值，会导致如果是相同索引的话，信息会丢失
 */
export function swap3(arr: number[], i: number, j: number) {
  if (i === j) {
    return;
  }
  arr[i] = arr[i] ^ arr[j];
  arr[j] = arr[i] ^ arr[j];
  arr[i] = arr[i] ^ arr[j];
}
