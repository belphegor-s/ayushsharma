import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync, readdirSync, statSync, copyFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const src = resolve(root, 'console-app', 'dist');
const dest = resolve(root, 'static');

if (!existsSync(src)) {
  console.error('Vite build not found. Run `npm -C console-app run build` first.');
  process.exit(1);
}

rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });

const indexPath = resolve(src, 'index.html');
let html = readFileSync(indexPath, 'utf-8');
html = html.replace(/src="\/assets\//g, 'src="/console/assets/');
html = html.replace(/href="\/assets\//g, 'href="/console/assets/');

mkdirSync(resolve(dest, 'console', 'assets'), { recursive: true });
writeFileSync(resolve(dest, 'console', 'index.html'), html);

function copyDir(from, to) {
  mkdirSync(to, { recursive: true });
  for (const entry of readdirSync(from)) {
    const srcPath = resolve(from, entry);
    const dstPath = resolve(to, entry);
    if (statSync(srcPath).isDirectory()) {
      copyDir(srcPath, dstPath);
    } else {
      copyFileSync(srcPath, dstPath);
    }
  }
}

const assetsSrc = resolve(src, 'assets');
if (existsSync(assetsSrc)) copyDir(assetsSrc, resolve(dest, 'console', 'assets'));

console.log('✓ Console SPA synced to static/');
