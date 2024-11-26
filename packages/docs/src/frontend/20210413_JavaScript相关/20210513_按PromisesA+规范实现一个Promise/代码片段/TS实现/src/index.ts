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

    // 根据规范完成 then 方法
    then(onfulfilled?: (value: T) => any, onrejected?: (value: any) => any) {
    // 2.2.1
        onfulfilled = typeof onfulfilled === 'function' ? onfulfilled : null;
        onrejected = typeof onrejected === 'function' ? onrejected : null;

        const nextPromise = new _Promise((nextResolve, nextReject) => {
            // 把 then 方法传入的回调函数整合一下
            const _handle = () => {
                if (this.status === PROMISE_STATUS.FULFILLED) {
                    // 状态为 fulfilled 时调用成功的回调函数
                    const x = onfulfilled && onfulfilled(this.value);
                    this._resolvePromise(nextPromise, x, nextResolve, nextReject);
                }

                if (this.status === PROMISE_STATUS.REJECTED) {
                    // 状态为 rejected 时调用失败的回调函数
                    if (onrejected) {
                        const x = onrejected(this.value);
                        this._resolvePromise(nextPromise, x, nextResolve, nextReject);
                    }
                    else {
                        nextReject(this.value);
                    }
                }
            };

            const handle = () => {
                // 支持微任务，这里执行 window.queueMicrotask
                queueMicrotask(_handle);
            };

            if (this.status === PROMISE_STATUS.PENDING) {
                // 当状态是 pending 时，把回调函数保存进 callback 里面
                this.callbacks.push(handle);
            }
            else {
                handle();
            }
        });

        return nextPromise;
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
        this.callbacks.forEach(fn => fn());
    };

    // 传入 executor 方法的第二个参数，调用此方法就是失败
    private _reject = (value) => {
    // 只有是 pending 状态才可以更新状态，防止二次调用
        if (this.status !== PROMISE_STATUS.PENDING) { return; }

        this.status = PROMISE_STATUS.REJECTED;
        this.value = value;
        this.callbacks.forEach(fn => fn());
    };

    private _resolvePromise = <T>(nextPromise: _Promise<T>, x: any, resolve, reject) => {
    // 2.3.1 nextPromise 不能和 x 相等
        if (nextPromise === x) {
            return reject(new TypeError('The promise and the return value are the same'));
        }

        // 2.3.2 如果 x 是 Promise 返回 x 的状态和值
        if (x instanceof _Promise) {
            x.then(resolve, reject);
        }

        // 2.3.3 如果 x 是对象或者函数执行 if 里面的逻辑
        if (typeof x === 'object' || typeof x === 'function') {
            if (x === null) {
                return resolve(x);
            }

            // 2.3.3.1
            let then;
            try {
                then = x.then;
            }
            catch (error) {
                return reject(error);
            }

            // 2.3.3.3
            if (typeof then === 'function') {
                // 声明 called 在调用过一次 resolve 或者 reject 之后，修改为 true ，保证只能调用一次
                let called = false;
                try {
                    then.call(
                        x,
                        (y) => {
                            if (called) { return; } // 2.3.3.3.4.1
                            called = true;
                            // 递归解析的过程（因为可能 promise 中还有 promise）
                            this._resolvePromise(nextPromise, y, resolve, reject);
                        },
                        (r) => {
                            if (called) { return; } // 2.3.3.3.4.1
                            called = true;
                            reject(r);
                        },
                    );
                }
                catch (e) {
                    if (called) { return; } // 2.3.3.3.4.1
                    // 2.3.3.3.4
                    reject(e);
                }
            }
            else {
                // 2.3.3.4
                resolve(x);
            }
        }
        else {
            // 2.3.4
            resolve(x);
        }
    };

    catch(onrejected) {
        return this.then(null, onrejected);
    }

    finally(cb) {
        return this.then(
            value => _Promise.resolve(cb()).then(() => value),
            reason =>
                _Promise.resolve(cb()).then(() => {
                    throw reason;
                }),
        );
    }

    static resolve(value) {
        if (value instanceof _Promise) {
            return value;
        }

        return new _Promise((resolve) => {
            resolve(value);
        });
    }

    static reject(reason) {
        return new _Promise((resolve, reject) => {
            reject(reason);
        });
    }

    static race(promises) {
        return new _Promise((resolve, reject) => {
            if (!Array.isArray(promises)) {
                return reject(new TypeError('Promise.race accepts an array'));
            }
            for (let i = 0, len = promises.length; i < len; i++) {
                _Promise.resolve(promises[i]).then(resolve, reject);
            }
        });
    }

    static all(promises) {
        const result = [];
        let i = 0;

        return new _Promise((resolve, reject) => {
            const processValue = (index, value) => {
                result[index] = value;
                i++;
                if (i === promises.length) {
                    resolve(result);
                }
            };
            for (let index = 0; index < promises.length; index++) {
                promises[index].then((value) => {
                    processValue(index, value);
                }, reject);
            }
        });
    }

    static allSettled(promises) {
        const result = [];
        let i = 0;
        return new _Promise((resolve) => {
            const processValue = (index, value, status: 'fulfilled' | 'rejected') => {
                result[index] = { status, value };
                i++;
                if (i === promises.length) {
                    resolve(result);
                }
            };

            for (let index = 0; index < promises.length; index++) {
                promises[index].then(
                    (value) => {
                        processValue(index, value, 'fulfilled');
                    },
                    (value) => {
                        processValue(index, value, 'rejected');
                    },
                );
            }
        });
    }
}

;(_Promise as any).deferred = function () {
    const dfd = {} as any;
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
};

module.exports = _Promise;

export { _Promise };
