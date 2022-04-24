# lion-fixture

A fixture function for tests.

## Installation

```shell
npm install lion-fixture
```

## Usage

```typescript
import { fixturer } from 'lion-fixture';
import { join } from 'desm';
import { test } from 'vitest';

const fixture = lionFixture({
  fixturesDir: join(import.meta.url, '../fixtures'),
  tempDir: join(import.meta.url, '../temp'),
});

test('creates a fixture asynchronously', async () => {
  const tempFixtureDir = await fixture('my-project');;
})
```
