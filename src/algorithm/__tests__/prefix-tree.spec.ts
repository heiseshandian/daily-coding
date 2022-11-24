import { PrefixTree } from '../prefix-tree';
import { searchTestData, deleteTestData, prefixTestData } from './prefix-tree.testdata';

describe('PrefixTree', () => {
    it.each(searchTestData)('search', ({ input, searchWord, expected }) => {
        const prefixTree = initPrefixTree(input);

        expect(prefixTree.search(searchWord)).toBe(expected);
    });

    it.each(deleteTestData)('delete', ({ input, deleteWord, searchWord, expected }) => {
        const prefixTree = initPrefixTree(input);

        prefixTree.delete(deleteWord);
        expect(prefixTree.search(searchWord)).toBe(expected);
    });

    it.each(prefixTestData)('prefix', ({ input, prefixWord, expected }) => {
        const prefixTree = initPrefixTree(input);

        expect(prefixTree.prefixCount(prefixWord)).toBe(expected);
    });
});

function initPrefixTree(input: string[]) {
    const prefixTree = new PrefixTree();
    input.forEach((word) => prefixTree.add(word));

    return prefixTree;
}
