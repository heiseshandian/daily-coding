import { MedianFinderTestData } from './design.testdata';
import { IMedianFinder, MedianFinder, MedianFinder2, WordDictionary } from '../design';
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

    describe('WordDictionary', () => {
        let wordDictionary: WordDictionary;

        beforeEach(() => {
            wordDictionary = new WordDictionary();
        });

        test('search returns true for added words', () => {
            wordDictionary.addWord('hello');
            wordDictionary.addWord('world');

            expect(wordDictionary.search('hello')).toBe(true);
            expect(wordDictionary.search('world')).toBe(true);
        });

        test('search returns false for non-existent words', () => {
            wordDictionary.addWord('hello');
            wordDictionary.addWord('world');

            expect(wordDictionary.search('h')).toBe(false);
            expect(wordDictionary.search('wo')).toBe(false);
        });

        test('search returns true for wildcard matches', () => {
            wordDictionary.addWord('hello');
            wordDictionary.addWord('world');

            expect(wordDictionary.search('h.llo')).toBe(true);
            expect(wordDictionary.search('w.rld')).toBe(true);
            expect(wordDictionary.search('h..lo')).toBe(true);
            expect(wordDictionary.search('w..ld')).toBe(true);
        });

        test('search returns false for empty string', () => {
            wordDictionary.addWord('hello');
            wordDictionary.addWord('world');

            expect(wordDictionary.search('')).toBe(false);
        });
    });
});
