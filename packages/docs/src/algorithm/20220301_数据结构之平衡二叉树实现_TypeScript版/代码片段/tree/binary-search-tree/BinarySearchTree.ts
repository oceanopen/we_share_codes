import type { TypeCompareFun } from '../../utils/comparator/Comparator';
import type Comparator from '../../utils/comparator/Comparator';
import BinarySearchTreeNode from './BinarySearchTreeNode';

export default class BinarySearchTree {
    public root: BinarySearchTreeNode;
    public nodeComparator: Comparator;

    constructor(nodeValueCompareFunction?: TypeCompareFun) {
        this.root = new BinarySearchTreeNode(null, nodeValueCompareFunction);

        // Steal node comparator from the root.
        this.nodeComparator = this.root.nodeComparator;
    }

    // 插入项
    insert(value: any) {
        return this.root.insert(value);
    }

    // 是否包含某项
    contains(value: any) {
        return this.root.contains(value);
    }

    // 删除项
    remove(value: any) {
        return this.root.remove(value);
    }

    toString() {
        return this.root.toString();
    }
}
