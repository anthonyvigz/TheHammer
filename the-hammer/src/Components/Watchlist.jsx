import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
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
    
    const [ watchlist, setList ] = useState([]);

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
          }, []);
        })


	const classes = useStyles();
	return (
		<React.Fragment>
			<Title>Today's Watchlist</Title>
            <div className="stocks" style={{ display: "flex", marginLeft: "10px", marginTop: "10px" }}>
        {watchlist.map((item, index) => {
          return <Typography style={{ marginRight: "15px"}} key={index}>{item}</Typography>;
        })}
      </div>
		</React.Fragment>
	);
}
