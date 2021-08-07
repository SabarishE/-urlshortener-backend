import { useState, useEffect } from "react";

import { Switch, Route, useHistory } from "react-router-dom";

import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import PersonIcon from "@material-ui/icons/Person";

export function Application({ user, popupMsg, popup, setLoading }) {
  const [allUrl, setAllurl] = useState([]);

  const history = useHistory();

  useEffect(() => {
    getallurls();
  }, []);

  function getallurls() {
    fetch("https://urlshortener-backend-task4.herokuapp.com/users/allurls", {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("all urls fetched >>", data);
        setAllurl(data);
      })
      .catch((err) => {
        console.log("err in login !!!", err.message);
      });
  }

  return (
    <>
      <div id="usernameDiv">
        <div>
          <span>
            {" "}
            <PersonIcon style={{ verticalAlign: "middle" }} />
            {user.firstname + " " + user.lastname}
          </span>
          <span>
            <button
              onClick={() => {
                history.push("/login");
              }}
            >
              Logout
            </button>
          </span>
        </div>
      </div>

      <div id="appnav">
        <Link to={`/application/dashboard`}>
          <button>Dashboard</button>
        </Link>
        <Link to={`/application/shortenUrl`}>
          <button>Shorten Url</button>
        </Link>
        <Link to={`/application/allshortUrl`}>
          <button>All short urls</button>
        </Link>
      </div>
      <div id="appcontent">
        <Switch>
          <Route path={`/application/dashboard`}>
            <h1>
              <img src={require("../images/url.png").default} alt="" />
              DASHBOARD
            </h1>
            <Dashboard allUrl={allUrl} />
          </Route>
          <Route path={`/application/shortenUrl`}>
            <h1>
              {" "}
              <img src={require("../images/url.png").default} alt="" />
              SHORTEN YOUR URL HERE
            </h1>
            <CreateShortUrl
              popup={popup}
              popupMsg={popupMsg}
              setLoading={setLoading}
              refresh={getallurls}
            />
          </Route>
          <Route path={`/application/allshortUrl`}>
            <h1>
              {" "}
              <img src={require("../images/url.png").default} alt="" />
              URLs shortened so far
            </h1>
            <AllShortUrls allUrl={allUrl} refresh={getallurls} />
          </Route>
        </Switch>
      </div>
    </>
  );
}

function Dashboard({ allUrl }) {
  return (
    <>
      <div id="dashboard">
        <div id="dashDiv1">
          <h2>Total URL shrunks</h2>
          <h1>
            <img src={require("../images/sigma.png").default} alt="" />
            {allUrl.length} !!!
          </h1>
        </div>
        <div id="dashDiv2">
          <h1>
            <img src={require("../images/calendar.png").default} alt="" />
            {allUrl.length}
          </h1>
          <h2>Shrunks / month</h2>
        </div>
      </div>
    </>
  );
}

function CreateShortUrl({ popupMsg, popup, setLoading, refresh }) {
  const { register, handleSubmit } = useForm();
  const [dis, setdis] = useState(false);
  const [shortUrl, setshortUrl] = useState([]);
  // console.log(shortUrl);

  function afterCreation(msg) {
    setLoading(false);
    popupMsg(msg);
    popup("block");
  }
  const handler = (v, e) => {
    console.log("short url alert !!!!", v);
    setLoading(true);
    setdis(true);
    e.target.reset();

    fetch("https://urlshortener-backend-task4.herokuapp.com/users/creaturl", {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(v)
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("short url created >>>>", data);
        setshortUrl([...shortUrl, data]);
        if (data.long) {
          afterCreation("URL shortened !!!");
          refresh();
        }
      })
      .catch((err) => {
        console.log("err in login !!!", err.message);
      });
  };

  return (
    <>
      <div id="urlformDiv">
        <form onSubmit={handleSubmit(handler)} id="shortUrlForm">
          <label>URL</label>
          <input
            type="text"
            {...register("longUrl")}
            required
            placeholder="enter long url ..."
          ></input>

          <input
            type="submit"
            value="shorten"
            disabled={dis}
            style={{
              backgroundColor: dis === true ? "gray" : "rgb(17, 29, 143)"
            }}
          ></input>
        </form>
        <button
          onClick={() => {
            setdis(false);
          }}
        >
          one more
        </button>
      </div>

      <div id="createdShortUrl">
        {shortUrl.length > 0
          ? shortUrl.map((v, i) => {
              return (
                <>
                  <div>
                    <div id="long">
                      <h5>LONG URL :</h5>
                      <a href={`${v.long}`} rel="noreferrer" target="_blank">{v.long}</a>
                    </div>
                    <div id="short">
                      <h5>SHORT URL :</h5>
                      <a
                        href={
                          "https://urlshortener-backend-task4.herokuapp.com/users/" +
                          v.short
                        }
                        rel="noreferrer" 
                        target="_blank"
                      >
                        {"https://urlshortener-backend-task4.herokuapp.com/users/" +
                          v.short}
                      </a>
                    </div>
                  </div>
                </>
              );
            })
          : ""}
      </div>
    </>
  );
}

function AllShortUrls({ allUrl, refresh }) {
  console.log("all>>", allUrl);

  return (
    <>
      {allUrl.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>long URL</th>
              <th>shortURL</th>
              <th>created on</th>
              <th>no.of visits</th>
            </tr>
          </thead>
          <tbody>
            {allUrl.map((v, i) => {
              return (
                <>
                  <tr key={i}>
                    <td data-label="long URL" key={i}>
                      <a href={v.long} target="_blank" rel="noreferrer">
                        {v.long}
                      </a>
                    </td>
                    <td data-label="short URL" key={i+1}>
                      <a
                        href={
                          "https://urlshortener-backend-task4.herokuapp.com/users/" +
                          v.short
                        }
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => refresh()}
                      >
                        {"https://urlshortener-backend-task4.herokuapp.com/users/" +
                          v.short}
                      </a>
                    </td>
                    <td data-label="created on">{v.createdAt}</td>
                    <td data-label="no. of visits">{v.visitors}</td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>
      ) : (
        <h3>no urls shortened so far</h3>
      )}
    </>
  );
}
