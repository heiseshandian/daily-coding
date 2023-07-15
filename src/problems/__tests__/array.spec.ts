import { maxNumOfMarkedIndices } from '../array';
import { maxNumOfMarkedIndicesTestData } from './array.testdata';

describe('array', () => {
    it.each(maxNumOfMarkedIndicesTestData)('maxNumOfMarkedIndices', ({ input, expected }) => {
        expect(maxNumOfMarkedIndices(input)).toBe(expected);
    });
});
