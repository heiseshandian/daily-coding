import { flipACoin } from '../common';

class SkipNode<K = any, V = any> {
  key: K | null;
  val: V | null;
  nextNodes: Array<SkipNode | null>;

  constructor(key: K | null, val: V | null, nextNodes: Array<SkipNode | null>) {
    this.key = key;
    this.val = val;
    this.nextNodes = nextNodes;
  }
}

type KeyComparator<K> = (a: K, b: K) => number;

export class SkipList<K, V> {
  head: SkipNode<null, null> = new SkipNode(null, null, [null]);

  comparator: KeyComparator<K | null>;

  constructor(
    comparator: KeyComparator<K | null> = (a, b) =>
      (a as number) - (b as number)
  ) {
    this.comparator = comparator;
  }

  public add(key: K, val: V | null = null) {
    const level = this.getCurrentLevel();
    const headLevel = this.head.nextNodes.length;
    const node = new SkipNode(key, val, new Array(level).fill(null));

    if (headLevel < level) {
      // head的高层节点指向node
      this.head.nextNodes.push(...new Array(level - headLevel).fill(node));
    }

    // 从head开始找到小于等于node最近的节点
    let curNode = this.head;
    let curIndex = headLevel - 1;
    let closestMin = this.head;

    while (curNode && curIndex >= 0) {
      const nextNode = curNode.nextNodes[curIndex];
      if (nextNode) {
        // 找到一个更好的结果，直接更新closestMin，然后从nextNode的curIndex继续往后找
        if (this.isSmallerThan(nextNode.key, node.key)) {
          closestMin = nextNode;
          curNode = nextNode;
        } else {
          curIndex--;
        }
      } else {
        // 如果当前层数大于node的层数什么也不做
        if (curIndex + 1 <= level) {
          curNode.nextNodes[curIndex] = node;
        }
        curIndex--;
      }
    }

    for (
      let i = Math.min(level, closestMin.nextNodes.length) - 1;
      i >= 0;
      i--
    ) {
      const prev = closestMin.nextNodes[i];
      if (prev !== node) {
        closestMin.nextNodes[i] = node;
        node.nextNodes[i] = prev;
      }
    }
  }

  private isSmallerThan(key1: K | null, key2: K | null): boolean {
    // 默认节点小于任何节点
    if (key1 === null) {
      return true;
    }
    if (key2 === null) {
      return false;
    }

    return this.comparator(key1, key2) < 0;
  }

  private isSmallerOrEqualTo(key1: K | null, key2: K | null): boolean {
    return this.isSmallerThan(key1, key2) || this.comparator(key1, key2) === 0;
  }

  private getCurrentLevel(): number {
    let count = 1;
    while (flipACoin()) {
      count++;
    }

    return count;
  }

  public delete(key: K) {
    const node = this.search(key);
    if (!node) {
      return;
    }

    let curNode = this.head;
    let curIndex = node.nextNodes.length - 1;
    while (curNode && curIndex >= 0) {
      const nextNode = curNode.nextNodes[curIndex];
      // 找到直接前后环境重连，下一层继续循环
      if (nextNode === node) {
        curNode.nextNodes[curIndex] = node.nextNodes[curIndex];
        curIndex--;
        continue;
      }

      // 为空直接不管，下一层继续
      if (!nextNode) {
        curIndex--;
        continue;
      }

      // 后续节点小于当前节点，直接往后走
      if (this.comparator(nextNode.key, node.key) < 0) {
        curNode = nextNode;
      } else {
        curIndex--;
      }
    }
  }

  public set(key: K, val: V) {
    const node = this.search(key);

    if (!node) {
      this.add(key, val);
    } else {
      node.val = val;
    }
  }

  public has(key: K): boolean {
    return this.search(key) !== null;
  }

  public search(key: K): SkipNode | null {
    let curNode = this.head;
    let curIndex = this.head.nextNodes.length - 1;

    while (curNode && curIndex >= 0) {
      // 找到直接返回
      if (this.comparator(curNode.key, key) === 0) {
        return curNode;
      }

      const nextNode = curNode.nextNodes[curIndex];
      if (nextNode && this.isSmallerOrEqualTo(nextNode.key, key)) {
        curNode = nextNode;
      } else {
        curIndex--;
      }
    }

    return null;
  }

  public keys() {
    let cur: SkipNode | null = this.head;
    const result: K[] = [];
    while (cur) {
      result.push(cur.key);
      cur = cur.nextNodes[0];
    }

    return result;
  }

  public print(width = 10) {
    let cur: SkipNode | null = this.head;
    while (cur) {
      console.log(
        `${cur.key}:${cur.val}`.padEnd(width, ' ') +
          new Array(cur.nextNodes.length).fill('  -->').join('') +
          '\n'
      );
      cur = cur.nextNodes[0];
    }
  }
}
