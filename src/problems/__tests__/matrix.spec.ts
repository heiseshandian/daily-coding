import { circleMatrix, generateMatrix, zigzagMatrix } from '../matrix';
import { zigzagMatrixTestData, circleMatrixTestData, generateMatrixTestData } from './matrix.testdata';

describe('matrix', () => {
    it.each(zigzagMatrixTestData)('zigzagMatrix %j', ({ input, expected }) => {
        expect(zigzagMatrix(input)).toEqual(expected);
    });

    it.each(circleMatrixTestData)('circleMatrix %j', ({ input, expected }) => {
        expect(circleMatrix(input)).toEqual(expected);
    });

    it.each(generateMatrixTestData)('generateMatrix', ({ input, expected }) => {
        expect(generateMatrix(input)).toEqual(expected);
    });
});
