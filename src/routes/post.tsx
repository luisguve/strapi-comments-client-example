import { useContext, useEffect } from "react"
import { CommentsConfigContext, Comments, CommentForm, ErrorBox } from "strapi-comments-client"
import { useParams, Link } from "react-router-dom";

const Post = () => {
  const { setContentID } = useContext(CommentsConfigContext)
  const { contentID } = useParams()
  useEffect(() => {
    if (contentID) {
      setContentID(contentID)
    }
  }, [contentID])

  return (
    <div className="container-md py-5">
      <p className="my-3"><Link to="/">Back</Link></p>
      <h1 className="fs-4 mb-3">This is {contentID}</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
        cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <CommentForm />
      <ErrorBox />
      <Comments />
    </div>
  )
}

export default Post
