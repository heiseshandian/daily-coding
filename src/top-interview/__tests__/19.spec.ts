import { SingleLinkedList } from '../../algorithm/linked-list';
import { removeNthFromEnd } from '../19';

describe('removeNthFromEnd', () => {
    const testData = [
        {
            input: {
                arr: [1, 2, 3, 4, 5],
                n: 2,
            },
            expected: [1, 2, 3, 5],
        },
        {
            input: {
                arr: [1, 2, 3, 4, 5],
                n: 3,
            },
            expected: [1, 2, 4, 5],
        },
        {
            input: {
                arr: [1, 2, 3, 4, 5],
                n: 5,
            },
            expected: [2, 3, 4, 5],
        },
        {
            input: {
                arr: [1, 2, 3, 4, 5],
                n: 1,
            },
            expected: [1, 2, 3, 4],
        },
        {
            input: {
                arr: [1],
                n: 1,
            },
            expected: [],
        },
        {
            input: {
                arr: [1, 2],
                n: 1,
            },
            expected: [1],
        },
    ];

    it.each(testData)('threeSum %j', ({ input: { arr, n }, expected }) => {
        const head = removeNthFromEnd(SingleLinkedList.from(arr), n);
        expect(SingleLinkedList.toArray(head)).toEqual(expected);
    });
});
