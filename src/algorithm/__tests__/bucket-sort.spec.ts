import { countSort } from '../bucket-sort';
import { countSortTestData } from './bucket-sort.testdata';
describe('bucket-sort', () => {
    it.each(countSortTestData)('countSort', ({ input, expected }) => {
        expect(countSort(input)).toEqual(expected);
    });
});
