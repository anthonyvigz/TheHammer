import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styling.scss";

function App() {
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
  }, []);

  const dawnPercent =
    ((parseInt(dawnData["equity"]) - parseInt(dawnData["last_equity"])) /
      parseInt(dawnData["last_equity"])) *
    100;

  const burstPercent =
    ((parseInt(burstData["equity"]) - parseInt(burstData["last_equity"])) /
      parseInt(burstData["last_equity"])) *
    100;

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
          <h4>Dawn</h4>
          <h5>${dawnData["equity"]}</h5>
          <h6
            style={
              dawnPercent >= 0 ? { color: "lightgreen" } : { color: "red" }
            }
          >
            {dawnPercent.toFixed(2)}%
          </h6>
        </div>
        <div className="burst">
          <h4>Burst</h4>
          <h5>${burstData["equity"]}</h5>
          <h6
            style={
              burstPercent >= 0 ? { color: "lightgreen" } : { color: "red" }
            }
          >
            {burstPercent.toFixed(2)}%
          </h6>
        </div>
      </div>
    </div>
  );
}

export default App;
