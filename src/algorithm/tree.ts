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
            // 另起一层的时候结算上一层的最大节点数
            max = Math.max(currentLevelNodes, max);
            currentLevel = currentNodeLevel;
            currentLevelNodes = 1;
        }
    }
    // 最后一层没有下一层来标识结算，所以出循环后单独结算
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

/* 给定节点如下所示，每个节点都有一个指向父节点的parent节点，要求实现函数返回任意给定节点的后继结点
所谓后继结点指的是中序遍历中处在后面的节点，比如说某棵树中序遍历的结果是 [1,2,3,4]，那么2就是1的后继节点，
3就是2的后继节点，以此类推 ，整棵树的最后一个节点没有后继节点，可以直接返回null*/
export class TreeNodeWithParent {
    val: number;
    left: TreeNodeWithParent | null = null;
    right: TreeNodeWithParent | null = null;
    parent: TreeNodeWithParent | null = null;

    constructor(val: number) {
        this.val = val;
    }
}

export function findNextNode(node: TreeNodeWithParent | null) {
    // 如果当前节点有右子树，那么右子树上最左的节点就是当前节点的后继节点
    if (node?.right) {
        let preLeft = node.right;
        let left = preLeft.left;
        while (left) {
            preLeft = left;
            left = left.left;
        }
        return preLeft;
    }

    // 如果当前节点无右子树，则向上找，若查找过程中某个节点是父节点的左节点，那么该父节点就是我们要找的后继结点
    let parent = node?.parent;
    while (parent && parent.left !== node) {
        parent = parent.parent;
    }

    return parent;
}

/* 
判断一棵树是否平衡二叉树
平衡二叉树的定义：任何节点的左子树和右子树高度差不超过1
 */
type BalancedInfo = {
    isBalanced: boolean;
    height: number;
};

export function isBalancedTree(root: TreeNode | null): BalancedInfo {
    if (!root) {
        return {
            isBalanced: true,
            height: 0,
        };
    }

    const { isBalanced: isLeftBalanced, height: leftHeight } = isBalancedTree(root.left);
    const { isBalanced: isRightBalanced, height: rightHeight } = isBalancedTree(root.right);

    const height = Math.max(leftHeight, rightHeight) + 1;
    const isBalanced = isLeftBalanced && isRightBalanced && Math.abs(leftHeight - rightHeight) < 2;

    return {
        isBalanced,
        height,
    };
}

type MaxDistanceInfo = {
    maxDistance: number;
    height: number;
};

// 假定一个节点走到另一个节点的最短路线就是这个点到另一个点的距离，求一颗树的最大距离
export function getMaxDistance(root: TreeNode | null): MaxDistanceInfo {
    if (!root) {
        return {
            maxDistance: 0,
            height: 0,
        };
    }

    const { maxDistance: leftMaxDistance, height: leftHeight } = getMaxDistance(root.left);
    const { maxDistance: rightMaxDistance, height: rightHeight } = getMaxDistance(root.right);

    const height = Math.max(leftHeight, rightHeight) + 1;
    const maxDistance = Math.max(leftMaxDistance, rightMaxDistance, leftHeight + rightHeight + 1);

    return {
        maxDistance,
        height,
    };
}

/*  
给定以下的员工结构，每个员工的直接下级存储在subEmployees中，假如现在需要举办party，
Employee中的happy表示该员工的快乐值，如果某个员工来则该员工的所有直接下级都不能来（下级的下级可以来）
问如何选择可以使得party的快乐值最大
*/
type Employee = {
    happy: number;
    subEmployees: Employee[];
};
type EmployeeInfo = {
    maxHappyWithX: number;
    maxHappyWithoutX: number;
};

export function getMaxHappy(node: Employee) {
    const { maxHappyWithX, maxHappyWithoutX } = getMaxHappyProcess(node);
    return Math.max(maxHappyWithX, maxHappyWithoutX);
}

