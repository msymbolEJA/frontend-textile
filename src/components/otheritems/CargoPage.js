import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import { postFormData } from "../../helper/PostData";

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
  const [cargoForm, setCargoForm] = useState({
    ref_number: "",
    tracking_number: "",
    carrier: "",
  });
  const [result, setResult] = useState();
  const classes = useStyles();

  const cargoFormPost = (e) => {
    e.preventDefault();
    console.log("CFB");
    console.log(cargoForm);

    postFormData("http://144.202.67.136:8080/etsy/cargo/", cargoForm)
      .then((res) => {
        console.log(res.data.Success);
        setResult(res.data.Success);
      })
      .catch(({ response }) => {
        console.log(response);
        setResult(response.data.Failed);
      });
    setCargoForm({
      ref_number: "",
      tracking_number: "",
      carrier: "",
    });
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
            id="ref_number"
            label="Reference Number"
            required={true}
            type="text"
            variant="outlined"
            name="ref_number"
            onChange={handleChange}
            value={cargoForm.ref_number}
          />
          <TextField
            className={classes.inputStyle}
            id="tracking_number"
            label="tracking_number"
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
