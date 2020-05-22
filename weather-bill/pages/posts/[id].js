import Layout from '../../components/layout'
import { getAllPostIds, getPostData } from '../../lib/posts'
import Head from 'next/head'
import Date from '../../components/date'
import utilStyles from '../../styles/utils.module.css'

// Render a post page
// Update the 'Post' component to render 'contentHtml' using 'dangerouslySetInnerHTML'
export default function Post({ postData })  {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
      {/* Commented out to use the Date object for format
         {postData.date}*/}
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  )
}

// This function will return a list of possible values for 'id'
export async function getStaticPaths()  {
  // Return a list of possible value for id
  // fallback: false -> any paths not returned by 'getStaticPaths' will result in a 404 page
  const paths = getAllPostIds()
  return {
    paths,
    fallback: false
  }
}

// This function will fetch necessary data for the blog post with a given 'id'
export async function getStaticProps({ params }) {
  // Fetch necessary data for the blog post using params. id
  // Add the 'await' for 'remark'
  const postData = await getPostData(params.id)
  return {
    props: {
      postData
    }
  }
}
