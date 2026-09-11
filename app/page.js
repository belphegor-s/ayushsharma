import Home from '@/components/Home';
import { getRepo } from '@/lib/github';
import { projects } from '@/lib/projects';

export const revalidate = 86400;

export default async function Page() {
  const stats = await Promise.all(projects.map((p) => getRepo(p.repo)));
  return <Home projects={projects.map((p, i) => ({ ...p, stats: stats[i] }))} />;
}
