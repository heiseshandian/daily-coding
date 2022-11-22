import { times } from '../../common';
import { Heap, heapSort } from '../heap';
import { sortTestData } from './sort.testdata';

describe('Heap', () => {
    test('isEmpty', () => {
        const heap = new Heap();
        expect(heap.isEmpty()).toBe(true);
    });

    const testData = [
        { input: [1, 3, 5, 4, 2, 0, 9], expected: [9, 5, 4, 3, 2, 1, 0] },
        { input: [1, 3, 5, 3, 2, 0, 9, 10], expected: [10, 9, 5, 3, 3, 2, 1, 0] },
    ];
    it.each(testData)('Heap %j', ({ input, expected }) => {
        const heap = new Heap();
        input.forEach((val) => heap.push(val));

        expect(times(input.length, () => heap.pop())).toEqual(expected);
        expect(heap.isEmpty()).toBe(true);
    });
});

describe('heapSort', () => {
    it.each(sortTestData)('heapSort %j', ({ input, expected }) => {
        const clone = input.slice();
        heapSort(clone);
        expect(clone).toEqual(expected);
    });
});
