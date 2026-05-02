import Image from 'next/image';
import Link from 'next/link';

function isInternal(href = '') {
  return href.startsWith('/') || href.startsWith('#');
}

function MdxLink({ href = '', children, ...rest }) {
  if (isInternal(href)) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
}

function MdxImg({ src, alt = '', width, height, ...rest }) {
  if (!src) return null;
  const isRemote = /^https?:\/\//.test(src);
  if (isRemote || !width || !height) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} loading="lazy" {...rest} />;
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={Number(width)}
      height={Number(height)}
      sizes="(min-width: 768px) 720px, 100vw"
      {...rest}
    />
  );
}

export const mdxComponents = {
  a: MdxLink,
  img: MdxImg,
  Image: MdxImg,
};
