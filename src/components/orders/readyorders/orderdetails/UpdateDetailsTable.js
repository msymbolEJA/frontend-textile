import {
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@material-ui/core";
import { FormattedMessage, useIntl } from "react-intl";

import { useEffect, useState } from "react";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { updateDetailsMappingTable } from "../../../../helper/Constants";
import { getData, putData } from "../../../../helper/PostData";
import EditableTableCell from "./EditableTableCell";
import {
  toastErrorNotify,
  toastSuccessNotify,
} from "../../../otheritems/ToastNotify";
const BASE_URL = process.env.REACT_APP_BASE_URL;

const useStyles = makeStyles((theme) => ({
  thead: {
    backgroundColor: "rgb(100, 149, 237)",
    "& th": {
      color: theme.palette.common.white,
      textAlign: "center",
    },
  },
  tbody: {
    "& td": {
      textAlign: "center",
    },
  },
  modalpaper: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    borderRadius: 10,
  },
  modalButton: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const UpdateDetailsTable = ({ row }) => {
  const [data, setData] = useState([]);
  const { formatMessage } = useIntl();

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [accountData, setAccountData] = useState({
    first_line: row?.first_line,
    second_line: row?.second_line,
    city: row?.city,
    state: row?.state,
    zip: row?.zip,
  });
  useEffect(() => {
    if (row) {
      setAccountData({
        first_line: row?.first_line,
        second_line: row?.second_line,
        city: row?.city,
        state: row?.state,
        zip: row?.zip,
      });
    }
  }, [row]);

  const handleSendTrackingCode = () => {
    row?.receipt_id &&
      getData(`${BASE_URL}dhl/send_tracking_code_by_one/${row?.id}/`)
        .then((res) => {})
        .catch((err) => {
          console.log({ err });
        });
  };

  const changeHandler = (e) => {
    setAccountData({ ...accountData, [e.target.name]: e.target.value });
  };

  const handleOpen = (e) => {
    e.preventDefault();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSaveAddress = () => {
    putData(`${BASE_URL}etsy/ordersTable/${row?.receipt_id}/`, {
      ...row,
      ...accountData,
    })
      .then((response) => {
        // console.log(response);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => getDetailsForUpdate());
  };
  const handleEditChange = (content, name) => {
    putData(`${BASE_URL}etsy/ordersTable/${row?.receipt_id}/`, {
      ...row,
      [name]: content,
    })
      .then((response) => {
        // console.log(response);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => getDetailsForUpdate());
  };

  const getDetailsForUpdate = () => {
    row?.receipt_id &&
      getData(`${BASE_URL}etsy/ordersTable/${row?.receipt_id}/`)
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          console.log({ err });
        });
  };

  useEffect(() => {
    getDetailsForUpdate();
  }, [row]);

  return (
    <>
      <div>
        <h1>Update Details</h1>
        <TableContainer>
          <Table>
            <TableHead className={classes.thead}>
              <TableRow>
                {updateDetailsMappingTable.map((item, index) => (
                  <TableCell key={index}>{item.name}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody className={classes.tbody}>
              <TableRow>
                {updateDetailsMappingTable.map((item, index) => {
                  return (
                    <TableCell
                      key={index}
                      onClick={() => {
                        item.objKey === "tracking_code" &&
                          navigator.clipboard.writeText(
                            data[item.objKey].substring(
                              data[item.objKey].length - 15
                            )
                          ) &&
                          toastSuccessNotify(
                            `${data[item.objKey].substring(
                              data[item.objKey].length - 15
                            )} copied`
                          );
                      }}
                    >
                      {item.type === "url" ? (
                        <a
                          href={data[item.objKey]}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visit
                        </a>
                      ) : item.type === "dropdown" ? (
                        <div>
                          {data[item.objKey]}
                          <select
                            onChange={(e) =>
                              handleEditChange(e.target.value, item.objKey)
                            }
                          >
                            <option value="" disabled selected>
                              Select your option
                            </option>

                            {item.values.map((value, index) => (
                              <option value={value.value} key={index}>
                                {value.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : item.type === "editable" ? (
                        <EditableTableCell
                          data={data}
                          name={item.objKey}
                          onChange={handleEditChange}
                        />
                      ) : (
                        data[item.objKey]
                      )}
                      {item.objKey === "tracking_code" ? (
                        <button onClick={handleSendTrackingCode}>Send</button>
                      ) : null}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          style={{ margin: 8 }}
          color="primary"
          variant="contained"
          onClick={() => setOpen(true)}
        >
          Update Address
        </Button>
      </div>
      <Modal open={open} onClose={handleClose}>
        <div className={classes.modalpaper}>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="first_line"
                  variant="outlined"
                  fullWidth
                  id="first_line"
                  label={formatMessage({
                    id: "firstLine",
                    defaultMessage: "First Line",
                  })}
                  defaultValue={accountData?.first_line}
                  onChange={(e) => changeHandler(e)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="second_line"
                  variant="outlined"
                  fullWidth
                  id="second_line"
                  label={formatMessage({
                    id: "secondLine",
                    defaultMessage: "Second Line",
                  })}
                  defaultValue={accountData?.second_line}
                  onChange={(e) => changeHandler(e)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="city"
                  label={formatMessage({
                    id: "city",
                    defaultMessage: "City",
                  })}
                  name="city"
                  defaultValue={accountData?.city}
                  onChange={(e) => changeHandler(e)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="state"
                  label={formatMessage({
                    id: "state",
                    defaultMessage: "State",
                  })}
                  name="city"
                  defaultValue={accountData?.state}
                  onChange={(e) => changeHandler(e)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="zip"
                  label={formatMessage({
                    id: "zip",
                    defaultMessage: "Zip",
                  })}
                  name="zip"
                  defaultValue={accountData?.zip}
                  onChange={(e) => changeHandler(e)}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={{ marginTop: 16 }}
              className={classes.submit}
              onClick={() => handleSaveAddress()}
            >
              <FormattedMessage id="update" defaultMessage="Update" />
            </Button>
            <Button
              fullWidth
              style={{ marginTop: 16 }}
              variant="contained"
              color="secondary"
              onClick={handleClose}
            >
              <FormattedMessage id="cancel" defaultMessage="Cancel" />
            </Button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default UpdateDetailsTable;
