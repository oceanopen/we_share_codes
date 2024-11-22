import HashTable from '../hash-table/HashTable';

export default class TrieNode {
    public character: string;
    public isCompleteWord: boolean;
    private children: HashTable;

    constructor(character: string, isCompleteWord = false) {
        this.character = character;
        this.isCompleteWord = isCompleteWord;
        this.children = new HashTable();
    }

    // 获取孩子节点
    getChild(character: string) {
        return this.children.get(character);
    }

    // 增加孩子节点，返回增加的节点
    addChild(character: string, isCompleteWord = false): TrieNode {
        if (!this.children.has(character)) {
            this.children.set(character, new TrieNode(character, isCompleteWord));
        }

        const childNode = this.children.get(character);

        // In cases similar to adding "car" after "carpet" we need to mark "r" character as complete.
        childNode.isCompleteWord = childNode.isCompleteWord || isCompleteWord;

        return childNode;
    }

    // 删除孩子节点
    removeChild(character: string) {
        const childNode = this.getChild(character);

        // Delete childNode only if:
        // - childNode has NO children,
        // - childNode.isCompleteWord === false.
        if (childNode && !childNode.isCompleteWord && !childNode.hasChildren()) {
            this.children.delete(character);
        }

        return this;
    }

    // 是否有指定孩子节点
    hasChild(character: string) {
        return this.children.has(character);
    }

    /**
     * Check whether current TrieNode has children or not.
     */
    hasChildren() {
        return this.children.getKeys().length !== 0;
    }

    // 展示孩子节点
    suggestChildren() {
        return [...this.children.getKeys()];
    }

    toString() {
        let childrenAsString = this.suggestChildren().toString();
        childrenAsString = childrenAsString ? `:${childrenAsString}` : '';
        const isCompleteString = this.isCompleteWord ? '*' : '';

        return `${this.character}${isCompleteString}${childrenAsString}`;
    }
}
