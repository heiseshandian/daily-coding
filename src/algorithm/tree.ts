import { Stack } from './stack';
import { Queue } from './queue';

export class TreeNode {
    val: number;
    left: TreeNode | null = null;
    right: TreeNode | null = null;

    constructor(val: number) {
        this.val = val;
    }
}

export function preVisitNode(root: TreeNode | null) {
    if (!root) {
        return [];
    }

    const result: TreeNode[] = [];
    const stack = new Stack<TreeNode>();
    stack.push(root);

    while (!stack.isEmpty()) {
        const node = stack.pop();
        result.push(node);
        if (node.right) {
            stack.push(node.right);
        }
        if (node.left) {
            stack.push(node.left);
        }
    }

    return result;
}

export function preVisitNode2(root: TreeNode | null) {
    if (!root) {
        return [];
    }

    const result: TreeNode[] = [];
    recursivePreVisitNode2(root, result);
    return result;
}

function recursivePreVisitNode2(node: TreeNode | null, result: TreeNode[]) {
    if (!node) {
        return;
    }

    result.push(node);
    recursivePreVisitNode2(node.left, result);
    recursivePreVisitNode2(node.right, result);
}

export function postVisitNode(root: TreeNode | null) {
    if (!root) {
        return [];
    }

    const result: TreeNode[] = [];
    const stack = new Stack<TreeNode>();
    stack.push(root);

    while (!stack.isEmpty()) {
        const node = stack.pop();
        result.push(node);
        if (node.left) {
            stack.push(node.left);
        }
        if (node.right) {
            stack.push(node.right);
        }
    }

    return result.reverse();
}

export function postVisitNode2(root: TreeNode | null) {
    if (!root) {
        return [];
    }

    const result: TreeNode[] = [];
    recursivePostVisitNode2(root, result);
    return result;
}

function recursivePostVisitNode2(node: TreeNode | null, result: TreeNode[]) {
    if (!node) {
        return;
    }

    recursivePostVisitNode2(node.left, result);
    recursivePostVisitNode2(node.right, result);
    result.push(node);
}

export function middleVisitNode(root: TreeNode | null) {
    if (!root) {
        return [];
    }

    const stack = new Stack<TreeNode>();
    const result: TreeNode[] = [];
    let node: TreeNode | null = root;

    while (!stack.isEmpty() || node !== null) {
        if (node !== null) {
            stack.push(node);
            node = node.left;
        } else {
            node = stack.pop();
            result.push(node);
            node = node.right;
        }
    }

    return result;
}

export function middleVisitNode2(root: TreeNode | null) {
    if (!root) {
        return [];
    }

    const result: TreeNode[] = [];
    recursiveMiddleVisitNode2(root, result);
    return result;
}

function recursiveMiddleVisitNode2(node: TreeNode | null, result: TreeNode[]) {
    if (!node) {
        return;
    }

    recursiveMiddleVisitNode2(node.left, result);
    result.push(node);
    recursiveMiddleVisitNode2(node.right, result);
}

export function visitTreeByLevel(root: TreeNode | null) {
    if (!root) {
        return [];
    }

    const result: TreeNode[] = [];
    const queue = new Queue<TreeNode>();
    queue.add(root);
    while (!queue.isEmpty()) {
        const node = queue.poll() as TreeNode;
        result.push(node);

        if (node.left) {
            queue.add(node.left);
        }
        if (node.right) {
            queue.add(node.right);
        }
    }

    return result;
}

export function getMaxWidth(root: TreeNode | null) {
    if (!root) {
        return 0;
    }

    const levelMap: Map<TreeNode, number> = new Map();
    levelMap.set(root, 1);
    let currentLevel = 1;
    let currentLevelNodes = 0;
    let max = 0;

    const queue = new Queue<TreeNode>();
    queue.add(root);

    while (!queue.isEmpty()) {
        const node = queue.poll() as TreeNode;
        const currentNodeLevel = levelMap.get(node) as number;

        if (node.left) {
            levelMap.set(node.left, currentNodeLevel + 1);
            queue.add(node.left);
        }
        if (node.right) {
            levelMap.set(node.right, currentNodeLevel + 1);
            queue.add(node.right);
        }

        if (currentLevel === currentNodeLevel) {
            currentLevelNodes++;
        } else {
            max = Math.max(currentLevelNodes, max);
            currentLevel = currentNodeLevel;
            currentLevelNodes = 1;
        }
    }
    max = Math.max(currentLevelNodes, max);

    return max;
}

export function getMaxWidthNoMap(root: TreeNode | null) {
    if (!root) {
        return 0;
    }

    const queue = new Queue<TreeNode>();
    queue.add(root);

    let curEnd: TreeNode | null = root;
    let nextEnd: TreeNode | null = null;
    let currentLevelNodes = 0;
    let max = 0;

    while (!queue.isEmpty()) {
        const node = queue.poll() as TreeNode;

        if (node.left) {
            queue.add(node.left);
            nextEnd = node.left;
        }
        if (node.right) {
            queue.add(node.right);
            nextEnd = node.right;
        }
        currentLevelNodes++;

        if (node === curEnd) {
            max = Math.max(max, currentLevelNodes);

            curEnd = nextEnd;
            currentLevelNodes = 0;
        }
    }

    return max;
}

export function preSerialize(root: TreeNode | null) {
    const queue = new Queue<number | null>();
    recursivePreSerialize(root, queue);
    return queue;
}

function recursivePreSerialize(node: TreeNode | null, queue: Queue<number | null>) {
    if (!node) {
        queue.add(null);
        return;
    }

    queue.add(node.val);
    recursivePreSerialize(node.left, queue);
    recursivePreSerialize(node.right, queue);
}

export function preBuildNode(queue: Queue<number | null>): TreeNode | null {
    if (!queue || queue.isEmpty()) {
        return null;
    }

    return recursivePreBuildNode(queue);
}

function recursivePreBuildNode(queue: Queue<number | null>) {
    const val = queue.poll() as number;
    if (val === null) {
        return null;
    }

    const head: TreeNode = new TreeNode(val);
    head.left = recursivePreBuildNode(queue);
    head.right = recursivePreBuildNode(queue);

    return head;
}
