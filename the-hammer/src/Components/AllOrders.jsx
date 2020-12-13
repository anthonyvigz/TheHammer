import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
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
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

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

  function createData(
    date,
    time,
    symbol,
    smaEntryDelta,
    entryPrice,
    orderType,
    shares
  ) {
    return { date, time, symbol, smaEntryDelta, entryPrice, orderType, shares };
  }

  const rows = todayData.map((order) => {
    return createData(
      order["Date"],
      order["Time"],
      order["Symbol"],
      order["SmaEntryDelta"],
      order["EntryPrice"],
      order["OrderType"],
      order["Shares"]
    );
  });

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
    </Box>
  );
}
