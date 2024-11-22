import type { ICallbacks } from '../../utils/sort/Sort';
import Sort from '../../utils/sort/Sort';

// 仅支持数字元素排序，因为要计算最大元素和最小元素的差值作为键的种类
type TCompareParam = number;

export default class CountingSort extends Sort {
    constructor(originalCallbacks?: ICallbacks) {
        super(originalCallbacks);
    }

    sort(
        originalArray: TCompareParam[],
        smallestElement: TCompareParam = undefined as unknown as TCompareParam,
        biggestElement: TCompareParam = undefined as unknown as TCompareParam,
    ) {
        // Init biggest and smallest elements in array in order to build number bucket array later.
        let detectedSmallestElement = smallestElement || 0;
        let detectedBiggestElement = biggestElement || 0;

        if (smallestElement === undefined || biggestElement === undefined) {
            originalArray.forEach((element) => {
                // Visit element.
                this.callbacks.visitingCallback?.(element);

                // Detect biggest element.
                if (this.comparator.greaterThan(element, detectedBiggestElement)) {
                    detectedBiggestElement = element;
                }

                // Detect smallest element.
                if (this.comparator.lessThan(element, detectedSmallestElement)) {
                    detectedSmallestElement = element;
                }
            });
        }

        // Init buckets array.
        // This array will hold frequency of each number from originalArray.
        const buckets = Array.from({ length: detectedBiggestElement - detectedSmallestElement + 1 }, () => 0);

        originalArray.forEach((element) => {
            // Visit element.
            this.callbacks.visitingCallback?.(element);

            buckets[element - detectedSmallestElement] += 1;
        });

        // Add previous frequencies to the current one for each number in bucket
        // to detect how many numbers less then current one should be standing to
        // the left of current one.
        for (let bucketIndex = 1; bucketIndex < buckets.length; bucketIndex += 1) {
            buckets[bucketIndex] += buckets[bucketIndex - 1];
        }

        // Now let's shift frequencies to the right so that they show correct numbers.
        // I.e. if we won't shift right than the value of buckets[5] will display how many
        // elements less than 5 should be placed to the left of 5 in sorted array
        // INCLUDING 5th. After shifting though this number will not include 5th anymore.
        buckets.pop();
        buckets.unshift(0);

        // Now let's assemble sorted array.
        const sortedArray = Array.from({ length: originalArray.length }).fill(null);
        for (let elementIndex = 0; elementIndex < originalArray.length; elementIndex += 1) {
            // Get the element that we want to put into correct sorted position.
            const element = originalArray[elementIndex];

            // Visit element.
            this.callbacks.visitingCallback?.(element);

            // Get correct position of this element in sorted array.
            const elementSortedPosition = buckets[element - detectedSmallestElement];

            // Put element into correct position in sorted array.
            sortedArray[elementSortedPosition] = element;

            // Increase position of current element in the bucket for future correct placements.
            buckets[element - detectedSmallestElement] += 1;
        }

        // Return sorted array.
        return sortedArray;
    }
}
