/**
 * @jest-environment jsdom
 */
import { getLoginLayer2, getLoginLayer } from '../singleton';

test('getLoginLayer', () => {
    expect(getLoginLayer()).toBe(getLoginLayer());
});

test('getLoginLayer2', () => {
    expect(getLoginLayer2()).toBe(getLoginLayer2());
});
