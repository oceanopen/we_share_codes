/**
 * 功能描述：
 * 线程池大小为 3 ，有 ABCDE 5 个任务，其中 任务X 执行 fail 时候需要重试，最大重试 3 次。需要等 ABCDE 所有执行完成才能返回。
 *
 * 异步任务队列，可能有很多个，比如 1000 个，全部同时执行是不现实的。
 * 所以需要按线程池的思路进行拆分，每个线程池单独进行处理。这样如果有个别进程失败，就直接返回了。就不用所有任务都执行。
 *
 * 实现思路：
 * 1. 线程池拆分单独处理。
 * 2. 如有任务需要重试，那么生成任务的时候，就要生成可重试的任务。如果具体执行过程中再去判断重试，就比较复杂了。
 */

/**
 * 异步任务线程池封装
 * @param {*} poolLimit 线程池大小
 * @param {*} taskList 异步任务队列
 */
async function asyncPool(poolLimit = 3, taskList = []) {
    return new Promise((resolve, reject) => {
    /**
     * 把任务队列，根据单个线程池限制进行拆分处理，如：
     * [A, B, C, D, E] => [[A, B, C], [D, E]]
     */
        const poolTaskList = [];
        taskList.forEach(async (item, index) => {
            if (index % poolLimit === 0) {
                poolTaskList.push([]);
            }
            poolTaskList[poolTaskList.length - 1].push(item);
        });

        /**
         * 遍历线程池列表，进行分别异步处理
         */
        let completeNum = 0; // 已执行线程池的数量
        poolTaskList.forEach(async (poolList, index) => {
            console.log(`第${index}个线程池，线程池任务数量:${poolList.length}`);

            let currentResultFail = null;
            try {
                await Promise.all(poolList);
            }
            catch (err) {
                currentResultFail = err;
            }
            completeNum++;

            console.log(`第${index}个线程池执行结果 || `, currentResultFail ? 'fail' : 'ok');

            if (currentResultFail || completeNum === poolTaskList.length) {
                if (currentResultFail) {
                    return reject(currentResultFail);
                }
                else {
                    return resolve(true);
                }
            }
        });
    });
}

/**
 * 重试请求封装
 */
class Retry {
    times = 3; // 重试次数
    ms = 3000; // 延迟执行时间
    callback = null; // 回调方法

    /**
     * 构造函数
     * @param {*} times 重试次数
     * @param {*} ms 重试延迟执行时间
     * @param {*} callback 失败回调，目前仅打印日志
     */
    constructor(times, ms, callback) {
        this.times = times;
        this.ms = ms;
        this.callback = callback;
    }

    /**
     * 延迟执行
     * @param ms 毫秒
     */
    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 执行重试
     * @param asyncTask 异步任务
     * @param times 执行次数
     */
    async work(asyncTask, times) {
        times = times || 1;
        try {
            await asyncTask();
            console.log('times:', times);
            return Promise.resolve(true);
        }
        catch (err) {
            this.callback && this.callback(times, err);
            // 如果失败没有到重试上限，继续重试
            if (times < this.times) {
                await Retry.delay(this.ms);
                await this.work(asyncTask, times + 1);
            }
            else {
                // 否则返回错误结果
                return Promise.reject(err);
            }
        }
    }
}

/**
 * 重试异步任务封装
 * @param {*} asyncTask 异步任务
 * @param {*} retryTimeLimit 重试次数限制
 * @param {*} retryTimeDelay 重试延迟时间
 */
async function asyncTaskRetry(asyncTask, retryTimeLimit = 3, retryTimeDelay = 3000) {
    // 生成重试实例，回调函数中可打印具体哪个任务在重试，以便跟踪问题，这里忽略
    const retry = new Retry(retryTimeLimit, retryTimeDelay, (count, err) => {
        console.log(`第${count}次重试 || err:`, err);
    });

    return retry.work(asyncTask);
}

/** *******  以下为测试代码  */

let retryNum = 0;
/**
 * 测试异步任务队列
 */
const taskList = [
    new Promise((resolve) => {
        setTimeout(() => {
            resolve(1);
        }, 100);
    }),
    new Promise((resolve) => {
        setTimeout(() => {
            resolve(2);
        }, 200);
    }),
    new Promise((resolve) => {
        setTimeout(() => {
            resolve(3);
        }, 300);
    }),
    new Promise((resolve) => {
        setTimeout(() => {
            resolve(4);
        }, 400);
    }),
    new Promise((resolve) => {
        setTimeout(() => {
            resolve(5);
        }, 500);
    }),
    // 直接返回成功实例
    asyncTaskRetry(() => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(6);
            }, 600);
        });
    }),
    // 重试返回成功实例
    asyncTaskRetry(() => {
        return new Promise((resolve, reject) => {
            console.log('执行次数：', retryNum);
            if (retryNum === 1) {
                setTimeout(() => {
                    resolve(7);
                }, 700);
            }
            else {
                setTimeout(() => {
                    reject(new Error('7'));
                    retryNum++;
                }, 700);
            }
        });
    }),
    // 失败重试实例
    asyncTaskRetry(() => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error('8'));
            }, 800);
        });
    }),
];

/**
 * 调用看下测试结果
 */
asyncPool(3, taskList)
    .then((result) => {
        console.log('asyncPool result || ok:', result);
    })
    .catch((err) => {
        console.error('asyncPool result || err:', err);
    });
