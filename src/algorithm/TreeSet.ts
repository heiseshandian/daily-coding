type Comparator<T> = (a: T, b: T) => number;

class TreeSetNode<T> {
    public left: TreeSetNode<T> | null = null;
    public right: TreeSetNode<T> | null = null;
    public height: number = 1;

    constructor(public value: T) {}
}

export class TreeSet<T = number> {
    private root: TreeSetNode<T> | null = null;
    private comparator: Comparator<T>;

    constructor(comparator: Comparator<T>) {
        this.comparator = comparator;
    }

    public add(value: T): boolean {
        if (this.contains(value)) {
            return false; // Duplicate value
        }
        this.root = this.insert(this.root, value);
        return true;
    }

    public contains(value: T): boolean {
        return this.find(this.root, value) !== null;
    }

    public remove(value: T): boolean {
        if (!this.contains(value)) {
            return false;
        }
        this.root = this.delete(this.root, value);
        return true;
    }

    public getMin(): T | null {
        if (!this.root) {
            return null;
        }
        return this.getMinNode(this.root).value;
    }

    public getMax(): T | null {
        if (!this.root) {
            return null;
        }
        return this.getMaxNode(this.root).value;
    }

    private find(node: TreeSetNode<T> | null, value: T): TreeSetNode<T> | null {
        if (!node) {
            return null;
        }
        const cmp = this.comparator(value, node.value);
        if (cmp < 0) {
            return this.find(node.left, value);
        } else if (cmp > 0) {
            return this.find(node.right, value);
        } else {
            return node;
        }
    }

    private insert(node: TreeSetNode<T> | null, value: T): TreeSetNode<T> {
        if (!node) {
            return new TreeSetNode(value);
        }
        const cmp = this.comparator(value, node.value);
        if (cmp < 0) {
            node.left = this.insert(node.left, value);
        } else {
            node.right = this.insert(node.right, value);
        }
        return this.balance(node);
    }

    private delete(
        node: TreeSetNode<T> | null,
        value: T
    ): TreeSetNode<T> | null {
        if (!node) {
            return null;
        }
        const cmp = this.comparator(value, node.value);
        if (cmp < 0) {
            node.left = this.delete(node.left, value);
        } else if (cmp > 0) {
            node.right = this.delete(node.right, value);
        } else {
            if (!node.left) {
                return node.right;
            } else if (!node.right) {
                return node.left;
            }
            const minLargerNode = this.getMinNode(node.right);
            node.value = minLargerNode.value;
            node.right = this.delete(node.right, minLargerNode.value);
        }
        return this.balance(node);
    }

    private getMinNode(node: TreeSetNode<T>): TreeSetNode<T> {
        while (node.left) {
            node = node.left;
        }
        return node;
    }

    private getMaxNode(node: TreeSetNode<T>): TreeSetNode<T> {
        while (node.right) {
            node = node.right;
        }
        return node;
    }

    private balance(node: TreeSetNode<T>): TreeSetNode<T> {
        if (!node) {
            return node;
        }
        node.height =
            1 + Math.max(this.height(node.left), this.height(node.right));
        const balanceFactor = this.getBalanceFactor(node);

        if (balanceFactor > 1) {
            if (this.getBalanceFactor(node.left) < 0) {
                node.left = this.rotateLeft(node.left!);
            }
            return this.rotateRight(node);
        }

        if (balanceFactor < -1) {
            if (this.getBalanceFactor(node.right) > 0) {
                node.right = this.rotateRight(node.right!);
            }
            return this.rotateLeft(node);
        }

        return node;
    }

    private height(node: TreeSetNode<T> | null): number {
        return node ? node.height : 0;
    }

    private getBalanceFactor(node: TreeSetNode<T> | null): number {
        return node ? this.height(node.left) - this.height(node.right) : 0;
    }

    private rotateRight(y: TreeSetNode<T>): TreeSetNode<T> {
        const x = y.left!;
        const T2 = x.right;

        x.right = y;
        y.left = T2;

        y.height = 1 + Math.max(this.height(y.left), this.height(y.right));
        x.height = 1 + Math.max(this.height(x.left), this.height(x.right));

        return x;
    }

    private rotateLeft(x: TreeSetNode<T>): TreeSetNode<T> {
        const y = x.right!;
        const T2 = y.left;

        y.left = x;
        x.right = T2;

        x.height = 1 + Math.max(this.height(x.left), this.height(x.right));
        y.height = 1 + Math.max(this.height(y.left), this.height(y.right));

        return y;
    }
}
