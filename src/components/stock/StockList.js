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
import CircularProgress from "@material-ui/core/CircularProgress";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import { useHistory } from "react-router-dom";
import { getQueryParams } from "../../helper/getQueryParams";
import TablePaginationActions from "./TablePaginationActions";

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
  header: {},
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
  const [storeNameArr, setStoreNameArr] = useState({});
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [store, setStore] = useState("");
  const [listCount, setListCount] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const classes = useStyles();
  const history = useHistory();

  const filters = getQueryParams();

  const { isAdmin } = useContext(AppContext);

  const getStoreNames = () => {
    getData(`${BASE_URL}etsy/stock/`)
      .then((res) => {
        console.log(res.data);

        function groupBy(objectArray, property) {
          return objectArray.reduce(function (acc, obj) {
            let key = obj[property];
            if (!acc[key]) {
              acc[key] = [];
            }
            acc[key].push(obj);
            return acc;
          }, {});
        }
        console.log(groupBy(res?.data, "store"));
        setStoreNameArr(() => groupBy(res?.data, "store"));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getStoreNames();
    getData(
      `${BASE_URL}etsy/stock/?store=${store}&limit=${rowsPerPage}&offset=${
        page * rowsPerPage
      }`
    )
      .then((res) => {
        setListCount(res.data.count);
        setStockListArr(res.data.results);

        setIsLoaded(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page, rowsPerPage, store]);

  const handleSupplier = (e) => {
    console.log("handleSupplier");
    console.log(e.currentTarget.id);
    setStore(e.currentTarget.id);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    let currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.set("offset", newPage * filters?.limit || 0);
    history.push(history.location.pathname + "?" + currentUrlParams.toString());
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    let rpp = +event.target.value;
    setPage(0);
    let currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.set("limit", rpp || 0);
    history.push(history.location.pathname + "?" + currentUrlParams.toString());
  };

  return (
    <div className={classes.tableDiv}>
      <TableContainer component={Paper} className={classes.root}>
        <Typography className={classes.header} variant="h3">
          Stock List
        </Typography>
        {isAdmin ? (
          <div>
            <Button
              color="secondary"
              className={classes.btn}
              variant="contained"
              id=""
              onClick={handleSupplier}
            >
              ALL ({listCount})
            </Button>
            {Object.keys(storeNameArr).map((key, index) => (
              <Button
                key={index}
                color="secondary"
                className={classes.btn}
                variant="contained"
                id={key}
                onClick={handleSupplier}
              >
                {key}({storeNameArr[key]?.length})
              </Button>
            ))}
          </div>
        ) : null}
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
            ) : !stockListArr?.length ? (
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
          <TableFooter>
            <TableRow>
              <td>Total Record :</td>
              <td>{listCount || 0}</td>
              <TablePagination
                rowsPerPageOptions={[25, 50, 100, 250, 500]}
                colSpan={22}
                count={listCount ? listCount : 0}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: { "aria-label": "rows per page" },
                  native: true,
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
};

export default StockList;
