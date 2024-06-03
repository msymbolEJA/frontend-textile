import React, { useState, useEffect, useContext, useCallback } from "react";
import { getData, putData, deleteProduct } from "../../helper/PostData";
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
import EditableTableCell from "./EditableTableCell";
import { toastErrorNotify, toastSuccessNotify } from "../otheritems/ToastNotify";
import TextField from "@material-ui/core/TextField";
import { globalSearch } from "../../helper/PostData";
import { FormattedMessage, useIntl } from "react-intl";
import { statusData } from "../../helper/Constants";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: "rgb(100, 149, 237)",
    color: theme.palette.common.black,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:hover": {
      //cursor: "pointer",
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
    minHeight: "200px",
    marginTop: 40,
    width: "95%",
  },
  header: {
    margin: "1rem auto",
    textAlign: "center",
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
  opt: {
    fontSize: "0.9rem",
    width: "100px",
    backgroundColor: "transparent",
    borderColor: "#E0E0E0",
    marginLeft: 20,
  },
});
const StockList = () => {
  const [stockListArr, setStockListArr] = useState([]);
  const [storeNameArr, setStoreNameArr] = useState({});
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [store, setStore] = useState("");
  const [listCount, setListCount] = useState(0);
  const [previous, setPrevious] = useState({});
  const [page, setPage] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const classes = useStyles();
  const history = useHistory();
  const { formatMessage } = useIntl();

  const filters = getQueryParams();

  const { isAdmin } = useContext(AppContext);

  // const getStoreNames = () => {
  //   getData(`${BASE_URL}etsy/stock_list/`)
  //     .then(res => {
  //       console.log(res.data);

  //       function groupBy(objectArray, property) {
  //         if (!objectArray.length) return () => {};
  //         return objectArray.reduce(function (acc, obj) {
  //           let key = obj[property].toUpperCase();
  //           if (!acc[key]) {
  //             acc[key] = [];
  //           }
  //           acc[key].push(obj);
  //           return acc;
  //         }, {});
  //       }
  //       console.log(groupBy(res?.data, "store"));
  //       setStoreNameArr(() => groupBy(res?.data, "store"));
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // };

  // eslint-disable-next-line
  const getListFunc = () => {
    getData(`${BASE_URL}etsy/stock_list/?limit=${rowsPerPage || 0}&offset=${page * rowsPerPage}`)
      .then(res => {
        setListCount(res?.data?.length);
        setStockListArr([
          {
            id: 30776,
            receipt_id: "3320871932",
            buyer: "Dorothy R. Landoll",
            type: "Linen_Dress_1058",
            variation_1_value: "M US W",
            variation_2_value: "Two Si",
            explanation: "Sara",
            is_stock_used: false,
          },
        ]);

        setIsLoaded(true);
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    // getStoreNames();
    getListFunc();
    // eslint-disable-next-line
  }, [page, rowsPerPage, store]);

  const handleChangePage = (event, newPage) => {
    let currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.set("offset", newPage * filters?.limit || 0);
    history.push(history.location.pathname + "?" + currentUrlParams.toString());
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    let rpp = +event.target.value;
    setPage(0);
    let currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.set("limit", rpp || 0);
    history.push(history.location.pathname + "?" + currentUrlParams.toString());
  };

  const handleRowChange = useCallback((e, data) => {
    putData(`${BASE_URL}etsy/mapping/${data?.id}/`, { status: e.target.value })
      .then(response => {
        const copyRows = [...stockListArr];
        const newRows = copyRows?.filter(item => item?.id != data?.id);
        setStockListArr(newRows);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleDeleteButton = id => {
    deleteProduct(`${BASE_URL}etsy/stock_used/${id}/`)
      .then(response => {
        console.log(response);
        getListFunc();
        toastSuccessNotify("Deleted Succesfully!");
      })
      .catch(error => {
        console.log(error);
        toastErrorNotify("Something went wrong!");
      });
  };

  return (
    <div className={classes.tableDiv}>
      <TableContainer component={Paper} className={classes.root}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/* <TextField
            className={classes.item}
            variant="outlined"
            margin="dense"
            name="globalSearch"
            required
            label={formatMessage({
              id: "search",
              defaultMessage: "Search",
            })}
            type="text"
            id="globalSearch"
            style={{ maxHeight: "30px", margin: "1rem", width: 130 }}
            onChange={e => setSearchKey(e.target.value)}
            onKeyPress={searchKeyPress}
            value={searchKey}
          /> */}
          <Typography className={classes.header} variant="h3">
            <FormattedMessage id="stockList" defaultMessage="Stock List" />
          </Typography>
          {/* <Button
            variant="contained"
            color="primary"
            style={{ margin: "1rem" }}
            onClick={handleNewStock}
          >
            <FormattedMessage id="newStock" defaultMessage="New Stock" />
          </Button> */}
        </div>
        {/* {isAdmin ? (
          <div>
            <Button
              className={classes.btn}
              variant="contained"
              id=""
              onClick={handleSupplier}
              style={{ backgroundColor: "orange" }}
            >
              <FormattedMessage id="all" defaultMessage="ALL" />({listCount})
            </Button>
            {Object.keys(storeNameArr).map((key, index) => (
              <Button
                key={index}
                className={classes.btn}
                variant="contained"
                id={key}
                onClick={handleSupplier}
                style={{ backgroundColor: "orange" }}
              >
                {key}({storeNameArr[key]?.length})
              </Button>
            ))}
          </div>
        ) : null} */}
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">
                <FormattedMessage id="id" defaultMessage="Id" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="receipt_id" defaultMessage="Receipt Id" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="buyer_name" defaultMessage="Buyer Name" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="type" defaultMessage="Type" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="color" defaultMessage="Color" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="size" defaultMessage="size" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="explanation" defaultMessage="Explanation" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="delete" defaultMessage="Delete" /> /
                <FormattedMessage id="update" defaultMessage="Update" />
              </StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {!isLoaded ? null : !stockListArr?.length ? (
              <tr>
                <td colSpan="8">No Item!</td>
              </tr>
            ) : (
              stockListArr.map((item, index) => {
                return (
                  <StyledTableRow
                    key={index}
                    // onClick={e => handleRowClick(item.id)}
                    // onBlur={e => handleRowBlur(e, item.id, item)}
                    // onKeyDown={e => handleRowKeyDown(e, item.id, item)}
                  >
                    <StyledTableCell align="center">
                      <a href={`/order-details/${item?.id}`}>{item?.id}</a>
                    </StyledTableCell>
                    <StyledTableCell align="center">{item?.receipt_id}</StyledTableCell>
                    <StyledTableCell align="center">{item?.buyer}</StyledTableCell>

                    <StyledTableCell align="center">{item?.type}</StyledTableCell>

                    <StyledTableCell align="center">{item?.variation_1_value}</StyledTableCell>
                    <StyledTableCell align="center">{item?.variation_2_value}</StyledTableCell>
                    <StyledTableCell align="center">{item?.explanation}</StyledTableCell>

                    <td
                      onClick={event => {
                        event.stopPropagation();
                      }}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        color="secondary"
                        style={{
                          maxHeight: "30px",
                          marginRight: "0.2rem",
                        }}
                        onClick={() => handleDeleteButton(item.id)}
                      >
                        <FormattedMessage id="delete" defaultMessage="Delete" />
                      </Button>

                      <select
                        // value={row[name]}
                        onChange={e => handleRowChange(e, item)}
                        onClick={e => e.stopPropagation()}
                        className={classes.opt}
                      >
                        <optgroup>
                          {statusData.map((item, index) => (
                            <option key={`${index}+${item}`} value={item}>
                              {formatMessage({
                                id: item === "awaiting" ? "approved" : item,
                                defaultMessage: item === "awaiting" ? "APPROVED" : item,
                              })}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                    </td>
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
                rowsPerPageOptions={[25, 50, 100, 250, 500, 2500]}
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
