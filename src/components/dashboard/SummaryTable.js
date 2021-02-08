import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";

import {
  Paper,
  Grid,
  Table,
  Button,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
} from "@material-ui/core";

import { ArrowForwardIos as ArrowForwardIosIcon } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: 30,
    minWidth: "400px",
  },
  table: {
    minWidth: 150,
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.primary,
    //width: "42rem",
  },
  icon: {
    fontSize: 40,
    display: "inline",
  },
  button: {
    height: "2rem ",
    minWidth: "8rem",
  },
}));

export default function SummaryTable({
  title,
  next,
  icon,
  header1,
  header2,
  data,
}) {
  // console.log("data", data);
  let total =
    (data !== "noOrders" &&
      data?.length > 0 &&
      data.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue.cell2;
      }, 0)) ||
    0;

  const classes = useStyles();
  const history = useHistory();

  const handleClick = () => {
    history.push(next);
  };

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
            {icon}
            <h3 style={{ display: "inline", marginLeft: "0.5rem" }}>
              {title} ({total})
            </h3>
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
              onClick={(e) => handleClick(e)}
            >
              View All
            </Button>
          </div>
        </div>
        <div>
          <Table className={classes.table}>
            <TableHead style={{ backgroundColor: "black" }}>
              <TableRow>
                <TableCell align="center" style={{ color: "white" }}>
                  {header1}
                </TableCell>
                <TableCell align="center" style={{ color: "white" }}>
                  {header2}
                </TableCell>
              </TableRow>
            </TableHead>
            {data?.length ? (
              <TableBody>
                {data === "noOrders" ? (
                  <TableRow>
                    <TableCell
                      colSpan="2"
                      align="center"
                      component="th"
                      scope="row"
                    >
                      EVERYTHING IS ON SCHEDULE
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell align="center" component="th" scope="row">
                        {item.cell1}
                      </TableCell>
                      <TableCell align="center">{item.cell2}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan="2" style={{ display: "table-cell" }}>
                    <CircularProgress />
                  </td>
                </tr>
              </tbody>
            )}
          </Table>
        </div>
      </Paper>
    </Grid>
  );
}
