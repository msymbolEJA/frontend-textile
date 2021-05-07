import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from "react";

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
  TextField,
  CircularProgress,
} from "@material-ui/core";
import FormData from "form-data";
import printJS from "print-js";
import { AppContext } from "../../../context/Context";
import { FormattedMessage, useIntl } from "react-intl";
import CustomButtonGroup from "./CustomButtonGroup";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import TablePaginationActions from "./TablePaginationActions";
import CustomTableCell from "./CustomTableCell";
import { tagsData, nonAdminTagsData } from "../../../helper/Constants";
import {
  getData,
  putData,
  getAllPdf,
  postData,
  globalSearch,
} from "../../../helper/PostData";
import { useHistory } from "react-router-dom";
import CargoPage from "../../otheritems/CargoPage";
import BarcodeInput from "../../otheritems/BarcodeInput";
import ViewImageFile from "./ViewImageFile";
import {
  toastErrorNotify,
  toastSuccessNotify,
} from "../../otheritems/ToastNotify";
import { getQueryParams } from "../../../helper/getQueryParams";
import CustomDialog from "./CustomDialog";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const BASE_URL_MAPPING = process.env.REACT_APP_BASE_URL_MAPPING;

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
    marginTop: 10,
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
    marginBottom: theme.spacing(0),
  },
  print: {
    marginTop: "0.5rem",
    marginBottom: "0.5rem",
  },
  countryFilter: {
    marginLeft: "0.5rem",
  },
  barcodeBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const localStoragePrefix = process.env.REACT_APP_STORE_NAME_ORJ;

