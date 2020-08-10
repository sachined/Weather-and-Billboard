import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import { getSortedPostsData } from '../lib/posts'
import Date from '../components/date'
import "https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous"

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>Hi, I am Sachin. I am a web developer and a trilingual (English/Malayalam/Spanish).
        You can contact me on <a href="https://twitter.com/nediyanchath" target="_blank">Twitter</a>.</p>
        <h1>
          <a href="https://warm-springs-80612.herokuapp.com/">Shopify-spoofed site</a>
        </h1>
        <h2>
          <Link href="/weather-seek">
            <a>Want to know the weather?</a>
          </Link>
        </h2>
        <h2>
          <Link href="/music-search">
            <a>Go here to search for music</a>
          </Link>
        </h2>
          <input type="text" placeholder="email" required>
          <button class="btn"><i class="fa fa-paper-plane">Submit</i></button>
      </section>
      <section className={utilStyles.headingMd}>…</section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href="/posts/[id]" as={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
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
