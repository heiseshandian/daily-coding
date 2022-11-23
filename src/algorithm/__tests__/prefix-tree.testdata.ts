export const searchTestData = [
    { input: ['abc', 'abcd', 'uire', 'test', 'abc', 'abcd'], searchWord: 'abc', expected: 2 },
    { input: ['abc', 'abcd', 'uire', 'test', 'abc', 'abcd'], searchWord: 'test', expected: 1 },
    { input: ['abc', 'abcd', 'uire', 'test', 'abc', 'abcd'], searchWord: 'a', expected: 0 },
];

export const deleteTestData = [
    { input: ['abc', 'abcd', 'uire', 'test', 'abc', 'abcd'], deleteWord: 'abc', searchWord: 'abc', expected: 1 },
    {
        input: ['abc', 'abcd', 'uire', 'test', 'abc', 'abcd', 'test'],
        deleteWord: 'test',
        searchWord: 'test',
        expected: 1,
    },
    { input: ['abc', 'abcd', 'uire', 'test', 'abc', 'abcd'], deleteWord: 'a', searchWord: 'abc', expected: 2 },
];
