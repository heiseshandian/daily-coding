import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    verbose: true,
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    testMatch: ['**/__tests__/**/*.spec.(t|j)s', '**/*.spec.(t|j)s'],
};

export default config;
