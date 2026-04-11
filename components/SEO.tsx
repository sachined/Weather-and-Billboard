import Head from 'next/head';
import { SITE_NAME, SITE_URL, BASE_PATH } from '@/lib/constants';

interface SEOProps {
  title: string;
  description: string;
  path: string;
  ogType?: string;
  ogImage?: string;
  article?: {
    publishedTime: string;
    tags: string[];
  };
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export default function SEO({
  title,
  description,
  path,
  ogType = 'website',
  ogImage,
  article,
  jsonLd,
}: SEOProps) {
  const canonicalUrl = `${SITE_URL}${BASE_PATH}${path}`;
  const imageUrl = ogImage || `${SITE_URL}${BASE_PATH}/api/og`;

  return (
    <Head>
      <title>{`${title} - ${SITE_NAME}`}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" key="og-image" content={imageUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      {article && (
        <>
          <meta property="article:published_time" content={`${article.publishedTime}T00:00:00Z`} />
          {article.tags.map((tag) => (
            <meta property="article:tag" content={tag} key={`tag-${tag}`} />
          ))}
        </>
      )}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </Head>
  );
}
