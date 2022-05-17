import type { CreateFixtureOptions, LionFixtureOptions } from '../types.js';
export declare function lionFixture(options: LionFixtureOptions): {
    fixture: {
        (fixtureName: string, tempFixtureName?: string | undefined, fixtureOptions?: CreateFixtureOptions | undefined): Promise<string>;
        (fixtureName: string, fixtureOptions?: CreateFixtureOptions | undefined): Promise<string>;
    };
    fixtureSync: (fixtureName: string, tempFixtureName?: string | undefined) => string;
    tempDir: string;
    fixturesDir: string;
};
