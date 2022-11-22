import { quickSort } from '../quick-sort';
import { sortTestData } from './sort.testdata';

describe('mergeSort', () => {
    it.each(sortTestData)('mergeSort %j', ({ input, expected }) => {
        quickSort(input);

        expect(input).toEqual(expected);
    });
});
