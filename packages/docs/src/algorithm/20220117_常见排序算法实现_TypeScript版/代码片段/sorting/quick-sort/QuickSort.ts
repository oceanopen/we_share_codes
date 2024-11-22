import type { TypeCompareParam } from '../../utils/comparator/Comparator';
import type { ICallbacks } from '../../utils/sort/Sort';
import Sort from '../../utils/sort/Sort';

export default class QuickSort extends Sort {
    constructor(originalCallbacks?: ICallbacks) {
        super(originalCallbacks);
    }

    sort(originalArray: TypeCompareParam[]) {
    // Clone original array to prevent it from modification.
        const array = [...originalArray];

        // If array has less than or equal to one elements then it is already sorted.
        if (array.length <= 1) {
            return array;
        }

        // Init left and right arrays.
        const leftArray: TypeCompareParam[] = [];
        const rightArray: TypeCompareParam[] = [];

        // Take the first element of array as a pivot.
        const pivotElement = array.shift() as TypeCompareParam;
        const centerArray = [pivotElement];

        // Split all array elements between left, center and right arrays.
        while (array.length) {
            const currentElement = array.shift() as TypeCompareParam;

            // Call visiting callback.
            this.callbacks.visitingCallback?.(currentElement);

            if (this.comparator.equal(currentElement, pivotElement)) {
                centerArray.push(currentElement);
            }
            else if (this.comparator.lessThan(currentElement, pivotElement)) {
                leftArray.push(currentElement);
            }
            else {
                rightArray.push(currentElement);
            }
        }

        // Sort left and right arrays.
        const leftArraySorted = this.sort(leftArray);
        const rightArraySorted = this.sort(rightArray);

        // Let's now join sorted left array with center array and with sorted right array.
        return leftArraySorted.concat(centerArray, rightArraySorted);
    }
}
