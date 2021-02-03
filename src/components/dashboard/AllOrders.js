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

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: "auto",
    overflow: "auto",
    margin: "2rem",
  },
  table: {
    minWidth: 150,
    height: "auto",
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.primary,
    width: "42rem",
  },
  icon: {
    fontSize: 40,
    display: "inline",
  },
  button: {
    height: "2rem ",
  },
}));

export default function AllOrders() {
  const classes = useStyles();
  const history = useHistory();
  const [statuList, setStatuList] = useState([]);

  useEffect(() => {
    getData("http://144.202.67.136:8080/etsy/status_count/").then(
      (response) => {
        console.log(response);
        setStatuList(response.data);
      }
    );
  }, []);

  const handleClick = () => {
    history.push("/all-orders");
  };

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
            <ListAltIcon className={classes.icon} color="primary" />
            <h1 style={{ display: "inline", marginLeft: "0.5rem" }}>Orders</h1>
          </div>
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
            <TableBody>
              {statuList.map((statu) => (
                <TableRow key={statu.status}>
                  <TableCell component="th" scope="row">
                    {statu.status
                      .replace("_", " ")
                      .replace("-", " ")
                      .toUpperCase()}
                  </TableCell>
                  <TableCell align="right">{statu.status_count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Paper>
    </Grid>
  );
}
