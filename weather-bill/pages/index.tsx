// Importing from next library to enable head element and linkage
import Head from 'next/head'
import Link from 'next/link'

// These three import statements are for registration form using React and server-side

// Import from components folder
import Date from '../components/date'
import Layout, { siteTitle } from '../components/layout'

// Import from styles folder
import utilStyles from '../styles/utils.module.css'

// Import from lib folder
import { getSortedPostsData } from '../lib/posts'

// import the library for icons
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import your icons
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
            <p>Hi, I am Sachin. I am a software/web developer and a trilingual <strong>(English/ Malayalam/ Spanish)</strong>, currently residing in Bay Area of California.<br/><br/>
            You can check out my <a href="https://www.linkedin.com/in/nediyanchath/" rel="noopener" target="_blank"> career <FontAwesomeIcon icon={faLinkedin} style={{width: '25px'}} /></a>,
            where you can contact me, or direct message <a href="https://twitter.com/nediyanchath" rel="noopener" target="_blank"> me on Twitter <FontAwesomeIcon icon={faTwitter} style={{width: '25px'}} /></a>.</p>
            <hr />
            <div className="linking">
              <h2 className={utilStyles.headingLg}>personal projects</h2>
              <h3>
                <a href="https://warm-springs-80612.herokuapp.com/">ChinShoppingCart</a>
              </h3>
              <h3>
                <Link href="/weather-seek">
                  <a>Want to know the weather where you are?</a>
                </Link>
              </h3>
              <h3>
                <a href="https://codepen.io/Kokoshka-Cowboy/">
                  Portfolio of self-designed web pages
                </a>
              </h3>
            </div>
          </section>
          <section className={utilStyles.headingMd}>…</section>
          <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
            <div className="blogger">
              <h3 className={utilStyles.headingLg}>Blog</h3>
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
          <h4>All the apps were coded from these repositories from this <a href="https://github.com/sachined" rel="noopener" target="_blank"> Github </a>
          <FontAwesomeIcon icon={faGithub} style={{width: '30px'}} />, using Git as a medium for Heroku and Vercel. </h4>
          <p style={{fontWeight: "bold"}}>If you prefer email, you can email me @ <a href="mailto:sachin.nediyanchath@gmail.com">sachin.nediyanchath@gmail.com</a> !</p>
          <p style={{fontStyle: "oblique"}}>Donations are appreciated, if you enjoy <a href="https://www.twitch.tv/mauldysach">gaming content</a></p>
          <form action="https://www.paypal.com/donate" method="post" target="_top">
            <input type="hidden" name="cmd" value="_donations" />
            <input type="hidden" name="business" value="2N7C9MK5EQN6J" />
            <input type="hidden" name="item_name" value="Charity" />
            <input type="hidden" name="currency_code" value="USD" />
            <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
            <img alt=""  src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />
          </form>

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
