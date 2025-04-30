import { debounce } from '../coding.js';
import { EventEmitter } from '../coding.js';
import { P } from '../coding.js';

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
