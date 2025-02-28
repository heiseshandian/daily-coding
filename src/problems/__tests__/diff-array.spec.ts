import { carPooling } from '../diff-array';
import { carPoolingTestData } from './diff-array.testdata';

describe('diff-array', () => {
  it.each(carPoolingTestData)(
    'carPooling',
    ({ input: { trips, capacity }, expected }) => {
      expect(carPooling(trips, capacity)).toBe(expected);
    }
  );
});
