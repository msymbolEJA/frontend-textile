import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import { postFormData } from "../../helper/PostData";
import {
  toastErrorNotify,
  toastSuccessNotify,
} from "../otheritems/ToastNotify";

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

const CargoPage = ({ getListFunc, id, setRefresh }) => {
  const [cargoForm, setCargoForm] = useState({
    tracking_number: "",
    carrier: "",
    ref_number_f: "",
  });
  const [result, setResult] = useState();
  const classes = useStyles();
  //console.log("CP Id", id);

  const cargoFormPost = (e) => {
    e.preventDefault();
    let d = new Date();
    console.log("CFB");
    cargoForm.ref_number =
      d
        .toISOString()
        .replaceAll("-", "")
        .replaceAll(":", "")
        .replaceAll(".", "") +
      "-" +
      cargoForm.ref_number_f;
    delete cargoForm.ref_number_f;
    // console.log(cargoForm);

    postFormData("http://144.202.67.136:8080/etsy/cargo/", cargoForm)
      .then((res) => {
        console.log(res.data.Success);
        toastSuccessNotify(res.data.Success);
        setResult(res.data.Success);
      })
      .catch(({ response }) => {
        console.log(response);
        setResult(response.data.Failed);
        toastErrorNotify(response.data.Failed);
      })
      .finally(() => {
        if (setRefresh) setRefresh(true);
      });
    setCargoForm({
      tracking_number: "",
      carrier: "",
      ref_number_f: "",
    });
    try {
      getListFunc();
    } catch (error) {
      //console.log(error);
    }
  };

  const handleChange = (e) => {
    setCargoForm({ ...cargoForm, [e.target.name]: e.target.value });
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.rootBottom}>
        <h1>Create A New Shipment</h1>
        <form
          className={classes.root}
          autoComplete="off"
          onSubmit={cargoFormPost}
        >
          <TextField
            className={classes.inputStyle}
            id="tracking_number"
            label="Tracking Number"
            required
            type="text"
            onChange={handleChange}
            variant="outlined"
            name="tracking_number"
            value={cargoForm.tracking_number}
          />
          <TextField
            className={classes.inputStyle}
            id="carrier"
            label="Carrier"
            required
            type="text"
            name="carrier"
            onChange={handleChange}
            variant="outlined"
            value={cargoForm.carrier}
          />
          <TextField
            className={classes.inputStyle}
            id="ref_number_f"
            label="Description"
            type="text"
            variant="outlined"
            name="ref_number_f"
            onChange={handleChange}
            value={cargoForm.ref_number_f}
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
      {result ? <h1>{result}</h1> : null}
    </div>
  );
};

export default CargoPage;
