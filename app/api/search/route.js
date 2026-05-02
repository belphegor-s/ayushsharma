import Fuse from 'fuse.js';
import { getAllPosts } from '@/lib/blog/posts';

export const dynamic = 'force-dynamic';
export const revalidate = false;

const SCORE_CUTOFF = 0.45;

let cachedFuse = null;
let cachedIndexedPosts = null;

function getIndex() {
  if (cachedFuse) return { fuse: cachedFuse, posts: cachedIndexedPosts };
  const posts = getAllPosts().map(({ content, ...rest }) => rest);
  const fuse = new Fuse(posts, {
    keys: [
      { name: 'title', weight: 0.6 },
      { name: 'tags', weight: 0.3 },
      { name: 'description', weight: 0.1 },
    ],
    threshold: 0.3,
    ignoreLocation: true,
    minMatchCharLength: 3,
    includeScore: true,
    includeMatches: true,
    useExtendedSearch: false,
  });
  cachedFuse = fuse;
  cachedIndexedPosts = posts;
  return { fuse, posts };
}

function trim(post, extra = {}) {
  return {
    slug: post.slug,
    title: post.title,
    description: post.description,
    date: post.date,
    updated: post.updated,
    tags: post.tags,
    cover: post.cover,
    coverAlt: post.coverAlt,
    readingTime: post.readingTime,
    featured: post.featured,
    ...extra,
  };
}

export function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').trim();
  const tagsParam = (searchParams.get('tags') || '').trim();
  const requiredTags = tagsParam
    ? tagsParam.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  const { fuse, posts } = getIndex();
  const matchesTags = (post) =>
    requiredTags.length === 0 || requiredTags.every((t) => post.tags.includes(t));

  let results;
  if (!q) {
    results = posts
      .filter(matchesTags)
      .sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return new Date(b.date) - new Date(a.date);
      })
      .slice(0, 50)
      .map((p) => trim(p));
  } else {
    const hits = fuse
      .search(q, { limit: 50 })
      .filter((h) => (h.score ?? 1) <= SCORE_CUTOFF);
    results = hits
      .filter((h) => matchesTags(h.item))
      .map((h) =>
        trim(h.item, {
          score: Number(h.score?.toFixed(4) ?? 0),
          matchedKeys: h.matches?.map((m) => m.key) || [],
        })
      );
  }

  return Response.json(
    { query: q, tags: requiredTags, count: results.length, results },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    }
  );
}
