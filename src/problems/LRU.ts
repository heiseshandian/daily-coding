class LRUNode<K, V> {
    key: K;
    val: V;

    prev: LRUNode<K, V> | null = null;
    next: LRUNode<K, V> | null = null;

    constructor(key: K, val: V) {
        this.key = key;
        this.val = val;
    }
}

class LRUDoubleLinkedList<K, V> {
    private head: LRUNode<K, V> | null = null;
    private tail: LRUNode<K, V> | null = null;

    public addNode(node: LRUNode<K, V> | null) {
        if (node === null) {
            return;
        }

        if (!this.tail) {
            this.head = node;
            this.tail = node;
        } else {
            this.tail.next = node;
            node.prev = this.tail;
            this.tail = node;
        }
    }

    public moveToTail(node: LRUNode<K, V> | null) {
        if (node === null || node === this.tail) {
            return;
        }

        if (node === this.head) {
            this.removeHead();
            this.addNode(node);
        } else {
            // 中间的某个节点，且prev和next一定有值
            const { prev, next } = node;
            prev!.next = next;
            next!.prev = prev;
            node.prev = null;
            node.next = null;

            this.addNode(node);
        }
    }

    public removeHead() {
        if (this.head === null) {
            return null;
        }

        const result = this.head;
        if (this.head === this.tail) {
            this.head = null;
            this.tail = null;
        } else {
            // 头尾不等说明至少有两个节点，也就是说next必然有值
            const next = result.next as LRUNode<K, V>;
            next.prev = null;
            result.next = null;
            this.head = next;
        }

        return result;
    }
}

export class LRUCache<K, V> {
    private map: Map<K, LRUNode<K, V>> = new Map();
    private doubleLinkedList: LRUDoubleLinkedList<K, V> = new LRUDoubleLinkedList();
    private readonly capacity: number;

    constructor(capacity: number) {
        if (capacity < 1) {
            throw new Error('capacity should be greater than 1');
        }
        this.capacity = capacity;
    }

    public set(key: K, val: V) {
        if (this.map.has(key)) {
            const node = this.map.get(key);
            node!.val = val;
            this.doubleLinkedList.moveToTail(node as LRUNode<K, V>);
        } else {
            if (this.map.size === this.capacity) {
                this.removeLeastUsedNode();
            }

            const node = new LRUNode(key, val);
            this.doubleLinkedList.addNode(node);
            this.map.set(key, node);
        }
    }

    public get(key: K) {
        const node = this.map.get(key);
        if (!node) {
            return null;
        }

        this.doubleLinkedList.moveToTail(node);
        return node.val;
    }

    private removeLeastUsedNode() {
        const head = this.doubleLinkedList.removeHead();
        if (head) {
            this.map.delete(head.key);
        }
    }
}
