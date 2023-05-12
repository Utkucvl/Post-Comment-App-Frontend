import React from "react";
import Post from "../Post/Post";
import "./Home.css";
import { useState, useEffect } from "react";
import { Container } from "@mui/material";
import PostForm from "../Post/PostForm";
function Home() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [postList, setPostList] = useState([]);
  const [refreshPostt,setRefreshPost] = useState(false)

  const refreshAllPosts = () =>{
    setRefreshPost(true)
  }

  const refreshPost = () => {
    fetch("/posts")
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setPostList(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
      setRefreshPost(false)
  };

  useEffect(() => {
    refreshPost();
  }, [refreshPostt]);

  if (error) {
    return <div> Error !!! </div>;
  } else if (!setIsLoaded) {
    return <div>Loading ...</div>;
  } else {
    return (
      <div className="container">
        {localStorage.getItem("currentUser") === null ? (
          ""
        ) : (
          <PostForm
          refreshAllPosts={refreshAllPosts}
            userId={localStorage.getItem("currentUser")}
            userName={localStorage.getItem("userName")}
            refreshPost={refreshPost}
          ></PostForm>
        )}

        {postList.map((post) => (
          <Post
          refreshAllPosts={refreshAllPosts}
            likes={post.postLikes}
            postId={post.id}
            userId={post.userId}
            userName={post.userName}
            title={post.title}
            text={post.text}
          ></Post>
        ))}
      </div>
    );
  }
}
export default Home;
