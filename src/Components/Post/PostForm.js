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
import { red } from "@mui/material/colors";
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
import { Button, InputAdornment, OutlinedInput } from "@mui/material";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import React from "react";
import { PostWithAuth ,RefreshToken} from "../../services/HttpService";
import { useNavigate } from "react-router-dom";

function PostForm(props) {
  let navigate = useNavigate();
  const { userId, userName, refreshPost ,refreshAllPosts} = props;
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [isPost, setIsPost] = useState(false);

  const logOut = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("message");
    localStorage.removeItem("refreshKey");
    localStorage.removeItem("userName");
    navigate(0);
  };


  const savePost = () => {
    PostWithAuth("/posts", {
      title: title,
      userId: userId,
      text: text,
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
            savePost()
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

  const handleSubmit = () => {
    savePost();
    setIsPost(true);
    setTitle("");
    setText("");
    refreshPost();
    refreshAllPosts()
  };
  const handleTitle = (value) => {
    setTitle(value);
    setIsPost(false);
  };
  const handleText = (value) => {
    setText(value);
    setIsPost(false);
  };
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsPost(false);
  };
  return (
    <div className="postContainer">
      <Snackbar open={isPost} autoHideDuration={1500} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Your post is sent !
        </Alert>
      </Snackbar>
      <Card sx={{ Width: 800, textAlign: "left" }}>
        <CardHeader
          avatar={
            <Link className="link2" to={{ pathname: "/users/" + userId }}>
              <Avatar sx={{ bgcolor: "#034f84" }} aria-label="recipe">
                {userName.charAt(0).toUpperCase()}
              </Avatar>
            </Link>
          }
          title={
            <OutlinedInput
              id="outlined-adornmenamount"
              multiline
              placeholder="Title"
              inputProps={{ maxLength: 25 }}
              value={title}
              onChange={(i) => handleTitle(i.target.value)}
              fullWidth
            ></OutlinedInput>
          }
        />
        <CardContent>
          <Typography
            variant="body2"
            color="text.secondary"
            style={{ textAlign: "center" }}
          >
            <OutlinedInput
              id="outlined-adornmenamount"
              multiline
              placeholder="Text"
              inputProps={{ maxLength: 250 }}
              fullWidth
              value={text}
              onChange={(i) => handleText(i.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <Button
                    variant="contained"
                    style={{
                      background:
                        "linear-gradient(45deg,#2196F3 30% , 21CBF3 90%)",
                      color: "white",
                    }}
                    onClick={handleSubmit}
                  >
                    Post
                  </Button>
                </InputAdornment>
              }
            ></OutlinedInput>
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default PostForm;
