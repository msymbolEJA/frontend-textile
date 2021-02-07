import React, { useEffect, useState } from "react";
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
});

export default function CustomizedTables() {
  const classes = useStyles();
  const [cargoList, setCargoList] = useState({});

  useEffect(() => {
    getData("http://144.202.67.136:8080/etsy/shipment_content/").then(
      (response) => {
        console.log(response.data.null);
        setCargoList(response.data.null);
      }
    );
  }, []);

  const tnFunc = (tn, carrier) => {
    console.log(tn, carrier.toUpperCase());
    if (carrier.toUpperCase().includes("DHL")) {
      // console.log("DHL");
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

  return (
    <TableContainer component={Paper} className={classes.root}>
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
          {Object.keys(cargoList).length === 0 ? (
            <tr>
              <td colSpan="4">No Item!</td>
            </tr>
          ) : (
            Object.keys(cargoList).map((row, i) => (
              <StyledTableRow key={i}>
                <StyledTableCell align="center">
                  {cargoList[row].id}
                </StyledTableCell>
                <StyledTableCell align="center" component="th" scope="row">
                  {row}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {cargoList[row].carrier.toUpperCase()}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {cargoList[row].content}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {cargoList[row].content.length}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {moment(cargoList[row].shipment_date).format(
                    "DD-MM-YY HH:mm"
                  )}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {tnFunc(
                    cargoList[row].tracking_number,
                    cargoList[row].carrier
                  )}
                </StyledTableCell>
              </StyledTableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
