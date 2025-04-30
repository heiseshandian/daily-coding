import { debounce } from '../coding.js';

describe('debounce 函数测试', () => {
  it('函数抛出错误时应正确传递错误', async () => {
    const error = new Error('Test error');
    const errorFn = jest.fn(() => {
      throw error;
    });
    const debounced = debounce(errorFn, 100);

    await expect(debounced()).rejects.toThrow(error);
  });

  it('leading 选项为 true 时应立即执行', async () => {
    const mockFn = jest.fn();
    const debounced = debounce(mockFn, 100, true);

    debounced();
    expect(mockFn).toHaveBeenCalledTimes(1);

    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('leading 选项为 true 时多次调用应在延迟后再次执行', async () => {
    const mockFn = jest.fn();
    const debounced = debounce(mockFn, 100, true);

    debounced();
    expect(mockFn).toHaveBeenCalledTimes(1);

    debounced();
    expect(mockFn).toHaveBeenCalledTimes(1);

    await new Promise((resolve) => setTimeout(resolve, 150));
    debounced();
    expect(mockFn).toHaveBeenCalledTimes(3);
  });

  it('应正确保存 this 上下文', async () => {
    const context = { value: 42 };
    const mockFn = jest.fn(function () {
      expect(this).toBe(context);
    });
    const debounced = debounce(mockFn.bind(context), 100);

    await debounced();
    expect(mockFn).toHaveBeenCalled();
  });

  it('应正确传递参数', async () => {
    const mockFn = jest.fn();
    const debounced = debounce(mockFn, 100);
    const args = [1, 'test', true];

    await debounced(...args);
    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(mockFn).toHaveBeenCalledWith(...args);
  });
});
