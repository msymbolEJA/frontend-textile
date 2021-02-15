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
import { Button } from "@material-ui/core";
import { getOnePdf, getData, putData } from "../../../../helper/PostData";
import OrderDetailsCargoPage from "./OrderDetailsCargoPage";
import { BASE_URL, BASE_URL_MAPPING } from "../../../../helper/Constants";
import moment from "moment";

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
    marginTop: theme.spacing(1),
    overflowX: "auto",
  },
  rootBottom: {
    backgroundColor: "lightgrey",
    minHeight: "10vh",
    margin: "5vw",
  },
  container: {
    // maxHeight: "83vh",
  },
  table: {
    minWidth: 650,
    marginBottom: "2rem",
  },
  table2: {
    maxWidth: 950,
    margin: "auto",
  },
  selectTableCell: {
    width: 60,
  },
  buttonGroup: {
    marginBottom: theme.spacing(1),
  },
  header: {
    fontSize: "2rem",
  },
  sub: {
    fontSize: "1rem",
  },
  printSubmit: {
    marginTop: theme.spacing(5),
  },
  tableRow: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

const OrderDetails = ({ match }) => {
  const [rows, setRows] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isPdfExist, setIsPdfExist] = useState(false);
  // console.log("isPdfExist", isPdfExist);
  const [refresh, setRefresh] = useState(false);
  const classes = useStyles();

  const getPdf = () => {
    let data = match.params.id;
    getOnePdf(`${BASE_URL}etsy/print_one/`, data)
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
    fetch(`${BASE_URL}media/pdf/${match.params.id}.pdf`)
      .then((res) => {
        if (res.status !== 404) {
          setIsPdfExist(true);
        }
      })
      .catch((err) => console.log("err", err));

    let url = `${BASE_URL}etsy/orders/${match.params.id}/`;
    let urlLogs = `${BASE_URL}etsy/dateLogs/${match.params.id}/`;
    getData(url)
      .then((res) => {
        setRows([res.data]);
      })
      .then(() => {
        getData(urlLogs).then((res) => {
          setLogs(res.data);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [match.params.id, refresh]);

  const handleSendToStock = () => {
    const newData = {
      status: "cancelled",
      note: rows[0]?.note + " - SENT TO STOCKS!",
    };
    handleStockChange(rows[0]?.id, newData);
  };

  const handleStockChange = (id, data) => {
    putData(`${BASE_URL_MAPPING}${id}/`, data)
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setRefresh(!refresh));
  };

  return (
    <div>
      <Paper className={classes.root}>
        <div
          style={{
            display: "flex",
            flexDirection: "row-reverse",
            marginRight: "0.5rem",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="small"
            className={classes.button}
            onClick={handleSendToStock}
          >
            Send to Stock
          </Button>
        </div>
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
                <StyledTableCell align="center">Id</StyledTableCell>
                <StyledTableCell align="center">Receipt Id</StyledTableCell>
                <StyledTableCell align="center">Date</StyledTableCell>
                <StyledTableCell align="center">Statu</StyledTableCell>
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
                    <CustomTableCell {...{ row, name: "id" }} />
                    <CustomTableCell
                      {...{ row, name: "receipt_id", name2: "is_repeat" }}
                    />
                    <CustomTableCell {...{ row, name: "created_date" }} />
                    <CustomTableCell {...{ row, name: "status" }} />
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
      {rows[0]?.status === "ready" ? (
        <OrderDetailsCargoPage id={match.params.id} setRefresh={setRefresh} />
      ) : null}
      {rows[0]?.status === "awaiting" ? (
        <>
          <Button
            onClick={getPdf}
            variant="contained"
            color="primary"
            className={classes.printSubmit}
          >
            Print
          </Button>
          <hr />
        </>
      ) : null}

      {["in_progress", "ready", "in_transit", "shipped"].includes(
        rows[0]?.status
      ) && isPdfExist ? (
        <>
          <a
            href={`${BASE_URL}media/pdf/${match.params.id}.pdf`}
            target="_blank"
            rel="noreferrer"
          >
            Open Printed Pdf
          </a>
          <hr />
        </>
      ) : null}

      {logs?.length === 0 ? null : (
        <TableContainer component={Paper}>
          <Table className={classes.table2} aria-label="simple table">
            <TableHead>
              <TableRow
                style={{ backgroundColor: "black", borderRadius: "0.5rem" }}
              >
                <TableCell align="center" style={{ color: "white" }}>
                  Date
                </TableCell>
                <TableCell align="center" style={{ color: "white" }}>
                  User
                </TableCell>
                <TableCell align="center" style={{ color: "white" }}>
                  Action
                </TableCell>
                <TableCell align="center" style={{ color: "white" }}>
                  Log Data
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.length > 0 &&
                logs.reverse().map((log, i) => (
                  <TableRow key={i} className={classes.tableRow}>
                    <TableCell component="th" scope="row" align="center">
                      {moment(log.change_date).format("DD-MM-YY HH:mm")}
                    </TableCell>
                    <TableCell align="center">{log.user}</TableCell>
                    <TableCell align="center">
                      {log.type.replaceAll("_", " ")}
                    </TableCell>
                    <TableCell align="center">
                      {moment(log.data).format("DD-MM-YY HH:mm") ===
                      "Invalid date"
                        ? log.data
                        : moment(log.data).format("DD-MM-YY HH:mm")}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default OrderDetails;
