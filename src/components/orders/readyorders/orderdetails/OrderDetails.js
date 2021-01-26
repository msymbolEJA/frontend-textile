import React, { useState, useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import CustomTableCell from "../CustomTableCell";
import Typography from "@material-ui/core/Typography";
import DATA from "../../../../helper/Data";
import { Button } from "@material-ui/core";
import { getOnePdf, getData } from "../../../../helper/PostData";
import CargoPage from "../../../otheritems/CargoPage";

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
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
  },
  rootBottom: {
    backgroundColor: "lightgrey",
    minHeight: "10vh",
    margin: "5vw",
  },
  container: {
    maxHeight: "83vh",
  },
  table: {
    minWidth: 650,
  },
  selectTableCell: {
    width: 60,
  },
  buttonGroup: {
    marginBottom: theme.spacing(1),
  },
  header: {
    fontSize: "1.5rem",
  },
  sub: {
    fontSize: "1rem",
  },
  printSubmit: {
    marginTop: theme.spacing(5),
  },
}));

const OrderDetails = ({ match }) => {
  const [rows, setRows] = useState(DATA);
  const classes = useStyles();

  console.log(rows[0].status);

  const getPdf = () => {
    let data = rows.id;
    getOnePdf("http://144.202.67.136:8080/etsy/print_one/", data)
      .then((res) => {
        //console.log(res.data.url);
        const link = document.createElement("a");
        link.href = `${res.data.url}`;
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        //console.log(rows[0].id);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    let data = "";
    let url = `http://144.202.67.136:8080/etsy/mapping/${match.params.id}/`;
    //console.log(url)
    getData(url, data)
      .then((res) => {
        //console.log(res.data)
        setRows([res.data]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [match.params.id]);

  return (
    <div>
      <Paper className={classes.root}>
        <Typography className={classes.header}>Order Details</Typography>
        <TableContainer className={classes.container}>
          <Table
            className={classes.table}
            stickyHeader
            aria-label="sticky table"
            size="small"
          >
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Receipt Id</StyledTableCell>
                <StyledTableCell align="center">Date</StyledTableCell>
                <StyledTableCell align="center">Statu</StyledTableCell>
                <StyledTableCell align="center">System Date</StyledTableCell>
                <StyledTableCell align="center">Buyer</StyledTableCell>
                <StyledTableCell align="center">Supplier</StyledTableCell>
                <StyledTableCell align="center">Type</StyledTableCell>
                <StyledTableCell align="center">length</StyledTableCell>
                <StyledTableCell align="center">Color</StyledTableCell>
                <StyledTableCell align="center">Qty</StyledTableCell>
                <StyledTableCell align="center">size</StyledTableCell>
                <StyledTableCell align="center">start</StyledTableCell>
                <StyledTableCell align="center">explanation</StyledTableCell>
                <StyledTableCell align="center">note</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows ? (
                rows?.map((row) => (
                  <StyledTableRow key={row.id} id={row.id}>
                    <CustomTableCell {...{ row, name: "receipt" }} />
                    <CustomTableCell {...{ row, name: "created_date" }} />
                    <CustomTableCell {...{ row, name: "status" }} />
                    <CustomTableCell {...{ row, name: "creation_tsz" }} />
                    <CustomTableCell {...{ row, name: "buyer" }} />
                    <CustomTableCell {...{ row, name: "supplier" }} />
                    <CustomTableCell {...{ row, name: "type" }} />
                    <CustomTableCell {...{ row, name: "length" }} />
                    <CustomTableCell {...{ row, name: "color" }} />
                    <CustomTableCell {...{ row, name: "qty" }} />
                    <CustomTableCell {...{ row, name: "size" }} />
                    <CustomTableCell {...{ row, name: "start" }} />
                    <CustomTableCell {...{ row, name: "explanation" }} />
                    <CustomTableCell {...{ row, name: "note" }} />
                  </StyledTableRow>
                ))
              ) : (
                <tr>
                  <td colSpan="13" style={{ fontSize: "2rem" }}>
                    "Nothing Found!"
                  </td>
                </tr>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {rows[0].status === "ready" ? <CargoPage /> : null}
      {rows[0].status === "awaiting" ? (
        <Button
          onClick={getPdf}
          variant="contained"
          color="primary"
          className={classes.printSubmit}
        >
          Print
        </Button>
      ) : null}
    </div>
  );
};

export default OrderDetails;
