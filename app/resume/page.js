'use server';

import { redirect } from 'next/navigation';

export function GET() {
  return redirect('https://storage.pixly.sh/ayush_resume.pdf');
}
