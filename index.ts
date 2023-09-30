function atMostNGivenDigitSet(digits: string[], n: number): number {
    if (n === 0) {
        return 0;
    }

    const digitsOfN = getDigitsOfN(n);

    // 假设n是个三位数，则两位数和一位数里面数字可以自由选择
    // 两位数和一位数的总和就是 len^2 + len;
    let count = 0;
    let i = digitsOfN.length - 1;
    while (i) {
        count += Math.pow(digits.length, i--);
    }

    count += atNGivenDigitSet(digits, digitsOfN);

    return count;
}

function atNGivenDigitSet(digits: string[], digitsOfN: number[]): number {
    let count = 0;
    const [closestMin, found] = getClosestMinAndFoundFlag(digits, digitsOfN[0]);

    // 首位在digits中，比如说 [1,3,5] 199
    // 那么我们只需要固定第一位，然后看 1xx 有多少种选择即可
    // 交给递归来处理
    if (found) {
        if (digitsOfN.length > 1) {
            count += atNGivenDigitSet(digits, digitsOfN.slice(1));
        } else {
            count += 1;
        }
    }

    // 首位不在digits中，比如说 [1,3,5] 299
    if (closestMin !== null) {
        count += (closestMin + 1) * Math.pow(digits.length, digitsOfN.length - 1);
    }

    return count;
}

function getDigitsOfN(n: number): number[] {
    const digitsOfN: number[] = [];
    while (n) {
        digitsOfN.unshift(n % 10);
        n = parseInt(`${n / 10}`);
    }

    return digitsOfN;
}

function getClosestMinAndFoundFlag(digits: string[], target: number): [closestMin: number | null, found: boolean] {
    let left = 0;
    let right = digits.length - 1;
    let closestMin: number | null = null;
    let found = false;
    while (left <= right) {
        const mid = left + ((right - left) >> 1);
        if (+digits[mid] === target) {
            found = true;
            right = mid - 1;
        } else if (+digits[mid] > target) {
            right = mid - 1;
        } else {
            closestMin = mid;
            left = mid + 1;
        }
    }

    return [closestMin, found];
}

atMostNGivenDigitSet(['1', '2', '3', '6', '7', '8'], 211);

export {};
