import { execa, execaSync } from 'execa';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { CreateFixtureOptions, LionFixtureOptions } from '~/types.js';

/**
	Returns undefined when no install command should be run.
*/
function getInstallCommandArgs({
	fixtureOptions,
	tempFixtureDir,
}: {
	fixtureOptions: CreateFixtureOptions;
	tempFixtureDir: string;
}): string[] | undefined {
	if (
		fixtureOptions.runInstall &&
		fs.existsSync(path.join(tempFixtureDir, 'package.json'))
	) {
		if (fixtureOptions.ignoreWorkspace) {
			return ['--ignore-workspace', 'install'];
		} else {
			return ['install'];
		}
	} else {
		return undefined;
	}
}

function normalizeFixtureParams(
	fixtureName: string,
	tempFixtureNameOrOptions?: string | CreateFixtureOptions,
	maybeFixtureOptions?: CreateFixtureOptions
) {
	let tempFixtureName: string;
	let fixtureOptions: CreateFixtureOptions | undefined;
	if (typeof tempFixtureNameOrOptions === 'string') {
		tempFixtureName = tempFixtureNameOrOptions;
		fixtureOptions = maybeFixtureOptions;
	} else {
		fixtureOptions = tempFixtureNameOrOptions;
		tempFixtureName = fixtureName;
	}

	fixtureOptions = {
		runInstall: true,
		ignoreWorkspace: true,
		...fixtureOptions,
	};

	return {
		tempFixtureName,
		fixtureOptions,
	};
}

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

	if (fixturesDir.startsWith('file://')) {
		fixturesDir = fileURLToPath(fixturesDir);
	}

	async function fixture(
		fixtureName: string,
		tempFixtureName?: string,
		fixtureOptions?: CreateFixtureOptions
	): Promise<string>;
	async function fixture(
		fixtureName: string,
		fixtureOptions?: CreateFixtureOptions
	): Promise<string>;
	async function fixture(
		fixtureName: string,
		tempFixtureNameOrOptions?: string | CreateFixtureOptions,
		maybeFixtureOptions?: CreateFixtureOptions
	): Promise<string> {
		let { fixtureOptions, tempFixtureName } = normalizeFixtureParams(
			fixtureName,
			tempFixtureNameOrOptions,
			maybeFixtureOptions
		);

		await fs.promises.mkdir(tempDir, { recursive: true });
		const originalFixtureDir = path.join(fixturesDir, fixtureName);
		const tempFixtureDir = path.join(tempDir, tempFixtureName);
		if (fs.existsSync(tempFixtureDir)) {
			await fs.promises.rm(tempFixtureDir, { recursive: true, force: true });
		}

		await fs.promises.cp(originalFixtureDir, tempFixtureDir, {
			recursive: true,
		});

		fixtureOptions = {
			ignoreWorkspace: fs.existsSync(path.join(tempFixtureDir, 'pnpm-workspace.yaml')) ? false : true,
			...fixtureOptions,
		}

		const installCommandArgs = getInstallCommandArgs({
			fixtureOptions,
			tempFixtureDir,
		});

		if (installCommandArgs !== undefined) {
			await execa('pnpm', installCommandArgs, { cwd: tempFixtureDir });
		}

		return tempFixtureDir;
	}

	function fixtureSync(
		fixtureName: string,
		tempFixtureName?: string,
		fixtureOptions?: CreateFixtureOptions
	): string;
	function fixtureSync(
		fixtureName: string,
		fixtureOptions?: CreateFixtureOptions
	): string;
	function fixtureSync(
		fixtureName: string,
		tempFixtureNameOrOptions?: string | CreateFixtureOptions,
		maybeFixtureOptions?: CreateFixtureOptions
	): string {
		let { fixtureOptions, tempFixtureName } = normalizeFixtureParams(
			fixtureName,
			tempFixtureNameOrOptions,
			maybeFixtureOptions
		);

		fs.mkdirSync(tempDir, { recursive: true });
		const originalFixtureDir = path.join(fixturesDir, fixtureName);
		const tempFixtureDir = path.join(tempDir, tempFixtureName ?? fixtureName);
		if (fs.existsSync(tempFixtureDir)) {
			fs.rmSync(tempFixtureDir, { recursive: true, force: true });
		}

		fs.cpSync(originalFixtureDir, tempFixtureDir, { recursive: true });

		fixtureOptions = {
			ignoreWorkspace: fs.existsSync(path.join(tempFixtureDir, 'pnpm-workspace.yaml')) ? false : true,
			...fixtureOptions,
		}

		const installCommandArgs = getInstallCommandArgs({
			fixtureOptions,
			tempFixtureDir,
		});

		if (installCommandArgs !== undefined) {
			execaSync('pnpm', installCommandArgs, { cwd: tempFixtureDir });
		}

		return tempFixtureDir;
	}

	return { fixture, fixtureSync, tempDir, fixturesDir };
}
