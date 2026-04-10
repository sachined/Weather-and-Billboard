import { GetServerSideProps } from 'next';
import { getSortedPostsData } from '@/lib/posts';
import { SITE_URL, BASE_PATH } from '@/lib/constants';

const BLOG_URL = `${SITE_URL}${BASE_PATH}`;
const FEED_URL = `${BLOG_URL}/feed.xml`;

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateRSS(posts: ReturnType<typeof getSortedPostsData>): string {
  const items = posts
    .map((post) => {
      const postUrl = `${BLOG_URL}/posts/${post.id}`;
      const categories = post.tags
        .map((tag) => `    <category>${escapeXml(tag)}</category>`)
        .join('\n');
      return `  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${postUrl}</link>
    <guid isPermaLink="true">${postUrl}</guid>
    <description>${escapeXml(post.excerpt)}</description>
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
${categories}
  </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Sachin Nediyanchath</title>
    <link>${BLOG_URL}</link>
    <description>Engineering journal — FinSurf, security audits, and building in public.</description>
    <language>en</language>
    <lastBuildDate>${new Date(posts[0]?.date ?? Date.now()).toUTCString()}</lastBuildDate>
    <atom:link href="${FEED_URL}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const posts = getSortedPostsData();
  const xml = generateRSS(posts);

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.write(xml);
  res.end();

  return { props: {} };
};

export default function Feed() {
  return null;
}