import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styling.scss";

function Algos(props) {
  const [list, setList] = useState([]);
  const [dawnData, setDawn] = useState("");
  const [burstData, setBurst] = useState("");

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;

  useEffect(() => {
    axios
      .get(`https://the-pavilion-hammer.herokuapp.com/data/get`)
      .then((res) => {
        console.log(res.data);
        const length = res.data.data.length;
        const newlist = res.data.data[length - 1]["watchlist"].split(" ");
        const finalist = [];
        newlist.map((item) => {
          const newitem = item.slice(0, -1);
          finalist.push(newitem);
        });
        setList(finalist);
      });
    axios
      .get("https://paper-api.alpaca.markets/v2/account", {
        headers: {
          "APCA-API-KEY-ID": process.env.REACT_APP_DAWN_KEY,
          "APCA-API-SECRET-KEY": process.env.REACT_APP_DAWN_SECRET,
        },
      })
      .then((res) => {
        console.log(res.data);
        setDawn(res.data);
      });

    axios
      .get("https://paper-api.alpaca.markets/v2/account", {
        headers: {
          "APCA-API-KEY-ID": process.env.REACT_APP_BURST_KEY,
          "APCA-API-SECRET-KEY": process.env.REACT_APP_BURST_SECRET,
        },
      })
      .then((res) => {
        console.log(res.data);
        setBurst(res.data);
      });

    axios.get(`https://the-pavilion-hammer.herokuapp.com/user/`).then((res) => {
      console.log(res.data);
      setExStocks(res.data["user"]["exclude"]);
    });
  }, []);

  const dawnPercent =
    ((parseInt(dawnData["equity"]) - parseInt(dawnData["last_equity"])) /
      parseInt(dawnData["last_equity"])) *
    100;

  const burstPercent =
    ((parseInt(burstData["equity"]) - parseInt(burstData["last_equity"])) /
      parseInt(burstData["last_equity"])) *
    100;

  const [sent, setSent] = useState(false);

  const [exclude, setExclude] = useState("");

  const [loader, setLoader] = useState(false);

  const [excludedStocks, setExStocks] = useState("");

  const changeHandler = (event) => {
    event.preventDefault();

    setExclude(event.target.value);
  };

  const logout = () => {
    window.localStorage.clear();
    setTimeout(() => props.history.push("/"), 1000);
  };

  const sendExclude = (event) => {
    event.preventDefault();

    const upperData = exclude.toUpperCase();

    axios
      .put(
        "https://the-pavilion-hammer.herokuapp.com/user/updateExclude",
        { exclude: upperData },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      )
      // successful login prompts to main page
      .then((res) => {
        setLoader(false);
        console.log(res.data["user"]["exclude"]);
        setExStocks(res.data["user"]["exclude"]);
      })
      .catch((err) => {
        setLoader(false);
        console.log(err);
      });
  };

  return (
    <div className="mainapp">
      <h1>The Pavilion Algos</h1>
      <h4>{today}</h4>
      <div className="stocks">
        {list.map((item, index) => {
          return <h6 key={index}>{item}</h6>;
        })}
      </div>
      <div className="theBots">
        <div className="dawn">
          <h5>${dawnData["equity"]}</h5>
          <h6
            style={
              dawnPercent >= 0 ? { color: "lightgreen" } : { color: "red" }
            }
          >
            {dawnPercent.toFixed(2)}%
          </h6>
        </div>
      </div>
      <form onSubmit={sendExclude} className="excludeForm">
        <h1>Exclude any stocks today?</h1>
        <ul>
          <li>If doing more than one, separate stocks using spaces.</li>
          <li>Every submission resets the list, do not add one by one.</li>
          <li>Stock(s) must be submitted before the algorithm is run.</li>
          <li>
            Once added, the stock(s) will be excluded for the day and will reset
            for next trading day.
          </li>
        </ul>
        <input
          maxlength="88"
          type="text"
          name="text"
          id="text"
          onChange={changeHandler}
          value={exclude}
        />
        <button type="submit">exclude</button>
        <h3>
          <span>{excludedStocks ? excludedStocks : "No stocks"}</span> are
          excluded today.
        </h3>
      </form>
      <button id="logout" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default Algos;
