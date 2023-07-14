import React, { useRef, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { getData } from "../../helper/PostData";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import Button from "@material-ui/core/Button";
import moment from "moment";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.primary,
    marginTop: 39,
    marginLeft: 8,
    width: 254,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: "fit-content",
  },
  titleStyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    minHeight: "5rem",
    borderBottom: "1px solid black",
  },
  paddingStyle: {
    margin: 10,
  },
}));

const CostGetter = () => {
  const classes = useStyles();
  const beginnerDateRef = useRef(null);
  const endDateRef = useRef(null);
  const [quantity, setQuantity] = useState(0);
  const [calcCost, setCalcCost] = useState({
    total_cost: null,
    isLoading: false,
    isRepeatNumber: 0,
  });

  const getDate = () => {
    // console.log("B", beginnerDateRef.current.value);
    // console.log("E", endDateRef.current.value);
    getCost();
  };

  const getCost = () => {
    setCalcCost({ ...calcCost, isLoading: true });
    getData(
      `${BASE_URL}etsy/cost/?order_date__iexact=&order_date__lte=${endDateRef.current.value}+00%3A00&order_date__gte=${beginnerDateRef.current.value}+00%3A00&limit=100000000000&offset=0`,
    ).then(response => {
      // console.log(response.data.results);
      setQuantity(response.data.count);

      let res = response.data.results.reduce(function (a, b) {
        return { cost: Number(a.cost) + Number(b.cost) }; // returns object with property x
      });

      let isRepeatRes = response.data.results.reduce(
        (total, x) => (x.is_repeat === true ? total + 1 : total),
        0,
      );

      setCalcCost({
        ...calcCost,
        total_cost: res.cost,
        isLoading: false,
        isRepeatNumber: isRepeatRes,
      });
    });
  };

  useEffect(() => {
    endDateRef.current.value = moment().format("YYYY-MM-DD");
    beginnerDateRef.current.value = moment().subtract(1, "months").format("YYYY-MM-DD");
  }, []);

  return (
    <Paper className={classes.paper}>
      <div className={classes.titleStyle}>
        <BorderColorIcon style={{ color: "#3F51B5", fontSize: "2rem" }} />
        <h3 style={{ display: "inline", marginLeft: "0.5rem" }}>Calculator</h3>
      </div>
      <div>
        <label htmlFor="beginnerDate" className={classes.paddingStyle}>
          Start Date:
        </label>
        <input ref={beginnerDateRef} type="date" className={classes.paddingStyle} />
      </div>
      <div>
        <label htmlFor="endDate" className={classes.paddingStyle}>
          End Date:
        </label>
        <input ref={endDateRef} type="date" className={classes.paddingStyle} />
      </div>
      <Button variant="contained" color="primary" onClick={getDate}>
        Calculate
      </Button>
      <div>
        {calcCost.isLoading ? (
          <h3>Calculating...</h3>
        ) : (
          <>
            <h3>{calcCost.total_cost && "Total Cost : $" + calcCost.total_cost}</h3>
            <h3>{calcCost.total_cost && "Quantity : " + quantity}</h3>
            <h3>{calcCost.total_cost && "Is Repeat : " + calcCost.isRepeatNumber}</h3>
          </>
        )}
      </div>
    </Paper>
  );
};

export default CostGetter;
