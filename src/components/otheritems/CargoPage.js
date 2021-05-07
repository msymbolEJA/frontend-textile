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
import { FormattedMessage, useIntl } from "react-intl";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const localStoragePrefix = process.env.REACT_APP_STORE_NAME_ORJ;

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
    // maxHeight: "83vh",
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

const CargoPage = ({ getListFunc, id, setRefreshTable, countryFilter }) => {
  const [cargoForm, setCargoForm] = useState({
    tracking_number: "",
    carrier: "",
    ref_number_f: "",
    date: "",
  });
  const [result, setResult] = useState();
  const classes = useStyles();
  const { formatMessage } = useIntl();
  //console.log("CP Id", id);

  let urlCargo;
  if (countryFilter === "usa") {
    urlCargo = `${BASE_URL}etsy/cargo/?type=us`;
  } else if (countryFilter === "int") {
    urlCargo = `${BASE_URL}etsy/cargo/?type=int`;
  } else urlCargo = `${BASE_URL}etsy/cargo/`;

  const cargoFormPost = (e) => {
    e.preventDefault();
    let d = new Date();
    cargoForm.ref_number =
      d
        .toISOString()
        ?.replaceAll("-", "")
        ?.replaceAll(":", "")
        ?.replaceAll(".", "") +
      `- ${cargoForm.ref_number_f} (${cargoForm.date})`;
    delete cargoForm.ref_number_f;
    delete cargoForm.date;

    postFormData(urlCargo, cargoForm)
      .then((res) => {
        toastSuccessNotify(res.data.Success);
        setResult(res.data.Success);
      })
      .catch(({ response }) => {
        setResult(response.data.Failed);
        toastErrorNotify(response.data.Failed);
      })
      .finally(() => {
        localStorage.removeItem(`${localStoragePrefix}-ready-2500-0`);
        localStorage.removeItem(`${localStoragePrefix}-ready-2500-0-count`);
        localStorage.removeItem(
          `${localStoragePrefix}-ready-2500-0-last_updated`
        );
        setRefreshTable((p) => !p);
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
        <h1>
          <FormattedMessage
            id="createANewShipment"
            defaultMessage="Create A New Shipment"
          />
        </h1>
        <form
          className={classes.root}
          autoComplete="off"
          onSubmit={cargoFormPost}
        >
          <TextField
            className={classes.inputStyle}
            id="tracking_number"
            label={formatMessage({
              id: "trackingNumber",
              defaultMessage: "Tracking Number",
            })}
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
            label={formatMessage({
              id: "carrier",
              defaultMessage: "Carrier",
            })}
            required
            type="text"
            name="carrier"
            onChange={handleChange}
            variant="outlined"
            value={cargoForm.carrier}
          />
          <TextField
            id="date"
            name="date"
            label={formatMessage({
              id: "cargoDate",
              defaultMessage: "Cargo Date",
            })}
            type="date"
            variant="outlined"
            value={cargoForm.date}
            onChange={handleChange}
            className={classes.inputStyle}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            className={classes.inputStyle}
            id="ref_number_f"
            label={formatMessage({
              id: "description",
              defaultMessage: "Description",
            })}
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
            <FormattedMessage
              id="areYouSureForPackage"
              defaultMessage="Are you sure for package?"
            />
          </Button>
        </form>
      </Paper>
      {result ? <h1>{result}</h1> : null}
    </div>
  );
};

export default CargoPage;
