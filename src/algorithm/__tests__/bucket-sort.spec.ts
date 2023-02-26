import { baseSort, countSort } from '../bucket-sort';
import { baseSortTestData, countSortTestData } from './bucket-sort.testdata';
describe('bucket-sort', () => {
    it.each(countSortTestData)('countSort', ({ input, expected }) => {
        expect(countSort(input)).toEqual(expected);
    });

    it.each(baseSortTestData)('baseSort', ({ input, expected }) => {
        expect(baseSort(input)).toEqual(expected);
    });
});
