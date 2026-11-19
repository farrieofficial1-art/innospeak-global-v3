import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd());
const sourceRoot = path.join(root, 'src');
const broken = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(jsx?|tsx?|mjs)$/.test(entry.name)) {
      const source = fs.readFileSync(full, 'utf8');
      const hrefPattern = /(?:to|href)=["'{]([^"'{}\s]+)["'}]/g;
      for (const match of source.matchAll(hrefPattern)) {
        const target = match[1];
        if (!target.startsWith('/') || target.includes(':')) continue;
        const clean = target.split(/[?#]/)[0].replace(/\/$/, '') || '/';
        if (clean === '/') continue;
        const routeFile = path.join(sourceRoot, 'App.jsx');
        if (fs.existsSync(routeFile)) {
          const appSource = fs.readFileSync(routeFile, 'utf8');
          const staticPath = clean.replace(/\/:[^/]+/g, '');
          if (!appSource.includes(`path="${clean}"`) && !appSource.includes(`path="${staticPath}"`) && !appSource.includes('*')) {
            broken.push(`${path.relative(root, full)} -> ${clean}`);
          }
        }
      }
    }
  }
}

walk(sourceRoot);
if (broken.length) {
  console.error(`Broken or unregistered route references: ${broken.length}`);
  broken.forEach((item) => console.error(`- ${item}`));
  process.exitCode = 1;
} else {
  console.log('Broken-link and route-reference check passed.');
}
