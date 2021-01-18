import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      marginTop: theme.spacing(2),
      margin: theme.spacing(1),
      width: "8rem",
    },
  },
  btn : {
    height: "2.5rem"
  }
}));

export default function Register() {
  const classes = useStyles();

  return (
    <div>
      <div>
        <form className={classes.root} >
          <TextField
            variant="outlined"
            margin="dense"
            id="username"
            label="Id"
            type="text"
            name="id"
            autoComplete="id"
            autoFocus
          />
          {/* TODO : Option */}
          <TextField
            className={classes.item}
            variant="outlined"
            margin="dense"
            id="status"
            label="Status"
            type="text"
            name="status"
            autoComplete="status"
          />
          <TextField
            className={classes.item}
            variant="outlined"
            margin="dense"
            id="buyer"
            label="Buyer"
            type="text"
            name="buyer"
            autoComplete="buyer"
          />
          <TextField
            className={classes.item}
            variant="outlined"
            margin="dense"
            id="sku"
            label="SKU"
            type="text"
            name="sku"
            autoComplete="sku"
          />
          <TextField
            className={classes.item}
            variant="outlined"
            margin="dense"
            name="supplier"
            label="Supplier"
            type="text"
            id="supplier"
          />
          <TextField
            className={classes.item}
            variant="outlined"
            margin="dense"
            name="internal_note"
            label="Internal Note"
            type="text"
            id="internal_note"
          />
          <TextField
            className={classes.item}
            variant="outlined"
            margin="dense"
            name="receipt_id"
            label="Receipt Id"
            type="nmuber"
            id="receipt_id"
          />
          <TextField
            className={classes.item}
            variant="outlined"
            margin="dense"
            name="tracking_code"
            label="Tracking Code"
            type="text"
            id="tracking_code"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.btn}
          >
            Search
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="default"
            className={classes.btn}
          >
            Clear
          </Button>
        </form>
      </div>
    </div>
  );
}
