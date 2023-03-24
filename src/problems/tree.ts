import { TreeNode } from '../algorithm/tree';
import { Queue } from '../algorithm/queue';
import { cache } from '../design-pattern/proxy';
/* 
https://leetcode.com/problems/kth-smallest-element-in-a-bst/description/

Given the root of a binary search tree, and an integer k, return 
the kth smallest value (1-indexed) of all the values of the nodes in the tree.
*/
export function kthSmallest(root: TreeNode | null, k: number): number {
    let found = -1;

    const inOrder = (node: TreeNode | null) => {
        if (!node || k === 0) {
            return;
        }
        inOrder(node.left);
        if (--k === 0) {
            found = node.val;
        }
        inOrder(node.right);
    };
    inOrder(root);

    return found;
}

/* 
题目6
如果一个节点×，它左树结构和右树结构完全一样那么我们说以X为头的树是相等树
给定一棵二叉树的头节点head 返回head整棵树上有多少棵相等子树
*/
export function countEqualTree(head: TreeNode | null): number {
    if (!head) {
        return 0;
    }

    let count = 0;
    const countEqualTreeProcess = (node: TreeNode) => {
        // 当前节点
        if (node && isEqualTree(node.left, node.right)) {
            count++;
        }

        if (node.left) {
            countEqualTreeProcess(node.left);
        }
        if (node.right) {
            countEqualTreeProcess(node.right);
        }
    };

    countEqualTreeProcess(head);

    return count;
}

function isEqualTree(node1: TreeNode | null, node2: TreeNode | null): boolean {
    if (node1 === null || node2 === null) {
        return node1 === node2;
    }

    if (node1.val !== node2.val) return false;

    return isEqualTree(node1.left, node2.right) && isEqualTree(node1.right, node2.left);
}

export function countEqualTree2(head: TreeNode | null): number {
    if (!head) {
        return 0;
    }

    return countEqualTree2Process(head).num;
}

class EqualTreeInfo {
    // 当前节点的相等子树数目
    num: number;
    // 先序方式遍历得到的序列
    preStr: string;

    constructor(num: number, preStr: string) {
        this.num = num;
        this.preStr = preStr;
    }
}

// 直接用先序遍历字符串来替代递归判断两颗子树是否相等
function countEqualTree2Process(head: TreeNode | null): EqualTreeInfo {
    if (!head) {
        return {
            num: 0,
            preStr: '#',
        };
    }

    const left = countEqualTree2Process(head.left);
    const right = countEqualTree2Process(head.right);

    const num = left.num + right.num + (left.preStr === right.preStr ? 1 : 0);
    const preStr = `${head.val},${left.preStr},${right.preStr}`;

    return {
        num,
        preStr,
    };
}

// zigzag方式打印二叉树
export function zigzagLevelOrder(head: TreeNode): number[][] {
    if (!head) {
        return [];
    }

    const queue = new Queue<TreeNode>();
    queue.add(head);

    let curEnd: TreeNode | null = head;
    let nextEnd: TreeNode | null = null;
    const curLevelValues: number[] = [];
    let shouldReverse = false;

    const result: number[][] = [];

    while (!queue.isEmpty()) {
        let cur = queue.poll() as TreeNode;
        curLevelValues.push(cur.val);

        if (cur.left) {
            queue.add(cur.left);
            nextEnd = cur.left;
        }
        if (cur.right) {
            queue.add(cur.right);
            nextEnd = cur.right;
        }

        // 当前节点是当前层最后一个节点
        if (cur === curEnd) {
            result.push(shouldReverse ? curLevelValues.slice().reverse() : curLevelValues.slice());
            shouldReverse = !shouldReverse;
            curLevelValues.length = 0;
            curEnd = nextEnd;
        }
    }

    return result;
}

