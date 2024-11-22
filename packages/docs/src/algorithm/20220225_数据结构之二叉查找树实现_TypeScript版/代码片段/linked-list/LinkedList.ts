import type { TypeCompareFun } from '../utils/comparator/Comparator';
import Comparator from '../utils/comparator/Comparator';
import LinkedListNode from './LinkedListNode';

export default class LinkedList {
    public head: null | LinkedListNode;
    public tail: null | LinkedListNode;
    public compare: Comparator;

    constructor(comparatorFunction?: TypeCompareFun) {
        this.head = null;

        this.tail = null;

        this.compare = new Comparator(comparatorFunction);
    }

    // 头部插入
    prepend(value: any) {
    // Make new node to be a head.
        const newNode = new LinkedListNode(value, this.head);
        this.head = newNode;

        // If there is no tail yet let's make new node a tail.
        if (!this.tail) {
            this.tail = newNode;
        }

        return this;
    }

    // 尾部插入
    append(value: any) {
        const newNode = new LinkedListNode(value);

        // If there is no head yet let's make new node a head.
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;

            return this;
        }

        // Attach new node to the end of linked list.
        (this.tail as LinkedListNode).next = newNode;
        this.tail = newNode;

        return this;
    }

    // 删除节点
    delete(value: any) {
        if (!this.head) {
            return null;
        }

        let deletedNode: LinkedListNode | null = null;

        // If the head must be deleted then make next node that is different
        // from the head to be a new head.
        while (this.head && this.compare.equal(this.head.value, value)) {
            deletedNode = this.head;
            this.head = this.head.next;
        }

        let currentNode = this.head;

        if (currentNode !== null) {
            // If next node must be deleted then make next node to be a next next one.
            while (currentNode.next) {
                if (this.compare.equal(currentNode.next.value, value)) {
                    deletedNode = currentNode.next;
                    currentNode.next = currentNode.next.next;
                }
                else {
                    currentNode = currentNode.next;
                }
            }
        }

        // Check if tail must be deleted.
        if (this.compare.equal(this.tail?.value, value)) {
            this.tail = currentNode;
        }

        return deletedNode;
    }

    // 查找节点
    find({ value = undefined, callback = undefined }: {
        value?: any;
        callback?: any;
    }) {
        if (!this.head) {
            return null;
        }

        let currentNode: LinkedListNode | null = this.head;

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
        const deletedTail = this.tail;

        if (this.head === this.tail) {
            // There is only one node in linked list.
            this.head = null;
            this.tail = null;

            return deletedTail;
        }

        // If there are many nodes in linked list...

        // Rewind to the last node and delete "next" link for the node before the last one.
        let currentNode = this.head;
        while (currentNode && currentNode.next) {
            if (!currentNode.next.next) {
                currentNode.next = null;
            }
            else {
                currentNode = currentNode.next;
            }
        }

        this.tail = currentNode;

        return deletedTail;
    }

    // 删除头部节点
    deleteHead() {
    // 无节点
        if (!this.head) {
            return null;
        }

        const deletedHead = this.head;

        // 多于一个节点
        if (this.head.next) {
            this.head = this.head.next;
        }
        else {
            // 仅有一个节点
            this.head = null;
            this.tail = null;
        }

        return deletedHead;
    }

    // 根据数组初始化链表
    fromArray(values: any[]) {
        values.forEach(value => this.append(value));

        return this;
    }

    // 转为节点数组
    toArray() {
        const nodes: LinkedListNode[] = [];

        let currentNode = this.head;
        while (currentNode) {
            nodes.push(currentNode);
            currentNode = currentNode.next;
        }

        return nodes;
    }

    // 转为字符串展示
    toString(callback?: (value: any) => any) {
        return this.toArray()
            .map(node => node.toString(callback))
            .toString();
    }

    // 链表反转
    reverse() {
        let currNode = this.head;
        let prevNode: LinkedListNode | null = null;
        let nextNode: LinkedListNode | null = null;

        while (currNode) {
            // Store next node.
            nextNode = currNode.next;

            // Change next node of the current node so it would link to previous node.
            currNode.next = prevNode;

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
