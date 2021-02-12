import React, { useState, useEffect, useCallback, useRef } from "react";

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  Paper,
  TablePagination,
  TableContainer,
  Checkbox,
  TextField,
} from "@material-ui/core";

import CustomButtonGroup from "./CustomButtonGroup";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import TablePaginationActions from "./TablePaginationActions";
import CustomTableCell from "./CustomTableCell";
import { tagsData, nonAdminTagsData } from "../../../helper/Constants";
import { getData, putData, getAllPdf } from "../../../helper/PostData";
import { useHistory } from "react-router-dom";
import CargoPage from "../../otheritems/CargoPage";
import BarcodeInput from "../../otheritems/BarcodeInput";
import ViewImageFile from "./ViewImageFile";
import { toastErrorNotify } from "../../otheritems/ToastNotify";
import { BASE_URL, BASE_URL_MAPPING } from "../../../helper/Constants";
import { getQueryParams } from "../../../helper/getQueryParams";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#001a33",
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

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
  },
  container: {
    // maxHeight: "83vh",
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
  print: {
    marginTop: "1rem",
    marginBottom: "0.5rem",
  },
}));

const localUser = localStorage.getItem("localUser");

let firstStatu;
if (
  localUser === "admin" ||
  localUser === "shop_manager" ||
  localUser === "shop_packer"
) {
  firstStatu = "pending";
} else {
  firstStatu = "awaiting";
}

