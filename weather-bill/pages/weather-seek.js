/* This will create a weather page
*  some continuity
*/

import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/layout'

export default function Weather_Search () {
  return (
    <Layout>
      <Head>
        <title>Weather Search</title>
      </Head>
      <div class="world_map">
        <h1>Weather Seeker</h1>
          <div className="container">
            <div className="app-title"><p>Weather</p></div>
            <div className="notification"></div>
            <div className="weather-container">
                <div className="weather-icon"><img src="/icons/unknown.png"/></div>
                <div className="temperature-value"><p>- °<span>C</span></p></div>
                <div className="temperature-description"><p> - </p></div>
                <div className="location"><p>-</p></div>
            </div>
          </div>
          <script src="/app.js"></script>
        <h2>
          <Link href="/music-search">
            <a>Go to the Music Search</a>
          </Link>
        </h2>
        <img src="/weather_board.jpg" alt="weather" />
      </div>
    </Layout>
  )
}
