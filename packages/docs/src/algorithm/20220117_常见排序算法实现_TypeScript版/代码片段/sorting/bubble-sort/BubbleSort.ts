import type { TypeCompareParam } from '../../utils/comparator/Comparator';
import type { ICallbacks } from '../../utils/sort/Sort';
import Sort from '../../utils/sort/Sort';
import { swap } from '../../utils/swap/swap';

export default class BubbleSort extends Sort {
  constructor(originalCallbacks?: ICallbacks) {
    super(originalCallbacks);
  }

  sort(originalArray: TypeCompareParam[]) {
    // Flag that holds info about whether the swap has occur or not.
    let swapped = false;
    // Clone original array to prevent its modification.
    const array = [...originalArray];

    for (let i = 1; i < array.length; i += 1) {
      swapped = false;

      // Call visiting callback.
      this.callbacks.visitingCallback?.(array[i]);

      for (let j = 0; j < array.length - i; j += 1) {
        // Call visiting callback.
        this.callbacks.visitingCallback?.(array[j]);

        // Swap elements if they are in wrong order.
        if (this.comparator.lessThan(array[j + 1], array[j])) {
          swap(array, j, j + 1);

          // Register the swap.
          swapped = true;
        }
      }

      // If there were no swaps then array is already sorted and there is no need to proceed.
      if (!swapped) {
        return array;
      }
    }

    return array;
  }
}
