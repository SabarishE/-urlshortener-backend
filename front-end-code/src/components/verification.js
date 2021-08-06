import { useHistory } from "react-router-dom";
export function Verification({ popup, popupMsg, setLoading }) {
  var urlarr = window.location.href.split("/");
  const email = urlarr[urlarr.length - 2];
  const token = urlarr[urlarr.length - 1];

  const history = useHistory();

  function afterrequest(msg) {
    popup("block");
    popupMsg(msg);
    setLoading(false);
  }

  const VerifyHandler = (v) => {
    console.log("verification starts ...");
    setLoading(true);

    fetch(
      `https://urlshortener-backend-task4.herokuapp.com/users/activation/${email}/${token}`,
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
        console.log("-----account activated------", data);
        if (data.newuser) {
          afterrequest("Account activated !!!");
          history.push("/login");
        }
      })
      .catch((err) => {
        console.log("err in login !!!", err.message);
        afterrequest("Verification failed");
      });
  };

  return (
    <>
      <div id="signupVerify">
        <h1>verification for account activation</h1>

        <button onClick={VerifyHandler}>Activate account</button>
      </div>
    </>
  );
}
