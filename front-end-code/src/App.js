import "./styles.css";
import { useState } from "react";

import { BrowserRouter as Router } from "react-router-dom";
import { Switch, Route, Redirect } from "react-router-dom";

import { Login } from "./components/loginPage";
import { Register } from "./components/registerPage";
import { ForgotPwdForm } from "./components/forgotPasswordForm";
import { PasswordResetForm } from "./components/resetPasswordForm";
import { Verification } from "./components/verification";
import { Application } from "./components/application";

import HashLoader from "react-spinners/HashLoader";

export default function App() {
  let [loading, setLoading] = useState(false);
  const [username, setusername] = useState({});

  const [popUp, setpopUp] = useState("popup messagehbhj jbjbjb jbjbjb");
  const [popOut, setpopOut] = useState("none");

  return (
    <>
      <div
        className="App"
        style={{
          filter: popOut === "block" ? "grayscale(100%)" : "grayscale(0)"
        }}
      >
        <Router>
          <div id="header">
            <div>
              <img src={require("./images/chainshorten.png").default} alt="" />
              <span>URL Shortener</span>
            </div>

            <div id="loadingDiv">
              <HashLoader color={"white"} loading={loading} size={55} />
            </div>
          </div>
          <div></div>
          <Switch>
            <Route path="/login">
              <Login
                popup={setpopOut}
                popupMsg={setpopUp}
                setLoading={setLoading}
                setusername={setusername}
              />
            </Route>
            <Route path="/register">
              <Register
                popup={setpopOut}
                popupMsg={setpopUp}
                setLoading={setLoading}
              />
            </Route>
            <Route path="/forgot">
              <ForgotPwdForm
                popup={setpopOut}
                popupMsg={setpopUp}
                setLoading={setLoading}
              />
            </Route>
            <Route path="/reset">
              <PasswordResetForm
                popup={setpopOut}
                popupMsg={setpopUp}
                setLoading={setLoading}
              />
            </Route>
            <Route path="/verification">
              <Verification
                popup={setpopOut}
                popupMsg={setpopUp}
                setLoading={setLoading}
              />
            </Route>
            <Route path="/application">
              <Application
                user={username}
                popup={setpopOut}
                popupMsg={setpopUp}
                setLoading={setLoading}
              />
            </Route>

            <Route path="*">
              <Redirect to="/login" />
            </Route>
          </Switch>
        </Router>
      </div>

      <div id="popup" style={{ display: popOut }}>
        <button
          onClick={() => {
            setpopOut("none");
          }}
        >
          X
        </button>
        <br></br>
        <span>{popUp}</span>
      </div>
      <div></div>
    </>
  );
}
