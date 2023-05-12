import React from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import "./NavBar.css";
import { LockOpen } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function NavBar() {
  let navigate = useNavigate();

  const onClick = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("message");
    localStorage.removeItem("refreshKey");
    localStorage.removeItem("userName");
    navigate(0);
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, textAlign: "left" }}
            >
              <Link className="link" to="/">
                Home
              </Link>
            </Typography>

            <Typography>
              {localStorage.getItem("currentUser") != null ? (
                <div>
                  <IconButton className="link2" onClick={onClick}>
                    <LockOpen></LockOpen>{" "}
                  </IconButton>
                  <Link
                    className="link2"
                    to={{
                      pathname: "/users/" + localStorage.getItem("currentUser"),
                    }}
                  >
                    Profile
                  </Link>
                </div>
              ) : (
                <Link className="link2" to="/auth">
                  Login/Register
                </Link>
              )}
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
}

export default NavBar;
