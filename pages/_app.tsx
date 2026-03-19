import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <div key={router.pathname} className="pageTransition">
      <Component {...pageProps} />
    </div>
  );
}
