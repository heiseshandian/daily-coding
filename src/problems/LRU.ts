/*  
双向链表加hash表来实现

双向链表从头到尾严格从旧到新，最新的节点（最近访问，加入，修改的节点）永远在尾部，最旧的节点永远在头部
*/
export class LRUCache<K, V> {
  private readonly map: Map<K, LRUNode<K, V>> = new Map();
  private readonly doubleList: LRUDoubleLinkedList<K, V> =
    new LRUDoubleLinkedList();

  private readonly capacity: number;

  constructor(capacity: number) {
    if (capacity < 1) {
      throw new Error('capacity should be greater than 1');
    }
    this.capacity = capacity;
  }

  public get(key: K): V | undefined {
    if (!this.map.has(key)) {
      return;
    }

    const node = this.map.get(key) as LRUNode;
    this.doubleList.moveToTail(node);

    return node.val;
  }

  public set(key: K, value: V) {
    if (this.map.has(key)) {
      const node = this.map.get(key)!;
      node.val = value;
      this.doubleList.moveToTail(node);
    } else {
      const node = new LRUNode(key, value);

      // 超过capacity需要先删除再加
      if (this.map.size === this.capacity) {
        // 超过capacity且删除的是头部，则头部必然不为空
        const head = this.doubleList.deleteHead() as LRUNode<K, V>;
        this.map.delete(head.key);
      }

      this.map.set(key, node);
      this.doubleList.addNode(node);
    }
  }
}

class LRUNode<K = any, V = any> {
  key: K;
  val: V;

  prev: LRUNode<K, V> | null = null;
  next: LRUNode<K, V> | null = null;

  constructor(key: K, val: V) {
    this.key = key;
    this.val = val;
  }
}

// 支持添加删除一个节点，将一个节点移动到尾部
class LRUDoubleLinkedList<K, V> {
  private head: LRUNode<K, V> | null = null;
  private tail: LRUNode<K, V> | null = null;

  public addNode(node: LRUNode<K, V>) {
    if (!this.tail) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      node.prev = this.tail;

      this.tail = node;
    }
  }

  public deleteHead() {
    if (!this.head) {
      return;
    }

    // 此处需要先存下来再删除，因为删除头部之后this.head会指向新的头部
    const head = this.head;
    this.deleteNode(head);
    return head;
  }

  public deleteNode(node: LRUNode<K, V>) {
    // 只有一个节点
    if (this.head === node && this.tail === node) {
      this.head = null;
      this.tail = null;
      return;
    }

    // 删除头部
    if (this.head === node) {
      // 头尾不等必然不止一个节点
      const next = this.head.next as LRUNode;
      next.prev = null;

      this.head = next;
      return;
    }

    // 删除尾部
    if (this.tail === node) {
      const prev = this.tail.prev as LRUNode;
      prev.next = null;

      this.tail = prev;
      return;
    }

    // 删除中间节点
    const prev = node.prev as LRUNode;
    prev.next = node.next;
    node.next!.prev = prev;
  }

  public moveToTail(node: LRUNode) {
    this.deleteNode(node);
    this.addNode(node);
  }
}
