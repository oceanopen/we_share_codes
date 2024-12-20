// 使用枚举定义 Promise 的状态
enum PROMISE_STATUS {
  PENDING,
  FULFILLED,
  REJECTED,
}

class _Promise<T> {
  // 保存当前状态
  private status = PROMISE_STATUS.PENDING;
  // 保存 resolve 的值，或者 reject 的原因
  private value: T;
  // 保存 then 方法传入的回调函数
  private callbacks = [];

  constructor(executor: (resolve: (value: T) => void, reject: (reason: any) => void) => void) {
    executor(this._resolve, this._reject);
  }

  // 根据规范完成简易功能的 then 方法
  then(onfulfilled: (value: T) => any, onrejected: (value: any) => any) {
    // 2.2.1
    onfulfilled = typeof onfulfilled === 'function' ? onfulfilled : null;
    onrejected = typeof onrejected === 'function' ? onrejected : null;

    // 把 then 方法传入的回调函数整合一下
    const handle = () => {
      if (this.status === PROMISE_STATUS.FULFILLED) {
        // 状态为 fulfilled 时调用成功的回调函数
        onfulfilled && onfulfilled(this.value);
      }

      if (this.status === PROMISE_STATUS.REJECTED) {
        // 状态为 rejected 时调用失败的回调函数
        onrejected && onrejected(this.value);
      }
    };

    if (this.status === PROMISE_STATUS.PENDING) {
      // 当状态是 pending 时，把回调函数保存进 callback 里面
      this.callbacks.push(handle);
    }

    handle();
  }

  // 传入 executor 方法的第一个参数，调用此方法就是成功
  private _resolve = (value) => {
    if (value === this) {
      throw new TypeError('A promise cannot be resolved with itself.');
    }

    // 只有是 pending 状态才可以更新状态，防止二次调用
    if (this.status !== PROMISE_STATUS.PENDING) { return; }

    this.status = PROMISE_STATUS.FULFILLED;
    this.value = value;

    // 遍历执行回调
    this.callbacks.forEach(fn => fn());
  };

  // 传入 executor 方法的第二个参数，调用此方法就是失败
  private _reject = (value) => {
    // 只有是 pending 状态才可以更新状态，防止二次调用
    if (this.status !== PROMISE_STATUS.PENDING) { return; }

    this.status = PROMISE_STATUS.REJECTED;
    this.value = value;

    // 遍历执行回调
    this.callbacks.forEach(fn => fn());
  };
}

export { _Promise };
