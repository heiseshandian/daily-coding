/*
 * 解题思路
 * 1. 先将boxTypes按照numberOfUnitsPerBoxes从大到小排序
 * 2. 采用贪心算法尽可能多的取前面的箱子（因为箱子数量是一定的，经过第一步之后越前面的箱子能够容纳的单元数量越多）
 * */
export function maximumUnits(boxTypes: number[][], truckSize: number): number {
  const sortedBoxTypes = sortBoxTypes(boxTypes);

  let unitCount = 0;
  let boxCount = 0;

  for (let i = 0; i < sortedBoxTypes.length; i++) {
    if (boxCount >= truckSize) {
      break;
    }
    const [numberOfBoxes, numberOfUnitsPerBox] = sortedBoxTypes[i];
    const current = Math.min(truckSize - boxCount, numberOfBoxes);

    boxCount += current;
    unitCount += current * numberOfUnitsPerBox;
  }

  return unitCount;
}

export function sortBoxTypes(boxTypes: number[][]) {
  return boxTypes.sort(([, numberOfUnitsPerBoxA], [, numberOfUnitsPerBoxB]) => {
    return numberOfUnitsPerBoxB - numberOfUnitsPerBoxA;
  });
}
