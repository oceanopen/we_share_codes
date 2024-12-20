import type { TypeCompareParam } from '../utils/comparator/Comparator';
import MinHeap from '../heap/MinHeap';
import Comparator from '../utils/comparator/Comparator';

// It is the same as min heap except that when comparing two elements
// we take into account its priority instead of the element's value.
export default class PriorityQueue extends MinHeap {
  private priorities: Map<any, number>;

  constructor() {
    // Call MinHeap constructor first.
    super();

    // Setup priorities map.
    this.priorities = new Map();

    // Use custom comparator for heap elements that will take element priority
    // instead of element value into account.
    this.compare = new Comparator(this.comparePriority.bind(this));
  }

  /**
   * Add item to the priority queue.
   * @param item - item we're going to add to the queue.
   * @param priority - items priority.
   */
  add(item: TypeCompareParam, priority = 0) {
    this.priorities.set(item, priority);
    super.add(item);
    return this;
  }

  /**
   * Remove item from priority queue.
   * @param item - item we're going to remove.
   * @param customFindingComparator - custom function for finding the item to remove
   */
  remove(item: TypeCompareParam, customFindingComparator?: Comparator) {
    super.remove(item, customFindingComparator);
    this.priorities.delete(item);
    return this;
  }

  /**
   * Change priority of the item in a queue.
   * @param item - item we're going to re-prioritize.
   * @param priority - new item's priority.
   */
  changePriority(item: TypeCompareParam, priority: number) {
    this.remove(item, new Comparator(this.compareValue));
    this.add(item, priority);
    return this;
  }

  /**
   * Find item by ite value.
   */
  findByValue(item: TypeCompareParam) {
    return this.find(item, new Comparator(this.compareValue));
  }

  /**
   * Check if item already exists in a queue.
   */
  hasValue(item: TypeCompareParam) {
    return this.findByValue(item).length > 0;
  }

  /**
   * Compares priorities of two items.
   */
  comparePriority(a: TypeCompareParam, b: TypeCompareParam) {
    if (this.priorities.get(a) === this.priorities.get(b)) {
      return 0;
    }
    return (this.priorities.get(a) as number) < (this.priorities.get(b) as number) ? -1 : 1;
  }

  /**
   * Compares values of two items.
   */
  compareValue(a: TypeCompareParam, b: TypeCompareParam) {
    if (a === b) {
      return 0;
    }
    return a < b ? -1 : 1;
  }
}
