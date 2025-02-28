export const searchTestData = [
  {
    input: ['abc', 'abcd', 'uire', 'test', 'abc', 'abcd'],
    searchWord: 'abc',
    expected: 2,
  },
  {
    input: ['abc', 'abcd', 'uire', 'test', 'abc', 'abcd'],
    searchWord: 'test',
    expected: 1,
  },
  {
    input: ['abc', 'abcd', 'uire', 'test', 'abc', 'abcd'],
    searchWord: 'a',
    expected: 0,
  },
];

export const deleteTestData = [
  {
    input: ['abc', 'abcd', 'uire', 'test', 'abc', 'abcd'],
    deleteWord: 'abc',
    searchWord: 'abc',
    expected: 1,
  },
  {
    input: ['abc', 'abcd', 'uire', 'test', 'abc', 'abcd', 'test'],
    deleteWord: 'test',
    searchWord: 'test',
    expected: 1,
  },
  {
    input: ['abc', 'abcd', 'uire', 'test', 'abc', 'abcd'],
    deleteWord: 'a',
    searchWord: 'abc',
    expected: 2,
  },
];

export const prefixTestData = [
  {
    input: ['abc', 'ab', 'test', 'hello', 'world'],
    prefixWord: 'a',
    expected: 2,
  },
  {
    input: ['abc', 'ab', 'test', 'hello', 'world'],
    prefixWord: 't',
    expected: 1,
  },
  { input: [], prefixWord: 't', expected: 0 },
  { input: ['hell'], prefixWord: 'e', expected: 0 },
  {
    input: ['abc', 'ab', 'test', 'hello', 'world'],
    prefixWord: 'abcd',
    expected: 0,
  },
];
