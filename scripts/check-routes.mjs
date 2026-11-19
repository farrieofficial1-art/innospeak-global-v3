import fs from 'node:fs';
import path from 'node:path';

const appPath = path.resolve('src/App.jsx');
const source = fs.readFileSync(appPath, 'utf8');
const routes = [...source.matchAll(/path="(\/[^"]*)"/g)].map((match) => match[1]);
const duplicates = routes.filter((route, index) => routes.indexOf(route) !== index);

if (duplicates.length) {
  console.error(`Duplicate route definitions: ${duplicates.join(', ')}`);
  process.exitCode = 1;
} else {
  console.log(`Route check passed: ${routes.length} route definitions found.`);
}
