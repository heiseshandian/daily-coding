import { LRUCache } from '../LRU';

describe('LRUCache', () => {
    test('Will throw error if the provided capacity less than 1', () => {
        expect(() => new LRUCache(0)).toThrow('capacity should be greater than 1');
    });

    test('Can set and get data successfully if capacity is not reached', () => {
        const cache = new LRUCache(2);

        cache.set('A', 'A');
        cache.set('B', 'B');

        expect(cache.get('A')).toBe('A');
        expect(cache.get('B')).toBe('B');
    });

    test('Least used data will be removed if capacity is reached, set new data', () => {
        const cache = new LRUCache(2);

        cache.set('A', 'A');
        cache.set('B', 'B');
        cache.set('D', 'D');

        expect(cache.get('A')).toBe(undefined);
        expect(cache.get('B')).toBe('B');
        expect(cache.get('D')).toBe('D');
    });

    test('Least used data will be removed if capacity is reached, set existing data', () => {
        const cache = new LRUCache(2);

        cache.set('A', 'A');
        cache.set('B', 'B');
        cache.set('A', 'C');
        cache.set('D', 'D');

        expect(cache.get('A')).toBe('C');
        expect(cache.get('B')).toBe(undefined);
        expect(cache.get('D')).toBe('D');
    });

    test('Least used data will be removed if capacity is reached, get existing data', () => {
        const cache = new LRUCache(2);

        cache.set('A', 'A');
        cache.set('B', 'B');
        cache.get('A');
        cache.set('D', 'D');

        expect(cache.get('A')).toBe('A');
        expect(cache.get('B')).toBe(undefined);
        expect(cache.get('D')).toBe('D');
    });
});
