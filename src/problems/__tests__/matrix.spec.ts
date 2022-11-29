import { zigzagMatrix } from '../matrix';
import { zigzagMatrixTestData } from './matrix.testdata';

describe('zigzagMatrix', () => {
    it.each(zigzagMatrixTestData)('zigzagMatrix %j', ({ input, expected }) => {
        expect(zigzagMatrix(input)).toEqual(expected);
    });
});
