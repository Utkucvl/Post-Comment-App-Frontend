import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Modal } from "@mui/material";
import { useState } from "react";
import {
  ListItem,
  List,
  ListItemSecondaryAction,
  Radio,
} from "@material-ui/core";
import { PutWithAuth } from "../../services/HttpService";
import { useNavigate } from "react-router-dom";
import { RefreshToken } from "../../services/HttpService";
function Avatar2(props) {
  const { avatarId,userId,userName } = props;
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(avatarId);

  let navigate = useNavigate();

  const logOut = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("message");
    localStorage.removeItem("refreshKey");
    localStorage.removeItem("userName");
    navigate(0);
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    saveAvatar();
  };
  const saveAvatar = () => {
    PutWithAuth("/users/" + localStorage.getItem("currentUser"), {
      avatar: selectedValue,
    }).then((res) => {
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
            saveAvatar()
           

          }
        }).catch((err)=>{console.log(err)})}
        else
        res.json()
      })
      .catch((err) =>{
        console.log(err)
      })
    }

  return (
    <div>
      <Card sx={{ maxWidth: 345, margin: 6 }}>
        <CardMedia
          sx={{ height: 250, width: 250 }}
          image={`/avatars/avatar${selectedValue}.png`}
          title="User Avatar "
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {userName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            User info
          </Typography>
        </CardContent>
        {localStorage.getItem("currentUser") === userId ? <Button size="small" onClick={handleOpen}>
          Change Avatar{" "}
        </Button>: "" }
       
      </Card>
      <Modal
        sx={{ display: "flex", maxWidth: 200 }}
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <List dense>
          {[1, 2, 3, 4].map((key) => {
            const labelId = `checkbox-list-secondary-label-${key}`;
            return (
              <ListItem key={key} button>
                <CardMedia
                  style={{ maxWidth: 100 }}
                  component="img"
                  alt={`Avatar n°${key}`}
                  image={`/avatars/avatar${key}.png`}
                  title="User Avatar"
                />
                <ListItemSecondaryAction>
                  <Radio
                    edge="end"
                    value={key}
                    onChange={handleChange}
                    checked={"" + selectedValue === "" + key}
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      </Modal>
    </div>
  );
}

export default Avatar2;
