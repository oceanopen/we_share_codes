import type { TypeCompareParam } from '../../utils/comparator/Comparator';
import type { ICallbacks } from '../../utils/sort/Sort';
import Sort from '../../utils/sort/Sort';
import { swap } from '../../utils/swap/swap';

export default class ShellSort extends Sort {
  constructor(originalCallbacks?: ICallbacks) {
    super(originalCallbacks);
  }

  sort(originalArray: TypeCompareParam[]) {
    // Prevent original array from mutations.
    const array = [...originalArray];

    // Define a gap distance.
    let gap = Math.floor(array.length / 2);

    // Until gap is bigger then zero do elements comparisons and swaps.
    while (gap > 0) {
      // Go and compare all distant element pairs.
      for (let i = 0; i < array.length - gap; i += 1) {
        let currentIndex = i;
        let gapShiftedIndex = i + gap;

        while (currentIndex >= 0) {
          // Call visiting callback.
          this.callbacks.visitingCallback?.(array[currentIndex]);

          // Compare and swap array elements if needed.
          if (this.comparator.lessThan(array[gapShiftedIndex], array[currentIndex])) {
            swap(array, gapShiftedIndex, currentIndex);
          }

          gapShiftedIndex = currentIndex;
          currentIndex -= gap;
        }
      }

      // Shrink the gap.
      gap = Math.floor(gap / 2);
    }

    // Return sorted copy of an original array.
    return array;
  }
}
