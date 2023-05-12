import { Avatar, CardContent, InputAdornment, OutlinedInput } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import "./Comment.css";


function Comment(props) {
  const { userId,userName,text } = props;
  return (
    <CardContent className="comment">
      <OutlinedInput
        disabled
        id="outlined-adornmenamount"
        multiline
        inputProps={{ maxLength: 25 }}
        value={text}
        startAdornment={
          <InputAdornment position="start">
            <Link className="link2" to={{ pathname: "/users/" + userId }}>
              <Avatar className="small" sx={{ bgcolor: "#034f84" }} aria-label="recipe">
                {userName.charAt(0).toUpperCase()}
              </Avatar>
            </Link>
          </InputAdornment>
        }
        style={{color:"black" , backgroundColor:"white"}}
      ></OutlinedInput>
    </CardContent>
  );
}

export default Comment;
