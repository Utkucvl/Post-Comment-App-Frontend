import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Avatar2 from "../Avatar/Avatar2";
import UserActivity from "../UserActivity/UserActivity";
import "./User.css";
import { GetWithAuth } from "../../services/HttpService";

function User() {
  const { userId } = useParams();
  const [user, setUser] = useState();
  const getUser = () => {
    GetWithAuth("/users/" + userId)
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result);
          setUser(result);
        },
        (error) => {
          console.log(error);
        }
      );
  };
  useEffect(() => {
    getUser();
  }, []);
  return (
    <div className="root">
      {user ? <Avatar2 userId={userId} avatarId={user.avatarId} userName={user.userName}></Avatar2> : ""}
      {localStorage.getItem("currentUser") === userId ? <UserActivity userId={userId}></UserActivity> : ""}
    </div>
  );
}
export default User;
