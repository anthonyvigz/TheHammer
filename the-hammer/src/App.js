import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styling.scss";

function App() {
  const [list, setList] = useState([]);

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
  }, []);

  return (
    <div className="App">
      {list.map((item) => {
        return <h1>{item}</h1>;
      })}
    </div>
  );
}

export default App;
