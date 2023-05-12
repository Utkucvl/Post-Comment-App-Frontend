import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route, Switch } from "react-router-dom";
import Home from "../src/Components/Home/Home";
import User from "../src/Components/User/User";
import NavBar from "../src/Components/NavBar/NavBar";
import Auth from "./Components/Auth/Auth";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar></NavBar>
        <Routes>
          <Route exact path="/" element={<Home />}>
            {" "}
          </Route>
          <Route exact path="/users/:userId" element={<User />}></Route>
          <Route
            path="/auth"
            element={
              localStorage.getItem("currentUser") != null ? (
                <Navigate to="/" />
              ) : (
                <Auth />
              )
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
