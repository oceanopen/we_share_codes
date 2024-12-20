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
