import BlogHeader from '@/components/blog/BlogHeader';
import BlogFooter from '@/components/blog/BlogFooter';

export default function BlogLayout({ children }) {
  return (
    <div className="blog-shell relative z-10 flex min-h-screen w-full flex-col">
      <BlogHeader />
      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 md:py-14">{children}</div>
      <BlogFooter />
    </div>
  );
}
