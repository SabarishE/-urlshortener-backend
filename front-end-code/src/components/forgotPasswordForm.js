import { useState } from "react";
import { useForm } from "react-hook-form";

export function ForgotPwdForm({ popup, popupMsg, setLoading }) {
  const [submitbtn, setsubmitbtn] = useState(false);

  const { register, handleSubmit } = useForm();

  function afterrequest(msg) {
    popup("block");
    popupMsg(msg);
    setLoading(false);
  }

  const handler = (v) => {
    const basePath = window.location.origin + "/reset";
    console.log("forgot password alert !!!!", { ...v, link: basePath });
    setLoading(true);

    fetch("https://urlshortener-backend-task4.herokuapp.com/users/forgotpwd", {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...v, link: basePath })
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("-----one time link sent to email------", data);
        setsubmitbtn(true);
        if (data.onetimelink) {
          afterrequest("Check your Email for reset password link (or console)");
        }
      })
      .catch((err) => {
        console.log("err in login !!!", err.message);
        afterrequest("Invalid Credentials");
      });
  };

  return (
    <>
      <div id="forgotDiv">
        <div className="formDiv">
          Forgot password ?<br></br>
          <span>Enter your email-id and receive a one time link</span>
        </div>
        <form onSubmit={handleSubmit(handler)}>
          <label>Email</label>
          <input
            type="email"
            {...register("email")}
            autoComplete="off"
            required
          ></input>
          <input type="submit" value="Send Email" disabled={submitbtn}></input>
        </form>
      </div>
    </>
  );
}
