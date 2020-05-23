import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/layout'

export default function Music_Search() {
  return (
    <Layout>
      <Head>
        <title>Music Search</title>
      </Head>
      <h1>Where Music can be Found!</h1>
      <form>
        <label for="artist">Artist: </label>
        <input type="text" id="artist" name="artist"></input><br /><br />
        <input type="submit" value="Submit"></input>
      </form>
      <div class="display">
        <h1 class="artist"></h1>
        <p class="song"></p>
        <p class="album"></p>
      </div>
      <h2>
        <Link href="/posts/weather-seek">
          <a>Looking for the weather somewhere?</a>
        </Link>
      </h2>
      <img src="/musicbrain.jpg" alt="music" />
    </Layout>
  )
}
