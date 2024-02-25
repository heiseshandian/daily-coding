export class UnionSetNode<T = any> {
    val: T;
    constructor(val: T) {
        this.val = val;
    }
}

export class UnionSet<T = any> {
    nodes: Map<T, UnionSetNode<T>> = new Map();
    parents: Map<UnionSetNode<T>, UnionSetNode<T>> = new Map();
    sizeMap: Map<UnionSetNode<T>, number> = new Map();

    constructor(values: T[] = []) {
        values.forEach((val) => {
            this.addNode(val);
        });
    }

    public addNode(value: T) {
        const node = new UnionSetNode<T>(value);
        this.nodes.set(value, node);
        this.parents.set(node, node);
        this.sizeMap.set(node, 1);
    }

    public isSameSet(a: T, b: T) {
        const nodeA = this.nodes.get(a);
        const nodeB = this.nodes.get(b);

        if (!nodeA || !nodeB) {
            return false;
        }
        return this.#findParent(nodeA) === this.#findParent(nodeB);
    }

    public union(a: T, b: T) {
        const nodeA = this.nodes.get(a);
        const nodeB = this.nodes.get(b);
        if (!nodeA || !nodeB) {
            return;
        }

        const parentA = this.#findParent(nodeA);
        const parentB = this.#findParent(nodeB);
        if (parentA === parentB) {
            return;
        }

        const sizeA = this.sizeMap.get(parentA) as number;
        const sizeB = this.sizeMap.get(parentB) as number;
        const largeSet = sizeA >= sizeB ? parentA : parentB;
        const smallSet = largeSet === parentA ? parentB : parentA;

        this.parents.set(smallSet, largeSet);
        this.sizeMap.set(largeSet, sizeA + sizeB);
        this.sizeMap.delete(smallSet);
    }

    #findParent(node: UnionSetNode<T>) {
        let cur = node;
        const visitedNodes: UnionSetNode<T>[] = [];
        while (cur !== this.parents.get(cur)) {
            cur = this.parents.get(cur)!;
            visitedNodes.push(cur);
        }

        visitedNodes.forEach((visitedNode) => {
            this.parents.set(visitedNode, cur);
        });
        return cur;
    }
}
