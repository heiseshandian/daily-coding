export class TreapNode<Val = any> {
    key: number;
    val: Val;
    left: TreapNode | null = null;
    right: TreapNode | null = null;

    constructor(key: number, val: Val) {
        this.key = key;
        this.val = val;
    }
}

type Comparator<T> = (a: T, b: T) => number;

export class Treap<T> {
    root: TreapNode;

    constructor(
        arr: T[],
        comparator: Comparator<T> = (a, b) => (a as number) - (b as number)
    ) {
        this.root = new TreapNode<T>(0, arr[0]);
        const stack: TreapNode[] = [this.root];

        for (let i = 1; i < arr.length; i++) {
            const newNode = new TreapNode(i, arr[i]);
            if (comparator(newNode.val, this.root.val) < 0) {
                this.root = newNode;
                stack.length = 0;
            } else {
                let leftSon: TreapNode | null = null;
                if (comparator(stack[stack.length - 1].val, newNode.val) > 0) {
                    leftSon = stack.pop()!;
                }

                newNode.left = leftSon;
                stack[stack.length - 1].right = newNode;
            }

            stack.push(newNode);
        }
    }
}
