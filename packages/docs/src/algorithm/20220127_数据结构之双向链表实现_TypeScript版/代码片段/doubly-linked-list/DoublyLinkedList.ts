import type { TypeCompareFun } from '../utils/comparator/Comparator';
import Comparator from '../utils/comparator/Comparator';
import DoublyLinkedListNode from './DoublyLinkedListNode';

export default class DoublyLinkedList {
    public head: null | DoublyLinkedListNode;
    public tail: null | DoublyLinkedListNode;
    public compare: Comparator;

    constructor(comparatorFunction?: TypeCompareFun) {
        this.head = null;

        this.tail = null;

        this.compare = new Comparator(comparatorFunction);
    }

    // 头部插入
    prepend(value: any) {
    // Make new node to be a head.
        const newNode = new DoublyLinkedListNode(value, this.head);

        // If there is head, then it won't be head anymore.
        // Therefore, make its previous reference to be new node (new head).
        // Then mark the new node as head.
        if (this.head) {
            this.head.previous = newNode;
        }
        this.head = newNode;

        // If there is no tail yet let's make new node a tail.
        if (!this.tail) {
            this.tail = newNode;
        }

        return this;
    }

    // 尾部插入
    append(value: any) {
        const newNode = new DoublyLinkedListNode(value);

        // If there is no head yet let's make new node a head.
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;

            return this;
        }

        // Attach new node to the end of linked list.
        (this.tail as DoublyLinkedListNode).next = newNode;

        // Attach current tail to the new node's previous reference.
        newNode.previous = this.tail;

        // Set new node to be the tail of linked list.
        this.tail = newNode;

        return this;
    }

    // 删除节点
    delete(value: any) {
        if (!this.head) {
            return null;
        }

        let deletedNode: DoublyLinkedListNode | null = null;
        let currentNode: DoublyLinkedListNode | null = this.head;

        while (currentNode) {
            if (this.compare.equal(currentNode.value, value)) {
                deletedNode = currentNode;

                if (deletedNode === this.head) {
                    // If HEAD is going to be deleted...

                    // Set head to second node, which will become new head.
                    this.head = deletedNode.next;

                    // Set new head's previous to null.
                    if (this.head) {
                        this.head.previous = null;
                    }

                    // If all the nodes in list has same value that is passed as argument
                    // then all nodes will get deleted, therefore tail needs to be updated.
                    if (deletedNode === this.tail) {
                        this.tail = null;
                    }
                }
                else if (deletedNode === this.tail) {
                    // If TAIL is going to be deleted...

                    // Set tail to second last node, which will become new tail.
                    this.tail = deletedNode.previous;
                    (this.tail as DoublyLinkedListNode).next = null;
                }
                else {
                    // If MIDDLE node is going to be deleted...
                    const previousNode = deletedNode.previous;
                    const nextNode = deletedNode.next as DoublyLinkedListNode;

                    previousNode.next = nextNode;
                    nextNode.previous = previousNode;
                }
            }

            currentNode = currentNode.next;
        }

        return deletedNode;
    }

    // 查找节点
    find({ value = undefined, callback = undefined }: {
        value?: any;
        callback?: (value: any) => any;
    }) {
        if (!this.head) {
            return null;
        }

        let currentNode: DoublyLinkedListNode | null = this.head;

        while (currentNode) {
            // If callback is specified then try to find node by callback.
            if (callback && callback(currentNode.value)) {
                return currentNode;
            }

            // If value is specified then try to compare by value..
            if (value !== undefined && this.compare.equal(currentNode.value, value)) {
                return currentNode;
            }

            currentNode = currentNode.next;
        }

        return null;
    }

    // 删除尾部节点
    deleteTail() {
        if (!this.tail) {
            // No tail to delete.
            return null;
        }

        if (this.head === this.tail) {
            // There is only one node in linked list.
            const deletedTail = this.tail;
            this.head = null;
            this.tail = null;

            return deletedTail;
        }

        // If there are many nodes in linked list...
        const deletedTail = this.tail;

        this.tail = this.tail.previous as DoublyLinkedListNode;
        this.tail.next = null;

        return deletedTail;
    }

    // 删除头部节点
    deleteHead() {
        if (!this.head) {
            return null;
        }

        const deletedHead = this.head;

        if (this.head.next) {
            this.head = this.head.next;
            this.head.previous = null;
        }
        else {
            this.head = null;
            this.tail = null;
        }

        return deletedHead;
    }

    // 转为数组
    toArray() {
        const nodes: DoublyLinkedListNode[] = [];

        let currentNode = this.head;
        while (currentNode) {
            nodes.push(currentNode);
            currentNode = currentNode.next;
        }

        return nodes;
    }

    // 根据数组初始化双向链表
    fromArray(values: any[]) {
        values.forEach(value => this.append(value));

        return this;
    }

    // 转为字符串展示
    toString(callback?: (value: any) => void) {
        return this.toArray()
            .map(node => node.toString(callback))
            .toString();
    }

    // 双向链表反转
    reverse() {
        let currNode = this.head;
        let prevNode: DoublyLinkedListNode | null = null;
        let nextNode: DoublyLinkedListNode | null = null;

        while (currNode) {
            // Store next node.
            nextNode = currNode.next;
            prevNode = currNode.previous;

            // Change next node of the current node so it would link to previous node.
            currNode.next = prevNode;
            currNode.previous = nextNode;

            // Move prevNode and currNode nodes one step forward.
            prevNode = currNode;
            currNode = nextNode;
        }

        // Reset head and tail.
        this.tail = this.head;
        this.head = prevNode;

        return this;
    }
}
