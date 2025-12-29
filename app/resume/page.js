'use server';

import { redirect } from 'next/navigation';

export async function GET() {
  return redirect('https://storage.pixly.sh/ayush_resume.pdf');
}
