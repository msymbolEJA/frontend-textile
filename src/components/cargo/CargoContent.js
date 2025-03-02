import React, { useEffect, useState, useContext } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { AppContext } from "../../context/Context";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { getData } from "../../helper/PostData";
import Typography from "@material-ui/core/Typography";
import ContactMailIcon from "@material-ui/icons/ContactMail";
const BASE_URL = process.env.REACT_APP_BASE_URL;

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "rgb(100, 149, 237)",
    color: theme.palette.common.black,
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
  const handleSendTrackingCode = (rowId) => {
    rowId &&
      getData(`${BASE_URL}dhl/send_tracking_code_by_one/${rowId}/`)
        .then((res) => {})
        .catch((err) => {
          console.log({ err });
        });
  };
  useEffect(() => {
    if (match?.params?.id)
      getData(`${BASE_URL}etsy/shipment/?id=${match.params.id}`).then(
        (response) => {
          setCargoList(response.data);
        }
      );
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
            <StyledTableCell align="center">ORDER ID</StyledTableCell>
            <StyledTableCell align="center">RECEIPT ID</StyledTableCell>
            {process.env.REACT_APP_STORE_NAME === "SWETTER" && <StyledTableCell align="center">STORE</StyledTableCell>}
            
            <StyledTableCell align="center">CUSTOMER</StyledTableCell>
            <StyledTableCell align="center">ITEM INDEX</StyledTableCell>
            <StyledTableCell align="center">TYPE</StyledTableCell>
            <StyledTableCell align="center">
              STATUS
              <br /> <button onClick={handleUpdateStatus}>Update</button>
            </StyledTableCell>
            <StyledTableCell align="center">HAS LABEL?</StyledTableCell>
            <StyledTableCell align="center">TRACKING ID</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cargoList.length
            ? cargoList.map((row, i) => (
                <StyledTableRow
                  key={i}
                  style={{
                    background: row?.type?.includes("14K") ? "gold" : "inherit",
                  }}
                >
                  <StyledTableCell align="center" component="th" scope="row">
                    <a href={`/order-details/${row.id}`}>{row.id}</a>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row?.receipt_id}
                  </StyledTableCell>
                   {process.env.REACT_APP_STORE_NAME === "SWETTER" &&  <StyledTableCell align="center">
                    {row?.store}
                  </StyledTableCell>}

                  <StyledTableCell align="center">{row?.name}</StyledTableCell>
                  <StyledTableCell align="center">
                    {row?.item_index}
                  </StyledTableCell>
                  <StyledTableCell align="center">{row?.type}</StyledTableCell>
                  <StyledTableCell align="center">
                    {row?.status}
                  </StyledTableCell>
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
                      <button onClick={() => handleSendTrackingCode(row.id)}>
                        Send
                      </button>
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