function AllOrdersTable() {
  const [rows, setRows] = useState([]);
  const [currentBarcodeList, setCurrentBarcodeList] = useState(
    JSON.parse(
      localStorage.getItem(`${localStoragePrefix}-barcode_list`) || "[]"
    )
  );

  const [countryFilter, setCountryFilter] = useState("all");
  const { user } = useContext(AppContext);
  const filters = getQueryParams();
  const barcodeInputRef = useRef();
  const uploadLabelRef = useRef();
  const { formatMessage } = useIntl();
  const [page, setPage] = useState(0);
  const classes = useStyles();
  const [count, setCount] = useState(0);
  const [selectedTag, setSelectedTag] = useState(filters?.status);
  const [printError, setPrintError] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState();
  const [url, setUrl] = useState(
    `${BASE_URL}etsy/orders/?status=${filters?.status}`
  );
  const history = useHistory();
  const [allPdf, setAllPdf] = useState();
  const [refreshTable, setRefreshTable] = useState(false);
  const [loading, setloading] = useState(false);
  const [searchWord, setSearchWord] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [dialogId, setDialogId] = useState(false);

  const localRole = localStorage.getItem("localRole");

  const userRole = user?.role || localRole;

  const getOrdersInProgress = useCallback(() => {
    getData(`${BASE_URL}etsy/get_mapping_update_date/`)
      .then((response) => {
        const l = localStorage.getItem(
          `${localStoragePrefix}-in_progress-2500-0-last_updated`
        );
        if (response.data.last_updated !== l) {
          getData(
            `${BASE_URL}etsy/orders/?status=in_progress&limit=2500&offset=0`
          )
            .then((response) => {
              const o = response?.data?.results?.length
                ? response?.data?.results
                : [];
              localStorage.setItem(
                `${localStoragePrefix}-Belky-in_progress-2500-0`,
                JSON.stringify(o)
              );
              localStorage.setItem(
                `${localStoragePrefix}-in_progress-2500-0-last_updated`,
                response.data.last_updated
              );
              localStorage.setItem(
                `${localStoragePrefix}-in_progress-2500-0-count`,
                response?.data?.results?.length
              );
            })
            .catch((error) => {
              console.log("error", error);
            });
        }
      })
      .catch((error) => {
        console.log("error", error);
      })
      .finally(() => {});
  }, []);

  const getListFunc = useCallback(() => {
    setloading(true);
    if (!searchWord) {
      if (filters?.status === "shipped" || filters?.status === "ready") {
        filters.ordering = "-last_updated";
      } else filters.ordering = "-id";

      getData(
        `${BASE_URL}etsy/orders/?${
          filters?.status ? `status=${filters?.status}` : ""
        }&is_repeat=${filters?.is_repeat}&is_followup=${
          filters?.is_followup
        }&ordering=${filters?.ordering}&limit=${filters?.limit}&offset=${
          filters?.offset
        }`
      )
        .then((response) => {
          const t = response?.data?.results?.length
            ? response?.data?.results
            : [];

          localStorage.setItem(
            `${localStoragePrefix}-${selectedTag}-${filters.limit}-${filters.offset}`,
            JSON.stringify(t)
          );

          localStorage.setItem(
            `${localStoragePrefix}-${selectedTag}-${filters.limit}-${filters.offset}-count`,
            response?.data?.count || 0
          );

          let ft =
            filters?.status === "in_progress"
              ? t.filter((item) => !currentBarcodeList.includes(item.id))
              : t;
          setRows(ft);
        })
        .catch((error) => {
          localStorage.setItem(
            `${localStoragePrefix}-${selectedTag}-${filters.limit}-${filters.offset}-last_updated`,
            null
          );
          console.log("error", error);
        })
        .finally(() => setloading(false));
    }
  }, [currentBarcodeList, filters, searchWord, selectedTag]);

  const getLastUpdateDate = () => {
    getData(`${BASE_URL}etsy/get_mapping_update_date/`)
      .then((response) => {
        const l = localStorage.getItem(
          `${localStoragePrefix}-${selectedTag}-${filters.limit}-${filters.offset}-last_updated`
        );
        if (response.data.last_updated !== l) {
          getListFunc();
          localStorage.setItem(
            `${localStoragePrefix}-${selectedTag}-${filters.limit}-${filters.offset}-last_updated`,
            response.data.last_updated
          );
        }
      })
      .catch((error) => {
        console.log("error", error);
      })
      .finally(() => {});
  };

  useEffect(() => {
    getLastUpdateDate();
    if (filters?.status === "awaiting") getAllPdfFunc();
    if (filters.status === "ready") getOrdersInProgress();
    const tmp =
      JSON.parse(
        localStorage.getItem(
          `${localStoragePrefix}-${selectedTag}-${filters.limit}-${filters.offset}`
        )
      ) ?? [];
    if (!tmp.length) getListFunc();
    else {
      let resultFilteredByCountry = null;
      if (countryFilter !== "all")
        resultFilteredByCountry = tmp.filter((item) =>
          countryFilter === "usa"
            ? item.country_id === "209"
            : item.country_id !== "209"
        );

      let ft =
        filters?.status === "in_progress"
          ? tmp.filter(
              (item) => !currentBarcodeList.includes(item.id.toString())
            )
          : tmp;
      setRows(resultFilteredByCountry ?? ft);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.ordering,
    filters.is_followup,
    filters.status,
    filters.is_repeat,
    filters.limit,
    filters.offset,
    refreshTable,
    countryFilter,
    count,
    selectedTag,
  ]);

  useEffect(() => {
    if (filters?.status) setSelectedTag(filters?.status);
  }, [filters?.status]);

  const handleChangePage = (event, newPage) => {
    let currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.set("offset", newPage * filters?.limit || 0);
    history.push(history.location.pathname + "?" + currentUrlParams.toString());
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    let rpp = +event.target.value;
    setPage(0);
    let currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.set("limit", rpp || 0);
    history.push(history.location.pathname + "?" + currentUrlParams.toString());
  };

  const handleTagChange = (e) => {
    setSearchWord("");
    if (e.currentTarget.id === filters?.status) return;
    setRows([]);
    const statu = e.currentTarget.id || filters?.status;
    setSelectedTag(statu);

    let newUrl = "";
    switch (statu) {
      case "all_orders":
        newUrl += `limit=${25}&offset=${0}`;
        break;
      case "repeat":
        newUrl += `is_repeat=true&limit=${2500}&offset=${0}`; //&limit=${rowsPerPage}&offset=${page * rowsPerPage}
        break;
      case "followUp":
        newUrl += `is_followup=true&limit=${2500}&offset=${0}`; //&limit=${rowsPerPage}&offset=${page * rowsPerPage}
        break;
      case "shipped":
        newUrl += `status=${statu}&limit=${25}&offset=${0}`; //&limit=${rowsPerPage}&offset=${page * rowsPerPage}
        break;
      default:
        newUrl += `status=${statu}&limit=${2500}&offset=${0}`; //&limit=${rowsPerPage}&offset=${page * rowsPerPage}
        break;
    }
    history.push(`/all-orders?&${newUrl}`);
    setPage(0);
  };

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
    let urlPrint;
    if (countryFilter === "usa") {
      urlPrint = `${BASE_URL}etsy/print_all/?type=us`;
    } else if (countryFilter === "int") {
      urlPrint = `${BASE_URL}etsy/print_all/?type=int`;
    } else urlPrint = `${BASE_URL}etsy/print_all/`;

    getData(urlPrint, data)
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

  // const printPdf = function (url) {
  //   var iframe = document.createElement("iframe");
  //   document.body.appendChild(iframe);

  //   iframe.style.display = "none";
  //   iframe.onload = function () {
  //     setTimeout(function () {
  //       iframe.focus();
  //       iframe.contentWindow.print();
  //     }, 1);
  //   };

  //   iframe.src = url;
  // };

  const changeOrderStatus = (id, status) => {
    putData(`${BASE_URL_MAPPING}${id}/`, { status })
      .then((response) => {
        const pdfUrl = `${BASE_URL}${response.data[1]}`;
        console.log("pfdUrl", pdfUrl);
        if (Array.isArray(response.data)) {
          printJS(pdfUrl);
        }
        getData(url);
        setRefreshTable(!refreshTable);
      })
      .catch((error) => {
        console.log("error", error);
        console.log(error.response);
      });
  };

  const checkOrderIfInProgress = async (id) => {
    let isInProgress = false;
    const ordersInProgressLS = JSON.parse(
      localStorage.getItem(`${localStoragePrefix}-in_progress-2500-0`)
    );
    isInProgress =
      (ordersInProgressLS?.length > 0 &&
        ordersInProgressLS.filter((item) => item.id.toString() === id)
          ?.length &&
        !currentBarcodeList.includes(id)) ||
      false;
    if (selectedTag === "shipped") {
      changeOrderStatus(id, "shipped");
    } else if (isInProgress) {
      localStorage.setItem(
        `${localStoragePrefix}-barcode_list`,
        JSON.stringify([...currentBarcodeList, id])
      );
      setCurrentBarcodeList([...currentBarcodeList, id]);
      // changeOrderStatus(id, "ready");
    } else {
      setDialogId(id);
    }
    barcodeInputRef.current.value = null;
    setBarcodeInput(null);
  };

  useEffect(() => {
    if (barcodeInput) checkOrderIfInProgress(barcodeInput);
    // eslint-disable-next-line
  }, [barcodeInput]);

  const handleClearBarcodeList = () => {
    localStorage.setItem(`${localStoragePrefix}-barcode_list`, "");
    setCurrentBarcodeList([]);
  };

  const removeItemfromBarcodeList = (id) => {
    const fb = currentBarcodeList.filter((i) => i !== id.toString());
    localStorage.setItem(
      `${localStoragePrefix}-barcode_list`,
      JSON.stringify(fb)
    );
    setCurrentBarcodeList(fb);
  };

  const handleSaveScanned = () => {
    postData(`${BASE_URL}etsy/approved_all_ready/`, { ids: currentBarcodeList })
      .then((res) => {
        toastSuccessNotify("Saved!");
        /*         localStorage.removeItem(`${localStoragePrefix}-in_progress-2500-0`);
        localStorage.removeItem(
          `${localStoragePrefix}-in_progress-2500-0-last_updated`
        );
        localStorage.removeItem(
          `${localStoragePrefix}-in_progress-2500-0-count`
        ); */
        localStorage.setItem(`${localStoragePrefix}-barcode_list`, []);
        localStorage.removeItem(
          `${localStoragePrefix}-${selectedTag}-${filters.limit}-${filters.offset}`
        );
        localStorage.removeItem(
          `${localStoragePrefix}-${selectedTag}-${filters.limit}-${filters.offset}-count`
        );
        setCurrentBarcodeList([]);
      })
      .catch(({ response }) => {
        console.log("response", response);
      })
      .finally(() => {
        getLastUpdateDate();
      });
  };

  useEffect(() => {
    setDialogOpen(dialogId ? true : false);
  }, [dialogId]);

  const handleDialogClose = () => {
    setDialogId(false);
  };

  const handleScan = useCallback((data) => {
    setBarcodeInput(data);
    barcodeInputRef.current.value = data;
  }, []);

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

  useEffect(() => {
    if (searchWord) {
      globalSearchFunc(searchWord);
    }
    // eslint-disable-next-line
  }, [page, searchWord]);

  const globalSearchFunc = useCallback(
    (searchWord) => {
      globalSearch(
        `${BASE_URL_MAPPING}?search=${searchWord}&limit=${25}&offset=${
          page * 25
        }`
      )
        .then((response) => {
          setRows(response.data.results);
          setCount(response?.data?.count || 0);
          //setList(response.data.results);
          let newUrl = "";
          newUrl += `limit=${25}&offset=${page * 25}`;
          history.push(`/all-orders?&${searchWord}&${newUrl}`);
        })
        .catch((error) => {
          console.log(error);
          setRows([]);
        })
        .finally(() => setloading(false));
    },
    // eslint-disable-next-line
    [page, searchWord]
  );

  const searchHandler = useCallback(
    (e, second) => {
      if (e.keyCode === 13 && !(e.target.value === "")) {
        //setRows(null);
        //setSearchProg(!(e.target.value === ""));

        setSearchWord(e.target.value);
        setPage(0);
        // searchWord = ;
        if (e.target.value) {
          globalSearchFunc(e.target.value);
        }
      } else if (e === 1 && !(second === "")) {
        setSearchWord(second);
        setPage(0);
        // searchWord = ;
        if (second) {
          globalSearchFunc(second);
        }
      }
    },
    // eslint-disable-next-line
    [page]
  );

  const handleError = useCallback((err) => {
    console.error(err);
  }, []);

  const removeFunc = (id) => {
    changeOrderStatus(id, "in_progress");
    getOrdersInProgress();
  };

  const handleLabelUpload = (e) => {
    e.stopPropagation();
    let fs = e.target.files[0];
    setIsUploadingFile(true);

    var data = new FormData();
    data.append("file", fs);

    let path = `${BASE_URL}etsy/UploadShipment/`;
    postData(path, data)
      .then((res) => {
        console.log(res);
        toastSuccessNotify("Success uploading file");
      })
      .catch((err) => {
        console.log(err.response);
        toastErrorNotify("Error uploading file");
      })
      .finally(() => {
        getListFunc();
        setIsUploadingFile(false);
      });
  };

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
                <FormattedMessage id="receiptId" defaultMessage="Receipt Id" />{" "}
                /
                <FormattedMessage id="id" defaultMessage="Id" /> /
                <FormattedMessage id="index" defaultMessage="Index" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage
                  id="createdTSZ"
                  defaultMessage="Created TSZ"
                />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage
                  id="ready_date"
                  defaultMessage="Approval Date"
                />
              </StyledTableCell>
              {userRole === "admin" ||
              userRole === "shop_manager" ||
              userRole === "shop_packer" ? (
                <>
                  <StyledTableCell align="center">
                    <FormattedMessage id="buyer" defaultMessage="Buyer" />
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <FormattedMessage id="supplier" defaultMessage="Supplier" />
                  </StyledTableCell>
                </>
              ) : null}
              <StyledTableCell align="center">
                <FormattedMessage id="status" defaultMessage="Status" />
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
                <FormattedMessage id="quantity" defaultMessage="Quantity" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="size" defaultMessage="Size" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="start" defaultMessage="Start" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="space" defaultMessage="Space" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage
                  id="explanation"
                  defaultMessage="Explanation"
                />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="image" defaultMessage="Image" />
              </StyledTableCell>
              {selectedTag === "ready" ? (
                <StyledTableCell align="center">
                  <FormattedMessage id="remove" defaultMessage="Remove" />
                </StyledTableCell>
              ) : null}
            </TableRow>
          </TableHead>
          {rows?.length ? (
            <TableBody>
              {rows.map((row) => (
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
                      name2: "receipt_id",
                      name: "id",
                      name3: "item_index",
                      name4: "is_repeat",
                    }}
                  />
                  <CustomTableCell {...{ row, name: "creation_tsz" }} />
                  <CustomTableCell {...{ row, name: "ready_date" }} />
                  {userRole === "admin" ||
                  userRole === "shop_manager" ||
                  userRole === "shop_packer" ? (
                    <>
                      <CustomTableCell {...{ row, name: "buyer" }} />
                      <CustomTableCell {...{ row, name: "supplier" }} />
                    </>
                  ) : null}
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
                      <p>
                        <FormattedMessage id="noFile" defaultMessage="-" />
                      </p>
                    )}
                  </td>
                  {selectedTag === "ready" ? (
                    <td>
                      <Button
                        variant="contained"
                        color="secondary"
                        className={classes.print}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFunc(row.id);
                        }}
                        size="small"
                      >
                        <FormattedMessage id="remove" defaultMessage="Remove" />
                      </Button>
                    </td>
                  ) : null}
                </StyledTableRow>
              ))}
            </TableBody>
          ) : !loading ? null : (
            <tbody>
              <tr>
                <td colSpan="15" style={{ display: "table-cell" }}>
                  <CircularProgress style={{ marginTop: "1rem" }} />
                </td>
              </tr>
            </tbody>
          )}
          <TableFooter>
            <TableRow>
              <td>
                <FormattedMessage
                  id="totalRecord"
                  defaultMessage="Total Record"
                />
                :
              </td>
              <td>
                {localStorage.getItem(
                  `${localStoragePrefix}-${selectedTag}-${filters.limit}-${filters.offset}-count`
                ) || 0}
              </td>
              <TablePagination
                rowsPerPageOptions={[25, 50, 100, 250, 500, 2500]}
                colSpan={22}
                count={Number(
                  localStorage.getItem(
                    `${localStoragePrefix}-${selectedTag}-${filters.limit}-${filters.offset}-count`
                  ) || 0
                )}
                rowsPerPage={Number(filters.limit)}
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
          selectedTag={filters?.status}
          handleTagChange={handleTagChange}
          tagsData={tagsData}
          nonAdminTagsData={nonAdminTagsData}
          searchHandler={searchHandler}
        />
        {selectedTag === "ready" || selectedTag === "shipped" ? (
          <div className={classes.barcodeBox}>
            <div style={{ marginRight: "0.5rem" }}>
              <BarcodeInput onError={handleError} onScan={handleScan} />
              <p>
                <FormattedMessage id="barcode" defaultMessage="Barcode" /> :{" "}
                {barcodeInput ||
                  formatMessage({
                    id: "noResult",
                    defaultMessage: "-",
                  })}
              </p>
            </div>
            <div className={classes.print}>
              <TextField
                label={formatMessage({
                  id: "barcode",
                  defaultMessage: "Barcode",
                })}
                inputRef={barcodeInputRef}
                id="outlined-size-small"
                variant="outlined"
                size="small"
                onKeyDown={handleBarcodeInputKeyDown}
              />
            </div>
          </div>
        ) : null}
        <div
          style={{ display: filters?.status === "ready" ? "block" : "none" }}
        >
          <hr />
          <div
            style={{
              display: "flex",
              color: "#001A33",
              marginBottom: 16,
              fontSize: "2rem",
              marginLeft: 16,
            }}
          >
            <FormattedMessage id="totalScanned" />:{" "}
            {currentBarcodeList?.length || 0}
          </div>
          <div style={{ display: "flex", textAlign: "left" }}>
            <div style={{ display: "inline-block", marginLeft: 16 }}>
              <p style={{ margin: 0 }}>
                <FormattedMessage id="lastScannedOrder" />
              </p>
              <Button color="primary" onClick={handleClearBarcodeList}>
                <FormattedMessage id="clear" />
              </Button>
            </div>
            <div style={{ display: "inline-flex", flexWrap: "wrap" }}>
              {currentBarcodeList?.length
                ? currentBarcodeList.map((item) => (
                    <p
                      key={item}
                      style={{
                        border: "1px blue solid",
                        borderRadius: 4,
                        color: "blue",
                        margin: "0 5px",
                        padding: "0 5px",
                        fontWeight: "bold",
                        height: "23px",
                        cursor: "pointer",
                      }}
                      onClick={() => removeItemfromBarcodeList(item)}
                    >
                      {item}
                    </p>
                  ))
                : null}
            </div>
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSaveScanned}
          >
            <FormattedMessage id="saveScanned" />
          </Button>
        </div>
        <hr />

        <div
          style={{
            display:
              process.env.REACT_APP_STORE_NAME === "Hilal Serisi"
                ? "flex"
                : "none",
            color: "#001A33",
            marginBottom: 16,
            marginLeft: 16,
            fontSize: "2rem",
          }}
        >
          <Button
            variant="contained"
            color={countryFilter === "all" ? "primary" : "default"}
            className={classes.countryFilter}
            onClick={() => setCountryFilter("all")}
          >
            <FormattedMessage id="all" defaultMessage="All" />
          </Button>
          <Button
            variant="contained"
            color={countryFilter === "usa" ? "primary" : "default"}
            className={classes.countryFilter}
            onClick={() => setCountryFilter("usa")}
          >
            <FormattedMessage id="usa" defaultMessage="USA" />
          </Button>
          <Button
            variant="contained"
            color={countryFilter === "int" ? "primary" : "default"}
            className={classes.countryFilter}
            onClick={() => setCountryFilter("int")}
          >
            <FormattedMessage id="int" defaultMessage="International" />
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#001A33",
              marginBottom: 16,
              fontSize: "2rem",
              marginLeft: 16,
            }}
          >
            {loading ? (
              <FormattedMessage id="updating" />
            ) : (
              <>
                <FormattedMessage id="total" defaultMessage="Total" />{" "}
                <FormattedMessage
                  id={filters?.status || "result"}
                  defaultMessage={
                    filters?.status?.toUpperCase() || "Result".toUpperCase()
                  }
                />{" "}
                :{" "}
                {rows.length ===
                Number(
                  localStorage.getItem(
                    `${localStoragePrefix}-${selectedTag}-${filters.limit}-${filters.offset}-count`
                  )
                )
                  ? localStorage.getItem(
                      `${localStoragePrefix}-${selectedTag}-${filters.limit}-${filters.offset}-count`
                    ) ?? 0
                  : `${rows.length}/${
                      localStorage.getItem(
                        `${localStoragePrefix}-${selectedTag}-${filters.limit}-${filters.offset}-count`
                      ) ?? 0
                    }`}
              </>
            )}
          </div>
          {filters.status === "shipped" ? (
            <>
              <Button
                color="secondary"
                onClick={() => uploadLabelRef.current.click()}
              >
                <FormattedMessage
                  id={isUploadingFile ? "loading" : "uploadLabel"}
                />
              </Button>
              <input
                onChange={(e) => handleLabelUpload(e)}
                onClick={(event) => event.stopPropagation()}
                id="myInput"
                style={{ display: "none" }}
                type={"file"}
                accept="application/pdf"
                ref={uploadLabelRef}
              />
            </>
          ) : null}
        </div>
        <AllTable />
        {printError ? <h1>{printError}</h1> : null}
        {filters?.status === "awaiting" ? (
          <>
            <Button
              variant="contained"
              color="primary"
              className={classes.print}
              onClick={printHandler}
            >
              <FormattedMessage id="print" defaultMessage="Print" />
            </Button>
            <h1>
              <FormattedMessage id="labels" defaultMessage="Labels" />
            </h1>
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
              <h2>
                <FormattedMessage
                  id="dontHaveAnyLabel"
                  defaultMessage="Dont have any label!"
                />
              </h2>
            )}
          </>
        ) : null}
      </Paper>
      {filters?.status === "ready" ? (
        <CargoPage
          getListFunc={getListFunc}
          setRefreshTable={setRefreshTable}
          countryFilter={countryFilter}
        />
      ) : null}
      <CustomDialog
        open={isDialogOpen}
        id={dialogId}
        handleDialogClose={handleDialogClose}
      />
    </div>
  );
}

export default AllOrdersTable;
