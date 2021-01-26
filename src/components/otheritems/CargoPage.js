import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(1),
  },
  rootBottom: {
    minHeight: "10vh",
    margin: "5vw",
    marginBottom: theme.spacing(2),
  },
  container: {
    maxHeight: "83vh",
  },
  table: {
    minWidth: 650,
  },
  selectTableCell: {
    width: 60,
  },
  buttonGroup: {
    marginBottom: theme.spacing(1),
  },
  header: {
    fontSize: "1.5rem",
  },
  sub: {
    fontSize: "1rem",
  },
  inputStyle: {
    backgroundColor: "white",
    borderRadius: "5px",
  },
  submit: {
    marginBottom: theme.spacing(1),
  },
}));

const CargoPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper className={classes.rootBottom}>
        <h1>Create Post</h1>

        <form className={classes.root} noValidate autoComplete="off">
          <TextField
            className={classes.inputStyle}
            id="referenceNumber"
            label="Reference Number"
            required
            variant="outlined"
          />
          <TextField
            className={classes.inputStyle}
            id="cargoCompany"
            label="Cargo Company"
            required
            variant="outlined"
          />
          <TextField
            className={classes.inputStyle}
            id="followingCode"
            label="Following Code"
            required
            variant="outlined"
          />
          <br />
          <br />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Are you sure for package?
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default CargoPage;
