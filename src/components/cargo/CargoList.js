import React, { useEffect, useState, useContext } from "react";
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
    width: "95%",
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
  const [cargoList, setCargoList] = useState([]);
  const history = useHistory();
  const [getSupplier, setGetSupplier] = useState("");
  const { isAdmin } = useContext(AppContext);

  useEffect(() => {
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
  }, [getSupplier]);

  const tnFunc = (tn, carrier) => {
    if (carrier.toUpperCase().includes("DHL")) {
      return (
        <a
          href={`https://www.dhl.com/en/express/tracking.html?AWB=${tn}&brand=DHL`}
          target="_blank"
          rel="noreferrer"
        >
          {tn}
        </a>
      );
    } else if (carrier.toUpperCase().includes("UPS")) {
      return (
        <a
          href={`https://www.ups.com/track?tracknum=${tn}`}
          target="_blank"
          rel="noreferrer"
        >
          {tn}
        </a>
      );
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
            All
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
        Cargo List
      </Typography>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Id</StyledTableCell>
            <StyledTableCell align="center">Reference Number</StyledTableCell>
            <StyledTableCell align="center">Carrier</StyledTableCell>
            <StyledTableCell align="center">Content</StyledTableCell>
            <StyledTableCell align="center">Count</StyledTableCell>
            <StyledTableCell align="center">Shipment Date</StyledTableCell>
            <StyledTableCell align="center">Tracking Number</StyledTableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {!cargoList.length ? (
            <tr>
              <td colSpan="4">No Item!</td>
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
                    <StyledTableCell align="center">
                      {row.carrier.toUpperCase()}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.content.map((key, i) => (
                        <span key={i}>
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
                          {(i + 1) % 4 === 0 ? <br /> : null}
                        </span>
                      ))}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.content.length}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {moment(row.shipment_date).format("DD-MM-YY HH:mm")}
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      {tnFunc(row.tracking_number, row.carrier)}
                    </StyledTableCell>
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
