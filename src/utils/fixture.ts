import { execa, execaSync } from 'execa';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { LionFixtureOptions } from '~/types.js';

export function lionFixture({ fixturesDir, tempDir }: LionFixtureOptions) {
	async function fixture(
		fixtureName: string,
		tempFixtureName?: string
	): Promise<string> {
		if (fixturesDir.startsWith('file://')) {
			fixturesDir = fileURLToPath(fixturesDir);
		}

		await fs.promises.mkdir(tempDir, { recursive: true });
		const originalFixtureDir = path.join(fixturesDir, fixtureName);
		const tempFixtureDir = path.join(tempDir, tempFixtureName ?? fixtureName);
		await fs.promises.cp(originalFixtureDir, tempFixtureDir, {
			recursive: true,
		});
		await execa('pnpm', ['install'], { cwd: tempFixtureDir });
		return tempFixtureDir;
	}

	function fixtureSync(fixtureName: string, tempFixtureName?: string): string {
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

	return { fixture, fixtureSync };
}
