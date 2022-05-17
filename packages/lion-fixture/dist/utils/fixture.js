import { execa, execaSync } from 'execa';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
export function lionFixture(options) {
    let fixturesDir;
    let tempDir;
    if (typeof options === 'string') {
        let fileUrl = options;
        if (fileUrl.startsWith('file://')) {
            fileUrl = fileURLToPath(fileUrl);
        }
        fixturesDir = path.join(path.dirname(fileUrl), '../fixtures');
        tempDir = path.join(path.dirname(fileUrl), '../temp');
    }
    else {
        fixturesDir = options.fixturesDir;
        tempDir = options.tempDir;
    }
    async function fixture(fixtureName, tempFixtureNameOrOptions, maybeFixtureOptions) {
        let tempFixtureName;
        let fixtureOptions;
        if (typeof tempFixtureNameOrOptions === 'string') {
            tempFixtureName = tempFixtureNameOrOptions;
            fixtureOptions = maybeFixtureOptions;
        }
        else {
            fixtureOptions = tempFixtureNameOrOptions;
            tempFixtureName = fixtureName;
        }
        fixtureOptions = {
            runInstall: true,
            ignoreWorkspace: true,
            ...fixtureOptions,
        };
        if (fixturesDir.startsWith('file://')) {
            fixturesDir = fileURLToPath(fixturesDir);
        }
        await fs.promises.mkdir(tempDir, { recursive: true });
        const originalFixtureDir = path.join(fixturesDir, fixtureName);
        const tempFixtureDir = path.join(tempDir, tempFixtureName);
        // Remove the temporary fixture directory if it already exists
        if (fs.existsSync(tempFixtureDir)) {
            await fs.promises.rm(tempFixtureDir, { recursive: true, force: true });
        }
        await fs.promises.cp(originalFixtureDir, tempFixtureDir, {
            recursive: true,
        });
        if (!fixtureOptions.runInstall &&
            fs.existsSync(path.join(tempFixtureDir, 'package.json'))) {
            if (fixtureOptions.ignoreWorkspace) {
                await execa('pnpm', ['--ignore-workspace', 'install'], {
                    cwd: tempFixtureDir,
                });
            }
            else {
                await execa('pnpm', ['install'], {
                    cwd: tempFixtureDir,
                });
            }
        }
        return tempFixtureDir;
    }
    function fixtureSync(fixtureName, tempFixtureName) {
        if (fixturesDir.startsWith('file://')) {
            fixturesDir = fileURLToPath(fixturesDir);
        }
        fs.mkdirSync(tempDir, { recursive: true });
        const originalFixtureDir = path.join(fixturesDir, fixtureName);
        const tempFixtureDir = path.join(tempDir, tempFixtureName ?? fixtureName);
        fs.cpSync(originalFixtureDir, tempFixtureDir, { recursive: true });
        execaSync('pnpm', ['install'], { cwd: tempFixtureDir });
        return tempFixtureDir;
    }
    return { fixture, fixtureSync, tempDir, fixturesDir };
}
