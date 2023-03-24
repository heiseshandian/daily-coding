import { kthSmallestTestData } from './tree.testdata';
import { kthSmallest } from '../tree';
import { deserializeByLevel } from '../../algorithm/tree';
describe('tree', () => {
    it.each(kthSmallestTestData)('kthSmallest', ({ input: { tree, k }, expected }) => {
        const root = deserializeByLevel(tree);
        expect(kthSmallest(root, k)).toBe(expected);
    });
});
