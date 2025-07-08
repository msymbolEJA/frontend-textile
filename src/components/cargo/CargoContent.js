import React, { useEffect, useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import ContactMailIcon from "@material-ui/icons/ContactMail";
import { getData } from "../../helper/PostData";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "rgb(100, 149, 237)",
    color: theme.palette.common.black,
    cursor: "pointer",
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

const useStyles = makeStyles({
  table: {
    //width: "500px",
  },
  root: {
    margin: "1.5%",
    minWidth: "500px",
    width: "97%",
  },
  header: {
    marginBottom: "1rem",
  },
});

export default function CustomizedTables({ match }) {
  const classes = useStyles();
  const [cargoList, setCargoList] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");

  const isSwetterStore = process.env.REACT_APP_STORE_NAME === "SWETTER";

  const handleSort = (property) => {
    if (!isSwetterStore) return; // Sadece SWETTER'da sıralama aktif
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedCargoList = isSwetterStore
    ? [...cargoList].sort((a, b) => {
        if (!orderBy) return 0;
        if (a[orderBy] === null) return 1;
        if (b[orderBy] === null) return -1;
        if (a[orderBy] === b[orderBy]) return 0;
        return order === "asc"
          ? a[orderBy].toString().localeCompare(b[orderBy].toString())
          : b[orderBy].toString().localeCompare(a[orderBy].toString());
      })
    : cargoList; // Diğer mağazalarda sıralama YOK

  const handleSendTrackingCode = (rowId) => {
    rowId &&
      getData(`${BASE_URL}dhl/send_tracking_code_by_one/${rowId}/`)
        .then((res) => {})
        .catch((err) => {
          console.log({ err });
        });
  };

  useEffect(() => {
    if (match?.params?.id) {
      getData(`${BASE_URL}etsy/shipment/?id=${match.params.id}`).then(
        (response) => {
          setCargoList(response.data);
        }
      );
    }
  }, [match?.params?.id]);

  const handleUpdateStatus = () => {
    match?.params?.id &&
      getData(
        `${BASE_URL}dhl/checking_order_status_update/${match?.params?.id}/`
      )
        .then((res) => {
          getData(`${BASE_URL}etsy/shipment/?id=${match.params.id}`).then(
            (response) => {
              setCargoList(response.data);
            }
          );
        })
        .catch((err) => {
          console.log({ err });
        });
  };

  return (
    <TableContainer component={Paper} className={classes.root}>
      <Typography className={classes.header} variant="h3">
        Cargo Content
      </Typography>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center" onClick={() => handleSort("id")}>
              ORDER ID {isSwetterStore && orderBy === "id" ? (order === "asc" ? "▲" : "▼") : ""}
            </StyledTableCell>
            <StyledTableCell align="center" onClick={() => handleSort("receipt_id")}>
              RECEIPT ID {isSwetterStore && orderBy === "receipt_id" ? (order === "asc" ? "▲" : "▼") : ""}
            </StyledTableCell>
            {isSwetterStore && (
              <StyledTableCell align="center" onClick={() => handleSort("store")}>
                STORE {orderBy === "store" ? (order === "asc" ? "▲" : "▼") : ""}
              </StyledTableCell>
            )}
            <StyledTableCell align="center" onClick={() => handleSort("name")}>
              CUSTOMER {isSwetterStore && orderBy === "name" ? (order === "asc" ? "▲" : "▼") : ""}
            </StyledTableCell>
            <StyledTableCell align="center">ITEM INDEX</StyledTableCell>
            <StyledTableCell align="center" onClick={() => handleSort("type")}>
              TYPE {isSwetterStore && orderBy === "type" ? (order === "asc" ? "▲" : "▼") : ""}
            </StyledTableCell>
            <StyledTableCell align="center" onClick={() => handleSort("status")}>
              STATUS {isSwetterStore && orderBy === "status" ? (order === "asc" ? "▲" : "▼") : ""}
              <br /> <button onClick={handleUpdateStatus}>Update</button>
            </StyledTableCell>
            <StyledTableCell align="center" onClick={() => handleSort("is_label")}>
              HAS LABEL? {isSwetterStore && orderBy === "is_label" ? (order === "asc" ? "▲" : "▼") : ""}
            </StyledTableCell>
            <StyledTableCell align="center" onClick={() => handleSort("tracking_code")}>
              TRACKING ID {isSwetterStore && orderBy === "tracking_code" ? (order === "asc" ? "▲" : "▼") : ""}
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedCargoList.length
            ? sortedCargoList.map((row, i) => (
                <StyledTableRow
                  key={i}
                  style={{
                    background: row?.type?.includes("14K") ? "gold" : "inherit",
                  }}
                >
                  <StyledTableCell align="center" component="th" scope="row">
                    <a href={`/order-details/${row.id}`}>{row.id}</a>
                  </StyledTableCell>
                  <StyledTableCell align="center">{row?.receipt_id}</StyledTableCell>
                  {isSwetterStore && (
                    <StyledTableCell align="center">{row?.store}</StyledTableCell>
                  )}
                  <StyledTableCell align="center">{row?.name}</StyledTableCell>
                  <StyledTableCell align="center">{row?.item_index}</StyledTableCell>
                  <StyledTableCell align="center">{row?.type}</StyledTableCell>
                  <StyledTableCell align="center">{row?.status}</StyledTableCell>
                  <StyledTableCell align="center">
                    {row?.is_label ? (
                      <a
                        href={`${BASE_URL}media/dhl/shipments/${match.params.id}/${row.id}.pdf`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View
                      </a>
                    ) : !row?.is_address_valid ? (
                      <ContactMailIcon style={{ color: "red" }} />
                    ) : row?.is_valid_shipment_method && row?.is_valid_type ? (
                      "-"
                    ) : (
                      "N/A"
                    )}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row?.tracking_code}
                    {row.tracking_code ? (
                      <button onClick={() => handleSendTrackingCode(row.id)}>Send</button>
                    ) : null}
                  </StyledTableCell>
                </StyledTableRow>
              ))
            : null}
        </TableBody>
      </Table>
    </TableContainer>
  );
}