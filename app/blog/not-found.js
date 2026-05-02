import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <p className="mb-2 text-sm font-mono text-blue-400">404</p>
      <h1 className="mb-3 text-3xl font-semibold text-white">Post not found</h1>
      <p className="mb-6 max-w-md text-gray-400">
        {"The post you're looking for doesn't exist, was renamed, or hasn't been published yet."}
      </p>
      <Link
        href="/blog"
        className="rounded-lg border border-blue-500/40 px-4 py-2 text-sm text-blue-300 hover:border-blue-500 hover:text-white transition-colors"
      >
        Back to all posts
      </Link>
    </div>
  );
}
