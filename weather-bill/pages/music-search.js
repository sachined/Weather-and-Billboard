import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/layout'

export default function Music_Search() {
  return (
    <Layout>
      <Head>
        <title>Music Search</title>
      </Head>
      <div class="music_looking">
        <h1>Where Music can be Found!</h1>
        <script src="/spotifysearch.js"></script>
          <h2>
            <Link href="/weather-seek">
              <a>Looking for the weather somewhere?</a>
            </Link>
          </h2>
        <img src="/musicbrain.jpg" alt="music" />
      </div>
    </Layout>
  )
}
