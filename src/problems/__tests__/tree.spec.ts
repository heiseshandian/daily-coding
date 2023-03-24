import {
    kthSmallestTestData,
    sufficientSubsetTestData,
    buildTreeTestData,
    printEdgeNodesTestData,
    maxPathSumTestData,
} from './tree.testdata';
import {
    kthSmallest,
    countEqualTree,
    countEqualTree2,
    zigzagLevelOrder,
    minCameraCover,
    minCameraCover2,
    maxPathSum,
    maxPathSum2,
} from '../tree';
import { deserializeByLevel, TreeNode, preBuildNode } from '../../algorithm/tree';
import { sufficientSubset, buildTree, printEdgeNodes } from '../tree';
describe('tree', () => {
    it.each(kthSmallestTestData)('kthSmallest', ({ input: { tree, k }, expected }) => {
        const root = deserializeByLevel(tree);
        expect(kthSmallest(root, k)).toBe(expected);
    });

    describe('countEqualTree', () => {
        test('countEqualTree 1', () => {
            const head = new TreeNode(1);
            head.left = new TreeNode(2);
            head.right = new TreeNode(3);

            expect(countEqualTree(head)).toBe(2);
            expect(countEqualTree2(head)).toBe(2);
        });

        test('countEqualTree 2', () => {
            const head = new TreeNode(1);
            head.left = new TreeNode(2);

            expect(countEqualTree(head)).toBe(1);
        });

        test('countEqualTree 3', () => {
            const head = new TreeNode(1);
            head.left = new TreeNode(2);
            head.right = new TreeNode(2);
            head.left.left = new TreeNode(4);
            head.right.right = new TreeNode(4);

            expect(countEqualTree(head)).toBe(3);
        });
    });

    test('zigzagLevelOrder', () => {
        const head = new TreeNode(3);
        head.left = new TreeNode(9);
        head.right = new TreeNode(20);
        head.right.left = new TreeNode(15);
        head.right.right = new TreeNode(7);

        expect(zigzagLevelOrder(head)).toEqual([[3], [20, 9], [15, 7]]);
    });

    describe('minCameraCover', () => {
        test('1 camera', () => {
            const head = new TreeNode(0);
            head.left = new TreeNode(0);
            head.left.left = new TreeNode(0);
            head.left.right = new TreeNode(0);

            expect(minCameraCover(head)).toBe(1);
            expect(minCameraCover2(head)).toBe(1);
        });

        test('2 cameras', () => {
            const head = new TreeNode(0);
            head.left = new TreeNode(0);
            head.left.left = new TreeNode(0);
            head.left.left.left = new TreeNode(0);
            head.left.left.right = new TreeNode(0);

            expect(minCameraCover(head)).toBe(2);
            expect(minCameraCover2(head)).toBe(2);
        });

        test('3 cameras', () => {
            const head = new TreeNode(0);
            head.left = new TreeNode(0);
            head.left.left = new TreeNode(0);
            head.left.left.left = new TreeNode(0);
            head.left.left.right = new TreeNode(0);
            head.left.left.right.right = new TreeNode(0);

            expect(minCameraCover(head)).toBe(3);
            expect(minCameraCover2(head)).toBe(3);
        });
    });

    it.each(sufficientSubsetTestData)('sufficientSubset', ({ input: { root, limit }, expected }) => {
        const tree = deserializeByLevel(root);
        const expectedTree = deserializeByLevel(expected);

        expect(sufficientSubset(tree, limit)).toEqual(expectedTree);
    });

    it.each(buildTreeTestData)('buildTree', ({ input: { preorder, inorder }, expected }) => {
        const expectedTree = deserializeByLevel(expected);

        expect(buildTree(preorder, inorder)).toEqual(expectedTree);
    });

    it.each(printEdgeNodesTestData)('printEdgeNodes', ({ input, expected }) => {
        const root = preBuildNode(input);
        expect(printEdgeNodes(root)).toEqual(expected);
    });

    it.each(maxPathSumTestData)('maxPathSum', ({ input, expected }) => {
        expect(maxPathSum(preBuildNode(input))).toBe(expected);
        expect(maxPathSum2(preBuildNode(input))).toBe(expected);
    });
});
