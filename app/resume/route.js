import { redirect, RedirectType } from 'next/navigation';

export function GET() {
  return redirect('https://storage.pixly.sh/ayush_resume.pdf', RedirectType.replace);
}
