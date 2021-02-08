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
    margin: "1.5%",
    minWidth: "500px",
    width: "97%",
  },
  header: {
    marginBottom: "1rem",
  },
});

export default function CustomizedTables({ match }) {
  const classes = useStyles();
  const [cargoList, setCargoList] = useState([]);
  console.log("match-params-id", match.params.id);

  useEffect(() => {
    getData(
      `http://144.202.67.136:8080/etsy/shipment/?id=${match.params.id}`
    ).then((response) => {
      console.log(response.data);
      setCargoList(response.data);
    });
  }, [match.params.id]);

  return (
    <TableContainer component={Paper} className={classes.root}>
      <Typography className={classes.header} variant="h3">
        Cargo Content
      </Typography>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">ORDER ID</StyledTableCell>
            <StyledTableCell align="center">RECEIPT ID</StyledTableCell>
            <StyledTableCell align="center">CUSTOMER</StyledTableCell>
            <StyledTableCell align="center">ITEM INDEX</StyledTableCell>
            <StyledTableCell align="center">TYPE</StyledTableCell>
            <StyledTableCell align="center">STATUS</StyledTableCell>
            <StyledTableCell align="center">NOTE</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cargoList.map((row, i) => (
            <StyledTableRow key={i}>
              <StyledTableCell align="center" component="th" scope="row">
                <a href={`/order-details/${row[0].id}`}>{row[0].id}</a>
              </StyledTableCell>
              <StyledTableCell align="center">
                {row[0].receipt_id}
              </StyledTableCell>
              <StyledTableCell align="center">{row[0].name}</StyledTableCell>
              <StyledTableCell align="center">
                {row[0].item_index}
              </StyledTableCell>
              <StyledTableCell align="center">{row[0].type}</StyledTableCell>
              <StyledTableCell align="center">{row[0].status}</StyledTableCell>
              <StyledTableCell align="center">{row[0].note}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
