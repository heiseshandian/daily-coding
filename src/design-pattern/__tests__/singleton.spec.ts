/**
 * @jest-environment jsdom
 */
import { getLoginLayer2, getLoginLayer, getSingleClass } from '../singleton';

test('getLoginLayer', () => {
    expect(getLoginLayer()).toBe(getLoginLayer());
});

test('getLoginLayer2', () => {
    expect(getLoginLayer2()).toBe(getLoginLayer2());
});

test('getSingleClass', () => {
    class Tmp {}

    expect(new Tmp()).not.toBe(new Tmp());
    const getSingleInstance = getSingleClass(Tmp);
    expect(getSingleInstance()).toBe(getSingleInstance());
});
