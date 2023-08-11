import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "./ContextProvider/Context";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const Dashboard = () => {
  const { logindata, setLoginData } = useContext(LoginContext);

  const [data, setData] = useState(false);

  const [url, setUrl] = useState("");

  const [message, setMessage] = useState(false);

  const [shortUrl, setShortUrl] = useState("");

  const [Clickcount, setClickcount] = useState(0);

  const history = useNavigate();

  const DashboardValid = async () => {
    let token = localStorage.getItem("usersdatatoken");

    const res = await fetch("https://urlshortner-backend-jwc7.onrender.com/validuser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await res.json();

    if (data.status == 401 || !data) {
      history("*");
    } else {
      // console.log("user verify");
      setLoginData(data);
      history("");
    }
  };

  useEffect(() => {
    setTimeout(() => {
      DashboardValid();
      setData(true);
    }, 2000);
  }, []);

  //URL SHORTNER

  const setVal = (e) => {
    setUrl(e.target.value);
  };

  const sendLink = async (e) => {
    e.preventDefault();

    if (url === "") {
      toast.error("url is required!", {
        position: "top-center",
      });
    } else {
      const res = await fetch("https://urlshortner-backend-jwc7.onrender.com/url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, userEmail: logindata.ValidUserOne.email }),
      });

      if (res.status == 200) {
        setUrl("");
        // console.log(res);
        toast.success("Url successfully shorted", {
          position: "top-center",
        });
      } else {
        toast.error("Invalid Url", {
          position: "top-center",
        });
      }
    }
    //CALLING URL DATA FUNCTION

    fetchShortUrl();
  };

  //FETCHING SHORTEN URL DATA

  const fetchShortUrl = () => {
    axios
      .get(
        `https://urlshortner-backend-jwc7.onrender.com/urlData/${
          logindata ? logindata.ValidUserOne.email : ""
        }`
      )
      .then((response) => {
        if (response) {
          let item = response.data;
          setShortUrl(item.Data[item.Data.length - 1].shortId);
        }
      })
      .catch((error) => console.error(error));
  };

  //FETCHING TOTAL CLICKS COUNT FROM DB

  const fetchShortUrlHistoryCount = () => {
    // console.log(shortUrl);
    axios
      .get(`https://urlshortner-backend-jwc7.onrender.com/analytics/${shortUrl ? shortUrl : ""}`)
      .then((response) => {
        if (response) {
          let result = response.data;
          setClickcount(result.totalClicks);
        }
      })
      .catch((error) => console.error(error));
  };

  if (shortUrl) {
    // console.log("shorturl", shortUrl);
  }

  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h3
          style={{
            marginRight: "-789px",
            marginTop: "10px",
            marginBottom: "20px",
          }}
          className="col-md-12"
        >
          User Email:{logindata ? logindata.ValidUserOne.email : ""}
        </h3>
        <h3>
          Click your shorted Url:
          <a
            href={`https://urlshortner-backend-jwc7.onrender.com/${shortUrl}`}
            target="_blank"
            onClick={fetchShortUrlHistoryCount}
            rel="noopener noreferrer"
            style={{ marginLeft: "10px", textDecoration: "none" }}
          >{`https://urlshortner-backend-jwc7.onrender.com/${shortUrl}`}</a>
        </h3>
        {/* Total clicks */}
        <h4 style={{ marginTop: "20px" }}>Total Number Clicks: {Clickcount}</h4>

        <div className="row">
          <div className="col-md-6">
            <div className="form_data" style={{ marginTop: "10px" }}>
              <div className="form_heading">
                <h1>Enter Your URL</h1>
              </div>

              <form>
                <div className="form_input">
                  <label htmlFor="url">URL</label>
                  <input
                    type="text"
                    value={url}
                    onChange={setVal}
                    name="url"
                    id="url"
                    placeholder="Paste Your URL"
                  />
                </div>

                <button className="btn" onClick={sendLink}>
                  Short It
                </button>
              </form>
              <ToastContainer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
