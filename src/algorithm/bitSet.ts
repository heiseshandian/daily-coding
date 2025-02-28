export class BitSet {
  bits: number[];

  constructor(n: number) {
    this.bits = Array((n >> 5) + 1).fill(0);
  }

  public add(x: number) {
    if (x < 0 || !Number.isInteger(x)) {
      throw new Error(`${x} should be non-negative integers`);
    }
    const index = x >> 5;
    if (index >= this.bits.length) {
      throw new Error(`${x} is out of range`);
    }

    const bit = x % 32;
    this.bits[index] |= 1 << bit;
  }

  public has(x: number) {
    const index = x >> 5;
    if (index >= this.bits.length) {
      return false;
    }

    const bit = x % 32;
    return Boolean(this.bits[index] & (1 << bit));
  }

  public delete(x: number) {
    const index = x >> 5;
    if (index >= this.bits.length) {
      return;
    }

    const bit = x % 32;
    const mask = ~(1 << bit);
    this.bits[index] &= mask;
  }
}
