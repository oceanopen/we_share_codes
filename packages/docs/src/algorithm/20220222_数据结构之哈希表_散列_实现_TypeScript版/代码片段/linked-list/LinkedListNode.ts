export default class LinkedListNode {
    public value: any;
    public next: null | LinkedListNode;

    constructor(value: any, next: any = null) {
        this.value = value;
        this.next = next;
    }

    toString(callback?: (value: any) => any) {
        return callback ? callback(this.value) : `${this.value}`;
    }
}
