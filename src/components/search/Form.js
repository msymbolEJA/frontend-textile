import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { FormattedMessage, useIntl } from "react-intl";
import { useFormik } from "formik";

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
  const formik = useFormik({
    initialValues: {
      id: globalSearchKey?.length < 7 ? globalSearchKey : "",
      status: "",
      buyer: "",
      sku: "",
      supplier: "",
      explanation: "",
      receipt: globalSearchKey?.length > 7 ? globalSearchKey : "",
      tracking_code: "",
    },
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  return (
    <div>
      <div>
        <form className={classes.root} onSubmit={formik.handleSubmit}>
          <>
            <TextField
              className={classes.item}
              variant="outlined"
              margin="dense"
              name="receipt"
              value={formik.values.receipt}
              onChange={formik.handleChange}
              label={formatMessage({
                id: "receiptId",
                defaultMessage: "Receipt Id",
              })}
              type="nmuber"
              id="receipt"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="dense"
              id="id"
              label={formatMessage({
                id: "id",
                defaultMessage: "Id",
              })}
              value={formik.values.id}
              onChange={formik.handleChange}
              type="text"
              name="id"
              autoComplete="id"
            />
            <TextField
              className={classes.item}
              variant="outlined"
              margin="dense"
              id="status"
              label={formatMessage({
                id: "status",
                defaultMessage: "Status",
              })}
              value={formik.values.status}
              onChange={formik.handleChange}
              type="text"
              name="status"
              autoComplete="status"
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
              value={formik.values.buyer}
              onChange={formik.handleChange}
              type="text"
              name="buyer"
              autoComplete="buyer"
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
              value={formik.values.sku}
              onChange={formik.handleChange}
              type="text"
              name="sku"
              autoComplete="sku"
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
              value={formik.values.supplier}
              onChange={formik.handleChange}
              type="text"
              id="supplier"
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
              value={formik.values.explanation}
              onChange={formik.handleChange}
              type="text"
              id="explanation"
            />

            <TextField
              className={classes.item}
              variant="outlined"
              margin="dense"
              name="tracking_code"
              value={formik.values.tracking_code}
              onChange={formik.handleChange}
              label={formatMessage({
                id: "trackingCode",
                defaultMessage: "Tracking Code",
              })}
              type="text"
              id="tracking_code"
            />
          </>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.btn}
          >
            <FormattedMessage id="search" defaultMessage="Search" />
          </Button>
          <Button
            variant="contained"
            color="default"
            className={classes.btn}
            onClick={formik.resetForm}
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
