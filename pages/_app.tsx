import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import 'highlight.js/styles/atom-one-dark.css';
import ReadingProgress from '@/components/ReadingProgress';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isPostPage = router.pathname.startsWith('/posts/');
  return (
    <>
      {isPostPage && <ReadingProgress />}
      <div key={router.pathname} className="pageTransition">
        <Component {...pageProps} />
      </div>
    </>
  );
}
