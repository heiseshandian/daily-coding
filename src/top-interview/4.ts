/* 
给定两个有序数组，arr1,arr2，长度分别是m和n，如果m+n是奇数直接返回中位数，如果m+n返回两个中位数 / 2
例：
arr1 = [1,3], arr2 = [2]
return 2

arr1 = [1,2], arr2 = [3,4]
return 2.5
*/
export function findMedianSortedArrays(
  nums1: number[],
  nums2: number[]
): number {
  const sum = nums1.length + nums2.length;
  const target = Math.ceil(sum / 2);
  const isEven = target === sum / 2;

  let count = 0;
  let i1 = 0;
  let i2 = 0;
  while (count < target - 1) {
    if (i1 === nums1.length) {
      const delta = target - 1 - count;
      i2 += delta;
      break;
    }

    if (i2 === nums2.length) {
      const delta = target - 1 - count;
      i1 += delta;
      break;
    }

    count++;
    if (nums1[i1] <= nums2[i2]) {
      i1++;
    } else {
      i2++;
    }
  }

  if (i1 === nums1.length) {
    if (isEven) {
      return (nums2[i2] + nums2[i2 + 1]) / 2;
    }
    return nums2[i2];
  }

  if (i2 === nums2.length) {
    if (isEven) {
      return (nums1[i1] + nums1[i1 + 1]) / 2;
    }
    return nums1[i1];
  }
  if (!isEven) {
    return nums1[i1] <= nums2[i2] ? nums1[i1] : nums2[i2];
  }
  const [a, b] = [
    nums1[i1],
    nums2[i2],
    nums1[i1 + 1] ?? Infinity,
    nums2[i2 + 1] ?? Infinity,
  ]
    .sort((a, b) => a - b)
    .slice(0, 2);
  return (a + b) / 2;
}
