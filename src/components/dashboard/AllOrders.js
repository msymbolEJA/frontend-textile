import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { useHistory } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { getData } from "../../helper/PostData";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  table: {
    minWidth: 350,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.primary,
    height: 260,
  },
  icon: {
    fontSize: 50,
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
              flexGrow: 2,
              border: "2px solid #3F51B5",
              borderRadius: "0.5rem",
            }}
          >
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
          <div
            style={{
              flexGrow: 1,
              fontSize: "2rem",
              cursor: "pointer",
              backgroundColor: "#3F51B5",
              color: "white",
              borderRadius: "1rem",
              height: "2.85rem",
              margin: "0.3rem",
            }}
            onClick={handleClick}
          >
            View Orders
          </div>
        </div>
      </Paper>
    </Grid>
  );
}
