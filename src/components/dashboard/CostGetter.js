import React, { useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { getData } from "../../helper/PostData";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import moment from "moment";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.primary,
    marginTop: 39,
    marginLeft: 8,
    width: 284,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: 300,
  },
  titleStyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    minHeight: "6rem",
  },
}));

const CostGetter = () => {
  const classes = useStyles();
  const beginnerDateRef = useRef(null);
  const endDateRef = useRef(null);

  const getDate = () => {
    console.log("B", beginnerDateRef.current.value);
    console.log("E", endDateRef.current.value);
    getCost();
  };

  const getCost = () => {
    getData(
      `${BASE_URL}etsy/qtyCostTable/?order_date__iexact=&order_date__lte=${endDateRef.current.value}+00%3A00&order_date__gte=${beginnerDateRef.current.value}+00%3A00`
    ).then((response) => {
      console.log(response);
    });
  };

  const test = () => {
    endDateRef.current.value = "2020-10-10";
  };

  return (
    <Paper className={classes.paper} style={{}}>
      <div className={classes.titleStyle}>
        <BorderColorIcon />
        <h3 style={{ display: "inline", marginLeft: "0.5rem" }}>
          Cost Calculator
        </h3>
      </div>
      <label htmlFor="beginnerDate">Beginner Date:</label>
      <input ref={beginnerDateRef} type="date" id="birthday" name="birthday" />
      <label htmlFor="endDate">End Date:</label>
      <input ref={endDateRef} type="date" id="birthday" name="birthday" />
      <button onClick={getDate}>date</button>
      <button onClick={test}>test</button>
    </Paper>
  );
};

export default CostGetter;