/* 
You are given the root of a binary tree. We install cameras on the tree nodes where each camera 
at a node can monitor its parent, itself, and its immediate children.

Return the minimum number of cameras needed to monitor all nodes of the tree.

以x为头节点的情况分析
1) x 没有camera 但是被子节点覆盖 noCameraCovered （此情况x的父节点可不放节点，也可放节点）
2) x 没有camera也没有被子节点覆盖 uncovered （此情况x的父节点必须放相机）
3) x 有camera且被覆盖 cameraCovered （此情况x的父节点可不放节点，也可放节点）
*/
export function minCameraCover(root: TreeNode | null): number {
    const { uncovered, noCameraCovered, cameraCovered } = minCameraCoverProcess(root);

    return Math.min(uncovered + 1, noCameraCovered, cameraCovered);
}

class MinCameraInfo {
    // x节点未被覆盖
    uncovered: number;
    // x节点无camera但是被覆盖（有一个子节点放了相机）
    noCameraCovered: number;
    // x节点放置了相机
    cameraCovered: number;

    constructor(uncovered: number, noCameraCovered: number, cameraCovered: number) {
        this.uncovered = uncovered;
        this.noCameraCovered = noCameraCovered;
        this.cameraCovered = cameraCovered;
    }
}

function minCameraCoverProcess(node: TreeNode | null): MinCameraInfo {
    if (!node) {
        // 空节点天然被覆盖，uncovered已经cameraCovered都设置为无效值
        return new MinCameraInfo(Infinity, 0, Infinity);
    }

    const left = minCameraCoverProcess(node.left);
    const right = minCameraCoverProcess(node.right);

    // 父节点必须是uncovered的状态
    // 则左右子节点必不能是uncovered（x的父节点无法再让x的子节点变成covered状态）
    // cameraCovered也不可以，因为一旦子节点上有一个相机，x节点就不可能是uncovered状态
    const uncovered = left.noCameraCovered + right.noCameraCovered;

    // x下方的点都被cover，x也被cover，但是x上无相机
    const noCameraCovered = Math.min(
        // 左右节点都有相机
        left.cameraCovered + right.cameraCovered,
        // 左右节点有一个有相机
        left.noCameraCovered + right.cameraCovered,
        left.cameraCovered + right.noCameraCovered
    );

    // 左边最少相机数+右边最少相机数+当前节点放相机
    const cameraCovered =
        Math.min(left.uncovered, left.noCameraCovered, left.cameraCovered) +
        Math.min(right.uncovered, right.noCameraCovered, right.cameraCovered) +
        1;

    return new MinCameraInfo(uncovered, noCameraCovered, cameraCovered);
}

// 借助贪心策略来优化常数时间
export function minCameraCover2(root: TreeNode | null): number {
    const { status, cameras } = minCameraCoverProcess2(root);

    return status === MinCameraStatus.Uncovered ? cameras + 1 : cameras;
}

enum MinCameraStatus {
    Uncovered,
    NoCameraCovered,
    CameraCovered,
}

class MinCameraInfo2 {
    status: MinCameraStatus;
    cameras: number;

    constructor(status: MinCameraStatus, cameras: number) {
        this.status = status;
        this.cameras = cameras;
    }
}

function minCameraCoverProcess2(node: TreeNode | null): MinCameraInfo2 {
    if (!node) {
        // 空节点必然是无相机且被覆盖，没有其他可能性
        return new MinCameraInfo2(MinCameraStatus.NoCameraCovered, 0);
    }

    const left = minCameraCoverProcess2(node.left);
    const right = minCameraCoverProcess2(node.right);
    const cameras = left.cameras + right.cameras;

    // 如果子节点有一个没被覆盖则x节点必须放相机
    // 此判断条件必须放在前面，因为如果子节点中存在未被覆盖的相机则x节点必须要放相机，没有其他可能性
    if (left.status === MinCameraStatus.Uncovered || right.status === MinCameraStatus.Uncovered) {
        return new MinCameraInfo2(MinCameraStatus.CameraCovered, cameras + 1);
    }

    // 如果子节点中有一个有相机，则x节点必返回无相机但被覆盖
    if (left.status === MinCameraStatus.CameraCovered || right.status === MinCameraStatus.CameraCovered) {
        return new MinCameraInfo2(MinCameraStatus.NoCameraCovered, cameras);
    }

    // 上面两个循环都没进入说明两个子节点都是没相机但是被cover的状态，则x节点必然返回uncovered状态
    return new MinCameraInfo2(MinCameraStatus.Uncovered, cameras);
}

