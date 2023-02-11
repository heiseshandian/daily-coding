import { flipACoin } from '../common';

export class SkipSetNode<K = any> {
    key: K | null;
    nextNodes: Array<SkipSetNode<K | null> | null>;

    constructor(key: K | null, nextNodes: Array<SkipSetNode<K | null> | null>) {
        this.key = key;
        this.nextNodes = nextNodes;
    }
}

type KeyComparator<K> = (a: K, b: K) => number;

export class SkipSet<K> {
    head: SkipSetNode<K | null> = new SkipSetNode(null, [null]);

    comparator: KeyComparator<K>;

    constructor(comparator: KeyComparator<K> = (a, b) => (a as number) - (b as number)) {
        this.comparator = comparator;
    }

    public add(key: K) {
        const level = this.getCurrentLevel();
        const headLevel = this.head.nextNodes.length;
        const node = new SkipSetNode(key, new Array(level).fill(null));

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
                if (this.isSmaller(nextNode.key, node.key)) {
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

        for (let i = Math.min(level, closestMin.nextNodes.length) - 1; i >= 0; i--) {
            const prev = closestMin.nextNodes[i];
            if (prev !== node) {
                closestMin.nextNodes[i] = node;
                node.nextNodes[i] = prev;
            }
        }
    }

    private isSmaller(key1: K | null, key2: K | null): boolean {
        // 默认节点小于任何节点
        if (key1 === null) {
            return true;
        }
        if (key2 === null) {
            return false;
        }

        return this.comparator(key1, key2) < 0;
    }

    private isSmallerOrEqual(key1: K | null, key2: K | null): boolean {
        return this.isSmaller(key1, key2) || this.isEqual(key1, key2);
    }

    private isEqual(key1: K | null, key2: K | null) {
        if (key1 === null || key2 === null) {
            return key1 === key2;
        }
        return this.comparator(key1, key2) === 0;
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
            if (this.isSmaller(nextNode.key, node.key)) {
                curNode = nextNode;
            } else {
                curIndex--;
            }
        }
    }

    public has(key: K): boolean {
        return this.search(key) !== null;
    }

    public search(key: K): SkipSetNode | null {
        let curNode = this.head;
        let curIndex = this.head.nextNodes.length - 1;

        while (curNode && curIndex >= 0) {
            // 找到直接返回
            if (this.isEqual(curNode.key, key)) {
                return curNode;
            }

            const nextNode = curNode.nextNodes[curIndex];
            if (nextNode && this.isSmallerOrEqual(nextNode.key, key)) {
                curNode = nextNode;
            } else {
                curIndex--;
            }
        }

        return null;
    }

    public keys() {
        let cur: SkipSetNode | null = this.head;
        const result: K[] = [];
        while (cur) {
            result.push(cur.key);
            cur = cur.nextNodes[0];
        }

        return result;
    }

    public first() {
        return this.head.nextNodes[0]?.key;
    }

    public last() {
        let curNode = this.head;
        let curIndex = this.head.nextNodes.length - 1;

        while (curNode && curIndex >= 0) {
            const nextNode = curNode.nextNodes[curIndex];
            if (!nextNode) {
                curIndex--;
            } else {
                curNode = nextNode;
            }
        }

        return curNode.key;
    }

    public isEmpty() {
        return this.head.nextNodes[0] === null;
    }

    public print(width = 10) {
        let cur: SkipSetNode | null = this.head;
        while (cur) {
            console.log(
                `${cur.key}`.padEnd(width, ' ') + new Array(cur.nextNodes.length).fill('  -->').join('') + '\n'
            );
            cur = cur.nextNodes[0];
        }
    }
}
