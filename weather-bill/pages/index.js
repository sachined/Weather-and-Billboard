import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import { getSortedPostsData } from '../lib/posts'

export default function Home({ allPostsData }) {
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
      <section className={utilStyles.headingMd}>…</section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              {title}
              <br />
              {id}
              <br />
              {date}
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}

export async function getStaticProps()  {
  const allPostsData = getSortedPostsData()
  return  {
    props: {
      allPostsData
    }
  }
}
