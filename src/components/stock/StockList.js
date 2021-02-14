import React, { useState, useEffect, useContext } from "react";
import { BASE_URL } from "../../helper/Constants";
import { getData } from "../../helper/PostData";
import TableContainer from "@material-ui/core/TableContainer";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import Paper from "@material-ui/core/Paper";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import { AppContext } from "../../context/Context";
import TableBody from "@material-ui/core/TableBody";
import moment from "moment";
import CircularProgress from "@material-ui/core/CircularProgress";

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
    minHeight: "250px",
    width: "95%",
  },
  header: {
    marginBottom: "1rem",
  },
  btn: {
    margin: "0.3rem",
  },
  tableDiv: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "fit-content",
    minWidth: "fit-content",
  },
});
const StockList = () => {
  const [stockListArr, setStockListArr] = useState([]);
  const [storeNameArr, setStoreNameArr] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const classes = useStyles();

  const { isAdmin } = useContext(AppContext);

  console.log("BASE_URL", BASE_URL);
  useEffect(() => {
    getData(`${BASE_URL}etsy/stock/`)
      .then((res) => {
        console.log(res.data);
        setStockListArr(res.data);
        let storeName = [];
        storeName = res.data.reduce((a, b) => {
          if (!storeName.includes(b.store)) {
            return [...a, b.store];
          }
        }, []);
        const storeNames = storeName.filter(function (item, pos) {
          return storeName.indexOf(item) === pos;
        });
        console.log(storeNames);
        setStoreNameArr(storeNames);
        setIsLoaded(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSupplier = (e) => {
    console.log("handleSupplier");
  };

  return (
    <div className={classes.tableDiv}>
      <TableContainer component={Paper} className={classes.root}>
        {isAdmin ? (
          <div>
            <Button
              color="secondary"
              className={classes.btn}
              variant="contained"
              id="all"
              onClick={handleSupplier}
            >
              ALL
            </Button>
            {storeNameArr?.map((item) => (
              <Button
                key={item}
                color="secondary"
                className={classes.btn}
                variant="contained"
                id="beyazit"
                onClick={handleSupplier}
              >
                {item}
              </Button>
            ))}
          </div>
        ) : null}
        <Typography className={classes.header} variant="h3">
          Stock List
        </Typography>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Id</StyledTableCell>
              <StyledTableCell align="center">Name of Store</StyledTableCell>
              <StyledTableCell align="center">Mappin Id</StyledTableCell>
              <StyledTableCell align="center">Type</StyledTableCell>
              <StyledTableCell align="center">Length</StyledTableCell>
              <StyledTableCell align="center">Color</StyledTableCell>
              <StyledTableCell align="center">Explanation</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {!isLoaded ? (
              <tr>
                <td colSpan="7" style={{ display: "table-cell" }}>
                  <CircularProgress />
                </td>
              </tr>
            ) : !stockListArr.length ? (
              <tr>
                <td colSpan="7">No Item!</td>
              </tr>
            ) : (
              stockListArr.map((item, index) => {
                return (
                  <StyledTableRow key={index}>
                    <StyledTableCell align="center">{item.id}</StyledTableCell>
                    <StyledTableCell align="center">
                      {item.store}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {item.mapping_id}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {item.type}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {item.length}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {item.color}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {item.explanation}
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default StockList;
