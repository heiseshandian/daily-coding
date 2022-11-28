import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    verbose: true,
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    testMatch: ['**/__tests__/**/*.spec.ts', '**/*.spec.ts'],
};

export default config;
