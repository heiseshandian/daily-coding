import { canSplit4Parts } from '../preprocessing';
import { canSplit4PartsTestData } from './preprocessing.testdata';

describe('canSplit4Parts', () => {
    it.each(canSplit4PartsTestData)('canSplit4Parts %j', ({ input, expected }) => {
        expect(canSplit4Parts(input)).toBe(expected);
    });
});
