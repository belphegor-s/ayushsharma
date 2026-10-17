#!/usr/bin/env node
/**
 * Project preview capture.
 *
 * Opens each project's live site in headless Chrome, once with a light and once
 * with a dark colour scheme, and saves the first screen as WebP under
 * public/projects/. A manifest with sizes and blur placeholders goes to
 * lib/previews.json, which the cards and the detail dialog read.
 *
 * Usage:
 *   npm run previews               # every project
 *   npm run previews -- pluck huddle  # only these slugs
 *
 * Needs a local Chrome (or Edge via PREVIEW_CHANNEL=msedge). playwright-core
 * never downloads a browser of its own.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';
import { chromium } from 'playwright-core';
import { projects } from '../lib/projects.js';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT_DIR = path.join(ROOT, 'public', 'projects');
const MANIFEST = path.join(ROOT, 'lib', 'previews.json');

const VIEWPORT = { width: 1440, height: 900 };
const OUTPUT_WIDTH = 1920;
// Below this share of differing pixels the dark capture is treated as the light one.
const SAME_THRESHOLD = 0.01;

const only = process.argv.slice(2);
const targets = only.length ? projects.filter((p) => only.includes(p.slug)) : projects;
if (targets.length === 0) {
  console.error(`No projects match: ${only.join(', ')}`);
  process.exit(1);
}

async function loadManifest() {
  try {
    return JSON.parse(await readFile(MANIFEST, 'utf8'));
  } catch {
    return {};
  }
}

async function capture(browser, url, colorScheme) {
  const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2, colorScheme, reducedMotion: 'reduce' });
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => page.waitForLoadState('load'));
    await page.evaluate(() => document.fonts?.ready);
    // Let entrance animations and late images settle.
    await page.waitForTimeout(1500);
    return await page.screenshot({ type: 'png' });
  } finally {
    await context.close();
  }
}

async function share(a, b) {
  const size = { width: 160, height: 100, fit: 'fill' };
  const [x, y] = await Promise.all([sharp(a).resize(size).raw().toBuffer(), sharp(b).resize(size).raw().toBuffer()]);
  let diff = 0;
  for (let i = 0; i < x.length; i += 3) {
    if (Math.abs(x[i] - y[i]) + Math.abs(x[i + 1] - y[i + 1]) + Math.abs(x[i + 2] - y[i + 2]) > 48) diff++;
  }
  return diff / (x.length / 3);
}

async function save(png, file) {
  const image = sharp(png).resize({ width: OUTPUT_WIDTH });
  const info = await image.clone().webp({ quality: 86, effort: 6 }).toFile(path.join(OUT_DIR, file));
  const blur = await sharp(png).resize(16).webp({ quality: 40 }).toBuffer();
  return { src: `/projects/${file}`, width: info.width, height: info.height, blur: `data:image/webp;base64,${blur.toString('base64')}` };
}

const manifest = await loadManifest();
await mkdir(OUT_DIR, { recursive: true });
const browser = await chromium.launch({ channel: process.env.PREVIEW_CHANNEL || 'chrome' });

try {
  for (const project of targets) {
    process.stdout.write(`${project.slug.padEnd(10)} ${project.url} … `);
    try {
      const light = await capture(browser, project.url, 'light');
      const dark = await capture(browser, project.url, 'dark');
      const entry = { light: await save(light, `${project.slug}-light.webp`), captured: new Date().toISOString().slice(0, 10) };
      if ((await share(light, dark)) > SAME_THRESHOLD) entry.dark = await save(dark, `${project.slug}-dark.webp`);
      manifest[project.slug] = entry;
      console.log(entry.dark ? 'light + dark' : 'light only');
    } catch (err) {
      console.log(`failed (${err.message.split('\n')[0]}), keeping previous capture`);
    }
  }
} finally {
  await browser.close();
}

const sorted = Object.fromEntries(projects.filter((p) => manifest[p.slug]).map((p) => [p.slug, manifest[p.slug]]));
await writeFile(MANIFEST, `${JSON.stringify(sorted, null, 2)}\n`);
console.log(`Wrote ${path.relative(ROOT, MANIFEST)}`);
