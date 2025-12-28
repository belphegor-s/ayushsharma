import { no_reasons } from '@/data/no_reasons';

export function GET() {
  const reason = no_reasons[Math.floor(Math.random() * no_reasons.length)];
  return Response.json({ reason });
}
