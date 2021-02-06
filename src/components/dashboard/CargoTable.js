import React, { useEffect, useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import Button from "@material-ui/core/Button";
import { getData } from "../../helper/PostData";

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
    marginTop: 30,
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  table: {
    //width: 300,
  },
  root: {
    flexGrow: 1,
    // cursor: "pointer",
    margin: 0,
    marginTop: 30,
    minWidth: "400px",
  },
  icon: {
    fontSize: 40,
    display: "inline",
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.primary,
    //width: "42rem",
  },
}));

export default function CustomizedTables() {
  const classes = useStyles();
  const [cargoList, setCargoList] = useState({});

  useEffect(() => {
    getData("http://144.202.67.136:8080/etsy/due_dates/").then((response) => {
      console.log("CargoTableResponse", response.data);
      setCargoList(response.data);
    });
  }, []);

  return (
    <Grid item xs={12} md={6} className={classes.root}>
      <Paper className={classes.paper}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <LocalShippingIcon className={classes.icon} color="primary" />
            <h1 style={{ display: "inline", marginLeft: "0.5rem" }}>Cargo</h1>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              color="primary"
              variant="outlined"
              id="approval"
              className={classes.button}
              endIcon={<ArrowForwardIosIcon />}
              //onClick={(e) => handleClick(e)}
            >
              View All
            </Button>
          </div>
        </div>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>DATE</StyledTableCell>
              <StyledTableCell align="left">QUANTITY</StyledTableCell>
              <StyledTableCell align="right">ORDERS</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(cargoList).map((item, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell component="th" scope="row">
                  {item}
                </StyledTableCell>
                {/* <StyledTableCell align="left">
                  {cargoList[item].is_late}
                </StyledTableCell> */}
                <StyledTableCell align="left">
                  {cargoList[item].values.length}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {cargoList[item].values.map((key, i) => (
                    <span key={i}>
                      <span key={i}>{key},</span>
                      {i % 4 === 0 ? <br /> : null}
                    </span>
                  ))}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Grid>
  );
}
