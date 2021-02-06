import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { useHistory } from "react-router-dom";
import Table from "@material-ui/core/Table";
import Button from "@material-ui/core/Button";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import ListAltIcon from "@material-ui/icons/ListAlt";
import TableRow from "@material-ui/core/TableRow";
import { getData } from "../../helper/PostData";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import CircularProgress from "@material-ui/core/CircularProgress";

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
  },
}));

export default function AllOrders({ userRole }) {
  const classes = useStyles();
  const history = useHistory();
  const [statuList, setStatuList] = useState();

  useEffect(() => {
    getData("http://144.202.67.136:8080/etsy/summary_order/").then(
      (response) => {
        console.log(response.data[0]);
        const newResult = {};
        response.data[0].forEach((item) => {
          Object.assign(newResult, { [item.status]: item.status_count });
        });

        if (
          userRole === "admin" ||
          userRole === "shop_manager" ||
          userRole === "shop_packer"
        ) {
          const newStatusList = {
            pending: newResult.pending || 0,
            awaiting: newResult.awaiting || 0,
            in_progress: newResult.in_progress || 0,
            ready: newResult.ready || 0,
            in_transit: newResult.in_transit || 0,
            cancelled: newResult.cancelled || 0,
            repeat: newResult.repeat || 0,
            shipped: newResult.shipped || 0,
            follow_up: newResult.follow_up || 0,
          };
          setStatuList(newStatusList);
        } else {
          const newStatusList = {
            awaiting: newResult.awaiting || 0,
            in_progress: newResult.in_progress || 0,
            ready: newResult.ready || 0,
            in_transit: newResult.in_transit || 0,
          };
          setStatuList(newStatusList);
        }
      }
    );
  }, [userRole]);

  const handleClick = () => {
    history.push("/all-orders");
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
            <ListAltIcon className={classes.icon} color="primary" />
            <h1 style={{ display: "inline", marginLeft: "0.5rem" }}>Orders</h1>
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
                <TableCell style={{ color: "white" }}>STATUS</TableCell>
                <TableCell align="right" style={{ color: "white" }}>
                  COUNT
                </TableCell>
              </TableRow>
            </TableHead>
            {statuList ? (
              <TableBody>
                {Object.keys(statuList).map((key, value) => (
                  <TableRow key={key}>
                    <TableCell component="th" scope="row">
                      {key.replace("_", " ").replace("-", " ").toUpperCase()}
                    </TableCell>
                    <TableCell align="right">{statuList[key]}</TableCell>
                  </TableRow>
                ))}
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
