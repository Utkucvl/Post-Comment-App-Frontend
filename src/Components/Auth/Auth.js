import {
  FormControl,
  Input,
  InputLabel,
  Button,
  FormHelperText,
} from "@mui/material";
import React, { useState } from "react";
import { PostWithoutAuth } from "../../services/HttpService";

function Auth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const sendRequest = (path) => {
    PostWithoutAuth("/auth/" + path, {
      userName: username,
      password: password,
    })
      .then((res) => res.json())
      .then((result) => {
        localStorage.setItem("tokenKey", result.accessToken);
        localStorage.setItem("refreshKey",result.refreshToken);
        localStorage.setItem("currentUser", result.userId);
        localStorage.setItem("userName", username);
      })

      .catch((err) => console.log(err));
  };

  const handleUsername = (value) => {
    setUsername(value);
  };
  const handlePassword = (value) => {
    setPassword(value);
  };
  const handleButton = (path) => {
    sendRequest(path);
    setUsername("");
    setPassword("");
    // eslint-disable-next-line no-restricted-globals
    history.go("/auth");
  };

  return (
    <FormControl>
      <InputLabel style={{ top: 20 }}>Username</InputLabel>
      <Input
        style={{ top: 20 }}
        onChange={(i) => handleUsername(i.target.value)}
      ></Input>
      <InputLabel style={{ top: 80 }}>Password</InputLabel>
      <Input
        style={{ top: 40 }}
        onChange={(i) => handlePassword(i.target.value)}
      ></Input>
      <Button
        onClick={() => handleButton("register")}
        variant="contained"
        style={{
          marginTop: 60,
          background: "linear-gradient(45deg,#2196F3 30% , 21CBF3 90%)",
          color: "white",
        }}
      >
        Register
      </Button>
      <FormHelperText>Are you already registered ? </FormHelperText>
      <Button
        onClick={() => handleButton("login")}
        variant="contained"
        style={{
          marginTop: 10,
          background: "linear-gradient(45deg,#2196F3 30% , 21CBF3 90%)",
          color: "white",
        }}
      >
        Login
      </Button>
    </FormControl>
  );
}

export default Auth;
