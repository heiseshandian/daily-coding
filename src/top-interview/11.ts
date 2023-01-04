// 给定一个高度数组，数组之间的距离表示宽度，问如何选择元素可以使得选择的面积最大
export function maxArea(height: number[]): number {
    let max = 0;

    for (let i = 0; i < height.length; i++) {
        for (let j = i + 1; j < height.length; j++) {
            const w = j - i;
            const h = Math.min(height[i], height[j]);
            const area = w * h;
            if (max < area) {
                max = area;
            }
        }
    }

    return max;
}

export function maxArea2(height: number[]): number {
    let max = 0;

    let i = 0;
    let j = height.length - 1;
    while (i !== j) {
        max = Math.max(max, (j - i) * Math.min(height[i], height[j]));

        if (height[i] < height[j]) {
            i++;
        } else {
            j--;
        }
    }

    return max;
}
