// Im
import Head from 'next/head'
import Link from 'next/link'

import Date from '../components/date'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'

import { getSortedPostsData } from '../lib/posts'


// import the library
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import your icons
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import {
  faGithub,
  faTwitter,
  faLinkedin
} from '@fortawesome/free-brands-svg-icons'

// adding icons to a library that can be used for rest
library.add(
  faGithub,
  faTwitter,
  faLinkedin
)

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
        <div className={utilStyles.bodyCr}>
          <section className={utilStyles.headingMd}>
            <p>Hi, I am Sachin. I am a web developer and a trilingual <strong>(English/ Malayalam/ Spanish)</strong>, currently residing in Bay Area of California.<br/><br/>
            You can check out my <a href="https://www.linkedin.com/in/nediyanchath/" rel="noopener" target="_blank"> career <FontAwesomeIcon icon={faLinkedin} style={{width: '25px'}} /></a>,
            where you can contact me, or direct message <a href="https://twitter.com/nediyanchath" rel="noopener" target="_blank"> me on Twitter <FontAwesomeIcon icon={faTwitter} style={{width: '25px'}} /></a>.</p>
            <div className="linking">
              <h2 className={utilStyles.headingLg}><center>personal projects</center></h2>
              <h2>
                <a href="https://warm-springs-80612.herokuapp.com/">Shopify-spoofed site</a>
              </h2>
              <h2>
                <Link href="/weather-seek">
                  <a>Want to know the weather?</a>
                </Link>
              </h2>
            </div>
            <div className="formContainer">
              <form action="/submitted">
                <h2 className={utilStyles.contact}><center>Interested?</center></h2>
                <label><center>Leave your email below!</center></label>
                <div className="row">
                    <input type="text" placeholder="email" required />
                    <button className="btn"><FontAwesomeIcon icon={faGlobe} style={{width: '15px' }} /> <strong>Submit</strong> </button>
                </div>
              </form>
            </div>
          </section>
          <section className={utilStyles.headingMd}><center>…</center></section>
          <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
            <div className="blogger">
              <h3 className={utilStyles.headingLg}><center>Blog</center></h3>
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
            </div>
          </section>
          <h4>All the apps were coded from these repositories from this <a href="https://github.com/sachined" target="_blank"> Github </a>
          <FontAwesomeIcon icon={faGithub} style={{width: '30px'}} />, using Git as a medium for Heroku and Vercel. </h4>
        </div>
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
