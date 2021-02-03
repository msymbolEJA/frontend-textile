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
    overflow: "auto",
    margin: "2rem",
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
        console.log(response.data);
        const newData = [
          {
            status: response.data[3]?.status,
            status_count: response.data[3]?.status_count,
          },
          {
            status: response.data[2]?.status,
            status_count: response.data[2]?.status_count,
          },
          {
            status: response.data[7]?.status,
            status_count: response.data[7]?.status_count,
          },
          {
            status: response.data[8]?.status,
            status_count: response.data[8]?.status_count,
          },
          {
            status: response.data[1]?.status,
            status_count: response.data[1]?.status_count,
          },
          {
            status: response.data[0]?.status,
            status_count: response.data[0]?.status_count,
          },
          {
            status: response.data[4]?.status,
            status_count: response.data[4]?.status_count,
          },
          {
            status: response.data[5]?.status,
            status_count: response.data[5]?.status_count,
          },
          {
            status: response.data[6]?.status,
            status_count: response.data[6]?.status_count,
          },
        ];
        // console.log(newData);
        setStatuList(newData);
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