/* 
https://leetcode.com/problems/insufficient-nodes-in-root-to-leaf-paths/description/

Given the root of a binary tree and an integer limit, delete all insufficient nodes in the tree simultaneously, 
and return the root of the resulting binary tree.

A node is insufficient if every root to leaf path intersecting this node has a sum strictly less than limit.

A leaf is a node with no children.

Input: root = [1,2,3,4,-99,-99,7,8,9,-99,-99,12,13,-99,14], limit = 1
Output: [1,2,3,4,null,null,7,8,9,null,14]
*/
export function sufficientSubset(root: TreeNode | null, limit: number): TreeNode | null {
    const canDeleteRoot = sufficientSubsetDfs(root, 0, limit);
    if (canDeleteRoot) {
        return null;
    }

    return root;
}

function sufficientSubsetDfs(node: TreeNode | null, sum: number, limit: number): boolean {
    if (!node) {
        return true;
    }

    sum += node.val;
    // 如果当前是叶子节点就开始判断是否满足删除标准
    if (!node.left && !node.right) {
        return sum < limit;
    }

    const canDeleteLeft = sufficientSubsetDfs(node.left, sum, limit);
    const canDeleteRight = sufficientSubsetDfs(node.right, sum, limit);

    if (canDeleteLeft) {
        node.left = null;
    }
    if (canDeleteRight) {
        node.right = null;
    }

    return canDeleteLeft && canDeleteRight;
}

/* 
https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/

Given two integer arrays preorder and inorder where preorder is the preorder traversal 
of a binary tree and inorder is the inorder traversal of the same tree, construct and return the binary tree.
*/
export function buildTree(preOrder: number[], inOrder: number[]): TreeNode | null {
    const inMap: Map<number, number> = new Map();
    for (let i = 0; i < inOrder.length; i++) {
        inMap.set(inOrder[i], i);
    }

    const build = (preStart: number, preEnd: number, inStart: number, inEnd: number) => {
        if (preStart > preEnd || inStart > inEnd) {
            return null;
        }

        const root = new TreeNode(preOrder[preStart]);
        const inRoot = inMap.get(root.val)!;
        const numsLeft = inRoot - inStart;
        root.left = build(preStart + 1, preStart + numsLeft, inStart, inRoot - 1);
        root.right = build(preStart + numsLeft + 1, preEnd, inRoot + 1, inEnd);

        return root;
    };

    return build(0, preOrder.length - 1, 0, inOrder.length - 1);
}

/* 
https://leetcode.com/problems/populating-next-right-pointers-in-each-node/description/

You are given a perfect binary tree where all leaves are on the same level, and every parent has two children. The binary tree has the following definition:

struct Node {
  int val;
  Node *left;
  Node *right;
  Node *next;
}
Populate each next pointer to point to its next right node. If there is no next right node, the next pointer should be set to NULL.

Initially, all next pointers are set to NULL.
*/
class TreeNodeWithNext {
    val: number;
    left: TreeNodeWithNext | null = null;
    right: TreeNodeWithNext | null = null;
    next: TreeNodeWithNext | null = null;

    constructor(val: number) {
        this.val = val;
    }
}

