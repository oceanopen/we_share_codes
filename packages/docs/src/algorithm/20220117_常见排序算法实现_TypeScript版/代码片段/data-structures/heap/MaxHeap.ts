import type { TypeCompareParam } from '../../utils/comparator/Comparator';
import Heap from './Heap';

export default class MaxHeap extends Heap {
  /**
   * Checks if pair of heap elements is in correct order.
   * For MinHeap the first element must be always smaller or equal.
   * For MaxHeap the first element must be always bigger or equal.
   */
  pairIsInCorrectOrder(firstElement: TypeCompareParam, secondElement: TypeCompareParam) {
    return this.compare.greaterThanOrEqual(firstElement, secondElement);
  }
}
