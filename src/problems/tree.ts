import { Queue } from '../algorithm/queue';
import {
    TreeNode,
    deserializeByLevel,
    getMaxDistance,
} from '../algorithm/tree';
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

    return (
        isEqualTree(node1.left, node2.right) &&
        isEqualTree(node1.right, node2.left)
    );
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
            result.push(
                shouldReverse
                    ? curLevelValues.slice().reverse()
                    : curLevelValues.slice()
            );
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
    const { uncovered, noCameraCovered, cameraCovered } =
        minCameraCoverProcess(root);

    return Math.min(uncovered + 1, noCameraCovered, cameraCovered);
}

class MinCameraInfo {
    // x节点未被覆盖
    uncovered: number;
    // x节点无camera但是被覆盖（有一个子节点放了相机）
    noCameraCovered: number;
    // x节点放置了相机
    cameraCovered: number;

    constructor(
        uncovered: number,
        noCameraCovered: number,
        cameraCovered: number
    ) {
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
    if (
        left.status === MinCameraStatus.Uncovered ||
        right.status === MinCameraStatus.Uncovered
    ) {
        return new MinCameraInfo2(MinCameraStatus.CameraCovered, cameras + 1);
    }

    // 如果子节点中有一个有相机，则x节点必返回无相机但被覆盖
    if (
        left.status === MinCameraStatus.CameraCovered ||
        right.status === MinCameraStatus.CameraCovered
    ) {
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
export function sufficientSubset(
    root: TreeNode | null,
    limit: number
): TreeNode | null {
    const canDeleteRoot = sufficientSubsetDfs(root, 0, limit);
    if (canDeleteRoot) {
        return null;
    }

    return root;
}

function sufficientSubsetDfs(
    node: TreeNode | null,
    sum: number,
    limit: number
): boolean {
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

Constraints:

1 <= preorder.length <= 3000
inorder.length == preorder.length
-3000 <= preorder[i], inorder[i] <= 3000
preorder and inorder consist of unique values.
Each value of inorder also appears in preorder.
preorder is guaranteed to be the preorder traversal of the tree.
inorder is guaranteed to be the inorder traversal of the tree.
*/
export function buildTree(
    preOrder: number[],
    inOrder: number[]
): TreeNode | null {
    const inMap: Map<number, number> = new Map();
    for (let i = 0; i < inOrder.length; i++) {
        inMap.set(inOrder[i], i);
    }

    const build = (
        preStart: number,
        preEnd: number,
        inStart: number,
        inEnd: number
    ) => {
        if (preStart > preEnd || inStart > inEnd) {
            return null;
        }

        const root = new TreeNode(preOrder[preStart]);
        const inRoot = inMap.get(root.val)!;
        const numsLeft = inRoot - inStart;
        root.left = build(
            preStart + 1,
            preStart + numsLeft,
            inStart,
            inRoot - 1
        );
        root.right = build(preStart + numsLeft + 1, preEnd, inRoot + 1, inEnd);

        return root;
    };

    return build(0, preOrder.length - 1, 0, inOrder.length - 1);
}

/* 
https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/

Given two integer arrays inorder and postorder where inorder is the inorder traversal of a binary tree 
and postorder is the postorder traversal of the same tree, construct and return the binary tree.

Constraints:

1 <= inorder.length <= 3000
postorder.length == inorder.length
-3000 <= inorder[i], postorder[i] <= 3000
inorder and postorder consist of unique values.
Each value of postorder also appears in inorder.
inorder is guaranteed to be the inorder traversal of the tree.
postorder is guaranteed to be the postorder traversal of the tree.
*/
export function buildTree2(
    inorder: number[],
    postorder: number[]
): TreeNode | null {
    const inMap: Record<number, number> = {};
    for (let i = 0; i < inorder.length; i++) {
        inMap[inorder[i]] = i;
    }

    const build = (
        inStart: number,
        inEnd: number,
        postStart: number,
        postEnd: number
    ) => {
        if (inStart > inEnd || postStart > postEnd) {
            return null;
        }

        const root = new TreeNode(postorder[postEnd]);
        const inRoot = inMap[postorder[postEnd]];
        const leftCount = inRoot - inStart;
        root.left = build(
            inStart,
            inRoot - 1,
            postStart,
            postStart + leftCount - 1
        );
        root.right = build(
            inRoot + 1,
            inEnd,
            postStart + leftCount,
            postEnd - 1
        );

        return root;
    };

    return build(0, inorder.length - 1, 0, postorder.length - 1);
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

export function connect(
    root: TreeNodeWithNext | null
): TreeNodeWithNext | null {
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

        if (
            first === curStart ||
            (!first.left && !first.right && first !== curEnd)
        ) {
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

function maxPathSumProcess(
    node: TreeNode | null
): [max: number, maxStartFromHead: number] {
    // 对于空节点需要返回-Infinity，否则当树上都是负数的时候空节点的返回值会被当成最大值，这是不对的
    // 因为路径要求最少要求一个节点
    if (!node) {
        return [-Infinity, -Infinity];
    }

    const [leftMax, leftMaxStartFromHead] = maxPathSumProcess(node.left);
    const [rightMax, rightMaxStartFromHead] = maxPathSumProcess(node.right);

    const maxStartFromHead = Math.max(
        node.val,
        node.val + leftMaxStartFromHead,
        node.val + rightMaxStartFromHead
    );
    const max = Math.max(
        leftMax,
        rightMax,
        maxStartFromHead,
        node.val + leftMaxStartFromHead + rightMaxStartFromHead
    );

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

/* 
https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/description/

Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.

According to the definition of LCA on Wikipedia: “The lowest common ancestor is defined between two 
nodes p and q as the lowest node in T that has both p and q as descendants (where we allow a node to be a descendant of itself).”

Input: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
Output: 3
*/
export function lowestCommonAncestor(
    root: TreeNode | null,
    p: TreeNode | null,
    q: TreeNode | null
): TreeNode | null {
    if (p === null || q === null) {
        return p || q;
    }
    if (root === null) {
        return null;
    }

    const pParents: TreeNode[] = [];
    const qParents: TreeNode[] = [];

    const post = (
        node: TreeNode | null
    ): [foundP: boolean, foundQ: boolean] => {
        if (!node) {
            return [false, false];
        }

        const [foundPL, foundQL] = post(node.left);
        const [foundPR, foundQR] = post(node.right);

        if (foundPL || foundPR) {
            pParents.push(node);
        }
        if (foundQL || foundQR) {
            qParents.push(node);
        }

        const foundP = node === p;
        const foundQ = node === q;
        return [foundP || foundPL || foundPR, foundQ || foundQL || foundQR];
    };
    post(root);

    const shortParents =
        pParents.length < qParents.length ? pParents : qParents;
    const shortParentsSet = new Set(shortParents);
    const longParents = shortParents === pParents ? qParents : pParents;
    let i = 0;
    while (i < longParents.length) {
        if (
            shortParentsSet.has(longParents[i]) ||
            longParents[i] === p ||
            longParents[i] === q
        ) {
            return longParents[i];
        }
        i++;
    }
    return null;
}

export function lowestCommonAncestor2(
    root: TreeNode | null,
    p: TreeNode | null,
    q: TreeNode | null
): TreeNode | null {
    if (!root || root === p || root === q) {
        return root;
    }

    const l = lowestCommonAncestor2(root.left, p, q);
    const r = lowestCommonAncestor2(root.right, p, q);
    if (l && r) {
        return root;
    }
    return l || r;
}

/* 
https://leetcode.com/problems/house-robber-iii/description/
The thief has found himself a new place for his thievery again. There is only one entrance to this area, called root.

Besides the root, each house has one and only one parent house. After a tour, the smart thief realized that all houses 
in this place form a binary tree. It will automatically contact the police if two directly-linked houses were broken into on the same night.

Given the root of the binary tree, return the maximum amount of money the thief can rob without alerting the police.

二叉树的递归套路
*/
export function rob(root: TreeNode | null): number {
    const dfs = (
        node: TreeNode | null
    ): [maxWithSelf: number, maxWithoutSelf: number] => {
        if (!node) {
            return [0, 0];
        }

        const [leftMaxWithSelf, leftMaxWithoutSelf] = dfs(node.left);
        const [rightMaxWithSelf, rightMaxWithoutSelf] = dfs(node.right);

        const withoutSelf =
            Math.max(leftMaxWithSelf, leftMaxWithoutSelf) +
            Math.max(rightMaxWithSelf, rightMaxWithoutSelf);
        const withSelf = leftMaxWithoutSelf + rightMaxWithoutSelf + node.val;

        return [withSelf, withoutSelf];
    };

    return Math.max(...dfs(root));
}

/* 
https://leetcode.com/problems/flatten-binary-tree-to-linked-list/description/

Given the root of a binary tree, flatten the tree into a "linked list":

The "linked list" should use the same TreeNode class where the right child pointer points to the 
next node in the list and the left child pointer is always null.

The "linked list" should be in the same order as a pre-order traversal of the binary tree.
*/
export function flatten(root: TreeNode | null): void {
    if (!root) {
        return;
    }

    const nodes: TreeNode[] = [];
    const pre = (node: TreeNode | null) => {
        if (!node) {
            return;
        }

        nodes.push(node);
        pre(node.left);
        pre(node.right);
    };
    pre(root);

    nodes.reduce((prev, cur) => {
        prev.right = cur;
        prev.left = null;

        return cur;
    });
}

export function flatten2(root: TreeNode | null): void {
    if (!root) {
        return;
    }

    let prev: TreeNode | null = null;

    // 右左头 反过来就是先序遍历，秒啊
    function dfs(node: TreeNode | null): void {
        if (!node) return;
        dfs(node.right);
        dfs(node.left);
        node.left = null;
        node.right = prev;
        prev = node;
    }

    dfs(root);
}

/*
https://leetcode.com/problems/recover-binary-search-tree/description/ 

You are given the root of a binary search tree (BST), where the values of exactly two nodes 
of the tree were swapped by mistake. Recover the tree without changing its structure.

额外空间复杂度O(n)
*/
export function recoverTree(root: TreeNode | null): void {
    // 先中序遍历拿到所有的节点
    const nodes: TreeNode[] = [];

    const middleTraverse = (node: TreeNode | null) => {
        if (!node) {
            return;
        }

        middleTraverse(node.left);
        nodes.push(node);
        middleTraverse(node.right);
    };
    middleTraverse(root);

    // 如果是相邻两个节点交换则只有一个逆序对，如果是非相邻的两个节点交换则有两个逆序对
    const pairs: TreeNode[] = [];
    for (let i = 0; i < nodes.length - 1; i++) {
        if (nodes[i].val > nodes[i + 1].val) {
            pairs.push(nodes[i]);
            pairs.push(nodes[i + 1]);
        }
    }

    const swap = (nodeA: TreeNode, nodeB: TreeNode) => {
        const tmp = nodeA.val;
        nodeA.val = nodeB.val;
        nodeB.val = tmp;
    };

    if (pairs.length === 2) {
        swap(pairs[0], pairs[1]);
    } else {
        swap(pairs[0], pairs[3]);
    }
}

// 额外空间复杂度O(log(n))
export function recoverTree2(root: TreeNode | null): void {
    let first: TreeNode | null = null;
    let second: TreeNode | null = null;
    let prev = new TreeNode(-Infinity);

    const traverse = (node: TreeNode | null) => {
        if (!node) {
            return;
        }
        traverse(node.left);

        if (prev.val > node.val) {
            if (!first) {
                first = prev;
            }
            second = node;
        }
        prev = node;

        traverse(node.right);
    };
    traverse(root);

    const tmp = first!.val;
    first!.val = second!.val;
    second!.val = tmp;
}

// 采用Morris遍历优化空间复杂度
export function recoverTree3(root: TreeNode | null): void {
    let first: TreeNode | null = null;
    let second: TreeNode | null = null;
    let prev = new TreeNode(-Infinity);

    const update = (node: TreeNode) => {
        if (prev.val > node.val) {
            if (!first) {
                first = prev;
            }
            second = node;
        }
        prev = node;
    };

    let cur: TreeNode | null = root;
    // 当前节点左子树上的最右节点
    let mostRight: TreeNode;
    while (cur) {
        // 没有左节点直接往右
        if (!cur.left) {
            update(cur);
            cur = cur.right;
            continue;
        }

        // 有左节点就找到左节点上的最右节点
        mostRight = cur.left;
        while (mostRight.right && mostRight.right !== cur) {
            mostRight = mostRight.right;
        }

        if (!mostRight.right) {
            // 第一次到达头结点
            mostRight.right = cur;
            cur = cur.left;
        } else {
            // 第二次到达头结点
            mostRight.right = null;
            update(cur);
            cur = cur.right;
        }
    }

    const tmp = first!.val;
    first!.val = second!.val;
    second!.val = tmp;
}

/* 
https://leetcode.com/problems/balanced-binary-tree/

Given a binary tree, determine if it is height-balanced

二叉树的递归套路，向左子树要信息，向右子树要信息，进而组合出当前节点的信息并向上返回
*/
export function isBalanced(root: TreeNode | null): boolean {
    const dfs = (
        node: TreeNode | null
    ): [height: number, balanced: boolean] => {
        if (!node) {
            return [0, true];
        }

        const [leftHeight, leftBalanced] = dfs(node.left);
        const [rightHeight, rightBalanced] = dfs(node.right);

        return [
            Math.max(leftHeight, rightHeight) + 1,
            leftBalanced &&
                rightBalanced &&
                Math.abs(leftHeight - rightHeight) <= 1,
        ];
    };

    return dfs(root)[1];
}

export function isBalanced2(root: TreeNode | null): boolean {
    let balanced = true;

    const dfs = (node: TreeNode | null): number => {
        if (!balanced || !node) {
            return 0;
        }

        const l = dfs(node.left);
        const r = dfs(node.right);
        if (Math.abs(l - r) > 1) {
            balanced = false;
        }

        return Math.max(l, r) + 1;
    };
    dfs(root);

    return balanced;
}

/* 
https://leetcode.com/problems/minimum-depth-of-binary-tree/description/

Given a binary tree, find its minimum depth.

The minimum depth is the number of nodes along the shortest path from the root node down to the nearest leaf node.

Note: A leaf is a node with no children.
*/
export function minDepth(root: TreeNode | null): number {
    if (!root) {
        return 0;
    }

    let min = Infinity;
    const backtracking = (node: TreeNode, depth: number) => {
        if (!node.left && !node.right) {
            min = Math.min(min, depth);
            return;
        }
        if (node.left) {
            backtracking(node.left, depth + 1);
        }
        if (node.right) {
            backtracking(node.right, depth + 1);
        }
    };
    backtracking(root, 1);

    return min;
}

/*
https://leetcode.com/problems/leaf-similar-trees/description/?envType=daily-question&envId=2024-02-11
872. Leaf-Similar Trees
Consider all the leaves of a binary tree, from left to right order, the values of those leaves form a leaf value sequence.

For example, in the given tree above, the leaf value sequence is (6, 7, 4, 9, 8).

Two binary trees are considered leaf-similar if their leaf value sequence is the same.

Return true if and only if the two given trees with head nodes root1 and root2 are leaf-similar.

Example 1:

Input: root1 = [3,5,1,6,2,9,8,null,null,7,4], root2 = [3,5,1,6,7,4,2,null,null,null,null,null,null,9,8]
Output: true

Example 2:

Input: root1 = [1,2,3], root2 = [1,3,2]
Output: false

Constraints:

	The number of nodes in each tree will be in the range [1, 200].
	Both of the given trees will have values in the range [0, 200].
*/
export function leafSimilar(
    root1: TreeNode | null,
    root2: TreeNode | null
): boolean {
    if (!root1 || !root2) {
        return root1 === root2;
    }

    const getLeafValueSequence = (
        node: TreeNode | null | undefined
    ): number[] => {
        if (!node) {
            return [];
        }

        const left = getLeafValueSequence(node.left);
        const right = getLeafValueSequence(node.right);

        if (!node.left && !node.right) {
            return [node.val].concat(left).concat(right);
        }
        return ([] as number[]).concat(left).concat(right);
    };

    const s1 = getLeafValueSequence(root1);
    const s2 = getLeafValueSequence(root2);
    if (s1.length !== s2.length) {
        return false;
    }

    for (let i = 0; i < s1.length; i++) {
        if (s1[i] !== s2[i]) {
            return false;
        }
    }
    return true;
}

/*
https://leetcode.com/problems/same-tree/description/
100. Same Tree
Given the roots of two binary trees p and q, write a function to check if they are the same or not.

Two binary trees are considered the same if they are structurally identical, and the nodes have the same value.

Example 1:

Input: p = [1,2,3], q = [1,2,3]
Output: true

Example 2:

Input: p = [1,2], q = [1,null,2]
Output: false

Example 3:

Input: p = [1,2,1], q = [1,1,2]
Output: false

Constraints:

	The number of nodes in both trees is in the range [0, 100].
	-10^4 <= Node.val <= 10^4
*/
export function isSameTree(
    p: TreeNode | null | undefined,
    q: TreeNode | null | undefined
): boolean {
    if (!p) {
        return !q;
    }

    return (
        p?.val === q?.val &&
        isSameTree(p?.left, q?.left) &&
        isSameTree(p?.right, q?.right)
    );
}

/*
https://leetcode.com/problems/diameter-of-binary-tree/description/?envType=daily-question&envId=2024-02-27
543. Diameter of Binary Tree
Given the root of a binary tree, return the length of the diameter of the tree.

The diameter of a binary tree is the length of the longest path between any two nodes in a tree. This path may or may not pass through the root.

The length of a path between two nodes is represented by the number of edges between them.

Example 1:

Input: root = [1,2,3,4,5]
Output: 3
Explanation: 3 is the length of the path [4,2,1,3] or [5,2,1,3].

Example 2:

Input: root = [1,2]
Output: 1

Constraints:

	The number of nodes in the tree is in the range [1, 10^4].
	-100 <= Node.val <= 100
*/
export function diameterOfBinaryTree(root: TreeNode | null): number {
    return getMaxDistance(root).maxDistance - 1;
}

export function diameterOfBinaryTree2(root: TreeNode | null): number {
    let diameter = 0;

    const dfs = (node: TreeNode | null): number => {
        if (!node) {
            return 0;
        }

        const leftHeight = dfs(node.left);
        const rightHeight = dfs(node.right);
        diameter = Math.max(diameter, leftHeight + rightHeight);

        return 1 + Math.max(leftHeight, rightHeight);
    };
    dfs(root);

    return diameter;
}

/*
https://leetcode.com/problems/find-bottom-left-tree-value/description/
513. Find Bottom Left Tree Value
Given the root of a binary tree, return the leftmost value in the last row of the tree.

Example 1:

Input: root = [2,1,3]
Output: 1

Example 2:

Input: root = [1,2,3,4,null,5,6,null,null,7]
Output: 7

Constraints:

	The number of nodes in the tree is in the range [1, 10^4].
	-231 <= Node.val <= 231 - 1
*/
export function findBottomLeftValue(root: TreeNode): number {
    const nodes: TreeNode[] = [root];

    let leftMostNodeVal = 0;
    while (nodes.length) {
        const node = nodes.shift()!;
        leftMostNodeVal = node.val;

        if (node.right) {
            nodes.push(node.right);
        }
        if (node.left) {
            nodes.push(node.left);
        }
    }

    return leftMostNodeVal;
}

/*
https://leetcode.com/problems/binary-tree-level-order-traversal-ii/description/
107. Binary Tree Level Order Traversal II
Given the root of a binary tree, return the bottom-up level order traversal of its nodes' values. (i.e., from left to right, level by level from leaf to root).

Example 1:

Input: root = [3,9,20,null,null,15,7]
Output: [[15,7],[9,20],[3]]

Example 2:

Input: root = [1]
Output: [[1]]

Example 3:

Input: root = []
Output: []

Constraints:

	The number of nodes in the tree is in the range [0, 2000].
	-1000 <= Node.val <= 1000
*/
export function levelOrderBottom(root: TreeNode | null): number[][] {
    if (!root) {
        return [];
    }

    const result: number[][] = [];
    const nodes = [root];
    let curEnd = root;
    let nextEnd = root;
    const level: number[] = [];
    while (nodes.length) {
        const node = nodes.shift()!;
        level.push(node.val);

        if (node.left) {
            nodes.push(node.left);
            nextEnd = node.left;
        }
        if (node.right) {
            nodes.push(node.right);
            nextEnd = node.right;
        }

        if (node === curEnd) {
            curEnd = nextEnd;
            result.push(level.slice());
            level.length = 0;
        }
    }
    if (level.length > 0) {
        result.push(level);
    }

    return result.reverse();
}

/*
https://leetcode.com/problems/even-odd-tree/description/
1609. Even Odd Tree
A binary tree is named Even-Odd if it meets the following conditions:

	The root of the binary tree is at level index 0, its children are at level index 1, their children are at level index 2, etc.
	For every even-indexed level, all nodes at the level have odd integer values in strictly increasing order (from left to right).
	For every odd-indexed level, all nodes at the level have even integer values in strictly decreasing order (from left to right).

Given the root of a binary tree, return true if the binary tree is Even-Odd, otherwise return false.

Example 1:

Input: root = [1,10,4,3,null,7,9,12,8,6,null,null,2]
Output: true
Explanation: The node values on each level are:
Level 0: [1]
Level 1: [10,4]
Level 2: [3,7,9]
Level 3: [12,8,6,2]
Since levels 0 and 2 are all odd and increasing and levels 1 and 3 are all even and decreasing, the tree is Even-Odd.

Example 2:

Input: root = [5,4,2,3,3,7]
Output: false
Explanation: The node values on each level are:
Level 0: [5]
Level 1: [4,2]
Level 2: [3,3,7]
Node values in level 2 must be in strictly increasing order, so the tree is not Even-Odd.

Example 3:

Input: root = [5,9,1,3,5,7]
Output: false
Explanation: Node values in the level 1 should be even integers.

Constraints:

	The number of nodes in the tree is in the range [1, 10^5].
	1 <= Node.val <= 10^6
*/
export function isEvenOddTree(root: TreeNode | null): boolean {
    if (!root) {
        return true;
    }

    let isEven = true;
    const nodes = [root];
    const level: number[] = [];
    const checkCurrentLevel = () => {
        if (isEven) {
            for (let i = 1; i < level.length; i++) {
                if (level[i] <= level[i - 1]) {
                    return false;
                }
            }
            return true;
        }

        for (let i = 1; i < level.length; i++) {
            if (level[i] >= level[i - 1]) {
                return false;
            }
        }
        return true;
    };

    let curEnd = root;
    let nextEnd = root;
    while (nodes.length) {
        const node = nodes.shift()!;
        if (isEven && (node.val & 1) === 0) {
            return false;
        }
        if (!isEven && (node.val & 1) === 1) {
            return false;
        }

        level.push(node.val);

        if (node.left) {
            nodes.push(node.left);
            nextEnd = node.left;
        }
        if (node.right) {
            nodes.push(node.right);
            nextEnd = node.right;
        }

        if (node === curEnd) {
            if (!checkCurrentLevel()) {
                return false;
            }

            level.length = 0;
            curEnd = nextEnd;
            isEven = !isEven;
        }
    }
    if (!checkCurrentLevel()) {
        return false;
    }

    return true;
}

/*
https://leetcode.com/problems/sum-of-nodes-with-even-valued-grandparent/description/
1315. Sum of Nodes with Even-Valued Grandparent
Given the root of a binary tree, return the sum of values of nodes with an even-valued grandparent. If there are no nodes with an even-valued grandparent, return 0.

A grandparent of a node is the parent of its parent if it exists.

Example 1:

Input: root = [6,7,8,2,7,1,3,9,null,1,4,null,null,null,5]
Output: 18
Explanation: The red nodes are the nodes with even-value grandparent while the blue nodes are the even-value grandparents.

Example 2:

Input: root = [1]
Output: 0

Constraints:

	The number of nodes in the tree is in the range [1, 10^4].
	1 <= Node.val <= 100

Hints
- Traverse the tree keeping the parent and the grandparent.
- If the grandparent of the current node is even-valued, add the value of this node to the answer.
*/
export function sumEvenGrandparent(root: TreeNode | null): number {
    if (!root) {
        return 0;
    }

    const parent = new Map<TreeNode, TreeNode>();
    let result = 0;
    const dfs = (node: TreeNode) => {
        const grandParent = parent.get(parent.get(node)!);
        if (grandParent && (grandParent.val & 1) === 0) {
            result += node.val;
        }

        if (node.left) {
            parent.set(node.left, node);
            dfs(node.left);
        }
        if (node.right) {
            parent.set(node.right, node);
            dfs(node.right);
        }
    };
    dfs(root);

    return result;
}

/*
https://leetcode.com/problems/longest-univalue-path/description/
687. Longest Univalue Path
Given the root of a binary tree, return the length of the longest path, where each node in the path has the same value. This path may or may not pass through the root.

The length of the path between two nodes is represented by the number of edges between them.

Example 1:

Input: root = [5,4,5,1,1,null,5]
Output: 2
Explanation: The shown image shows that the longest path of the same value (i.e. 5).

Example 2:

Input: root = [1,4,5,4,4,null,5]
Output: 2
Explanation: The shown image shows that the longest path of the same value (i.e. 4).

Constraints:

	The number of nodes in the tree is in the range [0, 10^4].
	-1000 <= Node.val <= 1000
	The depth of the tree will not exceed 1000.
*/

type UnivaluePath = [val: number, max: number, height: number];

export function longestUnivaluePath(root: TreeNode | null): number {
    if (!root) {
        return 0;
    }

    const dfs = (node: TreeNode | null): UnivaluePath => {
        if (!node) {
            return [0, 0, 0];
        }

        const [leftVal, leftMax, leftHeight] = dfs(node.left);
        const [rightVal, rightMax, rightHeight] = dfs(node.right);

        let val = node.val;
        let max = Math.max(leftMax, rightMax, 1);
        let height = 1;

        if (val === leftVal && val === rightVal) {
            max = Math.max(max, leftHeight + rightHeight + 1);
            height = Math.max(leftHeight + 1, rightHeight + 1);
        } else if (val === leftVal) {
            max = Math.max(max, leftHeight + 1);
            height = leftHeight + 1;
        } else if (val === rightVal) {
            max = Math.max(max, rightHeight + 1);
            height = rightHeight + 1;
        }

        return [val, max, height];
    };

    return dfs(root)[1] - 1;
}

/*
https://leetcode.com/problems/binary-tree-right-side-view/
199. Binary Tree Right Side View
Given the root of a binary tree, imagine yourself standing on the right side of it, return the values of the nodes you can see ordered from top to bottom.

Example 1:

Input: root = [1,2,3,null,5,null,4]
Output: [1,3,4]

Example 2:

Input: root = [1,null,3]
Output: [1,3]

Example 3:

Input: root = []
Output: []

Constraints:

	The number of nodes in the tree is in the range [0, 100].
	-100 <= Node.val <= 100
*/
export function rightSideView(root: TreeNode | null): number[] {
    if (!root) {
        return [];
    }

    let curEnd = root;
    let nextEnd = root;
    const result: number[] = [];
    const queue: TreeNode[] = [root];
    while (queue.length) {
        const node = queue.shift()!;
        if (node.left) {
            queue.push(node.left);
            nextEnd = node.left;
        }
        if (node.right) {
            queue.push(node.right);
            nextEnd = node.right;
        }

        if (node === curEnd) {
            result.push(node.val);
            curEnd = nextEnd;
        }
    }

    return result;
}

/*
https://leetcode.com/problems/find-largest-value-in-each-tree-row/description/
515. Find Largest Value in Each Tree Row
Given the root of a binary tree, return an array of the largest value in each row of the tree (0-indexed).

Example 1:

Input: root = [1,3,2,5,3,null,9]
Output: [1,3,9]

Example 2:

Input: root = [1,2,3]
Output: [1,3]

Constraints:

	The number of nodes in the tree will be in the range [0, 10^4].
	2^31 <= Node.val <= 2^31 - 1
*/
export function largestValues(root: TreeNode | null): number[] {
    if (!root) {
        return [];
    }

    let curEnd = root;
    let nextEnd = root;
    const queue: TreeNode[] = [root];
    let max = -Infinity;
    const result: number[] = [];
    while (queue.length > 0) {
        const node = queue.shift()!;
        max = Math.max(max, node.val);

        if (node.left) {
            queue.push(node.left);
            nextEnd = node.left;
        }
        if (node.right) {
            queue.push(node.right);
            nextEnd = node.right;
        }

        if (node === curEnd) {
            result.push(max);
            curEnd = nextEnd;
            max = -Infinity;
        }
    }

    return result;
}

/*
https://leetcode.com/problems/reverse-odd-levels-of-binary-tree/description/?envType=list&envId=mhgl61ev
2415. Reverse Odd Levels of Binary Tree
Given the root of a perfect binary tree, reverse the node values at each odd level of the tree.

	For example, suppose the node values at level 3 are [2,1,3,4,7,11,29,18], then it should become [18,29,11,7,4,3,1,2].

Return the root of the reversed tree.

A binary tree is perfect if all parent nodes have two children and all leaves are on the same level.

The level of a node is the number of edges along the path between it and the root node.

Example 1:

Input: root = [2,3,5,8,13,21,34]
Output: [2,5,3,8,13,21,34]
Explanation: 
The tree has only one odd level.
The nodes at level 1 are 3, 5 respectively, which are reversed and become 5, 3.

Example 2:

Input: root = [7,13,11]
Output: [7,11,13]
Explanation: 
The nodes at level 1 are 13, 11, which are reversed and become 11, 13.

Example 3:

Input: root = [0,1,2,0,0,0,0,1,1,1,1,2,2,2,2]
Output: [0,2,1,0,0,0,0,2,2,2,2,1,1,1,1]
Explanation: 
The odd levels have non-zero values.
The nodes at level 1 were 1, 2, and are 2, 1 after the reversal.
The nodes at level 3 were 1, 1, 1, 1, 2, 2, 2, 2, and are 2, 2, 2, 2, 1, 1, 1, 1 after the reversal.

Constraints:

	The number of nodes in the tree is in the range [1, 2^14].
	0 <= Node.val <= 10^5
	root is a perfect binary tree.
*/
export function reverseOddLevels(root: TreeNode): TreeNode | null {
    let curEnd = root;
    let nextEnd = root;
    const queue: TreeNode[] = [root];
    let isOdd = false;
    const level: TreeNode[] = [];
    const reverseLevel = () => {
        let l = 0;
        let r = level.length - 1;
        while (l < r) {
            let t = level[l].val;
            level[l].val = level[r].val;
            level[r].val = t;

            l++;
            r--;
        }
    };

    while (queue.length > 0) {
        const node = queue.shift()!;
        if (isOdd) {
            level.push(node);
        }

        if (node.left) {
            queue.push(node.left);
            nextEnd = node.left;
        }
        if (node.right) {
            queue.push(node.right);
            nextEnd = node.right;
        }

        if (node === curEnd) {
            if (isOdd) {
                reverseLevel();
                level.length = 0;
            }

            isOdd = !isOdd;
            curEnd = nextEnd;
        }
    }

    return root;
}

/*
https://leetcode.com/problems/average-of-levels-in-binary-tree/description/?envType=list&envId=o5cftq05
637. Average of Levels in Binary Tree
Given the root of a binary tree, return the average value of the nodes on each level in the form of an array. Answers within 10-5 of the actual answer will be accepted.

Example 1:

Input: root = [3,9,20,null,null,15,7]
Output: [3.00000,14.50000,11.00000]
Explanation: The average value of nodes on level 0 is 3, on level 1 is 14.5, and on level 2 is 11.
Hence return [3, 14.5, 11].

Example 2:

Input: root = [3,9,20,15,7]
Output: [3.00000,14.50000,11.00000]

Constraints:

	The number of nodes in the tree is in the range [1, 10^4].
	2^31 <= Node.val <= 2^31 - 1
*/
export function averageOfLevels(root: TreeNode): number[] {
    let curEnd = root;
    let nextEnd = root;
    const queue: TreeNode[] = [root];
    const result: number[] = [];

    let sum = 0;
    let count = 0;
    while (queue.length > 0) {
        const node = queue.shift()!;
        sum += node.val;
        count++;

        if (node.left) {
            queue.push(node.left);
            nextEnd = node.left;
        }
        if (node.right) {
            queue.push(node.right);
            nextEnd = node.right;
        }

        if (node === curEnd) {
            result.push(sum / count);
            sum = 0;
            count = 0;
            curEnd = nextEnd;
        }
    }

    return result;
}

/*
https://leetcode.com/problems/binary-tree-postorder-traversal/
145. Binary Tree Postorder Traversal
Given the root of a binary tree, return the postorder traversal of its nodes' values.

Example 1:

Input: root = [1,null,2,3]
Output: [3,2,1]

Example 2:

Input: root = []
Output: []

Example 3:

Input: root = [1]
Output: [1]

Constraints:

	The number of the nodes in the tree is in the range [0, 100].
	-100 <= Node.val <= 100

Follow up: Recursive solution is trivial, could you do it iteratively?
*/
export function postorderTraversal(root: TreeNode | null): number[] {
    if (!root) {
        return [];
    }
    const left = postorderTraversal(root.left);
    const right = postorderTraversal(root.right);
    return left.concat(right).concat(root.val);
}

/*
https://leetcode.com/problems/sum-of-left-leaves/description/
404. Sum of Left Leaves
Given the root of a binary tree, return the sum of all left leaves.

A leaf is a node with no children. A left leaf is a leaf that is the left child of another node.

Example 1:

Input: root = [3,9,20,null,null,15,7]
Output: 24
Explanation: There are two left leaves in the binary tree, with values 9 and 15 respectively.

Example 2:

Input: root = [1]
Output: 0

Constraints:

	The number of nodes in the tree is in the range [1, 1000].
	-1000 <= Node.val <= 1000
*/
export function sumOfLeftLeaves(root: TreeNode | null): number {
    if (!root || isLeaf(root)) {
        return 0;
    }

    let sum = 0;
    if (root.left) {
        sum += isLeaf(root.left) ? root.left.val : sumOfLeftLeaves(root.left);
    }
    if (root.right) {
        sum += sumOfLeftLeaves(root.right);
    }

    return sum;
}

function isLeaf(node: TreeNode) {
    return !node.left && !node.right;
}

/*
https://leetcode.com/problems/sum-root-to-leaf-numbers/description/
129. Sum Root to Leaf Numbers
You are given the root of a binary tree containing digits from 0 to 9 only.

Each root-to-leaf path in the tree represents a number.

	For example, the root-to-leaf path 1 -> 2 -> 3 represents the number 123.

Return the total sum of all root-to-leaf numbers. Test cases are generated so that the answer will fit in a 32-bit integer.

A leaf node is a node with no children.

Example 1:

Input: root = [1,2,3]
Output: 25
Explanation:
The root-to-leaf path 1->2 represents the number 12.
The root-to-leaf path 1->3 represents the number 13.
Therefore, sum = 12 + 13 = 25.

Example 2:

Input: root = [4,9,0,5,1]
Output: 1026
Explanation:
The root-to-leaf path 4->9->5 represents the number 495.
The root-to-leaf path 4->9->1 represents the number 491.
The root-to-leaf path 4->0 represents the number 40.
Therefore, sum = 495 + 491 + 40 = 1026.

Constraints:

	The number of nodes in the tree is in the range [1, 1000].
	0 <= Node.val <= 9
	The depth of the tree will not exceed 10.
*/
export function sumNumbers(root: TreeNode | null): number {
    if (!root) {
        return 0;
    }

    let sum = 0;
    const backtracking = (node: TreeNode, val: number) => {
        if (isLeaf(node)) {
            sum += val;
            return;
        }

        if (node.left) {
            backtracking(node.left, val * 10 + node.left.val);
        }
        if (node.right) {
            backtracking(node.right, val * 10 + node.right.val);
        }
    };
    backtracking(root, root.val);

    return sum;
}

/*
https://leetcode.com/problems/add-one-row-to-tree/description/
623. Add One Row to Tree
Given the root of a binary tree and two integers val and depth, add a row of nodes with value val at the given depth depth.

Note that the root node is at depth 1.

The adding rule is:

	Given the integer depth, for each not null tree node cur at the depth depth - 1, create two tree nodes with value val as cur's left subtree root and right subtree root.
	cur's original left subtree should be the left subtree of the new left subtree root.
	cur's original right subtree should be the right subtree of the new right subtree root.
	If depth == 1 that means there is no depth depth - 1 at all, then create a tree node with value val as the new root of the whole original tree, and the original tree is the new root's left subtree.

Example 1:

Input: root = [4,2,6,3,1,5], val = 1, depth = 2
Output: [4,1,1,2,null,null,6,3,1,5]

Example 2:

Input: root = [4,2,null,3,1], val = 1, depth = 3
Output: [4,2,null,1,1,3,null,null,1]

Constraints:

	The number of nodes in the tree is in the range [1, 10^4].
	The depth of the tree is in the range [1, 10^4].
	-100 <= Node.val <= 100
	-10^5 <= val <= 10^5
	1 <= depth <= the depth of tree + 1
*/
export function addOneRow(
    root: TreeNode | null,
    val: number,
    depth: number
): TreeNode | null {
    if (!root) {
        return root;
    }
    if (depth === 1) {
        const newRoot = new TreeNode(val);
        newRoot.left = root;
        return newRoot;
    }

    const queue: TreeNode[] = [root];
    let curEnd = root;
    let nextEnd = root;
    const parents: TreeNode[] = [];
    let i = 0;
    while (queue.length > 0) {
        const node = queue.shift()!;
        if (i === depth - 2) {
            parents.push(node);
        }

        if (node.left) {
            queue.push(node.left);
            nextEnd = node.left;
        }
        if (node.right) {
            queue.push(node.right);
            nextEnd = node.right;
        }
        if (node === curEnd) {
            i++;
            curEnd = nextEnd;

            if (parents.length) {
                parents.forEach((p) => {
                    p.left = new TreeNode(val, p.left);
                    p.right = new TreeNode(val, null, p.right);
                });
                break;
            }
        }
    }

    return root;
}

/*
https://leetcode.com/problems/smallest-string-starting-from-leaf/description/
988. Smallest String Starting From Leaf
You are given the root of a binary tree where each node has a value in the range [0, 25] representing the letters 'a' to 'z'.

Return the lexicographically smallest string that starts at a leaf of this tree and ends at the root.

As a reminder, any shorter prefix of a string is lexicographically smaller.

	For example, "ab" is lexicographically smaller than "aba".

A leaf of a node is a node that has no children.

Example 1:

Input: root = [0,1,2,3,4,3,4]
Output: "dba"

Example 2:

Input: root = [25,1,3,1,3,0,2]
Output: "adz"

Example 3:

Input: root = [2,2,1,null,1,0,null,0]
Output: "abc"

Constraints:

	The number of nodes in the tree is in the range [1, 8500].
	0 <= Node.val <= 25

TODO:优化点：1.更改了原数据需要恢复. 2.另外时间复杂度较高，属于偏暴力的解法
*/
export function smallestFromLeaf(root: TreeNode): string {
    const levels = getLevels(root);
    const smallest = new Set<TreeNode>();
    for (let i = levels.length - 1; i >= 0; i--) {
        const leafs = levels[i].filter((n) => isLeaf(n));
        const min = Math.min(...leafs.map((n) => n.val));
        leafs.forEach((node) => {
            if (node.val === min) {
                smallest.add(node);
            }
        });
    }

    const strings: string[] = [];
    smallest.forEach((n) => {
        let s = toAlpha(n.val);
        // @ts-expect-error
        while (n.parent) {
            // @ts-expect-error
            s += toAlpha(n.parent.val);
            // @ts-expect-error
            n = n.parent;
        }

        strings.push(s);
    });

    return strings.reduce((a, b) => (a < b ? a : b));
}

function getLevels(root: TreeNode): TreeNode[][] {
    let curEnd = root;
    let nextEnd = root;
    const queue: TreeNode[] = [root];
    const levels: TreeNode[][] = [];
    const currentLevel: TreeNode[] = [];
    while (queue.length) {
        const node = queue.shift()!;
        currentLevel.push(node);

        if (node.left) {
            // @ts-expect-error
            node.left.parent = node;
            nextEnd = node.left;
            queue.push(node.left);
        }
        if (node.right) {
            // @ts-expect-error
            node.right.parent = node;
            nextEnd = node.right;
            queue.push(node.right);
        }

        if (curEnd === node) {
            levels.push(currentLevel.slice());
            currentLevel.length = 0;
            curEnd = nextEnd;
        }
    }

    return levels;
}

function toAlpha(index: number) {
    return String.fromCharCode(index + 'a'.charCodeAt(0));
}

/*
https://leetcode.com/problems/path-sum-ii/description/
113. Path Sum II
Given the root of a binary tree and an integer targetSum, return all root-to-leaf paths where the sum of the node values in the path equals targetSum. Each path should be returned as a list of the node values, not node references.

A root-to-leaf path is a path starting from the root and ending at any leaf node. A leaf is a node with no children.

Example 1:

Input: root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22
Output: [[5,4,11,2],[5,8,4,5]]
Explanation: There are two paths whose sum equals targetSum:
5 + 4 + 11 + 2 = 22
5 + 8 + 4 + 5 = 22

Example 2:

Input: root = [1,2,3], targetSum = 5
Output: []

Example 3:

Input: root = [1,2], targetSum = 0
Output: []

Constraints:

	The number of nodes in the tree is in the range [0, 5000].
	-1000 <= Node.val <= 1000
	-1000 <= targetSum <= 1000
*/
export function pathSum(root: TreeNode | null, targetSum: number): number[][] {
    const result: number[][] = [];

    const backtracking = (
        node: TreeNode | null,
        path: number[],
        sum: number
    ) => {
        if (!node) {
            return;
        }
        if (isLeaf(node)) {
            sum === targetSum - node.val && result.push(path.concat(node.val));
            return;
        }

        path.push(node.val);
        backtracking(node.left, path, sum + node.val);
        backtracking(node.right, path, sum + node.val);
        path.length--;
    };
    backtracking(root, [], 0);

    return result;
}

/*
https://leetcode.com/problems/binary-tree-level-order-traversal/description/
102. Binary Tree Level Order Traversal
Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).

Example 1:

Input: root = [3,9,20,null,null,15,7]
Output: [[3],[9,20],[15,7]]

Example 2:

Input: root = [1]
Output: [[1]]

Example 3:

Input: root = []
Output: []

Constraints:

	The number of nodes in the tree is in the range [0, 2000].
	-1000 <= Node.val <= 1000
*/
export function levelOrder(root: TreeNode | null): number[][] {
    if (!root) {
        return [];
    }

    const result: number[][] = [];
    const queue: TreeNode[] = [root];
    while (queue.length) {
        const len = queue.length;
        const level: number[] = Array(len);
        for (let i = 0; i < len; i++) {
            const node = queue.shift()!;
            level[i] = node.val;

            if (node.left) {
                queue.push(node.left);
            }
            if (node.right) {
                queue.push(node.right);
            }
        }
        result.push(level);
    }

    return result;
}

/*
https://leetcode.com/problems/maximum-width-of-binary-tree/description/
662. Maximum Width of Binary Tree
Given the root of a binary tree, return the maximum width of the given tree.

The maximum width of a tree is the maximum width among all levels.

The width of one level is defined as the length between the end-nodes (the leftmost and rightmost non-null nodes), where the null nodes between the end-nodes that would be present in a complete binary tree extending down to that level are also counted into the length calculation.

It is guaranteed that the answer will in the range of a 32-bit signed integer.

Example 1:

Input: root = [1,3,2,5,3,null,9]
Output: 4
Explanation: The maximum width exists in the third level with length 4 (5,3,null,9).

Example 2:

Input: root = [1,3,2,5,null,null,9,6,null,7]
Output: 7
Explanation: The maximum width exists in the fourth level with length 7 (6,null,null,null,null,null,7).

Example 3:

Input: root = [1,3,2,5]
Output: 2
Explanation: The maximum width exists in the second level with length 2 (3,2).

Constraints:

	The number of nodes in the tree is in the range [1, 3000].
	-100 <= Node.val <= 100
*/
export function widthOfBinaryTree(root: TreeNode | null): number {
    if (!root) {
        return 0;
    }

    // index 使用 bitint 避免越界
    const queue: Array<[node: TreeNode, index: bigint]> = [[root, 1n]];
    let max = 0;
    while (queue.length) {
        const len = queue.length;
        max = Math.max(max, Number(queue[len - 1][1] - queue[0][1]) + 1);
        for (let i = 0; i < len; i++) {
            const [node, index] = queue.shift()!;
            if (node.left) {
                queue.push([node.left, index * 2n]);
            }
            if (node.right) {
                queue.push([node.right, index * 2n + 1n]);
            }
        }
    }

    return max;
}

/*
https://leetcode.com/problems/maximum-depth-of-binary-tree/description/
104. Maximum Depth of Binary Tree
Given the root of a binary tree, return its maximum depth.

A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.

Example 1:

Input: root = [3,9,20,null,null,15,7]
Output: 3

Example 2:

Input: root = [1,null,2]
Output: 2

Constraints:

	The number of nodes in the tree is in the range [0, 10^4].
	-100 <= Node.val <= 100
*/
export function maxDepth(root: TreeNode | null): number {
    return !root ? 0 : Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;
}

/*
https://leetcode.com/problems/check-completeness-of-a-binary-tree/description/
958. Check Completeness of a Binary Tree
Given the root of a binary tree, determine if it is a complete binary tree.

In a complete binary tree, every level, except possibly the last, is completely filled, and all nodes in the last level are as far left as possible. It can have between 1 and 2h nodes inclusive at the last level h.

Example 1:

Input: root = [1,2,3,4,5,6]
Output: true
Explanation: Every level before the last is full (ie. levels with node-values {1} and {2, 3}), and all nodes in the last level ({4, 5, 6}) are as far left as possible.

Example 2:

Input: root = [1,2,3,4,5,null,7]
Output: false
Explanation: The node with value 7 isn't as far left as possible.

Constraints:

	The number of nodes in the tree is in the range [1, 100].
	1 <= Node.val <= 1000
*/
export function isCompleteTree(root: TreeNode | null): boolean {
    if (!root) {
        return true;
    }

    const queue: TreeNode[] = [root];
    let leaf = false;
    while (queue.length) {
        const node = queue.shift()!;
        if ((node.right && !node.left) || (leaf && !isLeaf(node))) {
            return false;
        }
        if (node.left) {
            queue.push(node.left);
        }
        if (node.right) {
            queue.push(node.right);
        }
        if (!node.left || !node.right) {
            leaf = true;
        }
    }

    return true;
}

/*
https://leetcode.com/problems/trim-a-binary-search-tree/description/
669. Trim a Binary Search Tree
Given the root of a binary search tree and the lowest and highest boundaries as low and high, trim the tree so 
that all its elements lies in [low, high]. Trimming the tree should not change the relative structure of the elements 
that will remain in the tree (i.e., any node's descendant should remain a descendant). It can be proven that there is a unique answer.

Return the root of the trimmed binary search tree. Note that the root may change depending on the given bounds.

Example 1:

Input: root = [1,0,2], low = 1, high = 2
Output: [1,null,2]

Example 2:

Input: root = [3,0,4,null,2,null,null,1], low = 1, high = 3
Output: [3,2,null,1]

Constraints:

	The number of nodes in the tree is in the range [1, 10^4].
	0 <= Node.val <= 10^4
	The value of each node in the tree is unique.
	root is guaranteed to be a valid binary search tree.
	0 <= low <= high <= 10^4
*/
export function trimBST(
    root: TreeNode | null,
    low: number,
    high: number
): TreeNode | null {
    if (!root) {
        return null;
    }
    if (root.val < low) {
        return trimBST(root.right, low, high);
    }
    if (root.val > high) {
        return trimBST(root.left, low, high);
    }

    const l = trimBST(root.left, low, high);
    const r = trimBST(root.right, low, high);
    root.left = l;
    root.right = r;
    return root;
}

/*
https://leetcode.com/problems/delete-leaves-with-a-given-value/description/?envType=daily-question&envId=2024-05-17
1325. Delete Leaves With a Given Value
Given a binary tree root and an integer target, delete all the leaf nodes with value target.

Note that once you delete a leaf node with value target, if its parent node becomes a leaf node and has the value target, it should also be deleted (you need to continue doing that until you cannot).

Example 1:

Input: root = [1,2,3,2,null,2,4], target = 2
Output: [1,null,3,null,4]
Explanation: Leaf nodes in green with value (target = 2) are removed (Picture in left). 
After removing, new nodes become leaf nodes with value (target = 2) (Picture in center).

Example 2:

Input: root = [1,3,3,3,2], target = 3
Output: [1,3,null,null,2]

Example 3:

Input: root = [1,2,null,2,null,2], target = 2
Output: [1]
Explanation: Leaf nodes in green with value (target = 2) are removed at each step.

Constraints:

	The number of nodes in the tree is in the range [1, 3000].
	1 <= Node.val, target <= 1000
*/
export function removeLeafNodes(
    root: TreeNode | null,
    target: number
): TreeNode | null {
    const dfs = (root: TreeNode | null) => {
        if (!root) {
            return null;
        }

        const left = dfs(root.left);
        const right = dfs(root.right);
        if (left && isLeaf(left) && left.val === target) {
            root.left = null;
        }
        if (right && isLeaf(right) && right.val === target) {
            root.right = null;
        }

        return root;
    };
    const newRoot = dfs(root);

    return newRoot && isLeaf(newRoot) && newRoot.val === target ? null : root;
}

/*
https://leetcode.com/problems/distribute-coins-in-binary-tree/description/?envType=daily-question&envId=2024-05-18
979. Distribute Coins in Binary Tree
You are given the root of a binary tree with n nodes where each node in the tree has node.val coins. There are n coins in total throughout the whole tree.

In one move, we may choose two adjacent nodes and move one coin from one node to another. A move may be from parent to child, or from child to parent.

Return the minimum number of moves required to make every node have exactly one coin.

Example 1:

Input: root = [3,0,0]
Output: 2
Explanation: From the root of the tree, we move one coin to its left child, and one coin to its right child.

Example 2:

Input: root = [0,3,0]
Output: 3
Explanation: From the left child of the root, we move two coins to the root [taking two moves]. Then, we move one coin from the root of the tree to the right child.

Constraints:

	The number of nodes in the tree is n.
	1 <= n <= 100
	0 <= Node.val <= n
	The sum of all Node.val is n.
*/
export function distributeCoins(root: TreeNode | null): number {
    let moves = 0;

    const postOrder = (node: TreeNode | null): number => {
        if (!node) {
            return 0;
        }

        const left = postOrder(node.left);
        const right = postOrder(node.right);

        moves += Math.abs(left) + Math.abs(right);

        return node.val + left + right - 1;
    };
    postOrder(root);

    return moves;
}

/*
https://leetcode.com/problems/minimum-height-trees/description/?envType=daily-question&envId=2024-04-23
310. Minimum Height Trees
A tree is an undirected graph in which any two vertices are connected by exactly one path. In other words, any connected graph without simple cycles is a tree.

Given a tree of n nodes labelled from 0 to n - 1, and an array of n - 1 edges where edges[i] = [ai, bi] indicates that there is an undirected edge between the two nodes ai and bi in the tree, you can choose any node of the tree as the root. When you select a node x as the root, the result tree has height h. Among all possible rooted trees, those with minimum height (i.e. min(h))  are called minimum height trees (MHTs).

Return a list of all MHTs' root labels. You can return the answer in any order.

The height of a rooted tree is the number of edges on the longest downward path between the root and a leaf.

Example 1:

Input: n = 4, edges = [[1,0],[1,2],[1,3]]
Output: [1]
Explanation: As shown, the height of the tree is 1 when the root is the node with label 1 which is the only MHT.

Example 2:

Input: n = 6, edges = [[3,0],[3,1],[3,2],[3,4],[5,4]]
Output: [3,4]

Constraints:

	1 <= n <= 10^4
	edges.length == n - 1
	0 <= ai, bi < n
	ai != bi
	All the pairs (ai, bi) are distinct.
	The given input is guaranteed to be a tree and there will be no repeated edges.
*/
export function findMinHeightTrees(n: number, edges: number[][]): number[] {
    if (n <= 1) {
        return [0];
    }

    const degrees = Array(n).fill(0);
    const tables = Array.from({ length: n }, () => Array());
    edges.forEach(([from, to]) => {
        degrees[from]++;
        degrees[to]++;
        tables[from].push(to);
        tables[to].push(from);
    });

    let leafs: number[] = [];
    degrees.forEach((v, i) => {
        if (v === 1) {
            leafs.push(i);
        }
    });

    let leftNodes = n;
    while (leftNodes > 2) {
        const newLeafs: number[] = [];
        leafs.forEach((i) => {
            tables[i].forEach((n) => {
                if (--degrees[n] === 1) {
                    newLeafs.push(n);
                }
            });
        });

        leftNodes -= leafs.length;
        leafs = newLeafs;
    }

    return leafs;
}
