import React, { useEffect, useState } from "react";
import { useTheme } from "@material-ui/core/styles";
import Title from "./Title";
import axios from "axios";
import { Typography, Box } from "@material-ui/core";

export default function Chart() {
  const [tradeData, setTradeData] = useState({
    totalTrades: 0,
    shortTrades: 0,
    buyTrades: 0,
    shortWins: 0,
    buyWins: 0,
  });

  useEffect(() => {
    axios
      .get("https://api.jsonbin.io/b/5fd1536681ec296ae71bf145/latest", {
        headers: {
          "secret-key":
            "$2b$10$W9pzC938HHmXjvu/mRyO0.EKQPhhHssueyYCpi7wQ2IqTXsXNQ4Ga",
        },
      })
      .then((res) => {
        setTradeData({
          totalTrades: res.data["TotalTrades"],
          shortTrades: res.data["ShortTrades"],
          buyTrades: res.data["BuyTrades"],
          shortWins: res.data["ShortWins"],
          buyWins: res.data["BuyWins"],
          buyWinPercent:
            (parseInt(res.data["BuyWins"]) / parseInt(res.data["BuyTrades"])) *
            100,
          shortWinPercent:
            (parseInt(res.data["ShortWins"]) /
              parseInt(res.data["ShortTrades"])) *
            100,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const theme = useTheme();

  return (
    <React.Fragment>
      <Title>Updated Statistics</Title>
      <Box display="flex">
        <Box>
          <Typography variant="subtitle1" component="h2">
            Total Trades to Date
          </Typography>{" "}
          <Typography variant="h3" color="primary" component="h2">
            {tradeData.totalTrades}
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle1" component="h2">
            Total Short Trades
          </Typography>{" "}
          <Typography variant="h3" color="primary" component="h2">
            {tradeData.shortTrades}
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle1" component="h2">
            Total Buy Trades
          </Typography>{" "}
          <Typography variant="h3" color="primary" component="h2">
            {tradeData.buyTrades}
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle1" component="h2">
            Percentage of Winning Short Trades
          </Typography>{" "}
          <Typography variant="h3" color="primary" component="h2">
            {tradeData.shortWinPercent ? Math.round(tradeData.shortWinPercent) : 0}%
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle1" component="h2">
            Percentage of Winning Buy Trades
          </Typography>{" "}
          <Typography variant="h3" color="primary" component="h2">
            {tradeData.buyWinPercent ? Math.round(tradeData.buyWinPercent) : 0}%
          </Typography>
        </Box>
      </Box>
    </React.Fragment>
  );
}
