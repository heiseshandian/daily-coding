import { PrefixTree } from '../prefix-tree';
import { searchTestData, deleteTestData } from './prefix-tree.testdata';

describe('PrefixTree', () => {
    it.each(searchTestData)('search', ({ input, searchWord, expected }) => {
        const prefixTree = new PrefixTree();
        input.forEach((word) => prefixTree.add(word));

        expect(prefixTree.search(searchWord)).toBe(expected);
    });

    it.each(deleteTestData)('delete', ({ input, deleteWord, searchWord, expected }) => {
        const prefixTree = new PrefixTree();
        input.forEach((word) => prefixTree.add(word));

        prefixTree.delete(deleteWord);
        expect(prefixTree.search(searchWord)).toBe(expected);
    });
});
