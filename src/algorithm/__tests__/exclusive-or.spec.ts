import { getRightOne } from '../exclusive-or';

describe('getRightOne', () => {
  test('input 6(110) return 2(10)', () => {
    expect(getRightOne(6)).toBe(2);
  });

  test('input 7(111) return 1(1)', () => {
    expect(getRightOne(6)).toBe(2);
  });

  test('input 11(1011) return 1(1)', () => {
    expect(getRightOne(6)).toBe(2);
  });
});
