import type { TypeCompareParam } from '../../utils/comparator/Comparator';
import type { ICallbacks } from '../../utils/sort/Sort';
import MinHeap from '../../data-structures/heap/MinHeap';
import Sort from '../../utils/sort/Sort';

export default class HeapSort extends Sort {
    constructor(originalCallbacks?: ICallbacks) {
        super(originalCallbacks);
    }

    sort(originalArray: TypeCompareParam[]) {
        const sortedArray: TypeCompareParam[] = [];
        const minHeap = new MinHeap(this.callbacks.compareCallback);

        // Insert all array elements to the heap.
        originalArray.forEach((element) => {
            // Call visiting callback.
            this.callbacks.visitingCallback?.(element);

            minHeap.add(element);
        });

        // Now we have min heap with minimal element always on top.
        // Let's poll that minimal element one by one and thus form the sorted array.
        while (!minHeap.isEmpty()) {
            const nextMinElement = minHeap.poll() as TypeCompareParam;

            // Call visiting callback.
            this.callbacks.visitingCallback?.(nextMinElement);

            sortedArray.push(nextMinElement);
        }

        return sortedArray;
    }
}
