import { maximumUnits, sortBoxTypes } from '../index';
import { maximumUnitsTestData, sortBoxTypesTestData } from './index.testdata';

describe('sortBoxTypes', () => {
  it.each(sortBoxTypesTestData)('%j', ({ input, expected }) => {
    expect(sortBoxTypes(input)).toEqual(expected);
  });
});

describe('maximumUnits', () => {
  it.each(maximumUnitsTestData)(
    '%j',
    ({ input: { boxTypes, truckSize }, expected }) => {
      expect(maximumUnits(boxTypes, truckSize)).toBe(expected);
    }
  );
});
