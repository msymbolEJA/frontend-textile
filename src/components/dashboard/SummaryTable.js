import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
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
import { FormattedMessage } from "react-intl";
import { ArrowForwardIos as ArrowForwardIosIcon } from "@material-ui/icons";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: 30,
    maxWidth: "500px",
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
  lastDateOfOrder,
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

  return (
    <Grid item xs={12} md={6} className={classes.root}>
      <Paper className={classes.paper}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            minHeight: "5.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {icon}
            <h3 style={{ display: "inline", marginLeft: "0.5rem" }}>
              <FormattedMessage id={title} defaultMessage={title} /> ({total})
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
              <FormattedMessage id="wiewAll" defaultMessage="View All" />
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
                      <FormattedMessage
                        id="everythingOnSchedule"
                        defaultMessage="EVERYTHING IS ON SCHEDULE"
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell align="center" component="th" scope="row">
                        {title === "orders" ? (
                          <FormattedMessage
                            id={item.cell1.toLowerCase()}
                            defaultMessage={item.cell1}
                          />
                        ) : (
                          item.cell1
                        )}
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
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              fontSize: "1rem",
            }}
          >
            <div>
              Date of Last Order :{" "}
              {lastDateOfOrder
                ? moment(lastDateOfOrder?.creation_tsz).format("DD-MM-YY HH:mm")
                : "-"}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p>Health Check: </p>
              <CheckCircleIcon
                style={{ color: "green", marginLeft: "0.5rem" }}
              />
            </div>
          </div>
        ) : null}
      </Paper>
    </Grid>
  );
}
