import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/layout'

export default function Submitted() {
  return (
    <Layout>
      <Head>
        <title>Submitted</title>
      </Head>
      <div>
        <h1>This has been submitted!</h1>
          <p>Thank you for coming to this website!</p>

          <h4>Please note that this is still in working progress.<br/><br/>Please send email to <span className="blue_text">sachin.nediyanchath@gmail.com</span> for immediate contact</h4>
      </div>
    </Layout>
  )
}
