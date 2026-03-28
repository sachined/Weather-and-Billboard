import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import DOMPurify from 'isomorphic-dompurify';

const postsDirectory = path.join(process.cwd(), 'posts');

export interface PostData {
  id: string;
  date: string;
  title: string;
  excerpt: string;
  tags: string[];
  readingTime: number;
  highlight?: boolean;
  contentHtml?: string;
  series?: string;
  series_position?: number;
}

export function getSortedPostsData(): PostData[] {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    const wordCount = matterResult.content.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    // Combine the data with the id
    return {
      id,
      readingTime,
      ...(matterResult.data as { date: string; title: string; excerpt: string; tags: string[]; highlight?: boolean; series?: string; series_position?: number }),
    };
  });
  const today = new Date().toISOString().slice(0, 10);
  // Sort posts by date, excluding future-dated posts
  return allPostsData.filter((post) => post.date <= today).sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds() {
  const today = new Date().toISOString().slice(0, 10);
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => {
      const fullPath = path.join(postsDirectory, fileName);
      const { data } = matter(fs.readFileSync(fullPath, 'utf8'));
      return (data.date as string) <= today;
    })
    .map((fileName) => ({
      params: { id: fileName.replace(/\.md$/, '') },
    }));
}

export async function getPostData(id: string) {

  const allPosts = getSortedPostsData();
  const currentPost = allPosts.findIndex(post => post.id === id);

  // In a descending list, the newer post in index - 1, older is index + 1
  const nextPost = currentPost > 0 ? allPosts[currentPost - 1] : null;
  const prevPost = currentPost < allPosts.length - 1 ? allPosts[currentPost + 1] : null;

  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(matterResult.content);
  const contentHtml = DOMPurify.sanitize(processedContent.toString(), {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'input'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  });

  return {
    id,
    contentHtml,
    nextPost: nextPost ? { id: nextPost.id, title: nextPost.title } : null,
    prevPost: prevPost ? { id: prevPost.id, title: prevPost.title } : null,
    ...(matterResult.data as { date: string; title: string; excerpt: string; series?: string; series_position?: number }),
  };
}
