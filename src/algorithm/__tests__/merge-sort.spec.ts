import { mergeSort, mergeSort2 } from '../merge-sort';

describe('mergeSort', () => {
    test('input empty array output empty array', () => {
        const input: number[] = [];
        const expected: number[] = [];
        mergeSort(input);

        expect(input).toEqual(expected);
    });

    test('input [1] output [1]', () => {
        const input = [1];
        const expected = [1];
        mergeSort(input);

        expect(input).toEqual(expected);
    });

    test('input 3,5,2,1,4,3 output 1,2,3,3,4,5', () => {
        const input = [3, 5, 2, 1, 4, 3];
        const expected = [1, 2, 3, 3, 4, 5];
        mergeSort(input);

        expect(input).toEqual(expected);
    });

    test('input 3,5,2,1,4,3,10,2,11,24,0 output 0,1,2,2,3,3,4,5,10,11,24', () => {
        const input = [3, 5, 2, 1, 4, 3, 10, 2, 11, 24, 0];
        const expected = [0, 1, 2, 2, 3, 3, 4, 5, 10, 11, 24];
        mergeSort(input);

        expect(input).toEqual(expected);
    });
});

describe('mergeSort2', () => {
    test('input empty array output empty array', () => {
        const input: number[] = [];
        const expected: number[] = [];
        mergeSort2(input);

        expect(input).toEqual(expected);
    });

    test('input [1] output [1]', () => {
        const input = [1];
        const expected = [1];
        mergeSort2(input);

        expect(input).toEqual(expected);
    });

    test('input 3,5,2,1,4,3 output 1,2,3,3,4,5', () => {
        const input = [3, 5, 2, 1, 4, 3];
        const expected = [1, 2, 3, 3, 4, 5];
        mergeSort2(input);

        expect(input).toEqual(expected);
    });

    test('input 3,5,2,1,4,3,10,2,11,24,0 output 0,1,2,2,3,3,4,5,10,11,24', () => {
        const input = [3, 5, 2, 1, 4, 3, 10, 2, 11, 24, 0];
        const expected = [0, 1, 2, 2, 3, 3, 4, 5, 10, 11, 24];
        mergeSort2(input);

        expect(input).toEqual(expected);
    });
});
