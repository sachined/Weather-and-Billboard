import Layout from '../../components/layout'
import { getAllPostIds, getPostData } from '../../lib/posts'

// Render a post page
// Update the 'Post' component to render 'contentHtml' using 'dangerouslySetInnerHTML'
export default function Post({ postData })  {
  return (
    <Layout>
      {postData.title}
      <br />
      {postData.id}
      <br />
      {postData.date}
      <br />
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </Layout>
  )
}

// This function will return a list of possible values for 'id'
export async function getStaticPaths()  {
  // Return a list of possible value for id
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
