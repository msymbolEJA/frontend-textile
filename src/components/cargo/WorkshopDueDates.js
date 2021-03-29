import React, { useEffect, useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import { getData } from "../../helper/PostData";
import { FormattedMessage } from "react-intl";

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
    marginTop: 10,
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
    getData(`${BASE_URL}etsy/due_dates/`).then((response) => {
      setCargoList(response.data);
    });
  }, []);

  return (
    <Grid item xs={12} md={12} className={classes.root}>
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
            <h1 style={{ display: "inline", marginLeft: "0.5rem" }}>
              <FormattedMessage
                id="workshopDueDate"
                defaultMessage="Workshop Due Dates"
              />
            </h1>
          </div>
        </div>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">
                <FormattedMessage id="date" defaultMessage="DATE" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="quantity" defaultMessage="Quantity" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="orders" defaultMessage="Orders" />
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(cargoList).map((item, index) => (
              <StyledTableRow
                style={{
                  backgroundColor: cargoList[item].is_late
                    ? "#FF9494"
                    : "white",
                }}
                key={index}
              >
                <StyledTableCell align="center" component="th" scope="row">
                  {item}
                </StyledTableCell>
                {/* <StyledTableCell align="left">
                  {cargoList[item].is_late}
                </StyledTableCell> */}
                <StyledTableCell align="center">
                  {cargoList[item].values.length}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {cargoList[item].values.map((key, i) => (
                    <span key={i}>
                      <a href={`/order-details/${key}`} key={i}>
                        {key}
                      </a>{" "}
                      - {(i + 1) % 8 === 0 ? <br /> : null}
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
