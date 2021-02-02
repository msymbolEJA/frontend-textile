import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import SearchIcon from "@material-ui/icons/Search";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    cursor: "pointer",
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    color: theme.palette.text.primary,
    height: 150,
  },
  icon: {
    fontSize: 50,
  },
}));

export default function SearchOrders() {
  const classes = useStyles();
  const history = useHistory();

  const handleClick = () => {
    history.push("/search");
  };

  return (
    <Grid item xs={12} md={6} onClick={handleClick} className={classes.root}>
      <Paper className={classes.paper}>
        <div>
          <SearchIcon className={classes.icon} color="primary" />
          <h1>Search</h1>
        </div>
      </Paper>
    </Grid>
  );
}
