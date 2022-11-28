import { Queue } from '../queue';
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

describe('preVisitNode', () => {
    it.each(preVisitNodeTestData)('preVisitNode %j', ({ input, expected }) => {
        const root = preBuildNode(Queue.from(input));

        expect(preVisitNode(root).map(getVal)).toEqual(expected);
        expect(preVisitNode2(root).map(getVal)).toEqual(expected);
    });
});

describe('postVisitNode', () => {
    it.each(postVisitNodeTestData)('postVisitNode %j', ({ input, expected }) => {
        const root = preBuildNode(Queue.from(input));

        expect(postVisitNode(root).map(getVal)).toEqual(expected);
        expect(postVisitNode2(root).map(getVal)).toEqual(expected);
    });
});

describe('middleVisitNode', () => {
    it.each(middleVisitNodeTestData)('middleVisitNode %j', ({ input, expected }) => {
        const root = preBuildNode(Queue.from(input));

        expect(middleVisitNode(root).map(getVal)).toEqual(expected);
        expect(middleVisitNode2(root).map(getVal)).toEqual(expected);
    });
});

describe('visitTreeByLevel', () => {
    it.each(visitTreeByLevelTestData)('visitTreeByLevel %j', ({ input, expected }) => {
        const root = preBuildNode(Queue.from(input));

        expect(visitTreeByLevel(root).map(getVal)).toEqual(expected);
    });
});

describe('getMaxWidth', () => {
    it.each(getMaxWidthTestData)('getMaxWidth %j', ({ input, expected }) => {
        const root = preBuildNode(Queue.from(input));

        expect(getMaxWidth(root)).toBe(expected);
        expect(getMaxWidthNoMap(root)).toBe(expected);
    });
});

describe('preSerialize', () => {
    it.each(preSerializeTestData)('preSerialize %j', ({ input }) => {
        const root = preBuildNode(Queue.from(input));

        expect(preSerialize(root).valueOf()).toEqual(input);
    });
});
