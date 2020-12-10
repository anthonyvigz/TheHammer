import React, { useState, useEffect } from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';
import axios from "axios";

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

let today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
const yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;

export default function ProfitLoss(props) {

  const [ todayProfit, setTodayProfit ] = useState(0);

	useEffect(() => {
		axios
			.get('https://api.jsonbin.io/b/5fd1536681ec296ae71bf145/latest', {
				headers: {
					'secret-key': '$2b$10$W9pzC938HHmXjvu/mRyO0.EKQPhhHssueyYCpi7wQ2IqTXsXNQ4Ga'
				}
			})
			.then((res) => {
        const profitLoss = parseInt(res.data["Equity"][res.data["Equity"].length - 1]["ProfitLoss"]);
        setTodayProfit(profitLoss)
			})
			.catch((err) => {
				console.log(err);
			});
  }, []);


  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Profit Loss</Title>
      <Typography component="p" variant="h4">
        {todayProfit > 0 ? "$" + todayProfit : "-$" + -todayProfit}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        on {today}
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={() => props.goToOrders()}>
          View orders
        </Link>
      </div>
    </React.Fragment>
  );
}