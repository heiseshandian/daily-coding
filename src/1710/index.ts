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
