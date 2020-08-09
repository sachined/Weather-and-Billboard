import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/layout'

export default function Submission() {
  return (
    <Layout>
      <Head>
        <title>Submitted</title>
      </Head>
      <div>
        <h1>This has been submitted!</h1>
          <p>Thank you for coming to this website!</p>
      </div>
    </Layout>
  )
}
