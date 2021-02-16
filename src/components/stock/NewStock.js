import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import AddIcon from "@material-ui/icons/Add";
import { USER_TYPE } from "../../helper/Constants";
import { toastSuccessNotify } from "../otheritems/ToastNotify";
import { BASE_URL } from "../../helper/Constants";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

// const workshopName = localStorage.getItem("workshop");

export default function Register() {
  const classes = useStyles();
  const history = useHistory();
  const [stockInfo, setStockInfo] = useState({
    type: "",
    length: "",
    color: "",
    explanation: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("HandleSubmit");
    console.log(stockInfo);
    setStockInfo({
      type: "",
      length: "",
      color: "",
      explanation: "",
    });
    // TODO Send Info to BE
  };

  const handleChange = (e) => {
    setStockInfo({ ...stockInfo, [e.target.name]: e.target.value });
  };

  const backToStockList = () => {
    history.push("/stock-list");
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <AddIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Add New Stock
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="type"
            label="Type"
            name="type"
            autoComplete="type"
            onChange={handleChange}
            autoFocus
            value={stockInfo.type}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="length"
            label="Length"
            name="length"
            autoComplete="length"
            onChange={handleChange}
            value={stockInfo.length}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="color"
            label="Color"
            name="color"
            autoComplete="length"
            onChange={handleChange}
            value={stockInfo.color}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="explanation"
            label="Explanation"
            name="explanation"
            autoComplete="explanation"
            onChange={handleChange}
            value={stockInfo.explanation}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Register
          </Button>
          <Button fullWidth variant="contained" onClick={backToStockList}>
            Back to Stock List
          </Button>
        </form>
      </div>
    </Container>
  );
}
