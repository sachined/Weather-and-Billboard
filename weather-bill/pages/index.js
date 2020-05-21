import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>Hi, I am Sachin. I am a web developer and a trilingual (English/Malayalam/Spanish).
        You can contact me on <a href="https://twitter.com/nediyanchath" target="_blank">Twitter</a>.</p>
        <h2>
          <Link href="/music-search">
            <a>Go here to search for music</a>
          </Link>
        </h2>
        <h2>
          <Link href="/posts/first-post">
            <a>Go to the First Post</a>
          </Link>
        </h2>

      </section>
    </Layout>
  )
}
