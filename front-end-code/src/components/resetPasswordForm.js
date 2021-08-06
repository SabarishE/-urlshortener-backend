import { useState } from "react";
import { useForm } from "react-hook-form";

import { Link } from "react-router-dom";

import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";

export function PasswordResetForm({ popup, popupMsg, setLoading }) {
  const [formDis, setformDis] = useState("none");
  const [Verified, setVerified] = useState(false);
  const [verifyDis, setVerifyDis] = useState("block");
  const { register, handleSubmit } = useForm();

  const [disable, setdisable] = useState(false);

  var urlarr = window.location.href.split("/");
  const email = urlarr[urlarr.length - 2];
  const token = urlarr[urlarr.length - 1];

  function afterrequest(msg) {
    popup("block");
    popupMsg(msg);
    setLoading(false);
  }

  const VerifyHandler = (v) => {
    console.log("verification starts ...");
    setLoading(true);

    fetch(
      `https://urlshortener-backend-task4.herokuapp.com/users/resetpwd/${email}/${token}`,
      {
        method: "GET",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        }
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("-----verification success------", data);
        if (data.email) {
          setVerified(true);
          afterrequest("Verification success, you can now reset your password");
        }
      })
      .catch((err) => {
        console.log("err in login !!!", err.message);
        afterrequest("Verification failed");
      });
  };

  const ResetPasswordHandler = (v) => {
    console.log("new pwd >>>>", v);

    if (v.pwd !== v.confirmpwd) {
      popup("block");
      popupMsg("Passwords should match");
      setLoading(false);
      return;
    }
    setLoading(true);

    fetch(
      `https://urlshortener-backend-task4.herokuapp.com/users/resetpwd/${email}/${token}`,
      {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(v)
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("-----password reset success------", data);
        if (data.email) {
          setformDis("block");
          setdisable(true);
          afterrequest(
            "Password reset success ,you can now sign in with new password"
          );
        }
      })
      .catch((err) => {
        console.log("-----error in password change -----", err.message);
        afterrequest("Password reset failed");
      });
  };

  return (
    <>
      <div
        id="verifyToken"
        style={{
          backgroundColor: Verified ? "rgb(87, 155, 187)" : "",
          color: Verified ? "rgb(87, 155, 187)" : "",
          display: verifyDis
        }}
      >
        <button
          onClick={VerifyHandler}
          style={{ color: Verified ? "rgb(87, 155, 187)" : "" }}
        >
          {Verified ? (
            <>
              <span>Verified </span>
              <span style={{ verticalAlign: "middle" }}>
                <VerifiedUserIcon />
              </span>
            </>
          ) : (
            "Verify"
          )}
        </button>
        {Verified ? (
          <button
            onClick={() => {
              setformDis("block");
              setVerifyDis("none");
            }}
            style={{ color: "rgb(93, 250, 93)" }}
          >
            Change Password
          </button>
        ) : (
          ""
        )}
      </div>

      <div id="resetDiv" style={{ display: formDis }}>
        <div className="formDiv">Reset Password</div>
        <form onSubmit={handleSubmit(ResetPasswordHandler)}>
          <label>Password</label>
          <input type="password" {...register("pwd")}></input>
          <label> Confirm Password</label>
          <input type="password" {...register("confirmpwd")}></input>
          <input
            type="submit"
            value="Reset Password"
            disabled={disable}
          ></input>
        </form>
        {disable ? (
          <Link
            to="/login"
            style={{
              textDecoration: "none",
              color: "black",
              display: "block",
              margin: "0.5rem 120px"
            }}
          >
            Sign in
          </Link>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
