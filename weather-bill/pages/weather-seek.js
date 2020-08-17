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
          <h1>Weather Seeker</h1>
            <div className="container">
              <div className="app-title"><p>Weather</p></div>
              <div className="notification"></div>
              <div className="weather-container">
                  <div className="weather-icon"><img src="/icons/unknown.png" alt="current weather icon"/></div>
                  <div className="temperature-value"><p>- °<span>C</span></p></div>
                  <div className="temperature-description"><p> - </p></div>
                  <div className="location"><p>-</p></div>
              </div>
            </div>
            <script src="/app.js"></script>
            <br/>
          <img src="/weather_board.jpg" alt="weather" />
    </Layout>
  )
}
