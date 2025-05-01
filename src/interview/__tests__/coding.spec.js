import { debounce } from '../coding.js';
import { EventEmitter } from '../coding.js';
import { P } from '../coding.js';
import { throttle } from '../coding.js';

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

describe('EventEmitter 类测试', () => {
  let eventEmitter;

  beforeEach(() => {
    eventEmitter = new EventEmitter();
  });

  it('应正确注册事件处理函数', () => {
    const mockHandler = jest.fn();
    eventEmitter.on('testEvent', mockHandler);
    expect(eventEmitter.events['testEvent']).toContain(mockHandler);
  });

  it('应正确触发事件处理函数', () => {
    const mockHandler = jest.fn();
    eventEmitter.on('testEvent', mockHandler);
    eventEmitter.emit('testEvent', 'arg1', 'arg2');
    expect(mockHandler).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('应正确移除特定事件处理函数', () => {
    const mockHandler1 = jest.fn();
    const mockHandler2 = jest.fn();
    eventEmitter.on('testEvent', mockHandler1);
    eventEmitter.on('testEvent', mockHandler2);
    eventEmitter.off('testEvent', mockHandler1);
    expect(eventEmitter.events['testEvent']).not.toContain(mockHandler1);
    expect(eventEmitter.events['testEvent']).toContain(mockHandler2);
  });

  it('应正确移除所有事件处理函数', () => {
    const mockHandler = jest.fn();
    eventEmitter.on('testEvent', mockHandler);
    eventEmitter.off('testEvent');
    expect(eventEmitter.events['testEvent']).toBeUndefined();
  });

  it('应正确执行一次性事件处理函数', () => {
    const mockHandler = jest.fn();
    eventEmitter.once('testEvent', mockHandler);
    eventEmitter.emit('testEvent');
    eventEmitter.emit('testEvent');
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });
});

describe('P 类测试', () => {
  it('应正确处理 resolve 状态', (done) => {
    new P((resolve) => {
      resolve(42);
    }).then((value) => {
      expect(value).toBe(42);
      done();
    });
  });

  it('应正确处理 reject 状态', (done) => {
    const error = new Error('Test error');
    new P((_, reject) => {
      reject(error);
    }).then(null, (reason) => {
      expect(reason).toBe(error);
      done();
    });
  });

  it('应支持 then 方法链式调用', (done) => {
    new P((resolve) => {
      resolve(1);
    })
      .then((value) => value * 2)
      .then((value) => value + 3)
      .then((value) => {
        expect(value).toBe(5);
        done();
      });
  });

  it('应捕获 executor 中的异常', (done) => {
    const error = new Error('Test error');
    new P(() => {
      throw error;
    }).then(null, (reason) => {
      expect(reason).toBe(error);
      done();
    });
  });
});

describe('throttle 函数测试', () => {
  it('leading 为 true 且 trailing 为 true 时应按预期节流', (done) => {
    const mockFn = jest.fn();
    const throttled = throttle(mockFn, 100, { leading: true, trailing: true });

    throttled();
    expect(mockFn).toHaveBeenCalledTimes(1);

    throttled();
    expect(mockFn).toHaveBeenCalledTimes(1);

    setTimeout(() => {
      throttled();
      expect(mockFn).toHaveBeenCalledTimes(2);
      done();
    }, 150);
  });

  it('leading 为 false 且 trailing 为 true 时应延迟首次执行', (done) => {
    const mockFn = jest.fn();
    const throttled = throttle(mockFn, 100, { leading: false, trailing: true });

    throttled();
    expect(mockFn).toHaveBeenCalledTimes(0);

    setTimeout(() => {
      expect(mockFn).toHaveBeenCalledTimes(1);
      done();
    }, 150);
  });

  it('leading 为 true 且 trailing 为 false 时应只执行首次调用', (done) => {
    const mockFn = jest.fn();
    const throttled = throttle(mockFn, 100, { leading: true, trailing: false });

    throttled();
    expect(mockFn).toHaveBeenCalledTimes(1);

    throttled();
    expect(mockFn).toHaveBeenCalledTimes(1);

    setTimeout(() => {
      throttled();
      expect(mockFn).toHaveBeenCalledTimes(2);
      done();
    }, 150);
  });

  it('函数抛出错误时应正确传递错误', () => {
    const error = new Error('Test error');
    const errorFn = jest.fn(() => {
      throw error;
    });
    const throttled = throttle(errorFn, 100);

    expect(() => throttled()).toThrow(error);
  });

  it('cancel 方法应停止节流并重置状态', () => {
    const mockFn = jest.fn();
    const throttled = throttle(mockFn, 100);

    throttled();
    expect(mockFn).toHaveBeenCalledTimes(1);

    throttled.cancel();
    throttled();
    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});
