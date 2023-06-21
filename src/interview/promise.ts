// 实现promise.race
export function promiseRace<T = any>(promises: Promise<T>[]) {
    return new Promise<T>((resolve, reject) => promises.forEach((p) => p.then(resolve).catch(reject)));
}

// 实现promise.all
export function promiseAll<T = any>(fns: Array<() => Promise<T>>) {
    const len = fns.length;
    let count = 0;
    const data: T[] = [];

    return new Promise<T[]>((resolve, reject) => {
        for (const fn of fns) {
            fn()
                .then((d) => {
                    count++;
                    data.push(d);

                    if (count === len) {
                        resolve(data);
                    }
                })
                .catch(reject);
        }
    });
}

type Job = [
    fn: (args?: unknown) => Promise<unknown>,
    resolve: (value: unknown) => void,
    reject: (reason?: any) => void
];

// 手写一个Promise并发的控制器。假设需要执行N个异步任务，这个控制器可以并发执行M个异步任务，
// 不能同时执行超过M个任务，执行完一个任务再继续执行下一个，直到全部执行完毕。
export function promiseScheduler(max: number) {
    let runningJobs = 0;
    const queue: Job[] = [];

    const start = () => {
        if (queue.length === 0 || runningJobs >= max) {
            return;
        }

        // 先进先出
        const [fn, resolve, reject] = queue.shift() as Job;

        fn()
            .then((d) => {
                runningJobs--;
                start();
                resolve(d);
            })
            .catch((e) => {
                runningJobs--;
                start();
                reject(e);
            });
    };

    return (fn: (args?: unknown) => Promise<unknown>) => {
        return new Promise((resolve, reject) => {
            queue.push([fn, resolve, reject]);
            start();
        });
    };
}
