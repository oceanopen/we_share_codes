import type { TypeCompareParam } from '../../utils/comparator/Comparator';
import type { ICallbacks } from '../../utils/sort/Sort';
import Sort from '../../utils/sort/Sort';

// Using charCode (a = 97, b = 98, etc), we can map characters to buckets from 0 - 25
const BASE_CHAR_CODE = 97;
const NUMBER_OF_POSSIBLE_DIGITS = 10;
const ENGLISH_ALPHABET_LENGTH = 26;

export default class RadixSort extends Sort {
  constructor(originalCallbacks?: ICallbacks) {
    super(originalCallbacks);
  }

  sort(originalArray: TypeCompareParam[]) {
    // Assumes all elements of array are of the same type
    const isArrayOfNumbers = this.isArrayOfNumbers(originalArray);

    let sortedArray = [...originalArray];
    const numPasses = this.determineNumPasses(sortedArray);

    for (let currentIndex = 0; currentIndex < numPasses; currentIndex += 1) {
      const buckets = isArrayOfNumbers
        ? this.placeElementsInNumberBuckets(sortedArray as number[], currentIndex)
        : this.placeElementsInCharacterBuckets(sortedArray as string[], currentIndex, numPasses);

      // Flatten buckets into sortedArray, and repeat at next index
      sortedArray = buckets.reduce((acc, val) => {
        return [...acc, ...val] as number[] | string[];
      }, []);
    }

    return sortedArray;
  }

  placeElementsInNumberBuckets(array: number[], index: number) {
    // See below. These are used to determine which digit to use for bucket allocation
    const modded = 10 ** (index + 1);
    const divided = 10 ** index;
    const buckets = this.createBuckets(NUMBER_OF_POSSIBLE_DIGITS) as number[][];

    array.forEach((element) => {
      this.callbacks.visitingCallback?.(element);
      if (element < divided) {
        buckets[0].push(element);
      }
      else {
        /**
         * Say we have element of 1,052 and are currently on index 1 (starting from 0). This means
         * we want to use '5' as the bucket. `modded` would be 10 ** (1 + 1), which
         * is 100. So we take 1,052 % 100 (52) and divide it by 10 (5.2) and floor it (5).
         */
        const currentDigit = Math.floor((element % modded) / divided);
        buckets[currentDigit].push(element);
      }
    });

    return buckets;
  }

  placeElementsInCharacterBuckets(array: string[], index: number, numPasses: number) {
    const buckets = this.createBuckets(ENGLISH_ALPHABET_LENGTH) as string[][];

    array.forEach((element) => {
      this.callbacks.visitingCallback?.(element);
      const currentBucket = this.getCharCodeOfElementAtIndex(element, index, numPasses);
      buckets[currentBucket].push(element);
    });

    return buckets;
  }

  getCharCodeOfElementAtIndex(element: string, index: number, numPasses: number) {
    // Place element in last bucket if not ready to organize
    if (numPasses - index > element.length) {
      return 0;
    }

    /**
     * iterate backwards through element
     */
    const charPos = numPasses - index - 1;

    return element.toLowerCase().charCodeAt(charPos) - BASE_CHAR_CODE;
  }

  /**
   * Number of passes is determined by the length of the longest element in the array.
   * For integers, this log10(num), and for strings, this would be the length of the string.
   */
  determineNumPasses(array: TypeCompareParam[]) {
    return this.getLengthOfLongestElement(array);
  }

  getLengthOfLongestElement(array: TypeCompareParam[]) {
    if (this.isArrayOfNumbers(array)) {
      return Math.floor(Math.log10(Math.max(...(array as number[])))) + 1;
    }

    return (array as string[]).reduce((acc, val) => {
      return val.length > acc ? val.length : acc;
    }, -Infinity);
  }

  isArrayOfNumbers(array: TypeCompareParam[]) {
    // Assumes all elements of array are of the same type
    return this.isNumber(array[0]);
  }

  createBuckets(numBuckets: number): number[][] | string[][] {
    /**
     * Mapping buckets to an array instead of filling them with
     * an array prevents each bucket from containing a reference to the same array
     */
    return Array.from({ length: numBuckets }, () => []);
  }

  isNumber(element: TypeCompareParam) {
    return Number.isInteger(element);
  }
}
