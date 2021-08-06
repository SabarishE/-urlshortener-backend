import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";

export function Login({ popup, popupMsg, setLoading, setusername }) {
  const history = useHistory();
  function afterlogin(msg, data) {
    popup("block");
    popupMsg(msg);
    setLoading(false);
    if (msg !== "Invalid credentials" && msg !== "Account is not activated") {
      history.push("/application/dashboard");
      setusername(data);
    }
  }

  const handler = (v, e) => {
    console.log("login alert !!!!", v);
    setLoading(true);
    e.target.reset();

    fetch("https://urlshortener-backend-task4.herokuapp.com/users/login", {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(v)
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        // setuser(data.loggeduser);

        if (data.loggeduser) {
          if (data.loggeduser.isActivated === false) {
            afterlogin("Account is not activated");
          } else {
            afterlogin("Successful login !!!", data.loggeduser);
          }
        } else {
          afterlogin("Invalid credentials");
        }
      });
  };

  const { register, handleSubmit } = useForm();
  return (
    <>
      <div id="loginDiv">
        <div className="formDiv">SIGN IN</div>
        <form onSubmit={handleSubmit(handler)}>
          <label>Email</label>
          <input
            type="email"
            {...register("email")}
            id="email"
            autoComplete="off"
            required
          ></input>
          <label>Password</label>
          <input type="password" {...register("password")} required></input>

          <input type="submit" value="Sign In"></input>
        </form>
        <div id="loginFooter">
          {" "}
          <span>
            {" "}
            <Link
              to="/forgot"
              style={{ textDecoration: "none", color: "black" }}
            >
              Forgot Password ?
            </Link>
          </span>
          <span>
            <Link
              to="/register"
              style={{ textDecoration: "none", color: "black" }}
            >
              Sign up
            </Link>
          </span>
        </div>
      </div>
    </>
  );
}
