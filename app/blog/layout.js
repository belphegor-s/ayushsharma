import BlogHeader from '@/components/blog/BlogHeader';

export default function BlogLayout({ children }) {
  return (
    <div className="blog-shell relative z-10 min-h-screen w-full">
      <BlogHeader />
      <div className="mx-auto w-full max-w-5xl px-4 py-10 md:py-14">{children}</div>
    </div>
  );
}
