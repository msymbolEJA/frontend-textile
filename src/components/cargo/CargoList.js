import React, { useEffect, useState, useContext, useCallback } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { getData } from "../../helper/PostData";
import moment from "moment";
import Typography from "@material-ui/core/Typography";
import { useHistory } from "react-router-dom";
import { AppContext } from "../../context/Context";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { FormattedMessage } from "react-intl";
import EditableTableCell from "./EditableTableCell";
import { putData } from "../../helper/PostData";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:hover": {
      cursor: "pointer",
      //boxShadow: "1px 2px",
      backgroundColor: "#add8e6",
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    //width: "500px",
  },
  root: {
    margin: "1rem",
    minWidth: "500px",
    width: "98%",
    minHeight: "250px",
  },
  header: {
    marginBottom: "1rem",
  },
  btn: {
    margin: "0.3rem",
  },
});

export default function CustomizedTables() {
  const classes = useStyles();
  const [cargoList, setCargoList] = useState();
  const history = useHistory();
  const [getSupplier, setGetSupplier] = useState("");
  const { isAdmin } = useContext(AppContext);

  const getListFunc = () => {
    getData(`${BASE_URL}etsy/cargo_list/${getSupplier}`).then((response) => {
      let dataObj = response.data;
      const formattedData = dataObj
        ? Object.keys(dataObj).map((key) => {
            return Object.keys(dataObj[key]).map((key2) => ({
              ...dataObj[key][key2],
              refNumber: key2,
            }));
          })
        : [];

      setCargoList(formattedData);
    });
  };

  useEffect(() => {
    getListFunc();
    // eslint-disable-next-line
  }, [getSupplier]);

  const tnFunc = (tn, carrier) => {
    if (carrier.toUpperCase().includes("DHL")) {
      return `https://www.dhl.com/en/express/tracking.html?AWB=${tn}&brand=DHL`;
    } else if (carrier.toUpperCase().includes("UPS")) {
      return `https://www.ups.com/track?tracknum=${tn}`;
    } else {
      return tn;
    }
  };

  const handleRowClick = (id) => {
    history.push(`/cargo-content/${id}`);
  };

  const handleSupplier = (e) => {
    if (e.currentTarget.id) {
      setGetSupplier(`?supplier=${e.currentTarget.id}`);
    } else {
      setGetSupplier("");
    }
  };

  const handleRowChange = useCallback(
    (id, data) => {
      if (!data) return;
      putData(`${BASE_URL}etsy/shipments/${id}/`, data)
        .then((response) => {
          // console.log(response);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => getListFunc());
    },
    [getListFunc]
  );

  const onChange = (e, id, name) => {
    // console.log(id, name);
    handleRowChange(id, { [name]: e.target.innerText });
  };

  return (
    <TableContainer component={Paper} className={classes.root}>
      {isAdmin ? (
        <div>
          <Button
            variant="contained"
            color="secondary"
            id=""
            onClick={handleSupplier}
            className={classes.btn}
          >
            <FormattedMessage id="all" defaultMessage="ALL" />
          </Button>
          <Button
            className={classes.btn}
            color="secondary"
            variant="contained"
            id="asya"
            onClick={handleSupplier}
          >
            ASYA
          </Button>
          <Button
            color="secondary"
            className={classes.btn}
            variant="contained"
            id="beyazit"
            onClick={handleSupplier}
          >
            Beyazit
          </Button>
        </div>
      ) : null}
      <Typography className={classes.header} variant="h3">
        <FormattedMessage id="cargoList" defaultMessage="Cargo List" />
      </Typography>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">
              <FormattedMessage id="id" defaultMessage="Id" />
            </StyledTableCell>
            <StyledTableCell align="center">
              <FormattedMessage
                id="referenceNumber"
                defaultMessage="Reference Number"
              />
            </StyledTableCell>
            <StyledTableCell align="center">
              <FormattedMessage id="carrier" defaultMessage="Carrier" />
            </StyledTableCell>
            <StyledTableCell align="center">
              <FormattedMessage id="content" defaultMessage="Content" />
            </StyledTableCell>
            <StyledTableCell align="center">
              <FormattedMessage id="count" defaultMessage="Count" />
            </StyledTableCell>
            <StyledTableCell align="center">
              <FormattedMessage id="shipmentDate" defaultMessage="Log Date" />
            </StyledTableCell>
            <StyledTableCell align="center">
              <FormattedMessage
                id="trackingNumber"
                defaultMessage="Tracking Number"
              />
            </StyledTableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {cargoList === undefined ? (
            <tr>
              <td colSpan="7" style={{ display: "table-cell" }}>
                <CircularProgress style={{ marginTop: "1rem" }} />
              </td>
            </tr>
          ) : cargoList?.length === 0 ? (
            <tr>
              <td colSpan="7">No Item!</td>
            </tr>
          ) : (
            cargoList.map((ws, j) =>
              ws.reverse().map((row, i) => {
                return (
                  <StyledTableRow
                    key={i}
                    onClick={() => handleRowClick(row.id)}
                  >
                    <StyledTableCell align="center">{row.id}</StyledTableCell>
                    <StyledTableCell align="center" component="th" scope="row">
                      {row?.refNumber}
                    </StyledTableCell>
                    <EditableTableCell
                      align="center"
                      {...{
                        row,
                        name: "carrier",
                        onChange,
                      }}
                    />
                    <StyledTableCell align="center">
                      {row.content.map((key, i) => (
                        <span
                          key={i}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <a
                            href={`/order-details/${key}/`}
                            key={i}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            {key}
                          </a>
                          {" - "}
                          {(i + 1) % 10 === 0 ? <br /> : null}
                        </span>
                      ))}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.content.length}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {moment
                        .utc(row.shipment_date)
                        .local()
                        .format("MM-DD-YY HH:mm")}
                    </StyledTableCell>
                    <EditableTableCell
                      align="center"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      {...{
                        row,
                        name: "tracking_number",
                        onChange,
                        trackingNumber: tnFunc(
                          row.tracking_number,
                          row.carrier
                        ),
                      }}
                    />
                  </StyledTableRow>
                );
              })
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
