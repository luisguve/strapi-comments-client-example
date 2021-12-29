import { useState, useContext, useEffect } from "react"
import { Link } from "react-router-dom";

import Login from "./components/Login"
import AuthContext from "./context/AuthContext"
import { posts, STRAPI } from "./lib/urls"

interface IPostData {
  contentID: string;
  commentsCount?: Number;
}

function App() {
  const { user } = useContext(AuthContext)
  const [postsData, setPostsData] = useState<IPostData[]>(posts)
  useEffect(() => {
    const fetchCommentCount = async (slug: string) => {
      const url = `${STRAPI}/api/comment-manager/comments/${slug}/count`
      const res = await fetch(url)
      const { count } = await res.json()
      const updatedPostsData = postsData.map(p => {
        if (p.contentID === slug) {
          p.commentsCount = count
        }
        return p
      })
      setPostsData(updatedPostsData)
    }
    posts.map(p => {
      fetchCommentCount(p.contentID)
    })
  }, [])
  const renderList = () => {
    const postsJSX = postsData.map(p => {
      return (
        <div className="p-4 my-3 border rounded" key={p.contentID}>
          <h1><Link to={"/"+p.contentID}>{p.contentID}</Link></h1>
          <p>{(p.commentsCount !== undefined) ? p.commentsCount + " comments" : "Loading comments..."}</p>
        </div>
      )
    })
    return postsJSX
  }
  const [postsList, setPostsList] = useState<React.ReactNode>(renderList())
  useEffect(() => {
    setPostsList(renderList())
  }, [postsData])
  return (
    <div className="container-md py-5">
      {
        !user && <Login />
      }
      {
        postsList
      }
    </div>
  )
}

export default App
