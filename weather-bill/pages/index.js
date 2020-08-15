import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import { getSortedPostsData } from '../lib/posts'
import Date from '../components/date'

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

        <?php
          $fileWrite = '';
          $myFile = "testFile.txt";
            if(isset($_POST['fileWrite']) && !empty($_POST['fileWrite'])) {
              $fileWrite = $_POST['fileWrite'].PHP_EOL;
            }
            if($fileWrite) {
              $fh = fopen($myFile, 'a') or die("can't open file"); //Make sure you have permission
              fwrite($fh, $fileWrite);
              fclose($fh);
            }
        ?>

      </Head>
      <section className={utilStyles.headingMd}>
        <p>Hi, I am Sachin. I am a web developer and a trilingual (English/Malayalam/Spanish) living in California.<br/><br/>
        You can check out my <a href="https://www.linkedin.com/in/nediyanchath/" target="_blank"> career <FontAwesomeIcon icon={faLinkedin} style={{width: '25px'}} /></a>, where you can contact me, or direct message <a href="https://twitter.com/nediyanchath" target="_blank"> here <FontAwesomeIcon icon={faTwitter} style={{width: '25px'}} /></a>.</p>
        <h1>
          <a href="https://warm-springs-80612.herokuapp.com/">Shopify-spoofed site</a>
        </h1>
        <h2>
          <Link href="/weather-seek">
            <a>Want to know the weather?</a>
          </Link>
        </h2>
          <form action="/submitted" method="post">
            <h3 className={utilStyles.contact}>Interested in having a conversation?</h3>
            <div className="row">
              <div className="col-xs-7">
                <input type="text" placeholder="email" name="fileWrite" required />
              </div>
              <div className="col-xs-5">
                <button className="btn"><FontAwesomeIcon icon={faGlobe} />Submit</button>
              </div>
            </div>
          </form>
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
      <h4>All the apps were coded from these repositories from this <a href="https://github.com/sachined" target="_blank"> Github </a> <FontAwesomeIcon icon={faGithub} style={{width: '30px'}} />, using Git as a medium for Heroku and Vercel. </h4>
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
