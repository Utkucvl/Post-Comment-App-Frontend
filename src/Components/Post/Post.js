import { ReactDOM } from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { blue, red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import { makeStyles } from "@mui/material/styles";
import { ExpandMore } from "@mui/icons-material";
import "./Post.css";
import CommentIcon from "@mui/icons-material/Comment";
import { Link } from "react-router-dom";
import "../NavBar/NavBar";
import { useEffect, useRef } from "react";
import { Container, setRef } from "@mui/material";
import Comment from "../Comment/Comment";
import CommentForm from "../Comment/CommentForm";
import { PostWithAuth,DeleteWithAuth ,RefreshToken} from "../../services/HttpService";
import { useNavigate } from "react-router-dom";

function Post(props) {
  const { title, text, userId, userName, postId, likes ,refreshAllPosts } = props;
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [commentList, setCommentList] = useState([]);
  const isInitialMount = useRef(true);
  const [likeCount, setLikeCount] = useState(likes.length);
  const [likeId, setLikeId] = useState(0);
  const [refresh,setRefresh] = useState(false);
  let disabled = localStorage.getItem("currentUser") === null ? true : false;

  const setRefreshComment = () =>{
    setRefresh(true);
  }

  let navigate = useNavigate();

  const logOut = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("message");
    localStorage.removeItem("refreshKey");
    localStorage.removeItem("userName");
    navigate(0);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
    refreshComments();

  };
  const handleLike = () => {
    setLiked(!liked);
    if (!liked) {
      saveLike();
      setLikeCount(likeCount + 1);
    } else {
      saveUnlike();
      setLikeCount(likeCount - 1);
    }
  };
  const refreshComments = () => {
    fetch("/comments?postId=" + postId)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setCommentList(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
      setRefresh(false);
  };
  const checkLiked = () => {
    var likeControl = likes.find((like) => ""+like.userId === localStorage.getItem("currentUser"));
    if (likeControl != null) {
      setLikeId(likeControl.id);
      setLiked(true);
    }
  };
  const saveLike = () => {
    PostWithAuth("/likes" , {
      userId: localStorage.getItem("currentUser"),
      postId: postId,
    })
    .then((res) => {
      if(!res.ok){
        
        RefreshToken()
        .then((res) =>{
          if(!res.ok){ 
            logOut()
          }
          else
          return res.json()
        }).then((result) =>{
          console.log(result)
          if(result !== undefined){
            localStorage.setItem("tokenKey",result.accessToken)
            saveLike()
            refreshAllPosts()
            

          }
        }).catch((err)=>{console.log(err)})}
        else
        res.json()
      })
      .catch((err) =>{
        console.log(err)
      })
    }
    
  const saveUnlike = () => {  
    DeleteWithAuth("/likes/"+likeId)
    .then((res) => {
      if(!res.ok){
        
        RefreshToken()
        .then((res) =>{
          if(!res.ok){ 
            logOut()
          }
          else
          return res.json()
        }).then((result) =>{
          console.log(result)
          if(result !== undefined){
            localStorage.setItem("tokenKey",result.accessToken)
            saveUnlike()
            refreshAllPosts()
            

          }
        }).catch((err)=>{console.log(err)})}
        else
        res.json()
      })
      .catch((err) =>{
        console.log(err)
      })
    }
    

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
    refreshComments();
  }, [refresh]);
  useEffect(() => {
    checkLiked();
  }, []);
  return (
    <div className="postContainer">
      <Card sx={{ Width: 800, textAlign: "left" }}>
        <CardHeader
          avatar={
            <Link className="link2" to={{ pathname: "/users/" + userId }}>
              <Avatar sx={{ bgcolor: "#034f84" }} aria-label="recipe">
                {userName.charAt(0).toUpperCase()}
              </Avatar>
            </Link>
          }
          title={title}
        />
        <CardContent>
          <Typography
            variant="body2"
            color="text.secondary"
            style={{ textAlign: "center" }}
          >
            {text}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          {disabled ? (
            <IconButton
              disabled
              onClick={handleLike}
              aria-label="add to favorites"
            >
              <FavoriteIcon style={liked ? { color: "red" } : null} />
            </IconButton>
          ) : (
            <IconButton onClick={handleLike} aria-label="add to favorites">
              <FavoriteIcon style={liked ? { color: "red" } : null} />
            </IconButton>
          )}

          {likeCount}
          <CommentIcon
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </CommentIcon>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Container fixed className="container">
            {error
              ? "error"
              : isLoaded
              ? commentList.map((comment) => (
                  <Comment
                    userId={comment.userId}
                    userName={comment.userName}
                    text={comment.text}
                  ></Comment>
                ))
              : "Loading"}
            {localStorage.getItem("currentUser") === null ? (
              ""
            ) : (
              <CommentForm
              setRefreshComment={setRefreshComment}
                postId={postId}
                userId={localStorage.getItem("currentUser")}
                userName={localStorage.getItem("userName")}
              ></CommentForm>
            )}
          </Container>
        </Collapse>
      </Card>
    </div>
  );
}

export default Post;
