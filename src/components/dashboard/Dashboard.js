import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import AwaitingOrders from "./AwaitingOrders";
import AllOrders from "./AllOrders";
import DeliveredOrders from "./DeliveredOrders";
import SentOrders from "./SentOrders";
import NewOrders from "./NewOrders";
// Icons
import DashboardRoundedIcon from "@material-ui/icons/DashboardRounded";


const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 30,
  },
  boxes: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.primary,
  },
  icon: {
    fontSize: 50,
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <DashboardRoundedIcon className={classes.icon} color="primary" />
      <h1>Dashboard</h1>
      <div className={classes.boxes}>
        <Grid container spacing={3}>
          <AllOrders />
          <AwaitingOrders />
          <SentOrders />
          <DeliveredOrders />
          <NewOrders />
        </Grid>
      </div>
    </div>
  );
};

export default Dashboard;
