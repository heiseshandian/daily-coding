import { quickSort } from '../quick-sort';
import { sortTestData } from './sort.testdata';

describe('mergeSort', () => {
    it.each(sortTestData)('mergeSort %j', ({ input, expected }) => {
        const clone = input.slice();
        quickSort(clone);

        expect(clone).toEqual(expected);
    });
});