export function getMaxHappyProcess(node: Employee): EmployeeInfo {
    if (node.subEmployees.length === 0) {
        return {
            maxHappyWithX: node.happy,
            maxHappyWithoutX: 0,
        };
    }

    let maxHappyWithX = node.happy;
    let maxHappyWithoutX = 0;
    for (const employee of node.subEmployees) {
        const { maxHappyWithoutX: childMaxHappyWithoutX, maxHappyWithX: childMaxHappyWithX } =
            getMaxHappyProcess(employee);
        maxHappyWithX += childMaxHappyWithoutX;
        maxHappyWithoutX += Math.max(childMaxHappyWithoutX, childMaxHappyWithX);
    }

    return {
        maxHappyWithoutX,
        maxHappyWithX,
    };
}

/* 
Morris，利用子树上大量的空节点来优化额外空间复杂度，实现常数级别的额外空间复杂度（正常递归实现的遍历额外空间复杂度是递归深度，也就是树的高度）

具体过程
假设cur是当前节点，一开始cur来到头结点位置
1. 若cur无左节点，则cur向右移动（cur=cur.right）
2. 若cur有左节点，找到左节点上的最右节点mostRight
    a：若mostRight的右指针为空，则让mostRight的右指针指向cur节点，然后cur向左移动
    b：若mostRight的右指针指向cur，则让mostRight的右指针指向空，然后cur向右边移动
3. cur为空时停止
*/
export function morris(node: TreeNode): TreeNode[] {
    let cur: TreeNode | null = node;
    // 当前节点左子树上的最右节点
    let mostRight: TreeNode | null;
    const result: TreeNode[] = [];

    while (cur) {
        result.push(cur);

        // 没有左节点直接向右移动
        if (!cur.left) {
            cur = cur.right;
            continue;
        }

        // 有左节点找到左节点上的最右非空节点
        mostRight = cur.left!;
        while (mostRight.right && mostRight.right !== cur) {
            mostRight = mostRight.right;
        }

        // a：若mostRight的右指针为空，则让mostRight的右指针指向cur节点，然后cur向左移动
        if (!mostRight.right) {
            mostRight.right = cur;
            cur = cur.left;
        } else {
            // b：若mostRight的右指针指向cur，则让mostRight的右指针指向空，然后cur向右边移动
            mostRight.right = null;
            cur = cur.right;
        }
    }

    return result;
}

export function morrisPre(node: TreeNode | null): TreeNode[] {
    const result: TreeNode[] = [];

    let cur: TreeNode | null = node;
    let mostRight: TreeNode;
    while (cur) {
        if (cur.left) {
            mostRight = cur.left;
            while (mostRight.right && mostRight.right !== cur) {
                mostRight = mostRight.right;
            }

            if (!mostRight.right) {
                result.push(cur);
                mostRight.right = cur;
                cur = cur.left;
            } else {
                // mostRight.right === cur
                mostRight.right = null;
                cur = cur.right;
            }
        } else {
            result.push(cur);
            cur = cur.right;
        }
    }

    return result;
}

export function morrisMid(node: TreeNode | null): TreeNode[] {
    const result: TreeNode[] = [];

    let cur: TreeNode | null = node;
    let mostRight: TreeNode;
    while (cur) {
        if (cur.left) {
            mostRight = cur.left;
            while (mostRight.right && mostRight.right !== cur) {
                mostRight = mostRight.right;
            }

            if (!mostRight.right) {
                mostRight.right = cur;
                cur = cur.left;
            } else {
                // mostRight.right === cur
                result.push(cur);
                mostRight.right = null;
                cur = cur.right;
            }
        } else {
            result.push(cur);
            cur = cur.right;
        }
    }

    return result;
}

export function morrisPost(node: TreeNode | null): TreeNode[] {
    const result: TreeNode[] = [];

    let cur: TreeNode | null = node;
    let mostRight: TreeNode;
    while (cur) {
        if (cur.left) {
            mostRight = cur.left;
            while (mostRight.right && mostRight.right !== cur) {
                mostRight = mostRight.right;
            }

            if (!mostRight.right) {
                mostRight.right = cur;
                cur = cur.left;
            } else {
                // 先设空然后再打印，不然mostRight.right会影响打印结果
                mostRight.right = null;
                // 第二次来到当前节点的时候逆序打印左子树的右边界
                result.push(...getRightEdge(cur.left));
                cur = cur.right;
            }
        } else {
            cur = cur.right;
        }
    }
    // 单独打印整棵树的右边界
    result.push(...getRightEdge(node));

    return result;
}

