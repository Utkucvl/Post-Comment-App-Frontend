import {
  Avatar,
  CardContent,
  InputAdornment,
  OutlinedInput,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Comment.css";
import { PostWithAuth, RefreshToken } from "../../services/HttpService";
import { useNavigate } from "react-router-dom";

function CommentForm(props) {
  let navigate = useNavigate();
  const { userId, userName, postId, setRefreshComment } = props;
  const [text, setText] = useState("");

  const logOut = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("message");
    localStorage.removeItem("refreshKey");
    localStorage.removeItem("userName");
    navigate(0);
  };

  const saveComment = () => {
    PostWithAuth("/comments", {
      postId: postId,
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
              saveComment()
              setRefreshComment()

            }
          }).catch((err)=>{console.log(err)})}
          else
          res.json()
        })
        .catch((err) =>{
          console.log(err)
        })
      }
      
     

  const handleComment = () => {
    saveComment();
    setText("");
    setRefreshComment();
  };
  const handleText = (value) => {
    setText(value);
  };
  return (
    <CardContent className="comment">
      <OutlinedInput
        id="outlined-adornmenamount"
        multiline
        onChange={(i) => handleText(i.target.value)}
        inputProps={{ maxLength: 250 }}
        startAdornment={
          <InputAdornment position="start">
            <Link className="link2" to={{ pathname: "/users/" + userId }}>
              <Avatar
                className="small"
                sx={{ bgcolor: "#034f84" }}
                aria-label="recipe"
              >
                {userName.charAt(0).toUpperCase()}
              </Avatar>
            </Link>
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end">
            <Button
              variant="contained"
              style={{
                background: "linear-gradient(45deg,#2196F3 30% , 21CBF3 90%)",
                color: "white",
              }}
              onClick={handleComment}
            >
              Comment
            </Button>
          </InputAdornment>
        }
        value={text}
        style={{ color: "black", backgroundColor: "white" }}
      ></OutlinedInput>
    </CardContent>
  );
}

export default CommentForm;
