import type { TypeCompareFun } from '../../utils/comparator/Comparator';
import Comparator from '../../utils/comparator/Comparator';
import BinaryTreeNode from '../BinaryTreeNode';

export default class BinarySearchTreeNode extends BinaryTreeNode {
  declare left: null | BinarySearchTreeNode;
  declare right: null | BinarySearchTreeNode;
  declare parent: null | BinarySearchTreeNode;

  public compareFunction: TypeCompareFun;
  public nodeValueComparator: Comparator;

  constructor(value = null, compareFunction: TypeCompareFun | undefined = undefined) {
    super(value);

    // This comparator is used to compare node values with each other.
    this.compareFunction = compareFunction as TypeCompareFun;
    this.nodeValueComparator = new Comparator(compareFunction);
  }

  // 插入项
  insert(value: any): BinarySearchTreeNode {
    if (this.nodeValueComparator.equal(this.value, null)) {
      this.value = value;

      return this;
    }

    if (this.nodeValueComparator.lessThan(value, this.value)) {
      // Insert to the left.
      if (this.left) {
        return this.left.insert(value);
      }

      const newNode = new BinarySearchTreeNode(value, this.compareFunction);
      this.setLeft(newNode);

      return newNode;
    }

    if (this.nodeValueComparator.greaterThan(value, this.value)) {
      // Insert to the right.
      if (this.right) {
        return this.right.insert(value);
      }

      const newNode = new BinarySearchTreeNode(value, this.compareFunction);
      this.setRight(newNode);

      return newNode;
    }

    return this;
  }

  // 查找项
  find(value: any): null | BinarySearchTreeNode {
    // Check the root.
    if (this.nodeValueComparator.equal(this.value, value)) {
      return this;
    }

    if (this.nodeValueComparator.lessThan(value, this.value) && this.left) {
      // Check left nodes.
      return this.left.find(value);
    }

    if (this.nodeValueComparator.greaterThan(value, this.value) && this.right) {
      // Check right nodes.
      return this.right.find(value);
    }

    return null;
  }

  // 是否包含某项
  contains(value: any) {
    return !!this.find(value);
  }

  // 删除项
  remove(value: any) {
    const nodeToRemove = this.find(value);

    if (!nodeToRemove) {
      throw new Error('Item not found in the tree');
    }

    const { parent } = nodeToRemove;

    if (!nodeToRemove.left && !nodeToRemove.right) {
      // Node is a leaf and thus has no children.
      if (parent) {
        // Node has a parent. Just remove the pointer to this node from the parent.
        parent.removeChild(nodeToRemove);
      }
      else {
        // Node has no parent. Just erase current node value.
        nodeToRemove.setValue(undefined);
      }
    }
    else if (nodeToRemove.left && nodeToRemove.right) {
      // Node has two children.
      // Find the next bigger value (minimum value in the right branch)
      // and replace current value node with that next bigger value.
      const nextBiggerNode = nodeToRemove.right.findMin();
      if (!this.nodeComparator.equal(nextBiggerNode, nodeToRemove.right)) {
        this.remove(nextBiggerNode.value);
        nodeToRemove.setValue(nextBiggerNode.value);
      }
      else {
        // In case if next right value is the next bigger one and it doesn't have left child
        // then just replace node that is going to be deleted with the right node.
        nodeToRemove.setValue(nodeToRemove.right.value);
        nodeToRemove.setRight(nodeToRemove.right.right);
      }
    }
    else {
      // Node has only one child.
      // Make this child to be a direct child of current node's parent.
      const childNode = nodeToRemove.left || nodeToRemove.right;

      if (parent) {
        parent.replaceChild(nodeToRemove, childNode);
      }
      else {
        BinaryTreeNode.copyNode(childNode as BinarySearchTreeNode, nodeToRemove);
      }
    }

    // Clear the parent of removed node.
    nodeToRemove.parent = null;

    return true;
  }

  findMin(): BinarySearchTreeNode {
    if (!this.left) {
      return this;
    }

    return this.left.findMin();
  }

  findMax(): BinarySearchTreeNode {
    if (!this.right) {
      return this;
    }

    return this.right.findMax();
  }
}
