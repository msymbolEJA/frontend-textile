import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import Paper from "@material-ui/core/Paper";
import { postFormData } from "../../helper/PostData";
import { toastSuccessNotify } from "../otheritems/ToastNotify";
const STORE_NAME = process.env.REACT_APP_STORE_NAME;
const BELKY_STOCK_BASE_URL = process.env.REACT_APP_BELKY_STOCK_BASE_URL;

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  paper: {
    margin: "1rem",
  },
  divPaper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    marginTop: "2rem",
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  saveBtn: {
    marginBottom: "1rem",
  },
}));

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
    stockInfo.store = STORE_NAME.toLowerCase();
    stockInfo.mapping_id = 0;
    console.log(stockInfo);
    // TODO Send Info to BE
    postFormData(`${BELKY_STOCK_BASE_URL}/`, stockInfo)
      .then((data) => {
        console.log(data);
        console.log(data.statusText);
        toastSuccessNotify(data.statusText + " Succesfully!");
      })
      .catch((error) => {
        console.log(error);
      });
    setStockInfo({
      type: "",
      length: "",
      color: "",
      explanation: "",
    });
  };

  const handleChange = (e) => {
    setStockInfo({ ...stockInfo, [e.target.name]: e.target.value });
  };

  const backToStockList = () => {
    history.push("/stock-list");
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} className={classes.paper}>
        <CssBaseline />
        <div className={classes.divPaper}>
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
              required
              id="type"
              label="Type"
              name="type"
              autoComplete="type"
              onChange={handleChange}
              value={stockInfo.type}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
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
              required
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
              required
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
              required
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Save
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={backToStockList}
              className={classes.saveBtn}
            >
              Back to Stock List
            </Button>
          </form>
        </div>
      </Paper>
    </Container>
  );
}
