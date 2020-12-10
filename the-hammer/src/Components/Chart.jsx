import React, { useEffect, useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from './Title';
import axios from "axios";

export default function Chart() {

  const [ todayEquity, setTodayEquity ] = useState([]);

	useEffect(() => {
		axios
			.get('https://api.jsonbin.io/b/5fd1536681ec296ae71bf145/latest', {
				headers: {
					'secret-key': '$2b$10$W9pzC938HHmXjvu/mRyO0.EKQPhhHssueyYCpi7wQ2IqTXsXNQ4Ga'
				}
			})
			.then((res) => {
				setTodayEquity(res.data["Equity"]);
			})
			.catch((err) => {
				console.log(err);
			});
  }, []);

  // Generate Sales Data
  function createData(time, amount) {
    return { time, amount };
  }

  const data = todayEquity.map(equity => {
    return createData(equity["Time"], equity["ProfitLoss"])
  });
  
  const theme = useTheme();

  return (
    <React.Fragment>
      <Title>Today</Title>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
            >
              Equity ($)
            </Label>
          </YAxis>
          <Line type="monotone" dataKey="amount" stroke={theme.palette.primary.main} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}