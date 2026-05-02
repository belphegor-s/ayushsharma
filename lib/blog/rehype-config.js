import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';

const prettyCodeOptions = {
  theme: 'github-dark-dimmed',
  keepBackground: false,
  defaultLang: 'plaintext',
  onVisitLine(node) {
    if (node.children.length === 0) {
      node.children = [{ type: 'text', value: ' ' }];
    }
  },
  onVisitHighlightedLine(node) {
    node.properties.className = (node.properties.className || []).concat('highlighted');
  },
};

export const remarkPlugins = [remarkGfm];

export const rehypePlugins = [
  rehypeSlug,
  [rehypePrettyCode, prettyCodeOptions],
  [
    rehypeAutolinkHeadings,
    {
      behavior: 'append',
      properties: { className: ['heading-anchor'], 'aria-label': 'Link to section' },
    },
  ],
];
