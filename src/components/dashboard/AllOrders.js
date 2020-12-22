import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import HorizontalSplitRoundedIcon from "@material-ui/icons/HorizontalSplitRounded";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    cursor: "pointer",
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

export default function AllOrders() {
  const classes = useStyles();
  const history = useHistory();

  const handleClick = () => {
    history.push("/orders");
  };

  return (
    <Grid item xs={12} md={6} onClick={handleClick} className={classes.root}>
      <Paper className={classes.paper}>
        <HorizontalSplitRoundedIcon className={classes.icon} color="primary" />
        <h1>All Orders</h1>
      </Paper>
    </Grid>
  );
}
