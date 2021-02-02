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
    height: 500,
    overflow: "auto",
  },
  table: {
    minWidth: 350,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.primary,
  },
  icon: {
    fontSize: 25,
    display: "inline",
  },
}));

export default function AllOrders({ isAdmin }) {
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
    <Grid item xs={12} md={isAdmin ? 6 : 12} className={classes.root}>
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
            <p style={{ display: "inline", marginLeft: "0.5rem" }}>Orders</p>
          </div>
          <Button onClick={handleClick} style={{ backgroundColor: "#B6D8F2" }}>
            View All <ArrowForwardIosIcon />{" "}
          </Button>
        </div>
        <div>
          <Table
            className={classes.table}
            size="small"
            aria-label="a dense table"
          >
            <TableHead>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell align="right">Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {statuList.map((statu) => (
                <TableRow key={statu.status}>
                  <TableCell component="th" scope="row">
                    {statu.status}
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
