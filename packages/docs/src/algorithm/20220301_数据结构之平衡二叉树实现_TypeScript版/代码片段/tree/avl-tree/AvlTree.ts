import type BinarySearchTreeNode from '../binary-search-tree/BinarySearchTreeNode';
import BinarySearchTree from '../binary-search-tree/BinarySearchTree';

export default class AvlTree extends BinarySearchTree {
    // 插入项
    insert(value: any): BinarySearchTreeNode {
    // Do the normal BST insert.
        super.insert(value);

        // Let's move up to the root and check balance factors along the way.
        let currentNode = this.root.find(value);
        while (currentNode) {
            this.balance(currentNode);
            currentNode = currentNode.parent;
        }

        return currentNode as unknown as BinarySearchTreeNode;
    }

    // 删除项
    remove(value: any) {
        let currentNode = this.root.find(value);

        if (currentNode?.left && currentNode?.right) {
            // 左右都有子树的情况，删除仅可能会影响右子树的平衡
            currentNode = currentNode.findMax();
        }
        else if (currentNode?.left || currentNode?.right) {
            // 仅有一个子树的情况，删除可能会影响子树的平衡
            currentNode = currentNode.left || currentNode.right;
        }
        else {
            // 若为叶子节点，因为没有子树，所以仅需考虑父节点即可
            currentNode = currentNode?.parent as BinarySearchTreeNode;
        }

        // Do standard BST removal.
        const result = super.remove(value);

        // Let's move up to the root and check balance factors along the way.
        while (currentNode) {
            this.balance(currentNode);
            currentNode = currentNode.parent;
        }

        return result;
    }

    // 平衡当前节点
    balance(node: BinarySearchTreeNode) {
    // If balance factor is not OK then try to balance the node.
        if (node.balanceFactor > 1) {
            // Left rotation.
            if ((node.left?.balanceFactor as number) < 0) {
                // Left-Right rotation.
                this.rotateLeftRight(node);
            }
            else {
                // Left-Left rotation
                this.rotateLeftLeft(node);
            }
        }
        else if (node.balanceFactor < -1) {
            // Right rotation.
            if ((node.right?.balanceFactor as number) > 0) {
                // Right-Left rotation.
                this.rotateRightLeft(node);
            }
            else {
                // Right-Right rotation
                this.rotateRightRight(node);
            }
        }
    }

    // LL
    rotateLeftLeft(rootNode: BinarySearchTreeNode) {
    // Detach left node from root node.
        const leftNode = rootNode.left;
        rootNode.setLeft(null);

        // Make left node to be a child of rootNode's parent.
        if (rootNode.parent) {
            if (rootNode.parent.left === rootNode) {
                rootNode.parent.setLeft(leftNode);
            }
            else {
                rootNode.parent.setRight(leftNode);
            }
        }
        else if (rootNode === this.root) {
            // If root node is root then make left node to be a new root.
            this.root = leftNode as BinarySearchTreeNode;
        }

        // If left node has a right child then detach it and
        // attach it as a left child for rootNode.
        if (leftNode?.right) {
            rootNode.setLeft(leftNode.right);
        }

        // Attach rootNode to the right of leftNode.
        leftNode?.setRight(rootNode);
    }

    // LR
    rotateLeftRight(rootNode: BinarySearchTreeNode) {
    // Detach left node from rootNode since it is going to be replaced.
        const leftNode = rootNode.left;
        rootNode.setLeft(null);

        // Detach right node from leftNode.
        const leftRightNode = leftNode?.right;
        leftNode?.setRight(null);

        // Preserve leftRightNode's left subtree.
        if (leftRightNode?.left) {
            leftNode?.setRight(leftRightNode.left);
            leftRightNode.setLeft(null);
        }

        // Attach leftRightNode to the rootNode.
        rootNode.setLeft(leftRightNode as BinarySearchTreeNode);

        // Attach leftNode as left node for leftRight node.
        leftRightNode?.setLeft(leftNode);

        // Do left-left rotation.
        this.rotateLeftLeft(rootNode);
    }

    // RR
    rotateRightRight(rootNode: BinarySearchTreeNode) {
    // Detach right node from root node.
        const rightNode = rootNode.right;
        rootNode.setRight(null);

        // Make right node to be a child of rootNode's parent.
        if (rootNode.parent) {
            if (rootNode.parent.left === rootNode) {
                rootNode.parent.setLeft(rightNode);
            }
            else {
                rootNode.parent.setRight(rightNode);
            }
        }
        else if (rootNode === this.root) {
            // If root node is root then make right node to be a new root.
            this.root = rightNode as BinarySearchTreeNode;
        }

        // If right node has a left child then detach it and
        // attach it as a right child for rootNode.
        if (rightNode?.left) {
            rootNode.setRight(rightNode.left);
        }

        // Attach rootNode to the left of rightNode.
        rightNode?.setLeft(rootNode);
    }

    // RL
    rotateRightLeft(rootNode: BinarySearchTreeNode) {
    // Detach right node from rootNode since it is going to be replaced.
        const rightNode = rootNode.right;
        rootNode.setRight(null);

        // Detach left node from rightNode.
        const rightLeftNode = rightNode?.left;
        rightNode?.setLeft(null);

        if (rightLeftNode?.right) {
            rightNode?.setLeft(rightLeftNode.right);
            rightLeftNode.setRight(null);
        }

        // Attach rightLeftNode to the rootNode.
        rootNode.setRight(rightLeftNode as BinarySearchTreeNode);

        // Attach rightNode as right node for rightLeft node.
        rightLeftNode?.setRight(rightNode);

        // Do right-right rotation.
        this.rotateRightRight(rootNode);
    }
}
