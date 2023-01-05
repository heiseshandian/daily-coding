export function generateParenthesis(n: number): string[] {
    const result: Set<string> = new Set();

    const process = (path: string, open: number, close: number) => {
        if (path.length === n * 2) {
            result.add(path);
            return;
        }

        if (open < n) {
            process(path + '(', open + 1, close);
        }
        if (close < open) {
            process(path + ')', open, close + 1);
        }
    };

    process('(', 1, 0);

    return Array.from(result);
}
