import { useForm } from "react-hook-form";

export function Register({ popup, popupMsg, setLoading }) {
  const { register, handleSubmit } = useForm();

  function afterlogin(msg) {
    popup("block");
    popupMsg(msg);
    setLoading(false);
  }

  const handler = (v, e) => {
    const basePath = window.location.origin + "/verification";
    console.log("registraion alert !!!!", { ...v, link: basePath });
    setLoading(true);
    e.target.reset();

    // checking for existing email id

    fetch(
      `https://urlshortener-backend-task4.herokuapp.com/users/emailcheck/${v.email}`,
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
        if (data.check) {
          afterlogin("Email id already exists");
        } else {
          activation();
        }
      })
      .catch((err) => console.log("error in check>>>", err));

    // if email id not found in DB proceed with registration

    function activation() {
      setLoading(true);
      fetch("https://urlshortener-backend-task4.herokuapp.com/users/signup", {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...v, link: basePath })
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("-----activation mail sent------", data);

          if (data.newuser.email) {
            afterlogin(
              "Account activation link sent to your email (or check console)"
            );
          }
        })
        .catch((err) => {
          console.log("err in registration !!!", err.message);

          afterlogin("Error in Registration");
        });
    }
  };

  return (
    <>
      <div id="registerDiv">
        <div className="formDiv">REGISTER</div>
        <form onSubmit={handleSubmit(handler)}>
          <label>First name</label>
          <input
            type="text"
            {...register("firstname")}
            autoComplete="off"
            required
          ></input>

          <label>Last name</label>
          <input
            type="text"
            {...register("lastname")}
            autoComplete="off"
            required
          ></input>
          <label> Email</label>
          <input
            type="email"
            {...register("email")}
            autoComplete="off"
            required
          ></input>
          <label>Password</label>
          <input type="password" {...register("password")} required></input>

          <input type="submit" value="Sign Up"></input>
        </form>
      </div>
    </>
  );
}