function getRightEdge(node: TreeNode | null): TreeNode[] {
    const result: TreeNode[] = [];

    const tail = reverseRightEdge(node);
    let cur: TreeNode | null = tail;
    while (cur) {
        result.push(cur);
        cur = cur.right;
    }
    reverseRightEdge(tail);

    return result;
}

function reverseRightEdge(node: TreeNode | null) {
    let prev = null;
    let cur: TreeNode | null = node;
    while (cur) {
        const next = cur.right;
        cur.right = prev;
        prev = cur;
        cur = next;
    }

    return prev;
}

// 搜索二叉树定义，对于任意子树而言，子树上的所有值小于根节点上的值，所有根节点的值小于右子树上的值
export function isBST(node: TreeNode | null): boolean {
    let cur: TreeNode | null = node;
    let mostRight: TreeNode;
    let previous = -Infinity;
    while (cur) {
        if (cur.left) {
            mostRight = cur.left;
            while (mostRight.right && mostRight.right !== cur) {
                mostRight = mostRight.right;
            }

            if (!mostRight.right) {
                if (previous >= cur.val) {
                    return false;
                }
                previous = cur.val;

                mostRight.right = cur;
                cur = cur.left;
            } else {
                // mostRight.right === cur
                mostRight.right = null;
                cur = cur.right;
            }
        } else {
            if (previous >= cur.val) {
                return false;
            }
            previous = cur.val;

            cur = cur.right;
        }
    }

    return true;
}

/* 
递归套路判断一棵树是否是搜索二叉树
搜索二叉树定义，对于任意子树而言 左 < 头 < 右
*/
export function isBST2(node: TreeNode): boolean {
    if (!node) {
        return true;
    }

    // 若节点不为空则processIsBST2的返回值必不为空
    return processIsBST2(node)!.isBST;
}

type BSTInfo = {
    isBST: boolean;
    min: number;
    max: number;
};

function processIsBST2(node: TreeNode | null): BSTInfo | null {
    if (node === null) {
        return null;
    }

    const leftInfo = processIsBST2(node.left);
    const rightInfo = processIsBST2(node.right);

    let min = node.val;
    let max = node.val;
    if (leftInfo) {
        min = Math.min(min, leftInfo.min);
        max = Math.max(max, leftInfo.max);
    }
    if (rightInfo) {
        min = Math.min(min, rightInfo.min);
        max = Math.max(max, rightInfo.max);
    }

    let isBST = true;
    if (leftInfo && (!leftInfo.isBST || leftInfo.max >= node.val)) {
        isBST = false;
    }
    if (rightInfo && (!rightInfo.isBST || rightInfo.min <= node.val)) {
        isBST = false;
    }

    return {
        min,
        max,
        isBST,
    };
}

// 是否满二叉树
export function isFull(node: TreeNode): boolean {
    return processIsFull(node).isFull;
}

type FullInfo = {
    isFull: boolean;
    height: number;
};

function processIsFull(node: TreeNode | null): FullInfo {
    if (!node) {
        return {
            isFull: true,
            height: 0,
        };
    }

    const leftInfo = processIsFull(node.left);
    const rightInfo = processIsFull(node.right);

    const height = Math.max(leftInfo.height, rightInfo.height) + 1;
    const isFull = leftInfo.isFull && rightInfo.isFull && leftInfo.height === rightInfo.height;

    return {
        isFull,
        height,
    };
}

/* 折纸问题，取一张纸条，对折，打开后可以看到一条凹折痕，合起来再对折，可以在第一条折痕的上下分别看到一条凹和一条凸折痕，问对折n次之后从上到下打印所有折痕 */
export function printCrease(n: number) {
    printCreaseProcess(n, 0, true);
}

// 中序方式打印折痕二叉树
function printCreaseProcess(n: number, i: number, isDown: boolean) {
    if (i > n) {
        return;
    }

    printCreaseProcess(n, i + 1, true);
    console.log(isDown ? '凹' : '凸');
    printCreaseProcess(n, i + 1, false);
}
