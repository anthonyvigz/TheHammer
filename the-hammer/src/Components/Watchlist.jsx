import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Title from './Title';
import axios from 'axios';

let today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
const yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;

export default function Orders() {
    
    const [ watchlist, setList ] = useState([]);

    useEffect(() => {
        axios
          .get(`https://pavilion-server.herokuapp.com/data/get`)
          .then((res) => {
            const length = res.data.data.length;
            const newlist = res.data.data[length - 1]["watchlist"].split(" ");
            const finalist = [];
            newlist.forEach((item) => {
              const newitem = item.slice(0, -1);
              finalist.push(newitem);
            });
            setList(finalist);
          }, []);
        })

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
