export declare type LionFixtureOptions = string | {
    fixturesDir: string;
    tempDir: string;
};
export interface CreateFixtureOptions {
    runInstall?: boolean;
    ignoreWorkspace?: boolean;
}
