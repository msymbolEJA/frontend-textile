import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import AwaitingOrders from "./AwaitingOrders";
import AllOrders from "./AllOrders";
import DeliveredOrders from "./DeliveredOrders";
import SentOrders from "./SentOrders";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.primary,
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  return (
    <div>
      <h1>Dashboard</h1>
      <div className={classes.root}>
        <Grid container spacing={3}>
          <AwaitingOrders />
          <AllOrders />
          <DeliveredOrders />
          <SentOrders />
        </Grid>
      </div>
    </div>
  );
};

export default Dashboard;
