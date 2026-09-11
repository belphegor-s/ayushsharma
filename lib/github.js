import 'server-only';

const monthYear = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' });

/* Public repo facts for the project modal. Cached for a day; returns null on any
   failure (rate limit, network) so the UI simply leaves those fields out. */
export async function getRepo(fullName) {
  try {
    const res = await fetch(`https://api.github.com/repos/${fullName}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        ...(process.env.GITHUB_TOKEN && { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }),
      },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const repo = await res.json();
    const license = repo.license?.spdx_id;
    return {
      stars: repo.stargazers_count ?? 0,
      language: repo.language || null,
      license: license && license !== 'NOASSERTION' ? license : null,
      updated: repo.pushed_at ? monthYear.format(new Date(repo.pushed_at)) : null,
    };
  } catch {
    return null;
  }
}
