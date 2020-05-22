/* This file can be removed, but kept in order to keep
*  some continuity
*/

import Head from 'next/head'
import Link from 'next/link'
import Layout from '../../components/layout'

export default function FirstPost() {
  return (
    <Layout>
      <Head>
        <title>Weather Search</title>
      </Head>
      <h1>Weather Seeker</h1>
      <h2>
        <Link href="/music-search">
          <a>Go to the Music Search</a>
        </Link>
      </h2>
      <img src="/weather_board.jpg" alt="weather" />
    </Layout>
  )
}
