import { join } from 'desm';
import { execaCommandSync } from 'execa';
import * as fs from 'node:fs';
import { beforeAll, expect, test } from 'vitest';

import { lionFixture } from '~/index.js';

const tempDir = join(import.meta.url, '../temp');
const { fixture, fixtureSync } = lionFixture({
	fixturesDir: join(import.meta.url, '../fixtures'),
	tempDir,
});

beforeAll(() => {
	fs.rmSync(tempDir, { recursive: true, force: true });
});

test('creates a fixture asynchronously', () => {
	const tempFixturesDir = fixtureSync('my-project', 'my-project-sync');

	expect(
		execaCommandSync('node index.js', {
			cwd: tempFixturesDir,
		}).stdout
	).toEqual('1,2');
});

test('creates a fixture asynchronously', async () => {
	const tempFixturesDir = await fixture('my-project');

	expect(
		execaCommandSync('node index.js', {
			cwd: tempFixturesDir,
		}).stdout
	).toEqual('1,2');
});
