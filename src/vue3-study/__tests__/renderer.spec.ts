import { normalizeClass } from '../renderer';

describe('renderer', () => {
  test('normalizeClass', () => {
    expect(normalizeClass('class1 class2')).toBe('class1 class2');

    expect(
      normalizeClass([
        'class1',
        {
          class2: false,
          class3: true,
        },
      ])
    ).toBe('class1 class3');

    expect(
      normalizeClass({
        class3: false,
        class4: true,
      })
    ).toBe('class4');
  });
});
