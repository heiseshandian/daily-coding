import { Queue } from '../queue';
import { morris, morrisMid, morrisPost, serializeByLevel, deserializeByLevel } from '../tree';
import {
    preBuildNode,
    preVisitNode,
    preVisitNode2,
    postVisitNode,
    postVisitNode2,
    middleVisitNode,
    TreeNode,
    middleVisitNode2,
    visitTreeByLevel,
    getMaxWidth,
    getMaxWidthNoMap,
    preSerialize,
    TreeNodeWithParent,
    findNextNode,
    morrisPre,
} from '../tree';
import {
    preVisitNodeTestData,
    postVisitNodeTestData,
    middleVisitNodeTestData,
    visitTreeByLevelTestData,
    getMaxWidthTestData,
    preSerializeTestData,
} from './tree.testdata';

const getVal = (node: TreeNode) => node.val;

describe('tree', () => {
    it.each(preVisitNodeTestData)('preVisitNode %j', ({ input, expected }) => {
        const root = preBuildNode(Queue.from(input));

        expect(preVisitNode(root).map(getVal)).toEqual(expected);
        expect(preVisitNode2(root).map(getVal)).toEqual(expected);
        expect(morrisPre(root).map(getVal)).toEqual(expected);
    });

    it.each(postVisitNodeTestData)('postVisitNode %j', ({ input, expected }) => {
        const root = preBuildNode(Queue.from(input));

        expect(postVisitNode(root).map(getVal)).toEqual(expected);
        expect(postVisitNode2(root).map(getVal)).toEqual(expected);
        expect(morrisPost(root).map(getVal)).toEqual(expected);
    });

    it.each(middleVisitNodeTestData)('middleVisitNode %j', ({ input, expected }) => {
        const root = preBuildNode(Queue.from(input));

        expect(middleVisitNode(root).map(getVal)).toEqual(expected);
        expect(middleVisitNode2(root).map(getVal)).toEqual(expected);
        expect(morrisMid(root).map(getVal)).toEqual(expected);
    });

    it.each(visitTreeByLevelTestData)('visitTreeByLevel %j', ({ input, expected }) => {
        const root = preBuildNode(Queue.from(input));

        expect(visitTreeByLevel(root).map(getVal)).toEqual(expected);
    });

    it.each(getMaxWidthTestData)('getMaxWidth %j', ({ input, expected }) => {
        const root = preBuildNode(Queue.from(input));

        expect(getMaxWidth(root)).toBe(expected);
        expect(getMaxWidthNoMap(root)).toBe(expected);
    });

    it.each(preSerializeTestData)('preSerialize %j', ({ input }) => {
        const root = preBuildNode(Queue.from(input));

        expect(preSerialize(root).valueOf()).toEqual(input);
    });

    test('findNextNode', () => {
        const [root, node2, node3, node4, node6, node7, node8] = [1, 2, 3, 4, 6, 7, 8].map(
            (val) => new TreeNodeWithParent(val)
        );
        node7.parent = node6;
        node8.parent = node6;
        node6.parent = node3;
        node4.parent = node2;
        node3.parent = root;
        node2.parent = root;

        root.left = node2;
        root.right = node3;
        node2.left = node4;
        node3.right = node6;
        node6.left = node7;
        node6.right = node8;

        expect(findNextNode(root)).toBe(node3);
        expect(findNextNode(node4)).toBe(node2);
        expect(findNextNode(node2)).toBe(root);
        expect(findNextNode(node3)).toBe(node7);
        expect(findNextNode(node6)).toBe(node8);
        expect(findNextNode(node8)).toBe(null);
    });

    test('morris', () => {
        const head = new TreeNode(1);
        head.left = new TreeNode(2);
        head.right = new TreeNode(3);

        head.left.left = new TreeNode(4);
        head.left.right = new TreeNode(5);
        head.right.left = new TreeNode(6);
        head.right.right = new TreeNode(7);
    });

    describe('morris', () => {
        const head = new TreeNode(1);
        head.left = new TreeNode(2);
        head.right = new TreeNode(3);

        head.left.left = new TreeNode(4);
        head.left.right = new TreeNode(5);
        head.right.left = new TreeNode(6);
        head.right.right = new TreeNode(7);

        test('morris 1', () => {
            expect(morris(head).map(({ val }) => val)).toEqual([1, 2, 4, 2, 5, 1, 3, 6, 3, 7]);
        });

        test('morris 2', () => {
            head.left!.left = null;

            expect(morris(head).map(({ val }) => val)).toEqual([1, 2, 5, 1, 3, 6, 3, 7]);
        });
    });

    describe('serializeByLevel,deserializeByLevel', () => {
        test('[1,2,3,4,5,null,null,6]', () => {
            const head = new TreeNode(1);
            head.left = new TreeNode(2);
            head.right = new TreeNode(3);

            head.left.left = new TreeNode(4);
            head.left.right = new TreeNode(5);

            head.left.left.left = new TreeNode(6);

            const list = [1, 2, 3, 4, 5, null, null, 6];

            expect(serializeByLevel(head)).toEqual(list);
            expect(deserializeByLevel(list)).toEqual(head);
        });

        test('[1,2,3,4,5,null,6]', () => {
            const head = new TreeNode(1);
            head.left = new TreeNode(2);
            head.right = new TreeNode(3);

            head.left.left = new TreeNode(4);
            head.left.right = new TreeNode(5);

            head.right.right = new TreeNode(6);

            const list = [1, 2, 3, 4, 5, null, 6];

            expect(serializeByLevel(head)).toEqual([1, 2, 3, 4, 5, null, 6]);
            expect(deserializeByLevel(list)).toEqual(head);
        });

        test('[1, 2, null, 3, 6, 4, null, 7, 8, null, null, 9]', () => {
            const head = new TreeNode(1);
            head.left = new TreeNode(2);

            head.left.left = new TreeNode(3);
            head.left.right = new TreeNode(6);

            head.left.left.left = new TreeNode(4);
            head.left.right.left = new TreeNode(7);
            head.left.right.right = new TreeNode(8);

            head.left.right.left.left = new TreeNode(9);

            const list = [1, 2, null, 3, 6, 4, null, 7, 8, null, null, 9];

            expect(serializeByLevel(head)).toEqual([1, 2, null, 3, 6, 4, null, 7, 8, null, null, 9]);
            expect(deserializeByLevel(list)).toEqual(head);
        });
    });
});
