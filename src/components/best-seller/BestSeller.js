import React, { useRef, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { FormattedMessage } from "react-intl";
import Paper from "@material-ui/core/Paper";
import { getData } from "../../helper/PostData";
import Button from "@material-ui/core/Button";
import moment from "moment";
import SellerTable from "./SellerTable";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const useStyles = makeStyles((theme) => ({
  top: {
    display: "flex",
    justifyContent: "center",
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.primary,
    // marginTop: 39,
    marginLeft: 8,
    width: "fit-content",
    display: "flex",
    flexDirection: "row",
    // justifyContent: "space-evenly",
    alignItems: "center",
    // height: 400,
    border: "1px solid lightgrey",
    borderRadius: "5px",
  },
  btn: {
    width: "150px",
    margin: "5px",
  },
  inputs: {
    display: "flex",
    flexDirection: "column",
    margin: "10px",
  },
  label: {
    margin: "10px",
    fontSize: "1.5rem",
  },
  header: {
    margin: 10,
    marginTop: 75,
    textAlign: "center",
    fontSize: "2rem",
  },
  getBtnDiv: {
    display: "flex",
    flexDirection: "column",
  },
}));

const DateGetter = () => {
  const classes = useStyles();
  const beginnerDateRef = useRef(null);
  const endDateRef = useRef(null);
  const [bestSeller, setBestSeller] = useState({
    bestRows: null,
    isLoading: false,
    type: null,
  });

  const getCost = () => {
    setBestSeller({ ...bestSeller, isLoading: true });
    getData(
      `${BASE_URL}etsy/order_number_list/?creation_tsz__iexact=&creation_tsz__lte=${endDateRef.current.value}+00%3A00%3A00&creation_tsz__gte=${beginnerDateRef.current.value}+00%3A00%3A00`
    ).then((response) => {
      setBestSeller({
        isLoading: false,
        bestRows: response.data.results,
        type: "topSeller",
      });
    });
  };

  const getColors = () => {
    setBestSeller({ ...bestSeller, isLoading: true });
    getData(
      `${BASE_URL}etsy/color_number_list//?creation_tsz__iexact=&creation_tsz__lte=${endDateRef.current.value}+00%3A00%3A00&creation_tsz__gte=${beginnerDateRef.current.value}+00%3A00%3A00`
    ).then((response) => {
      setBestSeller({
        isLoading: false,
        bestRows: response.data.results,
        type: "colorCount",
      });
    });
  };

  useEffect(() => {
    endDateRef.current.value = moment().format("YYYY-MM-DD");
    beginnerDateRef.current.value = moment()
      .subtract(1, "months")
      .format("YYYY-MM-DD");
  }, []);

  return (
    <div>
      <h2 className={classes.header}>
        <FormattedMessage id="topSeller" defaultMessage="Top Seller" />
      </h2>
      <div className={classes.top}>
        <Paper className={classes.paper}>
          <div className={classes.inputs}>
            <label htmlFor="beginnerDate" className={classes.label}>
              <FormattedMessage id="startDate" defaultMessage="Start Date" />:
            </label>
            <input ref={beginnerDateRef} type="date" />
          </div>
          <div className={classes.inputs}>
            <label htmlFor="endDate" className={classes.label}>
              <FormattedMessage id="endDate" defaultMessage="End Date" />:
            </label>
            <input ref={endDateRef} type="date" />
          </div>
          <div className={classes.getBtnDiv}>
            <Button
              variant="contained"
              className={classes.btn}
              color="primary"
              onClick={getCost}
            >
              Get Types
            </Button>
            <Button
              variant="contained"
              className={classes.btn}
              color="primary"
              onClick={getColors}
            >
              Get Colors
            </Button>
          </div>
        </Paper>
      </div>
      {bestSeller.bestRows && <SellerTable bestSeller={bestSeller} />}
    </div>
  );
};

export default DateGetter;
