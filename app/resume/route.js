import { redirect, RedirectType } from 'next/navigation';

export function GET() {
  return redirect('https://storage.procd.cc/ayush_resume.pdf', RedirectType.replace);
}
