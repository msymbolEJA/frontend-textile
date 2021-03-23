import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import {
  Paper,
  Grid,
  Table,
  // Button,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
} from "@material-ui/core";
import { FormattedMessage } from "react-intl";
//import { ArrowForwardIos as ArrowForwardIosIcon } from "@material-ui/icons";
import CancelIcon from "@material-ui/icons/Cancel";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: 30,
    maxWidth: "300px",
  },
  table: {
    minWidth: 150,
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  tableRow: {
    cursor: "pointer",
    "&:hover": {
      background: "#efefef",
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
  titleStyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#add8e6",
      borderRadius: "0.5rem 0.5rem 0 0",
      fontSize: "1.1rem",
      transition: "0.5s",
    },
    minHeight: "6rem",
  },
}));

export default function SummaryTable({
  title,
  next,
  icon,
  header1,
  header2,
  data,
  lastDateOfOrder,
  healthCheck,
}) {
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

  // if (title === "orders") {
  //   console.log("healthCheck", healthCheck);
  // }

  return (
    <Grid item xs={12} md={6} className={classes.root}>
      <Paper className={classes.paper}>
        <div className={classes.titleStyle} onClick={(e) => handleClick(e)}>
          {icon}
          <h3 style={{ display: "inline", marginLeft: "0.5rem" }}>
            <FormattedMessage id={title} defaultMessage={title} /> ({total})
          </h3>
        </div>
        <div>
          <Table className={classes.table}>
            <TableHead style={{ backgroundColor: "black" }}>
              <TableRow>
                <TableCell align="left" style={{ color: "white" }}>
                  {header1}
                </TableCell>
                <TableCell align="right" style={{ color: "white" }}>
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
                      <FormattedMessage
                        id="everythingOnSchedule"
                        defaultMessage="EVERYTHING IS ON SCHEDULE"
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((item, index) => (
                    <TableRow
                      key={index}
                      className={classes.tableRow}
                      onClick={() =>
                        title === "orders"
                          ? history.push(
                              `/all-orders?&status=${item.cell1.toLowerCase()}&limit=250&offset=0`
                            )
                          : null
                      }
                    >
                      <TableCell align="left" component="th" scope="row">
                        {title === "orders" ? (
                          <FormattedMessage
                            id={
                              item.cell1.toLowerCase() === "awaiting"
                                ? "approved"
                                : item.cell1.toLowerCase()
                            }
                            defaultMessage={
                              item.cell1.toLowerCase() === "awaiting"
                                ? "APPROVED"
                                : item.cell1
                            }
                          />
                        ) : (
                          item.cell1
                        )}
                      </TableCell>
                      <TableCell align="right">{item.cell2}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan="2" style={{ display: "table-cell" }}>
                    <CircularProgress
                      style={{ marginTop: "1rem", marginBottom: "1rem" }}
                    />
                  </td>
                </tr>
              </tbody>
            )}
          </Table>
        </div>
        {title === "orders" && lastDateOfOrder ? (
          <div
            style={{
              // display: "flex",
              // justifyContent: "space-around",
              // alignItems: "center",
              marginTop: "1rem",
              fontSize: "1rem",
            }}
          >
            <div>
              <FormattedMessage
                id={"dateOfLastOrder"}
                defaultMessage={"Date of Last Order"}
              />
              {" : "}
              <br />
              {lastDateOfOrder
                ? moment(lastDateOfOrder?.creation_tsz).format("MM-DD-YY HH:mm")
                : "-"}{" "}
              GMT
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p>Health Check: </p>
              {healthCheck ? (
                <CheckCircleIcon
                  style={{ color: "green", marginLeft: "0.5rem" }}
                />
              ) : (
                <CancelIcon
                  style={{ color: "#ff3333", marginLeft: "0.5rem" }}
                />
              )}
            </div>
          </div>
        ) : null}
      </Paper>
    </Grid>
  );
}
