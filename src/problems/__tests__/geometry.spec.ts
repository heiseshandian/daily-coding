import { getSkylineTestData } from './geometry.testdata';
import { getSkyline } from '../geometry';
describe('geometry', () => {
  it.each(getSkylineTestData)('getSkyLine', ({ input, expected }) => {
    expect(getSkyline(input)).toEqual(expected);
  });
});
