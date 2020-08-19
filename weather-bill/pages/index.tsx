// Importing from next library to enable head element and linkage
import Head from 'next/head'
import Link from 'next/link'

// These three import statements are for registration form using React and server-side
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import ReCAPTCHA from 'react-google-recaptcha'

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

interface FormData  {
  name: string;
  email: string;
}

export default function Home({ allPostsData }) {

  const { register, handleSubmit, errors } = useForm<FormData>({
    defaultValues:  {
      name: "Sachin Headchayn",
      email: "sachin@email.com",
    },
  });
  const [submitting, setSubmitting] = useState<boolean>(false);

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
              <h2 className={utilStyles.headingLg}>personal projects</h2>
              <h3>
                <a href="https://warm-springs-80612.herokuapp.com/">Shopify-spoofed site</a>
              </h3>
              <h3>
                <Link href="/weather-seek">
                  <a>Want to know the weather?</a>
                </Link>
              </h3>
              <h3>
                <a href="https://codepen.io/Kokoshka-Cowboy/">
                  Portfolio of self-designed web pages
                </a>
              </h3>
            </div>
            <div className="formContainer">
              <form action="/submitted">
                <h2 className={utilStyles.contact}>Interested?</h2>
                <div>
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    ref={register( { required: "required" })}
                  />
                  {errors.name ? <div>{errors.name.message}</div> : null}
                </div>
                <div>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    ref={register( {required: "required" })}
                  />
                  {errors.email ? <div>{errors.email.message}</div> : null}
                </div>
                <button type="submit"><FontAwesomeIcon icon={faGlobe} style={{width: '15px' }} />Submit</button>
              </form>
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