export function connect(root: TreeNodeWithNext | null): TreeNodeWithNext | null {
    if (!root) {
        return root;
    }

    const queue: TreeNodeWithNext[] = [root];

    let prev: TreeNodeWithNext | null = null;
    let currentLevelCount = 0;
    let level = 0;

    const pow = cache((level: number) => 1 << level);

    while (queue.length > 0) {
        const first = queue.shift()!;
        currentLevelCount++;

        if (currentLevelCount === pow(level)) {
            // 当前节点是最左的节点
            currentLevelCount = 0;
            level++;
            first.next = prev;
            prev = null;
        } else {
            // 中间节点
            first.next = prev;
            prev = first;
        }

        if (currentLevelCount === 1) {
            // 当前节点是最右的节点
            prev = first;
        }

        if (first.right) {
            queue.push(first.right);
        }
        if (first.left) {
            queue.push(first.left);
        }
    }

    return root;
}

/* 
给定一棵二叉树的头节点head，按照如下两种标准分别实现二叉树边界节点的逆时针打印。标准一：
1.头节点为边界节点。
2.叶节点为边界节点。
3.如果节点在其所在的层中是最左的或最右的，那么该节点也是边界节点。
*/
export function printEdgeNodes(root: TreeNode | null): number[] {
    if (!root) {
        return [];
    }

    const queue: Queue<TreeNode> = new Queue();
    queue.add(root);
    let curStart: TreeNode | null = root;
    let curEnd: TreeNode | null = root;
    let nextStart: TreeNode | null = null;
    let nextEnd: TreeNode | null = null;

    const starts: number[] = [];
    const ends: number[] = [];
    while (!queue.isEmpty()) {
        const first = queue.poll()!;

        if (first === curStart || (!first.left && !first.right && first !== curEnd)) {
            starts.push(first.val);
        } else if (first === curEnd) {
            ends.unshift(first.val);
        }

        if (first.left) {
            queue.add(first.left);

            if (!nextStart) {
                nextStart = first.left;
            }
            nextEnd = first.left;
        }
        if (first.right) {
            queue.add(first.right);

            if (!nextStart) {
                nextStart = first.right;
            }
            nextEnd = first.right;
        }

        if (first === curEnd) {
            curStart = nextStart;
            curEnd = nextEnd;

            nextStart = null;
        }
    }

    return starts.concat(ends);
}

/* 
https://leetcode.com/problems/binary-tree-maximum-path-sum/

A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. 
A node can only appear in the sequence at most once. Note that the path does not need to pass through the root.

The path sum of a path is the sum of the node's values in the path.

Given the root of a binary tree, return the maximum path sum of any non-empty path.

Input: root = [-10,9,20,null,null,15,7]
Output: 42
Explanation: The optimal path is 15 -> 20 -> 7 with a path sum of 15 + 20 + 7 = 42.
*/
export function maxPathSum(root: TreeNode | null): number {
    return maxPathSumProcess(root)[0];
}

function maxPathSumProcess(node: TreeNode | null): [max: number, maxStartFromHead: number] {
    // 对于空节点需要返回-Infinity，否则当树上都是负数的时候空节点的返回值会被当成最大值，这是不对的
    // 因为路径要求最少要求一个节点
    if (!node) {
        return [-Infinity, -Infinity];
    }

    const [leftMax, leftMaxStartFromHead] = maxPathSumProcess(node.left);
    const [rightMax, rightMaxStartFromHead] = maxPathSumProcess(node.right);

    const maxStartFromHead = Math.max(node.val, node.val + leftMaxStartFromHead, node.val + rightMaxStartFromHead);
    const max = Math.max(leftMax, rightMax, maxStartFromHead, node.val + leftMaxStartFromHead + rightMaxStartFromHead);

    return [max, maxStartFromHead];
}

export function maxPathSum2(root: TreeNode | null): number {
    let max = -Infinity;

    // 只返回一个值，在递归的过程中把最大值抓取出来，比上面每次计算并返回两个值性能会好一点，也更节省内存一点
    const getMaxFromHead = (node: TreeNode | null): number => {
        if (!node) {
            return 0;
        }

        const left = Math.max(0, getMaxFromHead(node.left));
        const right = Math.max(0, getMaxFromHead(node.right));

        max = Math.max(max, node.val + left + right);
        return Math.max(node.val, node.val + left, node.val + right);
    };
    getMaxFromHead(root);

    return max;
}
