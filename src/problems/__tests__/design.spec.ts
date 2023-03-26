import { MedianFinderTestData } from './design.testdata';
import { MedianFinder } from '../design';
describe('design', () => {
    it.each(MedianFinderTestData)('MedianFinder', ({ input, expected }) => {
        const finder = new MedianFinder();
        const result = input
            .map((val) => {
                if (val.length === 0) {
                    return finder.findMedian();
                }
                return finder.addNum(val[0]);
            })
            .filter((val) => val !== undefined);

        expect(result).toEqual(expected);
    });
});
