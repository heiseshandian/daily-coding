import { circleMatrix, zigzagMatrix } from '../matrix';
import { zigzagMatrixTestData, circleMatrixTestData } from './matrix.testdata';

describe('zigzagMatrix', () => {
    it.each(zigzagMatrixTestData)('zigzagMatrix %j', ({ input, expected }) => {
        expect(zigzagMatrix(input)).toEqual(expected);
    });
});

describe('circleMatrix', () => {
    it.each(circleMatrixTestData)('circleMatrix %j', ({ input, expected }) => {
        expect(circleMatrix(input)).toEqual(expected);
    });
});
