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
import {
  toastErrorNotify,
  toastSuccessNotify,
} from "../otheritems/ToastNotify";
import TextField from "@material-ui/core/TextField";
import { globalSearch } from "../../helper/PostData";
import { FormattedMessage, useIntl } from "react-intl";

const BELKY_STOCK_BASE_URL = process.env.REACT_APP_BELKY_STOCK_BASE_URL;

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
    minHeight: "250px",
    marginTop: 40,
    width: "95%",
  },
  header: {
    marginLeft: "1rem",
    marginTop: "1rem",
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

  const getStoreNames = () => {
    getData(`${BELKY_STOCK_BASE_URL}`)
      .then((res) => {
        console.log(res.data);

        function groupBy(objectArray, property) {
          return objectArray.reduce(function (acc, obj) {
            let key = obj[property].toUpperCase();
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

  // eslint-disable-next-line
  const getListFunc = () => {
    getData(
      `${BELKY_STOCK_BASE_URL}?store=${store}&limit=${rowsPerPage}&offset=${
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
  };

  useEffect(() => {
    getStoreNames();
    getListFunc();
    // eslint-disable-next-line
  }, [page, rowsPerPage, store]);

  const handleSupplier = (e) => {
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

  const handleRowChange = useCallback(
    (id, data) => {
      putData(`${BELKY_STOCK_BASE_URL}${id}/`, data)
        .then((response) => {})
        .catch((error) => {
          console.log(error);
        })
        .finally(() => getListFunc());
    },
    [getListFunc]
  );

  const handleRowClick = useCallback(
    (id) => {
      const currentRow = stockListArr.find((row) => row.id === id);
      if (currentRow) {
        if (!currentRow.isEditMode) {
          const newRows = stockListArr?.map((row) => {
            return { ...row, isEditMode: row.id === id };
          });
          setStockListArr(newRows);
        }
      }
    },
    [stockListArr]
  );

  const handleRowBlur = useCallback(
    (e, id, item) => {
      let data = {
        [e.target.name]: e.target.defaultValue,
        mapping_id: item.mapping_id,
        store: item.store,
      };
      handleRowChange(id, data);
    },
    [handleRowChange]
  );

  const handleRowKeyDown = useCallback(
    (e, id, item) => {
      if (e.key === "Enter") {
        let data = {
          [e.target.name]: e.target.defaultValue,
          mapping_id: item.mapping_id,
          store: item.store,
        };
        handleRowChange(id, data);
      }
    },
    [handleRowChange]
  );

  const onChange = useCallback(
    (e, row) => {
      if (!previous[row.id]) {
        setPrevious((state) => ({ ...state, [row.id]: row }));
      }
      const value = e.target.value;
      const name = e.target.name;
      const { id } = row;
      const newRows = stockListArr?.map((row) => {
        if (row.id === id) {
          return { ...row, [name]: value };
        }
        return row;
      });
      setStockListArr(newRows);
    },
    [previous, stockListArr]
  );

  const handleNewStock = () => {
    //console.log("HandleNewStock");
    history.push(`/new-stock`);
  };

  const handleDeleteButton = (id) => {
    console.log("HANDLEDELETEBUTTON");
    console.log(id);
    console.log(BELKY_STOCK_BASE_URL + id);
    deleteProduct(`${BELKY_STOCK_BASE_URL}${id}/`)
      .then((response) => {
        console.log(response);
        getListFunc();
        toastSuccessNotify("Deleted Succesfully!");
      })
      .catch((error) => {
        console.log(error);
        toastErrorNotify("Something went wrong!");
      });
  };

  const searchKeyPress = (event) => {
    if (!(searchKey === "") && event.key === "Enter") {
      console.log(searchKey);
      globalSearch(`${BELKY_STOCK_BASE_URL}?search=${searchKey}`)
        .then((response) => {
          console.log(response.data.length);
          console.log(response.data);
          setListCount(response.data.length);
          setStockListArr(response.data);
          //setList(response.data);
        })
        .catch((error) => {
          console.log(error);
          //setList([]);
        });
    }
  };

  return (
    <div className={classes.tableDiv}>
      <TableContainer component={Paper} className={classes.root}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <TextField
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
            onChange={(e) => setSearchKey(e.target.value)}
            onKeyPress={searchKeyPress}
            value={searchKey}
          />
          <Typography className={classes.header} variant="h3">
            <FormattedMessage id="stockList" defaultMessage="Stock List" />
          </Typography>
          <Button
            variant="contained"
            color="primary"
            style={{ margin: "1rem" }}
            onClick={handleNewStock}
          >
            <FormattedMessage id="newStock" defaultMessage="New Stock" />
          </Button>
        </div>
        {isAdmin ? (
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
        ) : null}
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">
                <FormattedMessage id="id" defaultMessage="Id" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage
                  id="nameOfStore"
                  defaultMessage="Name of Store"
                />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="mappingId" defaultMessage="Mapping Id" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="type" defaultMessage="Type" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="length" defaultMessage="Length" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="color" defaultMessage="Color" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage
                  id="explanation"
                  defaultMessage="Explanation"
                />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="delete" defaultMessage="Delete" />
              </StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {!isLoaded ? (
              <tr>
                <td colSpan="7" style={{ display: "table-cell" }}>
                  <CircularProgress style={{ marginTop: "1rem" }} />
                </td>
              </tr>
            ) : !stockListArr?.length ? (
              <tr>
                <td colSpan="7">No Item!</td>
              </tr>
            ) : (
              stockListArr.map((item, index) => {
                return (
                  <StyledTableRow
                    key={index}
                    onClick={(e) => handleRowClick(item.id)}
                    onBlur={(e) => handleRowBlur(e, item.id, item)}
                    onKeyDown={(e) => handleRowKeyDown(e, item.id, item)}
                  >
                    <StyledTableCell align="center">{item.id}</StyledTableCell>
                    <StyledTableCell align="center">
                      {item.store}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {item.mapping_id === 0 ? "-" : item.mapping_id}
                    </StyledTableCell>
                    <EditableTableCell {...{ item, name: "type", onChange }} />
                    <EditableTableCell
                      {...{ item, name: "length", onChange }}
                    />
                    <EditableTableCell {...{ item, name: "color", onChange }} />
                    <EditableTableCell
                      {...{ item, name: "explanation", onChange }}
                    />
                    <td
                      onClick={(event) => {
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
