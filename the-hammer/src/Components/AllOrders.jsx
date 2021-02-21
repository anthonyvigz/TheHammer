import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";

let today = new Date();
const dd = String(today.getDate()).padStart(2, "0");
const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
const yyyy = today.getFullYear();

today = mm + "/" + dd + "/" + yyyy;

const columns = [
  { id: "date", label: "Date", minWidth: 120 },
  { id: "time", label: "Time", minWidth: 120 },
  { id: "symbol", label: "Symbol", minWidth: 100 },
  { id: "smaEntryDelta", label: "SMA Delta", minWidth: 120 },
  {
    id: "entryPrice",
    label: "Entry Price",
    minWidth: 90,
    align: "left",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "entryPctChange",
    label: "Entry % Change",
    minWidth: 90,
    align: "left",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "orderType",
    label: "Order Type",
    minWidth: 120,
    align: "left",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "shares",
    label: "Shares",
    minWidth: 100,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "stockWinner",
    label: "Winning Trade",
    minWidth: 50,
    align: "right",
    format: (value) => value.toFixed(2),
  },
];

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
});

export default function AllOrders() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [todayData, setTodayData] = useState([]);

  useEffect(() => {
    axios
      .get("https://api.jsonbin.io/b/5fd1536681ec296ae71bf145/latest", {
        headers: {
          "secret-key":
            "$2b$10$W9pzC938HHmXjvu/mRyO0.EKQPhhHssueyYCpi7wQ2IqTXsXNQ4Ga",
        },
      })
      .then((res) => {
        setTodayData(res.data["Orders"]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  
  const rows = todayData.map((order) => {
    return createData(
      order["Date"],
      order["Time"],
      order["Symbol"],
      order["SmaEntryDelta"],
      order["EntryPrice"],
      order["EntryPercent"],
      order["OrderType"],
      order["Shares"],
      order["StockWinner"]
    );
  });

  const dataToCsv = (data) => {
    const headers = ["date", "time", "symbol", "smaEntryDelta", "entryPrice", "entryPrice", "entryPercent", "orderType", "shares", "stockWinner"]
    const csvRows = [
      "date,time,symbol,smaEntryDelta,entryPrice,entryPercent,orderType,shares,stockWinner",
    ];

    for (const row of data) {
      const values = headers.map(header => {
        const escaped = (''+row[header]).replace(/"/g, '\\"')
        return `"${escaped}"`;
      })
      csvRows.push(values.join(','));
    }
    return csvRows.join('\n')
  };

  const download = (csv) => {
    const data = dataToCsv(csv);
    const blob = new Blob([data], { type: 'text/csv'} );
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'download.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function createData(
    date,
    time,
    symbol,
    smaEntryDelta,
    entryPrice,
    entryPctChange,
    orderType,
    shares,
    stockWinner
  ) {
    return {
      date,
      time,
      symbol,
      smaEntryDelta,
      entryPrice,
      entryPctChange,
      orderType,
      shares,
      stockWinner
    };
  }

  return (
    <Box marginTop="100px" marginLeft="50px" height="100vh">
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.symbol}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <Button variant="outlined" color="primary" onClick={() => download(rows)}>Download Excel</Button>
    </Box>
  );
}
