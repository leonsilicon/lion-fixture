import { execaCommandSync } from 'execa';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { FixturerOptions } from '~/types.js';
import { fileURLToPath } from 'node:url';

export function fixturer({ fixturesDir, tempDir }: FixturerOptions) {
	return function fixture(fixtureName: string) {
		if (fixturesDir.startsWith('file://')) {
			fixturesDir = fileURLToPath(fixturesDir);
		}

		fs.mkdirSync(tempDir, { recursive: true });
		const originalFixtureDir = path.join(fixturesDir, fixtureName);
		const tempFixtureDir = path.join(tempDir, fixtureName);
		fs.cpSync(originalFixtureDir, tempFixtureDir, { recursive: true });
		execaCommandSync('pnpm install', { cwd: tempFixtureDir });
		return tempFixtureDir;
	};
}
