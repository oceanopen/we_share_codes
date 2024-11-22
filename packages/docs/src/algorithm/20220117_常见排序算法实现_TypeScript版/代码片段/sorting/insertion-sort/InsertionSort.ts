import type { TypeCompareParam } from '../../utils/comparator/Comparator';
import type { ICallbacks } from '../../utils/sort/Sort';
import Sort from '../../utils/sort/Sort';
import { swap } from '../../utils/swap/swap';

export default class InsertionSort extends Sort {
    constructor(originalCallbacks?: ICallbacks) {
        super(originalCallbacks);
    }

    sort(originalArray: TypeCompareParam[]) {
        const array = [...originalArray];

        // Go through all array elements...
        for (let i = 1; i < array.length; i += 1) {
            let currentIndex = i;

            // Call visiting callback.
            this.callbacks.visitingCallback?.(array[i]);

            // Check if previous element is greater than current element.
            // If so, swap the two elements.
            while (
                array[currentIndex - 1] !== undefined
                && this.comparator.lessThan(array[currentIndex], array[currentIndex - 1])
            ) {
                // Call visiting callback.
                this.callbacks.visitingCallback?.(array[currentIndex - 1]);

                // Swap the elements.
                swap(array, currentIndex, currentIndex - 1);

                // Shift current index left.
                currentIndex -= 1;
            }
        }

        return array;
    }
}
