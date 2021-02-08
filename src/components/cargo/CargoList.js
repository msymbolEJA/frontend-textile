import React, { useEffect, useState, useContext } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { getData } from "../../helper/PostData";
import moment from "moment";
import Typography from "@material-ui/core/Typography";
import { useHistory } from "react-router-dom";
// import {  BASE_URL} from "../../helper/Constants";
import { AppContext } from "../../context/Context";
import Button from "@material-ui/core/Button";

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
    "&:hover": {
      cursor: "pointer",
      //boxShadow: "1px 2px",
      backgroundColor: "#add8e6",
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    //width: "500px",
  },
  root: {
    margin: "1rem",
    minWidth: "500px",
    width: "95%",
  },
  header: {
    marginBottom: "1rem",
  },
  btn: {
    margin: "0.3rem",
  },
});

export default function CustomizedTables() {
  const classes = useStyles();
  const [cargoList, setCargoList] = useState({});
  const history = useHistory();
  const [getSupplier, setGetSupplier] = useState("");
  const { isAdmin } = useContext(AppContext);
  // console.log(isAdmin);
  // console.log(userRole);
  // console.log("user.workshop", user.workshop);

  useEffect(() => {
    getData(`http://144.202.67.136:8080/etsy/cargo_list/${getSupplier}`).then(
      (response) => {
        console.log(response.data);
        let dataObj = response.data;
        let lastObj = {};
        const formattedData = dataObj
          ? Object.keys(dataObj).map((key) => ({ ...dataObj[key] }))
          : [];

        formattedData.forEach((item) => {
          for (const key in item) {
            lastObj[key] = item[key];
          }
        });
        //console.log(lastObj);
        setCargoList(lastObj);
      }
    );
  }, [getSupplier]);

  const tnFunc = (tn, carrier) => {
    // console.log(tn, carrier.toUpperCase());
    if (carrier.toUpperCase().includes("DHL")) {
      // console.log("DHL");
      return (
        <a
          href={`https://www.dhl.com/en/express/tracking.html?AWB=${tn}&brand=DHL`}
          target="_blank"
          rel="noreferrer"
        >
          {tn}
        </a>
      );
    } else if (carrier.toUpperCase().includes("UPS")) {
      return (
        <a
          href={`https://www.ups.com/track?tracknum=${tn}`}
          target="_blank"
          rel="noreferrer"
        >
          {tn}
        </a>
      );
    } else {
      return tn;
    }
  };

  const handleRowClick = (id) => {
    console.log("HRC", id);
    history.push(`/cargo-content/${id}`);
  };

  const handleSupplier = (e) => {
    console.log(e.currentTarget.id);
    if (e.currentTarget.id) {
      setGetSupplier(`?supplier=${e.currentTarget.id}`);
    } else {
      setGetSupplier("");
    }
  };

  return (
    <TableContainer component={Paper} className={classes.root}>
      {isAdmin ? (
        <div>
          <Button
            variant="contained"
            color="secondary"
            id=""
            onClick={handleSupplier}
            className={classes.btn}
          >
            All
          </Button>
          <Button
            className={classes.btn}
            color="secondary"
            variant="contained"
            id="asya"
            onClick={handleSupplier}
          >
            ASYA
          </Button>
          <Button
            color="secondary"
            className={classes.btn}
            variant="contained"
            id="beyazit"
            onClick={handleSupplier}
          >
            Beyazit
          </Button>
        </div>
      ) : null}
      <Typography className={classes.header} variant="h3">
        Cargo List
      </Typography>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Id</StyledTableCell>
            <StyledTableCell align="center">Reference Number</StyledTableCell>
            <StyledTableCell align="center">Carrier</StyledTableCell>
            <StyledTableCell align="center">Content</StyledTableCell>
            <StyledTableCell align="center">Count</StyledTableCell>
            <StyledTableCell align="center">Shipment Date</StyledTableCell>
            <StyledTableCell align="center">Tracking Number</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(cargoList).length === 0 ? (
            <tr>
              <td colSpan="4">No Item!</td>
            </tr>
          ) : (
            Object.keys(cargoList).map((row, i) => (
              <StyledTableRow
                key={i}
                onClick={() => handleRowClick(cargoList[row].id)}
              >
                <StyledTableCell align="center">
                  {cargoList[row].id}
                </StyledTableCell>
                <StyledTableCell align="center" component="th" scope="row">
                  {row}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {cargoList[row].carrier.toUpperCase()}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {cargoList[row].content.map((key, i) => (
                    <span key={i}>
                      <a
                        href={`/order-details/${key}/`}
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        {key}
                      </a>
                      {" - "}
                      {(i + 1) % 4 === 0 ? <br /> : null}
                    </span>
                  ))}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {cargoList[row].content.length}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {moment(cargoList[row].shipment_date).format(
                    "DD-MM-YY HH:mm"
                  )}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {tnFunc(
                    cargoList[row].tracking_number,
                    cargoList[row].carrier
                  )}
                </StyledTableCell>
              </StyledTableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
