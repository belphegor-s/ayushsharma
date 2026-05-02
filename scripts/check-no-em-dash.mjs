#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = process.cwd();
const SKIP_DIRS = new Set([
  'node_modules',
  '.next',
  '.git',
  '.vercel',
  'out',
  'dist',
  'build',
  'coverage',
  '.cache',
]);
const SKIP_FILES = new Set([
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'bun.lockb',
]);
const ALLOWED_EXT = new Set([
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.ts',
  '.tsx',
  '.mdx',
  '.md',
  '.svg',
  '.json',
  '.html',
  '.css',
  '.yml',
  '.yaml',
]);

const EM_DASH = String.fromCharCode(0x2014);
const EN_DASH = String.fromCharCode(0x2013);
const ESC_EM = '\\u2014';
const ESC_EN = '\\u2013';

const SELF = path.resolve(fileURLToPath(import.meta.url));

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') && entry.name !== '.github') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(full, out);
    } else if (entry.isFile()) {
      if (SKIP_FILES.has(entry.name)) continue;
      if (!ALLOWED_EXT.has(path.extname(entry.name))) continue;
      out.push(full);
    }
  }
  return out;
}

const files = walk(ROOT);
const hits = [];

for (const file of files) {
  if (path.resolve(file) === SELF) continue;
  let text;
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch {
    continue;
  }
  const lines = text.split(/\r?\n/);
  lines.forEach((line, i) => {
    const found = [];
    if (line.includes(EM_DASH)) found.push('em-dash');
    if (line.includes(EN_DASH)) found.push('en-dash');
    if (line.includes(ESC_EM)) found.push('em-dash escape');
    if (line.includes(ESC_EN)) found.push('en-dash escape');
    if (found.length) {
      hits.push({
        file: path.relative(ROOT, file),
        line: i + 1,
        kind: found.join(', '),
        snippet: line.trim().slice(0, 140),
      });
    }
  });
}

if (hits.length) {
  console.error(`\nem-dash check failed: ${hits.length} hit(s)\n`);
  for (const h of hits) {
    console.error(`  ${h.file}:${h.line}  [${h.kind}]  ${h.snippet}`);
  }
  console.error(
    `\nem/en-dashes are banned in this repo (AI-tell). Use comma, period, parentheses, or rewrite.`
  );
  process.exit(1);
}

console.log('em-dash check: clean');
