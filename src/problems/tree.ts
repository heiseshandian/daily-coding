import { TreeNode } from '../algorithm/tree';
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
