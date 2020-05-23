/* This will create a weather page
*  some continuity
*/

import Head from 'next/head'
import Link from 'next/link'
import Layout from '../../components/layout'
import fetch from 'isomorphic-unfetch'

export default function FirstPost() {
  return (
    <Layout>
      <Head>
        <title>Weather Search</title>
      </Head>
      <h1>Weather Seeker</h1>
      <form>
        <label htmlFor="city">City in US: </label>
        <input type="text" className="inputValue" placeholder="ex: Morgan Hill,US"></input><br /><br />
        <input type="submit" value="Submit" class="button"></input>
      </form>
      <div class="display">
        <h1 class="name"></h1>
        <p class="temp"></p>
        <p class="desc"></p>
      </div>
      <h2>
        <Link href="/music-search">
          <a>Go to the Music Search</a>
        </Link>
      </h2>
      <img src="/weather_board.jpg" alt="weather" />
    </Layout>
  )
}
