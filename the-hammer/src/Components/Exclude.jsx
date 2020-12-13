import React, { useEffect, useState } from "react";
import Title from "./Title";
import axios from "axios";
import { Typography, Button, Box, TextField } from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";

export default function Orders(props) {
  const [exclude, setExclude] = useState("");

  const [excludedStocks, setExStocks] = useState("");

  const changeHandler = (event) => {
    event.preventDefault();

    setExclude(event.target.value);
  };

  const sendExclude = (event) => {
    event.preventDefault();

    handleClose();

    setOpen(false);

    const upperData = exclude.toUpperCase();

    axios
      .put(
        "https://the-pavilion-hammer.herokuapp.com/user/updateExclude",
        { exclude: upperData },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      )
      // successful login prompts to main page
      .then((res) => {
        setExStocks(res.data["user"]["exclude"]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    axios
      .get(`https://the-pavilion-hammer.herokuapp.com/user/`)
      .then((res) => {
        setExStocks(res.data["user"]["exclude"]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [excludedStocks]);

  let today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Title>Today's Exclude</Title>
      <Box
        display="flex"
        alignItems="center"
        flexDirection="column"
        justifyContent="space-between"
        height="100px"
        marginTop="30px"
      >
        <Button variant="contained" color="secondary" onClick={handleClickOpen}>
          Exclude Stocks?
        </Button>
        <Typography variant="h6">{excludedStocks}</Typography>
      </Box>
      <Dialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogTitle id="simple-dialog-title">
          Exclude any stocks today? <Title>{today}</Title>
        </DialogTitle>
        <form onSubmit={sendExclude} className="excludeForm">
          <ListItemText inset={true}>
            • If doing more than one, separate stocks using spaces.
          </ListItemText>
          <ListItemText inset={true}>
            • Every submission resets the list, do not add one by one.
          </ListItemText>
          <ListItemText inset={true}>
            • Stock(s) must be submitted before the algorithm is run.
          </ListItemText>
          <ListItemText inset={true}>
            • Once added, the stock(s) will be excluded for the day
            <ListItemText inset={true}>and will reset for next trading day.
            </ListItemText>
          </ListItemText>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-evenly"
            height="150px"
          >
            <TextField
              onChange={changeHandler}
              value={exclude}
              id="outlined-basic"
              label="Stock Symbol"
              variant="outlined"
            />
            <Button variant="contained" color="secondary" type="submit">
              Exclude
            </Button>
          </Box>
        </form>
      </Dialog>
    </React.Fragment>
  );
}
