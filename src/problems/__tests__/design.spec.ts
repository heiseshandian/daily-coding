import { MedianFinderTestData } from './design.testdata';
import { IMedianFinder, MedianFinder, MedianFinder2 } from '../design';
describe('design', () => {
    it.each(MedianFinderTestData)('MedianFinder', ({ input, expected }) => {
        const finder = new MedianFinder();
        const finder2 = new MedianFinder2();

        const getResult = (arr: number[][], f: IMedianFinder) => {
            return arr
                .map((val) => {
                    if (val.length === 0) {
                        return f.findMedian();
                    }
                    return f.addNum(val[0]);
                })
                .filter((val) => val !== undefined);
        };

        const result1 = getResult(input, finder);
        const result2 = getResult(input, finder2);

        expect(result1).toEqual(expected);
        expect(result2).toEqual(expected);
    });
});
