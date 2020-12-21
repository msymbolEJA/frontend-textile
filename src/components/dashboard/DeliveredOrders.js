import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

const useStyles = makeStyles((theme) => ({
  root: {
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

export default function DeliveredOrders() {
  const classes = useStyles();

  const handleClick = () => {
    console.log("Delivered Orders");
  };

  return (
    <Grid item xs={12} md={6} onClick={handleClick}>
      <Paper className={classes.paper}>
        <CheckCircleIcon className={classes.icon} color="primary" />
        <h1>DeliveredOrders</h1>
      </Paper>
    </Grid>
  );
}
