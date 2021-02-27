import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      marginTop: theme.spacing(2),
      margin: theme.spacing(1),
      width: "8rem",
    },
  },
  btn: {
    height: "2.5rem",
  },
  bottomSection: {
    display: "flex",
    justifyContent: "center",
  },
  warn: {
    color: "#cc5500",
    backgroundColor: "#FFF4E5",
    borderRadius: "5px",
    height: "2rem",
    fontSize: "1rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "25rem",
  },
}));

export default function SearchForm({
  handleSubmit,
  handleChange,
  info,

  clearBtn,
  setGlobalSearchKey,
  globalSearchKey,
  fillError,
}) {
  const classes = useStyles();
  const { formatMessage } = useIntl();

  return (
    <div>
      <div>
        <form className={classes.root}>
          <TextField
            variant="outlined"
            margin="dense"
            id="id"
            label={formatMessage({
              id: "id",
              defaultMessage: "Id",
            })}
            type="text"
            name="id"
            autoComplete="id"
            autoFocus
            onChange={handleChange}
            value={info.id}
          />
          {/* TODO : Option */}
          <TextField
            className={classes.item}
            variant="outlined"
            margin="dense"
            id="status"
            label={formatMessage({
              id: "status",
              defaultMessage: "Status",
            })}
            type="text"
            name="status"
            autoComplete="status"
            onChange={handleChange}
            value={info.status}
          />
          <TextField
            className={classes.item}
            variant="outlined"
            margin="dense"
            id="buyer"
            label={formatMessage({
              id: "buyer",
              defaultMessage: "Buyer",
            })}
            type="text"
            name="buyer"
            autoComplete="buyer"
            onChange={handleChange}
            value={info.buyer}
          />
          <TextField
            className={classes.item}
            variant="outlined"
            margin="dense"
            id="sku"
            label={formatMessage({
              id: "sku",
              defaultMessage: "SKU",
            })}
            type="text"
            name="sku"
            autoComplete="sku"
            onChange={handleChange}
            value={info.sku}
          />
          <TextField
            className={classes.item}
            variant="outlined"
            margin="dense"
            name="supplier"
            label={formatMessage({
              id: "supplier",
              defaultMessage: "Supplier",
            })}
            type="text"
            id="supplier"
            onChange={handleChange}
            value={info.supplier}
          />
          <TextField
            className={classes.item}
            variant="outlined"
            margin="dense"
            name="explanation"
            label={formatMessage({
              id: "internalNote",
              defaultMessage: "Internal Note",
            })}
            type="text"
            id="explanation"
            onChange={handleChange}
            value={info.explanation}
          />
          <TextField
            className={classes.item}
            variant="outlined"
            margin="dense"
            name="receipt_id"
            label={formatMessage({
              id: "receiptId",
              defaultMessage: "Receipt Id",
            })}
            type="nmuber"
            id="receipt_id"
            onChange={handleChange}
            value={info.receipt_id}
          />
          <TextField
            className={classes.item}
            variant="outlined"
            margin="dense"
            name="tracking_code"
            label={formatMessage({
              id: "trackingCode",
              defaultMessage: "Tracking Code",
            })}
            type="text"
            id="tracking_code"
            onChange={handleChange}
            value={info.tracking_code}
          />

          <TextField
            className={classes.item}
            variant="outlined"
            margin="dense"
            name="globalSearch"
            label={formatMessage({
              id: "globalSearch",
              defaultMessage: "Global Search",
            })}
            type="text"
            id="globalSearch"
            onChange={(e) => setGlobalSearchKey(e.target.value)}
            value={globalSearchKey}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.btn}
            onClick={(e) => handleSubmit(e)}
          >
            <FormattedMessage id="search" defaultMessage="Search" />
          </Button>
          <Button
            variant="contained"
            color="default"
            className={classes.btn}
            onClick={clearBtn}
          >
            <FormattedMessage id="clear" defaultMessage="Clear" />
          </Button>
        </form>
        {fillError ? (
          <div className={classes.bottomSection}>
            <div className={classes.warn}>
              <Typography>{fillError}</Typography>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
