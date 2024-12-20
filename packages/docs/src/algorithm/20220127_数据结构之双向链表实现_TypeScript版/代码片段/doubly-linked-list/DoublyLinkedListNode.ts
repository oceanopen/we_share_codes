export default class DoublyLinkedListNode {
  public value: any;
  public next: null | DoublyLinkedListNode;
  public previous: any | DoublyLinkedListNode;

  constructor(value: any, next: any = null, previous: any = null) {
    this.value = value;
    this.next = next;
    this.previous = previous;
  }

  toString(callback?: (value: any) => any) {
    return callback ? callback(this.value) : `${this.value}`;
  }
}
