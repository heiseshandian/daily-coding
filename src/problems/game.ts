import { cache } from '../design-pattern/proxy';
/**
 * 巴什博奕
 * 一共有 n 颗石子，两个人轮流拿，每次多可以拿 1~m 颗石子
 * 拿到最后一颗石子的人赢，问给定 n和m最后谁赢
 * 先手赢返回 "先手"
 * 后手赢返回 "后手"
 */
export function bashWinner(n: number, m: number): string {
    return n % (m + 1) === 0 ? '后手' : '先手';
}

function bashWinner2(n: number, m: number): string {
    const dfs = cache((rest: number): boolean => {
        if (rest <= m) {
            return true;
        }

        for (let i = 1; i <= m; i++) {
            if (dfs(rest - i) === false) {
                return true;
            }
        }

        return false;
    });

    return dfs(n) ? '先手' : '后手';
}

function bashWinnerTest() {
    const times = 1000;

    for (let i = 0; i < times; i++) {
        const n = (Math.random() * times + 1) >> 0;
        const m = (Math.random() * times + 1) >> 0;
        if (bashWinner(n, m) !== bashWinner2(n, m)) {
            console.log(n, m, bashWinner(n, m), bashWinner2(n, m));
        }
    }
}
bashWinnerTest();
