import { execa, execaSync } from 'execa';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { LionFixtureOptions } from '~/types.js';

export function lionFixture(options: LionFixtureOptions) {
	let fixturesDir: string;
	let tempDir: string;
	if (typeof options === 'string') {
		let fileUrl = options;
		if (fileUrl.startsWith('file://')) {
			fileUrl = fileURLToPath(fileUrl);
		}

		fixturesDir = path.join(path.dirname(fileUrl), '../fixtures');
		tempDir = path.join(path.dirname(fileUrl), '../temp');
	} else {
		fixturesDir = options.fixturesDir;
		tempDir = options.tempDir;
	}

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
