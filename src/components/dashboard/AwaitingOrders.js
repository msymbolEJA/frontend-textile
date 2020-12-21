import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import HourglassFullIcon from "@material-ui/icons/HourglassFull";

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

export default function AwaitingOrders() {
  const classes = useStyles();

  return (
    <Grid item xs={12} md={6}>
      <Paper className={classes.paper}>
        <HourglassFullIcon className={classes.icon} color="primary" />
        <h1>Awaiting Orders</h1>
      </Paper>
    </Grid>
  );
}
