// Publish the web-client bundle on the docs site (machinable.org/widget-sdk.js).
// The bundle is not committed: releases ship it in the wheel, and this copy is
// the fallback repo checkouts fetch on first use (see machinable/server.py's
// ensure_web_asset). Runs as part of `npm run gen`, after the web/sdk build.
import { cpSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const docs = dirname(dirname(fileURLToPath(import.meta.url)));
const assets = join(docs, '..', 'src', 'machinable', 'assets');
const publicDir = join(docs, 'public');

mkdirSync(publicDir, { recursive: true });
for (const name of ['widget-sdk.js', 'widget-sdk.css']) {
	cpSync(join(assets, name), join(publicDir, name));
}
console.log('web-client bundle copied to docs/public');