function AllOrdersTable() {
  const [rows, setRows] = useState([]);
  const filters = getQueryParams();
  const barcodeInputRef = useRef();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(250);
  const classes = useStyles();
  const [count, setCount] = useState(0);
  const [selectedTag, setSelectedTag] = useState(filters?.status || "pending");
  const [printFlag, setPrintFlag] = useState(false);
  const [printError, setPrintError] = useState(false);
  const [isStatuReady, setIsStatuReady] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState();
  const [url, setUrl] = useState(
    `${BASE_URL}etsy/orders/?status=${firstStatu}`
  );
  const history = useHistory();
  const [allPdf, setAllPdf] = useState();
  const [refreshTable, setRefreshTable] = useState(false);

  const getListFunc = useCallback(() => {
    if (filters?.status === "shipped") {
      filters.ordering = "-last_updated";
    }
    getData(
      `${BASE_URL_MAPPING}?${
        filters?.status ? `status=${filters?.status}` : ""
      }&is_repeat=${filters?.is_repeat}&is_followup=${
        filters?.is_followup
      }&ordering=${filters?.ordering}&limit=${rowsPerPage}&offset=${
        filters?.offset
      }`
    )
      .then((response) => {
        // setRows(response.data);
        setRows(response.data.results);

        // setCount(response.data.length);
        setCount(response.data.count);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, [
    filters?.is_followup,
    filters?.is_repeat,
    filters?.offset,
    filters?.ordering,
    filters?.status,
    rowsPerPage,
  ]);

  useEffect(() => {
    getListFunc();
  }, [
    filters.ordering,
    filters.is_followup,
    filters.status,
    filters.is_repeat,
    filters.limit,
    filters.offset,
    refreshTable,
    getListFunc,
  ]);

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

  const handleTagChange = useCallback(
    (e) => {
      const statu = e.currentTarget.id;
      setSelectedTag(statu);
      let newUrl = "";
      switch (statu) {
        case "all_orders":
          newUrl += `limit=${rowsPerPage}&offset=${page * rowsPerPage}`;
          break;
        case "repeat":
          newUrl += `is_repeat=true&limit=${rowsPerPage}&offset=${
            page * rowsPerPage
          }`; //&limit=${rowsPerPage}&offset=${page * rowsPerPage}
          break;
        case "followUp":
          newUrl += `is_followup=true&limit=${rowsPerPage}&offset=${
            page * rowsPerPage
          }`; //&limit=${rowsPerPage}&offset=${page * rowsPerPage}
          break;
        default:
          newUrl += `status=${statu}&limit=${rowsPerPage}&offset=${
            page * rowsPerPage
          }`; //&limit=${rowsPerPage}&offset=${page * rowsPerPage}
          break;
      }
      history.push(`/all-orders?&${newUrl}`);
      setPage(0);
    },
    [history, page, rowsPerPage]
  );

  const getAllPdfFunc = () => {
    getAllPdf(`${BASE_URL}etsy/all_pdf/`)
      .then((response) => {
        setAllPdf(response.data.a);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const printHandler = () => {
    const data = "";
    getData(`${BASE_URL}etsy/print_all/`, data)
      .then((data) => {
        // Open pdf after get
        const link = document.createElement("a");
        link.href = `${data.data.url}`;
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setPrintError(false);
      })
      .catch(({ response }) => {
        console.log(response.data.Failed);
        setPrintError(response.data.Failed);
      })
      .finally(() => {
        setUrl(`${BASE_URL}etsy/orders/?status=awaiting`);
        getAllPdfFunc();
        getListFunc();
      });
  };

  const changeOrderStatus = (id, status) => {
    putData(`${BASE_URL_MAPPING}${id}/`, { status })
      .then((response) => {
        getData(url);
        setRefreshTable(!refreshTable);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (barcodeInput) checkOrderIfInProgress(barcodeInput);
    // eslint-disable-next-line
  }, [barcodeInput]);

  const checkOrderIfInProgress = async (id) => {
    let isInProgress = false;
    const url = `${BASE_URL_MAPPING}${id}/`;
    try {
      const res = await getData(url);
      isInProgress = res?.data?.status === "in_progress";
      if (selectedTag === "shipped") {
        changeOrderStatus(id, "shipped");
      } else if (isInProgress) {
        changeOrderStatus(id, "ready");
      } else {
        toastErrorNotify(`Current status: ${res?.data?.status}`.toUpperCase());
      }
    } catch (error) {
      toastErrorNotify(error?.response?.data?.detail || error?.message);
    } finally {
      barcodeInputRef.current.value = null;
    }

    return isInProgress;
  };

  const handleBarcodeInputKeyDown = (e) => {
    if (e.keyCode === 13) setBarcodeInput(barcodeInputRef.current.value);
  };

  const handleRowClick = useCallback(
    (id) => {
      history.push({
        pathname: `/order-details/${id}`,
      });
    },
    [history]
  );

  const handleScan = useCallback((data) => {
    setBarcodeInput(data);
    barcodeInputRef.current.value = data;
  }, []);

  const handleError = useCallback((err) => {
    console.error(err);
  }, []);

  const AllTable = React.memo(
    () => (
      <TableContainer className={classes.container}>
        <Table
          className={classes.table}
          stickyHeader
          aria-label="sticky table"
          size="small"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">
                Receipt Id / Id / Index
              </StyledTableCell>
              <StyledTableCell align="center">Created TSZ</StyledTableCell>
              <StyledTableCell align="center">Buyer</StyledTableCell>
              <StyledTableCell align="center">Supplier</StyledTableCell>
              <StyledTableCell align="center">Status</StyledTableCell>
              <StyledTableCell align="center">Type</StyledTableCell>
              <StyledTableCell align="center">Length</StyledTableCell>
              <StyledTableCell align="center">Color</StyledTableCell>
              <StyledTableCell align="center">Quantity</StyledTableCell>
              <StyledTableCell align="center">Size</StyledTableCell>
              <StyledTableCell align="center">Start</StyledTableCell>
              <StyledTableCell align="center">Space</StyledTableCell>
              <StyledTableCell align="center">Explanation</StyledTableCell>
              <StyledTableCell align="center">Image</StyledTableCell>
              <StyledTableCell align="center">Note</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.map((row) => (
              <StyledTableRow
                className={classes.rowStyle}
                key={row.id}
                id={row.id}
                onClick={() => handleRowClick(row.id)}
                style={{
                  backgroundColor:
                    row["type"]?.includes("14K") ||
                    row["explanation"]?.includes("14K")
                      ? "#ffef8a"
                      : null,
                }}
              >
                <CustomTableCell
                  {...{
                    row,
                    name2: "receipt",
                    name: "id",
                    name3: "item_index",
                    name4: "is_repeat",
                  }}
                />
                <CustomTableCell {...{ row, name: "creation_tsz" }} />
                <CustomTableCell {...{ row, name: "buyer" }} />
                <CustomTableCell {...{ row, name: "supplier" }} />
                <CustomTableCell {...{ row, name: "status" }} />
                <CustomTableCell {...{ row, name: "type" }} />
                <CustomTableCell {...{ row, name: "length" }} />
                <CustomTableCell {...{ row, name: "color" }} />
                <CustomTableCell {...{ row, name: "qty" }} />
                <CustomTableCell {...{ row, name: "size" }} />
                <CustomTableCell {...{ row, name: "start" }} />
                <CustomTableCell {...{ row, name: "space" }} />
                <CustomTableCell {...{ row, name: "explanation" }} />
                <td style={{ padding: 0, borderBottom: "1px solid #e0e0e0" }}>
                  {row?.image ? (
                    <ViewImageFile {...{ row, name: "image" }} />
                  ) : (
                    <p>No File</p>
                  )}
                </td>
                <CustomTableCell {...{ row, name: "note" }} />
              </StyledTableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <td>Total Record :</td>
              <td>{count || 0}</td>
              <TablePagination
                rowsPerPageOptions={[25, 50, 100, 250, 500]}
                colSpan={22}
                count={count}
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
    ),
    []
  );
  return (
    <div>
      <Paper className={classes.root}>
        <CustomButtonGroup
          selectedTag={selectedTag}
          handleTagChange={handleTagChange}
          tagsData={tagsData}
          nonAdminTagsData={nonAdminTagsData}
        />
        {selectedTag === "ready" ? (
          <div>
            <BarcodeInput onError={handleError} onScan={handleScan} />
            <p>Barcode: {barcodeInput || "No result"}</p>
          </div>
        ) : null}
        {selectedTag === "shipped" ? (
          <div>
            <BarcodeInput onError={handleError} onScan={handleScan} />
            <p>Barcode: {barcodeInput || "No result"}</p>
          </div>
        ) : null}
        {selectedTag === "ready" || selectedTag === "shipped" ? (
          <div className={classes.print}>
            <TextField
              label="Barcode"
              inputRef={barcodeInputRef}
              id="outlined-size-small"
              variant="outlined"
              size="small"
              onKeyDown={handleBarcodeInputKeyDown}
            />
          </div>
        ) : null}
        <AllTable />
        {printError ? <h1>{printError}</h1> : null}
        {printFlag & printFlag ? (
          <>
            <Button
              variant="contained"
              color="primary"
              className={classes.print}
              onClick={printHandler}
            >
              Print
            </Button>
            <h2>Labels</h2>
            {allPdf ? (
              allPdf?.map((pdf, index) => (
                <div key={`${index}${pdf}`}>
                  <a
                    href={`${BASE_URL}media/pdf/bulk/${pdf}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {pdf}
                  </a>
                </div>
              ))
            ) : (
              <h2>Dont have any label!</h2>
            )}
          </>
        ) : null}
      </Paper>
      {isStatuReady ? (
        <CargoPage
          getListFunc={getListFunc}
          setRefreshTable={setRefreshTable}
        />
      ) : null}
    </div>
  );
}

export default AllOrdersTable;
