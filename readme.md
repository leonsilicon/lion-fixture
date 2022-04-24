# lion-fixture

A fixture function for tests.

## Installation

```shell
npm install lion-fixture
```

## Usage

```typescript
import { join } from 'desm';
import { fixturer } from 'lion-fixture';
import { expect, test } from 'vitest';
import * as path from 'node:path';
import * as fs from 'node:fs';

const tempDir = join(import.meta.url, '../temp'); // or `path.join(__dirname, '../temp')` for CommonJS

const fixture = lionFixture({
  fixturesDir: join(import.meta.url, '../fixtures'),
  tempDir,
});

test('creates fixtures', async () => {
  const tempMyProjectDir = await fixture('my-project');

  expect(fs.existsSync(tempMyProjectDir));
  expect(tempMyProjectDir).toEqual(path.join(tempDir, 'my-project'));

  const tempMyProjectSyncDir = fixtureSync('my-project', 'my-project-sync');
  expect(tempMyProjectSyncDir).toEqual(path.join(tempDir, 'my-project-sync'));
});
```

## API

### lionFixture(options): FixtureCreators

#### options.fixturesDir

Type: `string`
\
Required: `true`

The path to the directory where the fixture folders are.

#### options.tempDir

Type: `string`
\
Required: `true`

Creates a new fixture creator.

#### FixtureCreators

An object with functions to clone the fixtures into a temporary directory.

Type: `{ fixture: Function, fixtureSync: Function }`

##### FixturesCreators.fixture(fixtureName, tempFixtureDir?)

Clones the fixture at `` `${fixturesDir}/${fixtureName}` `` into `` `${tempDir}/${tempFixtureDir}` `` and runs `pnpm install` in the temporary directory.

Returns: `Promise<string>`

The path to the temporary folder where the fixture was cloned.

###### fixtureName

Type: `string`
\
Required: `true`

The name of the fixture to clone into the temporary directory.

###### tempFixtureDir

Type: `string`
\
Default: `fixtureName`

The name of the cloned fixture folder created in the temporary directory.

##### FixturesCreators.fixtureSync(fixtureName, tempFixtureDir?)

Returns: `string`

Creates a clone of the fixture synchronously. Uses the same API as `FixtureCreators.fixture`.
