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
  const [cargoList, setCargoList] = useState([]);

  useEffect(() => {
    getData("http://144.202.67.136:8080/etsy/shipment_list/").then(
      (response) => {
        console.log(response.data);
        setCargoList(response.data);
      }
    );
  }, []);

  return (
    <TableContainer component={Paper} className={classes.root}>
      <Typography className={classes.header} variant="h3">
        Cargo List
      </Typography>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Id</StyledTableCell>
            <StyledTableCell align="center">Carrier</StyledTableCell>
            <StyledTableCell align="center">Count</StyledTableCell>
            <StyledTableCell align="center">Reference Number</StyledTableCell>
            <StyledTableCell align="center">Shipment Date</StyledTableCell>
            <StyledTableCell align="center">Tracking Number</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cargoList.map((row, i) => (
            <StyledTableRow key={i}>
              <StyledTableCell align="center" component="th" scope="row">
                {row.id}
              </StyledTableCell>
              <StyledTableCell align="center">{row.carrier}</StyledTableCell>
              <StyledTableCell align="center">{row.count}</StyledTableCell>
              <StyledTableCell align="center">{row.ref_number}</StyledTableCell>
              <StyledTableCell align="center">
                {moment(row.shipment_date).format("DD-MM-YY HH:mm")}
              </StyledTableCell>
              <StyledTableCell align="center">
                {row.tracking_number}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
