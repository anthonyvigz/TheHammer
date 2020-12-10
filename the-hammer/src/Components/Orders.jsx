import React, { useEffect, useState } from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import axios from 'axios';

function preventDefault(event) {
	event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
	seeMore: {
		marginTop: theme.spacing(3)
	}
}));

let todayFormatted = new Date()
let today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
const yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;
todayFormatted = yyyy+"-"+mm+"-"+dd;

export default function Orders(props) {
	const [ todayData, setTodayData ] = useState([]);

	useEffect(() => {
		axios
			.get('https://api.jsonbin.io/b/5fd1536681ec296ae71bf145/latest', {
				headers: {
					'secret-key': '$2b$10$W9pzC938HHmXjvu/mRyO0.EKQPhhHssueyYCpi7wQ2IqTXsXNQ4Ga'
				}
			})
			.then((res) => {
				setTodayData(res.data["Orders"]);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);


	const classes = useStyles();
	return (
		<React.Fragment>
			<Title>Recent Orders</Title>
			<Table size="small">
				<TableHead>
					<TableRow>
						<TableCell>Date</TableCell>
            <TableCell>Time</TableCell>
						<TableCell>Symbol</TableCell>
						<TableCell>Order Type</TableCell>
						<TableCell>Shares</TableCell>
						<TableCell>Entry Price</TableCell>
						<TableCell align="right">SMA Delta</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{todayData.map((orderData, index) => (
						orderData["Date"] === todayFormatted ?
						<TableRow key={index}>
							<TableCell>{today}</TableCell>
              <TableCell>{orderData['Time']}</TableCell>
							<TableCell>{orderData['Symbol']}</TableCell>
							<TableCell>{orderData['OrderType']}</TableCell>
							<TableCell>{orderData['Shares']}</TableCell>
							<TableCell>{orderData['EntryPrice']}</TableCell>
							<TableCell align="right">{orderData['SmaEntryDelta']}</TableCell>
						</TableRow>
					: null))}
				</TableBody>
			</Table>
			<div className={classes.seeMore}>
				<Link color="primary" href="#" onClick={() => props.goToOrders()}>
					See more orders
				</Link>
			</div>
		</React.Fragment>
	);
}
