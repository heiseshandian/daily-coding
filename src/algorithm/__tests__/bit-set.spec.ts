import { BitSet } from '../bitSet';

describe('bit-set', () => {
  const len = 10000;
  const nums1 = Array(len)
    .fill(0)
    .map(() => (Math.random() * len) >>> 0);
  const nums2 = Array(len)
    .fill(0)
    .map(() => (Math.random() * len) >>> 0);

  const set = new Set(nums1);
  const bitSet = new BitSet(len);
  nums1.forEach((n) => {
    bitSet.add(n);
  });

  it.each(nums2)('has', (n) => {
    expect(set.has(n)).toEqual(bitSet.has(n));
  });

  it.each(nums2)('delete', (n) => {
    expect(set.has(n)).toEqual(bitSet.has(n));
    set.delete(n);
    bitSet.delete(n);
    expect(set.has(n)).toEqual(bitSet.has(n));
  });
});
