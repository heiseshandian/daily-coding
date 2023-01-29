export function plusOne(digits: number[]): number[] {
    digits[digits.length - 1] = digits[digits.length - 1] + 1;
    let carry = 0;

    for (let i = digits.length - 1; i >= 0; i--) {
        const sum = digits[i] + carry;
        digits[i] = sum % 10;
        if (sum >= 10) {
            carry = 1;
        } else {
            carry = 0;
        }
    }

    if (carry === 1) {
        digits.unshift(1);
    }

    return digits;
}
