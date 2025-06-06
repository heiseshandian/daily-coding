import { SlidingWindow } from '../sliding-window';

describe('SlidingWindow', () => {
  const arr = [4, 3, 5, 4, 3, 3, 6, 7];

  test('moveRight moveLeft getMax', () => {
    const slidingWindow = new SlidingWindow(arr);

    slidingWindow.moveRight();
    slidingWindow.moveRight();

    expect(slidingWindow.doubleQueue).toEqual([0, 1]);
    expect(slidingWindow.peek()).toBe(4);

    slidingWindow.moveLeft();
    expect(slidingWindow.doubleQueue).toEqual([1]);
    expect(slidingWindow.peek()).toBe(3);
  });

  test('moveRight moveLeft getMax 2', () => {
    const slidingWindow = new SlidingWindow(arr);

    slidingWindow.moveRight();
    slidingWindow.moveRight();
    slidingWindow.moveRight();
    slidingWindow.moveRight();

    expect(slidingWindow.doubleQueue).toEqual([2, 3]);
    expect(slidingWindow.peek()).toBe(5);

    slidingWindow.moveLeft();

    expect(slidingWindow.doubleQueue).toEqual([2, 3]);
    expect(slidingWindow.peek()).toBe(5);

    slidingWindow.moveLeft();
    slidingWindow.moveLeft();

    expect(slidingWindow.doubleQueue).toEqual([3]);
    expect(slidingWindow.peek()).toBe(4);
  });
});
