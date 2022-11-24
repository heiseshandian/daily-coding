import {
    SingleLinkedList,
    DoubleLinkedList,
    reverseSingleLinkedList,
    reverseDoubleLinkedList,
    deleteNum,
    getMiddleNode,
    getMiddleNode2,
    getMiddleNode3,
    getMiddleNode4,
} from '../linked-list';
import {
    getMiddleNode2TestData,
    getMiddleNode3TestData,
    getMiddleNode4TestData,
    getMiddleNodeTestData,
} from './linked-list.testdata';

describe('SingleLinkedList.from', () => {
    test('return null if input is empty or []', () => {
        expect(SingleLinkedList.from()).toEqual(null);
        expect(SingleLinkedList.from([])).toEqual(null);
    });

    test('return 1>null if input is empty or [1]', () => {
        expect(SingleLinkedList.from([1])).toEqual(new SingleLinkedList(1));
    });

    test('return 1>2>null if input is empty or [1,2]', () => {
        expect(SingleLinkedList.from([1, 2])).toEqual(new SingleLinkedList(1, new SingleLinkedList(2)));
    });

    test('return 1>2>3>null if input is [1,2,3]', () => {
        expect(SingleLinkedList.from([1, 2, 3])).toEqual(
            new SingleLinkedList(1, new SingleLinkedList(2, new SingleLinkedList(3)))
        );
    });
});

describe('DoubleLinkedList.from', () => {
    test('return null if input is empty or []', () => {
        expect(DoubleLinkedList.from()).toEqual(null);
    });

    test('return 1>null if input is empty or [1]', () => {
        expect(DoubleLinkedList.from([1])).toEqual(new DoubleLinkedList(1));
    });

    test('return 1>2>null if input is empty or [1,2]', () => {
        const [firstNode, secondNode] = [new DoubleLinkedList(1), new DoubleLinkedList(2)];
        firstNode.next = secondNode;
        secondNode.prev = firstNode;

        expect(DoubleLinkedList.from([1, 2])).toEqual(firstNode);
    });

    test('return 1>2>3>null if input is [1,2,3]', () => {
        const [firstNode, secondNode, thirdNode] = [
            new DoubleLinkedList(1),
            new DoubleLinkedList(2),
            new DoubleLinkedList(3),
        ];
        firstNode.next = secondNode;
        secondNode.next = thirdNode;

        thirdNode.prev = secondNode;
        secondNode.prev = firstNode;

        expect(DoubleLinkedList.from([1, 2, 3])).toEqual(firstNode);
    });
});

describe('reverseSingleLinkedList', () => {
    test('return null if the input is null', () => {
        expect(reverseSingleLinkedList(null)).toBe(null);
    });

    test('return 1 if the input is 1', () => {
        expect(reverseSingleLinkedList(new SingleLinkedList(1))).toEqual(new SingleLinkedList(1));
    });

    test('return [2,1] if the input is [1,2]', () => {
        expect(reverseSingleLinkedList(SingleLinkedList.from([1, 2]))).toEqual(SingleLinkedList.from([2, 1]));
    });

    test('return [3,2,1] if the input is [1,2,3]', () => {
        expect(reverseSingleLinkedList(SingleLinkedList.from([1, 2, 3]))).toEqual(SingleLinkedList.from([3, 2, 1]));
    });
});

describe('reverseDoubleLinkedList', () => {
    test('return null if the input is null', () => {
        expect(reverseDoubleLinkedList(null)).toBe(null);
    });

    test('return 1 if the input is 1', () => {
        expect(reverseDoubleLinkedList(new DoubleLinkedList(1))).toEqual(new DoubleLinkedList(1));
    });

    test('return [2,1] if the input is [1,2]', () => {
        expect(reverseDoubleLinkedList(DoubleLinkedList.from([1, 2]))).toEqual(DoubleLinkedList.from([2, 1]));
    });

    test('return [3,2,1] if the input is [1,2,3]', () => {
        expect(reverseDoubleLinkedList(DoubleLinkedList.from([1, 2, 3]))).toEqual(DoubleLinkedList.from([3, 2, 1]));
    });
});

describe('deleteNum', () => {
    test('return null if the input is null', () => {
        expect(deleteNum(null, 1)).toBe(null);
    });

    test('return null if the input is [1],1', () => {
        expect(deleteNum(SingleLinkedList.from([1]), 1)).toBe(null);
    });

    test('return 2 if the input is [1,1,2,1,1,1],1', () => {
        expect(deleteNum(SingleLinkedList.from([1, 1, 2, 1, 1, 1]), 1)).toEqual(new SingleLinkedList(2));
    });
});

describe('getMiddleNode', () => {
    it.each(getMiddleNodeTestData)('getMiddleNode %j', ({ input, expected }) => {
        const head = SingleLinkedList.from(input);

        expect(getMiddleNode(head)?.val).toBe(expected);
    });

    it.each(getMiddleNode2TestData)('getMiddleNode2 %j', ({ input, expected }) => {
        const head = SingleLinkedList.from(input);

        expect(getMiddleNode2(head)?.val).toBe(expected);
    });

    it.each(getMiddleNode3TestData)('getMiddleNode3 %j', ({ input, expected }) => {
        const head = SingleLinkedList.from(input);

        expect(getMiddleNode3(head)?.val).toBe(expected);
    });

    it.each(getMiddleNode4TestData)('getMiddleNode4 %j', ({ input, expected }) => {
        const head = SingleLinkedList.from(input);

        expect(getMiddleNode4(head)?.val).toBe(expected);
    });
});
