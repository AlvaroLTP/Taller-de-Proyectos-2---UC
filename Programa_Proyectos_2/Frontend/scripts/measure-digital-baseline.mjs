import { readdir, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { gzipSync } from 'node:zlib';
import { readFileSync } from 'node:fs';

const dist = join(import.meta.dirname, '..', 'dist');

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  }))).flat();
}

const output = await files(dist);
const assets = await Promise.all(output.map(async (path) => {
  const bytes = (await stat(path)).size;
  const gzipBytes = gzipSync(readFileSync(path)).length;
  return { file: relative(dist, path).replaceAll('\\', '/'), bytes, gzipBytes };
}));

console.log(JSON.stringify({
  measuredAt: new Date().toISOString(),
  scope: 'production build artifact sizes only; network, API and render metrics require a browser run',
  assets: assets.sort((a, b) => b.bytes - a.bytes),
  totals: {
    bytes: assets.reduce((sum, asset) => sum + asset.bytes, 0),
    gzipBytes: assets.reduce((sum, asset) => sum + asset.gzipBytes, 0),
  },
}, null, 2));
