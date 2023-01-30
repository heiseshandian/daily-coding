import { getIndexOf } from '../str';

describe('getIndexOf', () => {
    const strs = [
        ['erqw1234eqwewe', '1234'],
        ['erqw1234eqwewe', 'ab'],
        ['erqw1234eqwewe', ''],
        ['erqw1234eqwewe', 'we'],
        ['erqw1234eqwewe', '43'],
        ['erqw1234eqwewe', '12'],
        ['test1', 'te'],
        ['erqw1234eqwewe', 'test'],
    ];

    it.each(strs)('getIndexOf %j', ([str1, str2]) => {
        expect(getIndexOf(str1, str2)).toBe(str1.indexOf(str2));
    });
});
