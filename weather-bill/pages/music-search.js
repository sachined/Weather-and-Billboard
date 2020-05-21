import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/layout'

export default function Music_Search() {
  return (
    <Layout>
      <Head>
        <title>Music Search</title>
      </Head>
      <h1>Where Music can be Found!</h1>
      <h2>
        <Link href="/posts/first-post">
          <a>Go to the First Post</a>
        </Link>
      </h2>
      <img src="/musicbrain.jpg" alt="music" />
    </Layout>
  )
}
