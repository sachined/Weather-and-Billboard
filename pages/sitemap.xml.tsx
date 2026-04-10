import { GetServerSideProps } from 'next';
import { getSortedPostsData, getSeriesSummaries } from '@/lib/posts';
import { SITE_URL, BASE_PATH } from '@/lib/constants';

const BLOG_URL = `${SITE_URL}${BASE_PATH}`;

const STATIC_PAGES = [
  { path: '/', priority: '1.0' },
  { path: '/about', priority: '0.8' },
  { path: '/finsurf', priority: '0.8' },
  { path: '/portfolio', priority: '0.5' },
  { path: '/journey', priority: '0.5' },
  { path: '/contact', priority: '0.5' },
];

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateSitemap(
  posts: ReturnType<typeof getSortedPostsData>,
  series: ReturnType<typeof getSeriesSummaries>,
): string {
  const allUrls: string[] = [];

  // Add static pages
  STATIC_PAGES.forEach(({ path, priority }) => {
    allUrls.push(`  <url>
    <loc>${escapeXml(`${BLOG_URL}${path}`)}</loc>
    <priority>${priority}</priority>
  </url>`);
  });

  // Add blog posts
  posts.forEach((post) => {
    allUrls.push(`  <url>
    <loc>${escapeXml(`${BLOG_URL}/posts/${post.id}`)}</loc>
    <lastmod>${post.date}</lastmod>
    <priority>0.7</priority>
  </url>`);
  });

  // Add series
  series.forEach((s) => {
    allUrls.push(`  <url>
    <loc>${escapeXml(`${BLOG_URL}/series/${s.slug}`)}</loc>
    <priority>0.6</priority>
  </url>`);
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.join('\n')}
</urlset>`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const posts = getSortedPostsData();
  const series = getSeriesSummaries();
  const xml = generateSitemap(posts, series);

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.write(xml);
  res.end();

  return { props: {} };
};

export default function Sitemap() {
  return null;
}
