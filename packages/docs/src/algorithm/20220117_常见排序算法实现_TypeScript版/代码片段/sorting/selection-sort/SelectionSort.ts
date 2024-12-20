import type { TypeCompareParam } from '../../utils/comparator/Comparator';
import type { ICallbacks } from '../../utils/sort/Sort';
import Sort from '../../utils/sort/Sort';
import { swap } from '../../utils/swap/swap';

export default class SelectionSort extends Sort {
  constructor(originalCallbacks?: ICallbacks) {
    super(originalCallbacks);
  }

  sort(originalArray: TypeCompareParam[]) {
    // Clone original array to prevent its modification.
    const array = [...originalArray];

    for (let i = 0; i < array.length - 1; i += 1) {
      let minIndex = i;

      // Call visiting callback.
      this.callbacks.visitingCallback?.(array[i]);

      // Find minimum element in the rest of array.
      for (let j = i + 1; j < array.length; j += 1) {
        // Call visiting callback.
        this.callbacks.visitingCallback?.(array[j]);

        if (this.comparator.lessThan(array[j], array[minIndex])) {
          minIndex = j;
        }
      }

      // If new minimum element has been found then swap it with current i-th element.
      if (minIndex !== i) {
        swap(array, i, minIndex);
      }
    }

    return array;
  }
}
