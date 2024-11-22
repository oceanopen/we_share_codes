import type { TypeCompareFun, TypeCompareParam } from '../../utils/comparator/Comparator';
import Comparator from '../../utils/comparator/Comparator';

/**
 * Parent class for Min and Max Heaps.
 */
export default class Heap {
    private heapContainer: TypeCompareParam[];
    protected compare: Comparator;

    /**
     * @constructs Heap
     */
    constructor(comparatorFunction?: TypeCompareFun) {
        if (new.target === Heap) {
            throw new TypeError('Cannot construct Heap instance directly');
        }

        // Array representation of the heap.
        this.heapContainer = [];
        this.compare = new Comparator(comparatorFunction);
    }

    /**
     * 获取左子节点下标
     */
    getLeftChildIndex(parentIndex: number) {
        return 2 * parentIndex + 1;
    }

    /**
     * 获取右子节点下标
     */
    getRightChildIndex(parentIndex: number) {
        return 2 * parentIndex + 2;
    }

    /**
     * 获取父节点下标
     */
    getParentIndex(childIndex: number) {
        return Math.floor((childIndex - 1) / 2);
    }

    /**
     * 判断是否有父节点
     */
    hasParent(childIndex: number) {
        return this.getParentIndex(childIndex) >= 0;
    }

    /**
     * 判断是否有左子节点
     */
    hasLeftChild(parentIndex: number) {
        return this.getLeftChildIndex(parentIndex) < this.heapContainer.length;
    }

    /**
     * 判断是否有右子节点
     */
    hasRightChild(parentIndex: number) {
        return this.getRightChildIndex(parentIndex) < this.heapContainer.length;
    }

    /**
     * 获取左子节点
     */
    leftChild(parentIndex: number) {
        return this.heapContainer[this.getLeftChildIndex(parentIndex)];
    }

    /**
     * 获取右子节点
     */
    rightChild(parentIndex: number) {
        return this.heapContainer[this.getRightChildIndex(parentIndex)];
    }

    /**
     * 获取父节点
     */
    parent(childIndex: number) {
        return this.heapContainer[this.getParentIndex(childIndex)];
    }

    /**
     * 根据下标交互数据
     */
    swap(indexOne: number, indexTwo: number) {
        const tmp = this.heapContainer[indexTwo];
        this.heapContainer[indexTwo] = this.heapContainer[indexOne];
        this.heapContainer[indexOne] = tmp;
    }

    /**
     * 获取根节点
     * 最小堆中对应最小值，最大堆中对应最大值
     */
    peek() {
        if (this.heapContainer.length === 0) {
            return null;
        }

        return this.heapContainer[0];
    }

    /**
     * 取出根节点
     * 最小堆中对应最小值，最大堆中对应最大值
     * 取出后，若还有节点，则将最后节点替换到当前根节点，然后进行堆树下降
     */
    poll() {
        if (this.heapContainer.length === 0) {
            return null;
        }

        if (this.heapContainer.length === 1) {
            return this.heapContainer.pop();
        }

        const item = this.heapContainer[0];

        // Move the last element from the end to the head.
        this.heapContainer[0] = this.heapContainer.pop() as TypeCompareParam;
        this.heapifyDown();

        return item;
    }

    /**
     * 增加一个堆节点
     * 增加的堆节点在最右侧，所以只需要从最右侧进行堆树上升即可
     */
    add(item: TypeCompareParam) {
        this.heapContainer.push(item);
        this.heapifyUp();
        return this;
    }

    /**
     * 删除指定的堆节点
     */
    remove(item: TypeCompareParam, comparator: Comparator = this.compare) {
    // Find number of items to remove.
        const numberOfItemsToRemove = this.find(item, comparator).length;

        for (let iteration = 0; iteration < numberOfItemsToRemove; iteration += 1) {
            // We need to find item index to remove each time after removal since
            // indices are being changed after each heapify process.
            const indexToRemove = this.find(item, comparator).pop() as number;

            // If we need to remove last child in the heap then just remove it.
            // There is no need to heapify the heap afterwards.
            if (indexToRemove === this.heapContainer.length - 1) {
                this.heapContainer.pop();
            }
            else {
                // Move last element in heap to the vacant (removed) position.
                this.heapContainer[indexToRemove] = this.heapContainer.pop() as TypeCompareParam;

                // Get parent.
                const parentItem = this.parent(indexToRemove);

                // If there is no parent or parent is in correct order with the node
                // we're going to delete then heapify down. Otherwise heapify up.
                if (
                    this.hasLeftChild(indexToRemove)
                    && (!parentItem || this.pairIsInCorrectOrder(parentItem, this.heapContainer[indexToRemove]))
                ) {
                    this.heapifyDown(indexToRemove);
                }
                else {
                    this.heapifyUp(indexToRemove);
                }
            }
        }

        return this;
    }

    /**
     * 查找堆节点，返回对应的下标索引数组
     */
    find(item: TypeCompareParam, comparator: Comparator = this.compare): number[] {
        const foundItemIndices: number[] = [];

        for (let itemIndex = 0; itemIndex < this.heapContainer.length; itemIndex += 1) {
            if (comparator.equal(item, this.heapContainer[itemIndex])) {
                foundItemIndices.push(itemIndex);
            }
        }

        return foundItemIndices;
    }

    /**
     * 判断堆是否为空
     */
    isEmpty(): boolean {
        return !this.heapContainer.length;
    }

    /**
     * 将堆数据转为字符串展示
     */
    toString() {
        return this.heapContainer.toString();
    }

    /**
     * 指定节点进行堆树上升
     */
    heapifyUp(customStartIndex?: number) {
    // Take the last element (last in array or the bottom left in a tree)
    // in the heap container and lift it up until it is in the correct
    // order with respect to its parent element.
        let currentIndex = customStartIndex || this.heapContainer.length - 1;

        while (
            this.hasParent(currentIndex)
            && !this.pairIsInCorrectOrder(this.parent(currentIndex), this.heapContainer[currentIndex])
        ) {
            this.swap(currentIndex, this.getParentIndex(currentIndex));
            currentIndex = this.getParentIndex(currentIndex);
        }
    }

    /**
     * 指定节点进行堆树下降
     */
    heapifyDown(customStartIndex = 0) {
    // Compare the parent element to its children and swap parent with the appropriate
    // child (smallest child for MinHeap, largest child for MaxHeap).
    // Do the same for next children after swap.
        let currentIndex = customStartIndex;
        let nextIndex: number | null = null;

        while (this.hasLeftChild(currentIndex)) {
            if (
                this.hasRightChild(currentIndex)
                && this.pairIsInCorrectOrder(this.rightChild(currentIndex), this.leftChild(currentIndex))
            ) {
                nextIndex = this.getRightChildIndex(currentIndex);
            }
            else {
                nextIndex = this.getLeftChildIndex(currentIndex);
            }

            if (this.pairIsInCorrectOrder(this.heapContainer[currentIndex], this.heapContainer[nextIndex])) {
                break;
            }

            this.swap(currentIndex, nextIndex);
            currentIndex = nextIndex;
        }
    }

    /**
     * Checks if pair of heap elements is in correct order.
     * For MinHeap the first element must be always smaller or equal.
     * For MaxHeap the first element must be always bigger or equal.
     */
    /* istanbul ignore next */
    pairIsInCorrectOrder(firstElement: TypeCompareParam, secondElement: TypeCompareParam): boolean {
        throw new Error(`
      You have to implement heap pair comparision method
      for ${firstElement} and ${secondElement} values.
    `);
    }
}
