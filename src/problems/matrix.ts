export function zigzagMatrix(matrix: number[][]) {
    if (!matrix || matrix.length === 0) {
        return [];
    }

    const result: number[] = [];

    let pointAX = 0;
    let pointAY = 0;
    let pointBX = 0;
    let pointBY = 0;
    const endX = matrix[0].length - 1;
    const endY = matrix.length - 1;
    let shouldReverse = false;

    while (pointAX <= endX && pointAY <= endY && pointBX <= endX && pointBY <= endY) {
        const slashResult = slash(matrix, pointAX, pointAY, pointBX, pointBY, shouldReverse);
        result.push(...slashResult);
        shouldReverse = !shouldReverse;

        // 此处变量设置的顺序不能变
        pointAX = pointAY < endY ? 0 : pointAX + 1;
        pointAY = pointAX === 0 ? pointAY + 1 : endY;
        pointBY = pointBX < endX ? 0 : pointBY + 1;
        pointBX = pointBY === 0 ? pointBX + 1 : endX;
    }

    return result;
}

function slash(
    matrix: number[][],
    pointAX: number,
    pointAY: number,
    pointBX: number,
    pointBY: number,
    shouldReverse: boolean
) {
    const result: number[] = [];

    let x = pointBX;
    let y = pointBY;
    while (x >= pointAX && y <= pointAY) {
        result.push(matrix[x--][y++]);
    }

    if (shouldReverse) {
        return result.reverse();
    }
    return result;
}
