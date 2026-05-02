import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import { cache } from 'react';
import matter from 'gray-matter';
import readingTime from 'reading-time';

export { formatDate } from './format';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');
const IS_PROD = process.env.NODE_ENV === 'production';

function readPostFile(filename) {
  const slug = filename.replace(/\.mdx?$/, '');
  const filePath = path.join(CONTENT_DIR, filename);
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);

  const stats = readingTime(content);

  return {
    slug,
    title: data.title || slug,
    description: data.description || '',
    date: data.date,
    updated: data.updated || data.date,
    tags: Array.isArray(data.tags) ? data.tags : [],
    cover: data.cover || null,
    coverAlt: data.coverAlt || data.title || '',
    accent: data.accent || null,
    draft: Boolean(data.draft),
    featured: Boolean(data.featured),
    readingTime: stats.text,
    readingMinutes: Math.max(1, Math.round(stats.minutes)),
    wordCount: stats.words,
    content,
  };
}

export const getAllPosts = cache(() => {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => /\.mdx?$/.test(f));
  const posts = files
    .map(readPostFile)
    .filter((p) => !IS_PROD || !p.draft)
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return new Date(b.date) - new Date(a.date);
    });
  return posts;
});

export const getPost = cache((slug) => {
  return getAllPosts().find((p) => p.slug === slug) || null;
});

export const getAllTags = cache(() => {
  const tagMap = new Map();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    }
  }
  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
});

export const getPostsByTag = cache((tag) => {
  const target = tag.toLowerCase();
  return getAllPosts().filter((p) => p.tags.some((t) => t.toLowerCase() === target));
});

export function getPostNeighbors(slug) {
  const posts = getAllPosts();
  const idx = posts.findIndex((p) => p.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx < posts.length - 1 ? posts[idx + 1] : null,
    next: idx > 0 ? posts[idx - 1] : null,
  };
}

export const POSTS_PER_PAGE = 9;
