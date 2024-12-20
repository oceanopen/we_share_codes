import HashTable from '../hash-table/HashTable';
import Comparator from '../utils/comparator/Comparator';

export default class BinaryTreeNode {
  public left: null | BinaryTreeNode;
  public right: null | BinaryTreeNode;
  public parent: null | BinaryTreeNode;
  public value: any;

  public meta: HashTable;
  public nodeComparator: Comparator;

  constructor(value = null) {
    this.left = null;
    this.right = null;
    this.parent = null;
    this.value = value;

    // Any node related meta information may be stored here.
    this.meta = new HashTable();

    // This comparator is used to compare binary tree nodes with each other.
    this.nodeComparator = new Comparator();
  }

  get leftHeight() {
    if (!this.left) {
      return 0;
    }

    return this.left.height + 1;
  }

  get rightHeight() {
    if (!this.right) {
      return 0;
    }

    return this.right.height + 1;
  }

  // 获取当前节点的 height
  get height(): number {
    return Math.max(this.leftHeight, this.rightHeight);
  }

  get balanceFactor() {
    return this.leftHeight - this.rightHeight;
  }

  /**
   * Get parent's sibling if it exists.
   */
  get uncle() {
    // Check if current node has parent.
    if (!this.parent) {
      return undefined;
    }

    // Check if current node has grand-parent.
    if (!this.parent.parent) {
      return undefined;
    }

    // Check if grand-parent has two children.
    if (!this.parent.parent.left || !this.parent.parent.right) {
      return undefined;
    }

    // So for now we know that current node has grand-parent and this
    // grand-parent has two children. Let's find out who is the uncle.
    if (this.nodeComparator.equal(this.parent, this.parent.parent.left)) {
      // Right one is an uncle.
      return this.parent.parent.right;
    }

    // Left one is an uncle.
    return this.parent.parent.left;
  }

  // 设置节点的值，作为大小的比较
  setValue(value: any) {
    this.value = value;

    return this;
  }

  // 设置左子节点
  setLeft(node: null | BinaryTreeNode) {
    // Reset parent for left node since it is going to be detached.
    if (this.left) {
      this.left.parent = null;
    }

    // Attach new node to the left.
    this.left = node;

    // Make current node to be a parent for new left one.
    if (node) {
      (this.left as BinaryTreeNode).parent = this;
    }

    return this;
  }

  // 设置右子节点
  setRight(node: null | BinaryTreeNode) {
    // Reset parent for right node since it is going to be detached.
    if (this.right) {
      this.right.parent = null;
    }

    // Attach new node to the right.
    this.right = node;

    // Make current node to be a parent for new right one.
    if (node) {
      (this.right as BinaryTreeNode).parent = this;
    }

    return this;
  }

  // 删除子节点
  removeChild(nodeToRemove: null | BinaryTreeNode) {
    if (this.left && this.nodeComparator.equal(this.left, nodeToRemove)) {
      this.left = null;
      return true;
    }

    if (this.right && this.nodeComparator.equal(this.right, nodeToRemove)) {
      this.right = null;
      return true;
    }

    return false;
  }

  // 替换子节点
  replaceChild(nodeToReplace: null | BinaryTreeNode, replacementNode: null | BinaryTreeNode) {
    if (!nodeToReplace || !replacementNode) {
      return false;
    }

    if (this.left && this.nodeComparator.equal(this.left, nodeToReplace)) {
      this.left = replacementNode;
      return true;
    }

    if (this.right && this.nodeComparator.equal(this.right, nodeToReplace)) {
      this.right = replacementNode;
      return true;
    }

    return false;
  }

  // 复制节点
  static copyNode(sourceNode: BinaryTreeNode, targetNode: BinaryTreeNode) {
    targetNode.setValue(sourceNode.value);
    targetNode.setLeft(sourceNode.left);
    targetNode.setRight(sourceNode.right);
  }

  // 顺序遍历
  traverseInOrder() {
    let traverse: any[] = [];

    // Add left node.
    if (this.left) {
      traverse = traverse.concat(this.left.traverseInOrder());
    }

    // Add root.
    traverse.push(this.value);

    // Add right node.
    if (this.right) {
      traverse = traverse.concat(this.right.traverseInOrder());
    }

    return traverse;
  }

  toString() {
    return this.traverseInOrder().toString();
  }
}
