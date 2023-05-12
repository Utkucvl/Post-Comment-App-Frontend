import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { forwardRef } from "react";
import Post from "../Post/Post";
import { GetWithAuth, PostWithAuth } from "../../services/HttpService";

const columns = [
  {
    id: "User Activity",
    label: "User Activity",
    minWidth: 170,
    align: "left",
    format: (value) => value.toLocaleString("en-US"),
  },
];

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function PopUp(props) {
  const { isOpen, postId, setIsOpen } = props;
  const [open, setOpen] = useState(isOpen);
  const [post, setPost] = useState(null);

  const getPost = () => {
    GetWithAuth("/posts/" + postId)
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result);
          setPost(result);
        },
        (error) => {
          console.log(error);
        }
      );
  };
  const handleClose = () => {
    setOpen(false);
    setIsOpen(false);
  };
  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);
  useEffect(() => {
    getPost();
  }, [postId]);

  return post != null ? (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Close
          </Typography>
        </Toolbar>
      </AppBar>
      <Post
        likes={post.postLikes}
        postId={post.id}
        userId={post.userId}
        userName={post.userName}
        title={post.title}
        text={post.text}
      ></Post>
    </Dialog>
  ) : (
    "loading"
  );
}

function UserActivity(props) {
  const { userId } = props;
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [rows, setRows] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const getActivity = () => {
    GetWithAuth("/users/activity/" + localStorage.getItem("currentUser"))
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          console.log(result);
          setRows(result);
        },
        (error) => {
          console.log(error);
          setIsLoaded(true);
          setError(error);
        }
      );
  };

  const handleNotification = (postId) => {
    setSelectedPost(postId);
    setIsOpen(true);
  };

  useEffect(() => {
    getActivity();
  }, []);

  return (
    <div>
      {isOpen ? (
        <PopUp
          isOpen={isOpen}
          postId={selectedPost}
          setIsOpen={setIsOpen}
        ></PopUp>
      ) : (
        ""
      )}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>User Activity</TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                return (
                  <Button
                    onClick={() => {
                      handleNotification(row[1]);
                    }}
                  >
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      {row[3] + " " + row[0] + " your post "}
                    </TableRow>
                  </Button>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
        />
      </Paper>
    </div>
  );
}
export default UserActivity;
