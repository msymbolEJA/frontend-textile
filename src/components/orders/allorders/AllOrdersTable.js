import React, { useContext, useEffect, useMemo, useRef, useState } from "react";

import {
  Button,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import FormData from "form-data";
import printJS from "print-js";
import { FormattedMessage, useIntl } from "react-intl";
import { useHistory } from "react-router-dom";
import { AppContext } from "../../../context/Context";
import { isLabelStore, nonAdminTagsData, tagsData } from "../../../helper/Constants";
import { getAllPdf, getData, globalSearch, postData, putData } from "../../../helper/PostData";
import { getQueryParams } from "../../../helper/getQueryParams";
import BarcodeInput from "../../otheritems/BarcodeInput";
import CargoPage from "../../otheritems/CargoPage";
import {
  toastErrorNotify,
  toastSuccessNotify,
  toastWarnNotify,
} from "../../otheritems/ToastNotify";
import EditableTableCell from "../../tableitems/EditableTableCell";
import CustomButtonGroup from "./CustomButtonGroup";
import CustomDialog from "./CustomDialog";
import CustomTableCell from "./CustomTableCell";
import TablePaginationActions from "./TablePaginationActions";
import ViewImageFile from "./ViewImageFile";
import { toast } from "react-toastify";
import WarningIcon from '@material-ui/icons/Warning';

// import { BarcodeDetector, setZXingModuleOverrides } from "barcode-detector/pure";
// import "barcode-detector/side-effects";
// const { BarcodeDetector } = require("barcode-detector/pure");

const BASE_URL = process.env.REACT_APP_BASE_URL;
// const BASE_URL_MAPPING = process.env.REACT_APP_BASE_URL_MAPPING;
const PAGE_ROW_NUMBER = process.env.REACT_APP_PAGE_ROW_NUMBER || 25;
const NON_SKU = process.env.REACT_APP_NON_SKU === "true";

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: props => (props.isLabel ? "#eb6223" : "rgb(100, 149, 237)"),
    color: theme.palette.common.black,
    fontWeight: "bold",
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
      cursor: "pointer",
      //boxShadow: "1px 2px",
      backgroundColor: "#add8e6",
    },
  },
}))(TableRow);

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: 10,
  },
  container: {
    overflowX: "initial",
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
  const [sortedRows, setSortedRows] = useState([]);
  const [currentBarcodeList, setCurrentBarcodeList] = useState(
    JSON.parse(localStorage.getItem(`${localStoragePrefix}-barcode_list`) || "[]"),
  );
  const [currentSiblingList, setCurrentSiblingList] = useState(
    JSON.parse(localStorage.getItem(`${localStoragePrefix}-sibling_list`) || "[]"),
  );

  const [currentLabelList, setCurrentLabelList] = useState(
    JSON.parse(localStorage.getItem(`${localStoragePrefix}-label_list`) || "[]"),
  );
  const [currentLabelSiblingList, setCurrentLabelSiblingList] = useState(
    JSON.parse(localStorage.getItem(`${localStoragePrefix}-label_sibling_list`) || "[]"),
  );
  const [getLabelsLoading, setGetLabelsLoading] = useState(false);


  const isBeyazit =
    (localStorage.getItem("localRole") === "workshop_manager" ||
      !localStorage.getItem("localRole") ||
      localStorage.getItem("localRole") === "null") &&
    !["asya", "umraniye"]?.includes(localStorage.getItem("workshop")?.toLowerCase());
  const [selected, setSelected] = useState([]);
  const [countryFilter, setCountryFilter] = useState("all");
  const { user } = useContext(AppContext);

  const paramsQuery = getQueryParams();
  const filters = { ...paramsQuery, limit: 150, offset: 0, status: paramsQuery?.status };

  const [scannedBarcodes, setScannedBarcodes] = useState([]);
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
  const [url, setUrl] = useState(`${BASE_URL}etsy/orders/?status=${filters?.status}`);
  const history = useHistory();
  const [allPdf, setAllPdf] = useState();
  const [allZip, setAllZip] = useState();

  const [inProgressLoading, setInProgressLoading] = useState(false);


  const [refreshTable, setRefreshTable] = useState(false);
  const [loading, setloading] = useState(false);
  const [searchWord, setSearchWord] = useState("");
  const [dialog, setDialog] = useState({ statu: "", id: "", open: false });
  const [scannedRows, setScannedRows] = useState([]);
  const [scannedRowsCount, setScannedRowsCount] = useState(0);

  const localRole = localStorage.getItem("localRole");

  const [inProggressItems, setInProggressItems] = useState([]);
  const userRole = user?.role || localRole;

  const [lastResponse, setLastResponse] = useState(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  const [printLoading, setPrintLoading] = useState(false)

  const getOrdersInProgress = () => {
    setInProgressLoading(true);

    getData(`${BASE_URL}etsy/orders/?status=in_progress&limit=${2500}&offset=0`)
      .then(response => {
        const o = response?.data?.results?.length ? response?.data?.results : [];
        setInProggressItems(o);
      })
      .catch(error => {
        console.log("error", error);
      })
      .finally(() => {
        setInProgressLoading(false);
      });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!hasScrolledToBottom) {
        const scrollThreshold = 0.7; // Set your threshold (70% in this example)

        const scrollPosition = window.innerHeight + window.scrollY;
        const scrollableHeight = document.body.offsetHeight;
        const scrollableThreshold = scrollableHeight * scrollThreshold;

        if (scrollPosition >= scrollableThreshold && lastResponse?.next) {
          setHasScrolledToBottom(true);
          loadMore(lastResponse.next);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasScrolledToBottom, lastResponse]);

  const [selectedCargo, setSelectedCargo] = useState("usps");

  const handleSelectChange = e => {
    setSelectedCargo(e.target.value);
  };

  const [dimensions, setDimensions] = useState({
    weight: 15.99,
    gr: 453.59,
    height: 1,
    length: 12,
    width: 10,
  });

  const getListFunc = () => {
    setloading(true);
    if (!searchWord) {
      if (filters?.status === "shipped" || filters?.status === "ready") {
        filters.ordering = "-last_updated";
      } else filters.ordering = "-id";

      const url = `${BASE_URL}etsy/orders/?${filters?.status !== "all_orders" && filters?.status !== "repeat"
        ? `status=${filters?.status}`
        : `status=awaiting`
        }&is_followup=${filters?.is_followup}&country_filter=${countryFilter}&ordering=${filters?.ordering
        }&limit=${filters?.limit || 0}&offset=${filters?.offset}`;

      const labelUrl = `${BASE_URL}/etsy/orders/?is_label_ready=true&is_label=false&country_filter=${countryFilter}&ordering=${filters?.ordering
        }&limit=${filters?.limit || 0}&offset=${filters?.offset}`;

      getData(filters?.status === "label" ? labelUrl : url)
        .then(response => {
          const t = response?.data?.results?.length ? response?.data?.results : [];

          setRows(t);
          setCount(response?.data?.count || 0);
          setLastResponse(response?.data);

          setHasScrolledToBottom(false);
        })
        .catch(error => {
          console.log("error", error);
        })
        .finally(() => {
          setloading(false);
        });
    }
  };

  const loadMore = link => {
    setloading(true);

    getData(link)
      .then(response => {
        const t = response?.data?.results?.length ? response?.data?.results : [];

        const copyRows = [...rows];

        const concatted = copyRows.concat(t);

        setRows(concatted);
        setLastResponse(response?.data);

        setHasScrolledToBottom(false);
      })
      .catch(error => {
        console.log("error", error);
      })
      .finally(() => {
        setloading(false);
      });
  };

  const getAllZipFunc = () => {
    getAllPdf(`${BASE_URL}usps/all_zip/`)
      .then(response => {
        setAllZip(response.data.a);
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (filters?.status === "awaiting") getAllPdfFunc();
    if (filters?.status === "label") getAllZipFunc();
    if (filters?.status === "ready" || filters?.status === "label") getOrdersInProgress();
    getListFunc();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.ordering,
    filters.is_followup,
    filters.search,
    filters.is_repeat,
    filters.limit,
    filters.offset,
    refreshTable,
    countryFilter,
    count,
    selectedTag,
  ]);

  const getSiblingsForLabel = async id => {
    const currentOrder = rows.filter(item => item.id.toString() === id)?.[0];
    let currentReceiptId = currentOrder?.receipt_id;
    if (currentOrder?.item_index === "1/1") return null;
    let siblings = [];

    await globalSearch(`${BASE_URL}etsy/mapping/?receipt__receipt_id=${currentReceiptId}`).then(
      response => {
        if (response?.data?.results?.length)
          siblings = response?.data?.results
            .map(item => item.id)
            .filter(item => item.toString() !== id.toString());
        localStorage.setItem(
          `${localStoragePrefix}-label_sibling_list`,
          JSON.stringify([
            ...currentLabelSiblingList,
            {
              id,
              siblings,
            },
          ]),
        );
        setCurrentLabelSiblingList([
          ...currentLabelSiblingList,
          {
            id,
            siblings,
          },
        ]);
      },
    );
  };

  const checkLabel = id => {
    if (!currentLabelList.includes(id)) {
      getData(`${BASE_URL}etsy/orders/${id}/`)
        .then(response => {
          getSiblingsForLabel(id);
          localStorage.setItem(
            `${localStoragePrefix}-label_list`,
            JSON.stringify([...currentLabelList, id]),
          );
          setCurrentLabelList([...currentLabelList, id]);
        })
        .catch(error => {
          console.log("error", error);
        });

      barcodeInputRef.current.value = null;
      setBarcodeInput(null);
    }
  };

  useEffect(() => {
    setSelectedTag(filters?.status);
  }, [filters?.status]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setPage(0);
  };

  const handleTagChange = e => {
    setSearchWord("");
    if (e.currentTarget.id === filters?.status) return;
    setRows([]);
    const statu = e.currentTarget.id || filters?.status;
    setSelectedTag(statu);

    let newUrl = "";
    switch (statu) {
      case "all_orders":
        newUrl += ``;
        break;
      case "repeat":
        newUrl += `?&is_repeat=true`;
        break;
      case "followUp":
        newUrl += `?&is_followup=true`;
        break;
      case "shipped":
        newUrl += `?&status=${statu}&`;
        break;
      default:
        newUrl += `?&status=${statu}`;
        break;
    }
    history.push(`/all-orders${newUrl}`);
    setPage(0);
  };

  const getAllPdfFunc = () => {
    getAllPdf(`${BASE_URL}etsy/all_pdf/`)
      .then(response => {
        setAllPdf(response.data.a);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const printHandler = () => {
    setPrintLoading(true)
    const data = "";
    let urlPrint;
    if (countryFilter === "usa") {
      urlPrint = `${BASE_URL}etsy/print_all/?type=us`;
    } else if (countryFilter === "international") {
      urlPrint = `${BASE_URL}etsy/print_all/?type=int`;
    } else urlPrint = `${BASE_URL}etsy/print_all/`;

    getData(urlPrint, data)
      .then(data => {
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
        setPrintLoading(false)

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

  const changeGoogleSheetReadyStatus = (id, is_ready) => {
    putData(`${BASE_URL}etsy/mapping/${id}/`, { is_ready })
      .then(response => {
        getOrdersInProgress();
        setRefreshTable(!refreshTable);
      })
      .catch(error => {
        console.log("error", error);
        console.log(error.response);
      });
  };
  const changeOrderStatus = (id, status) => {
    putData(`${BASE_URL}etsy/mapping/${id}/`, { status })
      .then(response => {
        const pdfUrl = `${BASE_URL}${response.data[1]}`;
        if (Array.isArray(response.data)) {
          printJS(pdfUrl);
        }
        getData(url);
        setRefreshTable(!refreshTable);
      })
      .catch(error => {
        console.log("error", error);
        console.log(error.response);
      });
  };

  const getSiblings = async id => {
    const ordersInProgressLS = [...inProggressItems];
    const currentOrder =
      ordersInProgressLS?.length > 0
        ? ordersInProgressLS.filter(item => item.id.toString() === id)?.[0]
        : null;
    let currentReceiptId = currentOrder?.receipt_id;
    if (currentOrder?.item_index === "1/1") return null;
    let siblings = [];

    await globalSearch(`${BASE_URL}etsy/mapping/?receipt__receipt_id=${currentReceiptId}`).then(
      response => {
        if (response?.data?.results?.length)
          siblings = response?.data?.results
            .map(item => item.id)
            .filter(item => item.toString() !== id.toString());
        localStorage.setItem(
          `${localStoragePrefix}-sibling_list`,
          JSON.stringify([
            ...currentSiblingList,
            {
              id,
              siblings,
            },
          ]),
        );
        setCurrentSiblingList([
          ...currentSiblingList,
          {
            id,
            siblings,
          },
        ]);
      },
    );
  };

  const checkOrderIfInProgress = id => {
    let isInProgress = false;
    const ordersInProgressLS = [...inProggressItems];
    isInProgress =
      (ordersInProgressLS?.length > 0 &&
        ordersInProgressLS.filter(item => item.id.toString() === id)?.length &&
        !JSON.parse(localStorage.getItem(`${localStoragePrefix}-barcode_list`) || "[]")?.includes(
          id,
        )) ||
      false;
    if (selectedTag === "shipped") {
      changeOrderStatus(id, "shipped");
    } else if (isInProgress) {
      getSiblings(id);
      localStorage.setItem(
        `${localStoragePrefix}-barcode_list`,
        JSON.stringify([
          ...JSON.parse(localStorage.getItem(`${localStoragePrefix}-barcode_list`) || "[]"),
          id,
        ]),
      );
      setCurrentBarcodeList([
        ...JSON.parse(localStorage.getItem(`${localStoragePrefix}-barcode_list`) || "[]"),
        id,
      ]);
    } else {
      getData(`${BASE_URL}etsy/orders/${id}/`)
        .then(response => {
          setDialog({
            ...dialog,
            statu: response?.data?.status,
            id: id,
            open: true,
          });
        })
        .catch(error => {
          console.log("error", error?.response?.data?.detail);
          toastErrorNotify(error?.response?.data?.detail || "Error");
        });
    }
    if (barcodeInputRef.current) {
      barcodeInputRef.current.value = "";
      setBarcodeInput(null);
    }
  };

  useEffect(() => {
    if (barcodeInput) {
      if (filters.status === "ready") checkOrderIfInProgress(barcodeInput);
      else if (filters.status === "label") {
        const { weight, height, length, width } = dimensions;
        getData(`${BASE_URL}etsy/orders/${barcodeInput}/`)
          .then(response => {
            barcodeInputRef.current.value = null;
            setBarcodeInput(null);
            if (response?.data?.error) toast.error(response?.data?.error || "Error");
            let updatedData = {
              is_label_ready: true,
              is_label: false,
              weight: Number(weight),
              height: Number(height),
              length: Number(length),
              width: Number(width),
            };
            handleRowChange(barcodeInput, updatedData, true);

          })
          .catch(error => {
            console.log("error", error);
            toast.error(error?.response?.data?.error || "Error - Order not found with this id: " + barcodeInput);
          });
      }
    }
    // eslint-disable-next-line
  }, [barcodeInput]);

  const handleClearLabelList = () => {
    localStorage.setItem(`${localStoragePrefix}-label_list`, "");
    setCurrentLabelList([]);
  };

  const handleClearBarcodeList = () => {
    localStorage.setItem(`${localStoragePrefix}-barcode_list`, "");
    setCurrentBarcodeList([]);
  };

  const removeItemfromBarcodeList = id => {
    const fb = JSON.parse(
      localStorage.getItem(`${localStoragePrefix}-barcode_list`) || "[]",
    ).filter(i => i !== id.toString());
    localStorage.setItem(`${localStoragePrefix}-barcode_list`, JSON.stringify(fb));
    setCurrentBarcodeList(fb);
  };

  const removeItemfromLabelList = id => {
    const fb = currentLabelList.filter(i => i !== id.toString());
    localStorage.setItem(`${localStoragePrefix}-label_list`, JSON.stringify(fb));
    setCurrentLabelList(fb);
  };

  const handleSaveScanned = () => {
    postData(`${BASE_URL}etsy/approved_all_ready/`, {
      ids: JSON.parse(localStorage.getItem(`${localStoragePrefix}-barcode_list`) || "[]"),
    })
      .then(res => {
        toastSuccessNotify("Saved!");

        localStorage.setItem(`${localStoragePrefix}-barcode_list`, []);
        localStorage.setItem(`${localStoragePrefix}-sibling_list`, []);

        setCurrentBarcodeList([]);
        setCurrentSiblingList([]);
      })
      .catch(({ response }) => {
        console.log("response", response);
        getOrdersInProgress();
      })
      .finally(() => {
        getOrdersInProgress();
        getAllPdfFunc();
        getListFunc();
      });
  };

  useEffect(() => {
    setDialog({ ...dialog, open: dialog?.id ? true : false });
  }, [dialog?.id]);

  const handleDialogClose = () => {
    setDialog({ ...dialog, open: false, id: "", statu: "" });
  };

  const handleScan = data => {
    setBarcodeInput(data);
    if (barcodeInputRef.current) barcodeInputRef.current.value = data;
  };

  const handleBarcodeInputKeyDown = e => {
    if (e.keyCode === 13)
      setBarcodeInput(barcodeInputRef.current ? barcodeInputRef.current.value : "");
  };

  // const handleRowClick = (id) => {
  //   history.push({
  //     pathname: `/order-details/${id}`,
  //   });
  // };

  const handleRowChange = (id, data) => {
    if (!data) return;
    if (
      rows?.filter(item => item.id === id)?.[0]?.[Object.keys(data)[0]] === Object.values(data)[0]
    )
      return;
    putData(`${BASE_URL}etsy/mapping/${id}/`, data)
      .then(response => { })
      .catch(error => {
        console.log(error);
        toastErrorNotify(error?.response?.data?.error || "Error, Please try again after refresh the page");
      })
      .finally(() => {
        if (filters?.search) {
          history.push(`/all-orders?search=${filters?.search}`);
        }
        setloading(false);
        setRefreshTable(!refreshTable);
      });
  };
  const onChange = (e, id, name) => {
    if (!rows?.length || !name || !e?.target?.innerText) return;
    if (rows?.filter(item => item.id === id)?.[0]?.[name] === e.target.innerText) return;
    handleRowChange(id, { [name]: e.target.innerText });
  };

  useEffect(() => {
    if (filters?.search) {
      globalSearch(
        `${BASE_URL}etsy/mapping/?search=${filters?.search}&limit=${25}&offset=${page * 25}`,
      )
        .then(response => {
          setRows(response.data.results);
          setCount(response?.data?.count || 0);
        })
        .catch(error => {
          console.log(error);
          setRows([]);
        });
    }
    // eslint-disable-next-line
  }, [filters?.search, refreshTable]);

  const searchHandler = (value, keyCode) => {
    if (keyCode === 13 && value) {
      history.push(`/all-orders?search=${value}`);
    }
  };

  const handleError = err => {
    console.error(err);
  };

  const removeFunc = id => {
    changeOrderStatus(id, "in_progress");
    getOrdersInProgress();
  };

  const removeFuncLabel = id => {
    handleRowChange(id, { is_label_ready: false });

    setTimeout(() => {
      getListFunc();
    }, 500);
  };

  const handleLabelUpload = e => {
    e.stopPropagation();
    let fs = e.target.files[0];
    setIsUploadingFile(true);

    var data = new FormData();
    data.append("file", fs);

    let path = `${BASE_URL}etsy/UploadShipment/`;
    postData(path, data)
      .then(res => {
        console.log(res);
        toastSuccessNotify("Success uploading file");
      })
      .catch(err => {
        console.log(err.response);
        toastErrorNotify("Error uploading file");
      })
      .finally(() => {
        getListFunc();
        setIsUploadingFile(false);
      });
  };

  const handleCheckBoxClick = id => {
    let tempArr;
    if (selected?.includes(id)) {
      tempArr = selected.filter(item => id?.toString() !== item?.toString());
      setSelected(tempArr);
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleSelectAllClick = () => {
    const tempArr = [];
    if (!selected?.length) {
      rows.forEach(row => {
        tempArr.push(row.id);
      });
    }
    setSelected(tempArr);
  };

  const sortByGiftMessages = () => {
    let tmp;
    if (rows.length > 0) {
      try {
        if (rows[0].gift_message > rows[rows.length - 1].gift_message) {
          tmp = rows.sort((a, b) => (a.gift_message > b.gift_message ? 1 : -1));
        } else {
          tmp = rows.sort((a, b) => (a.gift_message < b.gift_message ? 1 : -1));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setSortedRows([...tmp]);
      }
    }
  };

  const AllTable = React.memo(
    () => (
      <TableContainer className={NON_SKU ? classes.container : ""}>
        <Table className={classes.table} stickyHeader aria-label="sticky table" size="small">
          <TableHead>
            <TableRow>
              {filters?.status === "ready" ? (
                <StyledTableCell align="center" isLabel={filters?.status === "label"}>
                  <Checkbox
                    indeterminate={selected?.length > 0 && selected?.length < rows?.length}
                    checked={rows?.length > 0 && selected?.length === rows?.length}
                    style={{ color: "white" }}
                    onChange={handleSelectAllClick}
                  />
                </StyledTableCell>
              ) : null}
              <StyledTableCell align="center" isLabel={filters?.status === "label"}>
                <FormattedMessage id="receiptId" defaultMessage="Receipt Id" /> /
                <FormattedMessage id="id" defaultMessage="Id" /> /
                <FormattedMessage id="index" defaultMessage="Index" />
              </StyledTableCell>
              <StyledTableCell align="center" isLabel={filters?.status === "label"}>
                <FormattedMessage id="createdTSZ" defaultMessage="Created" />
                {" / "}
                <FormattedMessage id="ready_date" defaultMessage="Approval Date" />
              </StyledTableCell>

              <StyledTableCell align="center" isLabel={filters?.status === "label"}>
                <FormattedMessage id="stationStatus" defaultMessage="Station Status" />
              </StyledTableCell>


              {isLabelStore && filters?.status === "ready" ? <StyledTableCell align="center" isLabel={filters?.status === "label"}>
                <FormattedMessage id="needLabel" defaultMessage="Need Label?" />
              </StyledTableCell> : null}

              {userRole !== "workshop_designer" && userRole !== "workshop_designer2" && (
                <StyledTableCell align="center" isLabel={filters?.status === "label"}>
                  <FormattedMessage id="buyer" defaultMessage="Buyer" />
                </StyledTableCell>
              )}
              {/*                   <StyledTableCell align="center" isLabel={filters?.status === "label"}>
                    <FormattedMessage id="supplier" defaultMessage="Supplier" />
                  </StyledTableCell> */}

              {/*               <StyledTableCell align="center" isLabel={filters?.status === "label"}>
                <FormattedMessage id="status" defaultMessage="Status" />
              </StyledTableCell> */}
              {NON_SKU ? (
                <>
                  <StyledTableCell align="center" isLabel={filters?.status === "label"}>
                    <FormattedMessage id="type" defaultMessage="Type" />
                  </StyledTableCell>
                  <StyledTableCell align="center" isLabel={filters?.status === "label"}>
                    <FormattedMessage id="size" defaultMessage="Size" />
                  </StyledTableCell>
                  <StyledTableCell align="center" isLabel={filters?.status === "label"}>
                    <FormattedMessage id="color" defaultMessage="Color" />
                  </StyledTableCell>

                  {userRole !== "workshop_manager" ? (
                    <StyledTableCell align="center" isLabel={filters?.status === "label"}>
                      <FormattedMessage id="explanationMod" defaultMessage="Mod-Explanation" />{" "}
                    </StyledTableCell>
                  ) : null}
                </>
              ) : (
                <>
                  <StyledTableCell align="center" isLabel={filters?.status === "label"}>
                    <FormattedMessage id="type" defaultMessage="Type" />
                  </StyledTableCell>
                  {userRole !== "workshop_designer" && userRole !== "workshop_designer2" && (
                    <StyledTableCell align="center" isLabel={filters?.status === "label"}>
                      <FormattedMessage id="var1" />
                    </StyledTableCell>
                  )}
                  {userRole !== "workshop_designer" && userRole !== "workshop_designer2" && (
                    <StyledTableCell align="center" isLabel={filters?.status === "label"}>
                      <FormattedMessage id="var2" />
                    </StyledTableCell>
                  )}
                  {userRole !== "workshop_designer" && userRole !== "workshop_designer2" && (
                    <StyledTableCell align="center" isLabel={filters?.status === "label"}>
                      <FormattedMessage id="var3" />
                    </StyledTableCell>
                  )}
                  <StyledTableCell align="center" isLabel={filters?.status === "label"}>
                    <FormattedMessage id="var4" />
                  </StyledTableCell>
                  {userRole !== "workshop_designer" && userRole !== "workshop_designer2" && (
                    <StyledTableCell align="center" isLabel={filters?.status === "label"}>
                      <FormattedMessage id="var5" />
                    </StyledTableCell>
                  )}

                  {userRole !== "workshop_designer" && userRole !== "workshop_designer2" && (
                    <StyledTableCell align="center" isLabel={filters?.status === "label"}>
                      <FormattedMessage id="var6" />
                    </StyledTableCell>
                  )}
                  {/*          <StyledTableCell align="center" isLabel={filters?.status === "label"}>
                    <FormattedMessage id="goldGr" />
                  </StyledTableCell> */}
                </>
              )}
              <StyledTableCell align="center" isLabel={filters?.status === "label"}>
                <FormattedMessage id="explanation" defaultMessage="Explanation" />
              </StyledTableCell>
              {selectedTag === "in_progress" &&
                (process.env.REACT_APP_STORE_NAME_ORJ === "Linenia" ||
                  process.env.REACT_APP_STORE_NAME_ORJ === "Uludag" ||
                  process.env.REACT_APP_STORE_NAME_ORJ === "ShinyCustomized" ||
                  process.env.REACT_APP_STORE_NAME_ORJ === "LinenByMN" ||
                  process.env.REACT_APP_STORE_NAME_ORJ === "myra" ||
                  process.env.REACT_APP_STORE_NAME_ORJ === "DALLAS") ? (
                <StyledTableCell align="center" isLabel={filters?.status === "label"}>
                  <FormattedMessage id="showInGoogleSheet" defaultMessage="Google Sheet?" />
                </StyledTableCell>
              ) : null}
              {!isBeyazit &&
                process.env.REACT_APP_STORE_NAME !== "Mina" &&
                process.env.REACT_APP_STORE_NAME !== "Linen Serisi" &&
                process.env.REACT_APP_STORE_NAME !== "Uludag" &&
                userRole !== "workshop_designer" &&
                userRole !== "workshop_designer2" && (
                  <StyledTableCell
                    align="center" isLabel={filters?.status === "label"}
                    onClick={() => sortByGiftMessages()}
                    style={{ cursor: "pointer" }}
                  >
                    <FormattedMessage id="giftMessage" defaultMessage="Gift Message" />
                  </StyledTableCell>
                )}

              {localRole === "workshop_istasyon_a" ||
                localRole === "workshop_istasyon_b" ||
                localRole === "workshop_istasyon_c" ? null : (
                <>
                  <StyledTableCell align="center" isLabel={filters?.status === "label"}>
                    <FormattedMessage id="image" defaultMessage="Image" />
                  </StyledTableCell>
                  {selectedTag === "ready" ? (
                    <StyledTableCell align="center" isLabel={filters?.status === "label"}>
                      <FormattedMessage id="remove" defaultMessage="Remove" />
                    </StyledTableCell>
                  ) : null}
                </>
              )}
            </TableRow>
          </TableHead>
          {rows?.length || scannedRows?.length ? (
            <TableBody>
              {(localRole === "workshop_istasyon_a" ||
                localRole === "workshop_istasyon_b" ||
                localRole === "workshop_istasyon_c"
                ? scannedRows
                : rows
              ).map(row => (
                <StyledTableRow
                  className={classes.rowStyle}
                  key={row.id}
                  id={row.id}
                  // onClick={() => handleRowClick(row.id)}
                  style={{
                    backgroundColor:
                      process.env.REACT_APP_STORE_NAME === "Yildiz Serisi"
                        ? !["209", "79", "US", "CA"]?.includes(row["country_id"]) &&
                          row["shop"] === "Shopify"
                          ? "#dad0d4"
                          : row["type"]?.includes("14K") || row["explanation"]?.includes("14K")
                            ? "#ffef8a"
                            : null
                        : row["type"]?.includes("14K") || row["explanation"]?.includes("14K")
                          ? "#ffef8a"
                          : null,
                  }}
                >
                  {filters?.status === "ready" ? (
                    <td
                      onClick={e => {
                        e.stopPropagation();
                        handleCheckBoxClick(row?.id);
                      }}
                      onBlur={e => {
                        e.stopPropagation();
                      }}
                      onChange={e => {
                        e.stopPropagation();
                      }}
                    >
                      <Checkbox checked={selected?.includes(row?.id)} />
                    </td>
                  ) : null}

                  <CustomTableCell
                    {...{
                      row,
                      name2: "receipt_id",
                      name: "id",
                      name3: "item_index",
                      name4: "is_repeat",
                    }}
                  />
                  <CustomTableCell
                    {...{
                      row,
                      name: "creation_tsz",
                      name5: "ready_date",
                      style: { width: 140, maxWidth: 140 },
                    }}
                  />

                  <td>
                    <div
                      style={{
                        display: "flex",
                        gap: 3,
                        padding: "0 10px",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <FormattedMessage id="cutting" defaultMessage="Cutting" />
                      <Checkbox disabled checked={row?.station_1} />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 3,
                        padding: "0 10px",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <FormattedMessage id="sewing" defaultMessage="Sewing" />
                      <Checkbox disabled checked={row?.station_2} />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 3,
                        padding: "0 10px",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <FormattedMessage id="package" defaultMessage="Package" />
                      <Checkbox disabled checked={row?.station_3} />
                    </div>
                  </td>

                  {isLabelStore && filters?.status === "ready" ? <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {row?.is_need_shipping_label && <WarningIcon style={{ color: "red" }} />}
                  </div> : null}
                  {/*   <CustomTableCell {...{ row, name: "ready_date" }} /> */}

                  {userRole !== "workshop_designer" && userRole !== "workshop_designer2" && (
                    <CustomTableCell {...{ row, name: "buyer" }} />
                  )}
                  {/*   <CustomTableCell {...{ row, name: "supplier" }} /> */}

                  {/*    <CustomTableCell {...{ row, name: "status" }} /> */}
                  {NON_SKU ? (
                    <>
                      <CustomTableCell style={{ fontWeight: "bold" }} {...{ row, name: "sku" }} />
                      <CustomTableCell
                        style={{ fontWeight: "bold" }}
                        {...{
                          row,
                          name:
                            row["sku"] === "Linen_Pillow"
                              ? "variation_2_value"
                              : "variation_1_value",
                        }}
                      />
                      <CustomTableCell
                        style={{ fontWeight: "bold" }}
                        {...{
                          row,
                          name:
                            row["sku"] === "Linen_Pillow"
                              ? "variation_1_value"
                              : "variation_2_value",
                        }}
                      />
                      {userRole !== "workshop_manager" ? (
                        <EditableTableCell
                          onClick={e => e.stopPropagation()}
                          {...{
                            row,
                            name: "explanation_mod",
                            onChange,
                            minWidth: 250,
                          }}
                        />
                      ) : null}
                    </>
                  ) : (
                    <>
                      <CustomTableCell {...{ row, name: "type" }} />
                      {/* This wil change with shopify */}
                      {userRole !== "workshop_designer" && userRole !== "workshop_designer2" && (
                        <CustomTableCell {...{ row, name: "length" }} />
                      )}
                      {userRole !== "workshop_designer" && userRole !== "workshop_designer2" && (
                        <CustomTableCell {...{ row, name: "color" }} />
                      )}
                      {userRole !== "workshop_designer" && userRole !== "workshop_designer2" && (
                        <CustomTableCell {...{ row, name: "qty" }} />
                      )}
                      <CustomTableCell {...{ row, name: "size" }} />
                      {userRole !== "workshop_designer" && userRole !== "workshop_designer2" && (
                        <CustomTableCell {...{ row, name: "start" }} />
                      )}
                      {/* --------------------------- */}
                      {userRole !== "workshop_designer" && userRole !== "workshop_designer2" && (
                        <CustomTableCell {...{ row, name: "space" }} />
                      )}
                      {/*   <EditableTableCell
                        onClick={(e) => e.stopPropagation()}
                        {...{
                          row,
                          name: "goldGr",
                          onChange,
                          from: "all-orders",
                        }}
                      /> */}
                    </>
                  )}
                  <EditableTableCell
                    onClick={e => e.stopPropagation()}
                    {...{
                      row,
                      name: "explanation",
                      onChange,
                      from: "all-orders",
                      minWidth: 250,
                    }}
                  />
                  {selectedTag === "in_progress" &&
                    (process.env.REACT_APP_STORE_NAME_ORJ === "Linenia" ||
                      process.env.REACT_APP_STORE_NAME_ORJ === "Uludag" ||
                      process.env.REACT_APP_STORE_NAME_ORJ === "ShinyCustomized" ||
                      process.env.REACT_APP_STORE_NAME_ORJ === "LinenByMN" ||
                      process.env.REACT_APP_STORE_NAME_ORJ === "myra" ||
                      process.env.REACT_APP_STORE_NAME_ORJ === "DALLAS") ? (
                    <td
                      style={{
                        padding: 10,
                      }}
                      onClick={e => {
                        e.stopPropagation();
                      }}
                      onBlur={e => {
                        e.stopPropagation();
                      }}
                      onChange={e => {
                        e.stopPropagation();
                      }}
                    >
                      <Checkbox
                        checked={row.is_ready}
                        onChange={e => changeGoogleSheetReadyStatus(row.id, e.target.checked)}
                        color="primary"
                      />
                    </td>
                  ) : null}
                  {!isBeyazit &&
                    process.env.REACT_APP_STORE_NAME !== "Mina" &&
                    process.env.REACT_APP_STORE_NAME !== "Linen Serisi" &&
                    process.env.REACT_APP_STORE_NAME !== "Uludag" &&
                    userRole !== "workshop_designer" &&
                    userRole !== "workshop_designer2" && (
                      <CustomTableCell
                        onClick={e => {
                          e.stopPropagation();
                        }}
                        onBlur={e => {
                          e.stopPropagation();
                        }}
                        onChange={e => {
                          e.stopPropagation();
                        }}
                        {...{
                          row,
                          name: "gift_message",
                          style: { minWidth: NON_SKU ? 240 : 150 },
                        }}
                      />
                    )}

                  {localRole === "workshop_istasyon_a" ||
                    localRole === "workshop_istasyon_b" ||
                    localRole === "workshop_istasyon_c" ? null : (
                    <>
                      <td style={{ padding: 10, borderBottom: "1px solid #e0e0e0" }}>
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
                            onClick={e => {
                              e.stopPropagation();
                              removeFunc(row.id);
                            }}
                            size="small"
                          >
                            <FormattedMessage id="remove" defaultMessage="Remove" />
                          </Button>
                        </td>
                      ) : null}


                      {selectedTag === "label" ? (
                        <td>
                          <Button
                            variant="contained"
                            color="secondary"
                            className={classes.print}
                            onClick={e => {
                              e.stopPropagation();
                              removeFuncLabel(row.id);
                            }}
                            size="small"
                          >
                            <FormattedMessage id="remove" defaultMessage="Remove" />
                          </Button>
                        </td>
                      ) : null}
                    </>
                  )}
                </StyledTableRow>
              ))}
            </TableBody>
          ) : null}
          <TableFooter>
            <TableRow>
              <td>
                <FormattedMessage id="totalRecord" defaultMessage="Total Record" />:
              </td>
              <td>
                {localRole === "workshop_istasyon_a" ||
                  localRole === "workshop_istasyon_b" ||
                  localRole === "workshop_istasyon_c"
                  ? scannedRowsCount
                  : count}
              </td>
              <TablePagination
                rowsPerPageOptions={[150]}
                colSpan={22}
                count={loading || inProgressLoading ? 0 :
                  localRole === "workshop_istasyon_a" ||
                    localRole === "workshop_istasyon_b" ||
                    localRole === "workshop_istasyon_c"
                    ? scannedRowsCount
                    : count
                }
                rowsPerPage={
                  loading || inProgressLoading ? 150 :
                    localRole === "workshop_istasyon_a" ||
                      localRole === "workshop_istasyon_b" ||
                      localRole === "workshop_istasyon_c"
                      ? scannedRowsCount
                      : count
                }
                page={1}
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
    [selected, rows],
  );
  const videoRef = useRef();
  const canvasRef = useRef();
  const isMounted = useRef(false);

  const handleSendScanned = async id => {
    getData(`${BASE_URL}etsy/scanned_order/${id}/`)
      .then(response => {
        if (response?.data?.message || response?.data?.success) {
          toastWarnNotify(response?.data?.message || response?.data?.success);
        } else {
          toastSuccessNotify("Item is scanned successfully");

          setScannedRows(prevRows => {
            const updatedRows = [...prevRows, ...response?.data];
            return updatedRows;
          });

          setScannedRowsCount(prev => prev + response?.data?.length);
        }
      })
      .catch(error => {
        console.log("error", error);
        toastErrorNotify(error?.response?.data?.error || "Scanning item is unsuccessfully");
      });
  };

  useEffect(() => {
    if (canvasRef.current) {
      isMounted.current = true;
      const startVideo = async () => {
        const startFrontCamera = async () => {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              video: { width: 1280, height: 720 },
            });
            const capturer = new ImageCapture(
              stream.getVideoTracks()[stream.getVideoTracks()?.length - 1],
            );
            captureFrame(capturer);
          } catch (error) {
            alert("Error accessing media devices.", error);
          }
        };

        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 1280, height: 720, facingMode: { exact: "environment" } },
          });
          const capturer = new ImageCapture(
            stream.getVideoTracks()[stream.getVideoTracks()?.length - 1],
          );
          captureFrame(capturer);
        } catch (error) {
          startFrontCamera();
        }
      };

      const captureFrame = async capturer => {
        try {
          const bitmap = await capturer.grabFrame();
          const ctx = canvasRef.current.getContext("2d");
          ctx.drawImage(
            bitmap,
            0,
            0,
            bitmap.width,
            bitmap.height,
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height,
          );

          const barcodeDetector = new window.BarcodeDetector({ formats: ["ean_13", "code_128"] });
          const barcodes = await barcodeDetector.detect(bitmap);

          if (barcodes?.length) {
            setScannedBarcodes(prevBarcodes => {
              const newBarcodes = barcodes.reduce((acc, b) => {
                if (!prevBarcodes?.includes(b.rawValue)) {
                  acc.push(b.rawValue);
                  handleSendScanned(b.rawValue);
                }
                return acc;
              }, []);
              const updatedBarcodes = [...prevBarcodes, ...newBarcodes];
              return updatedBarcodes;
            });
          }

          if (isMounted.current) {
            requestAnimationFrame(() => captureFrame(capturer));
          }
        } catch (error) {
          console.error("Error during frame capture or barcode detection.", error);
          if (isMounted.current) {
            requestAnimationFrame(() => captureFrame(capturer));
          }
        }
      };

      startVideo();

      return () => {
        isMounted.current = false;
      };
    }
  }, []);

  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const renderBarcode = useMemo(() => {
    return (
      <>
        <video ref={videoRef} autoPlay muted hidden />
        <canvas
          ref={canvasRef}
          width={screenSize.width > 1280 ? 1280 / 2 : 1280 / 4}
          height={screenSize.width > 1280 ? 720 / 2 : 720 / 4}
        />
        <div>Scanned Barcodes: {scannedBarcodes?.join("-")}</div>
      </>
    );
  }, [scannedBarcodes, screenSize.width]);

  const handleSaveBarcodes = () => {
    postData(`${BASE_URL}usps/approved_is_ready_label/`, { ids: currentLabelList })
      .then(res => {
        localStorage.setItem(`${localStoragePrefix}-label_list`, []);
        localStorage.setItem(`${localStoragePrefix}-label_sibling_list`, []);

        setCurrentLabelList([]);
        setCurrentLabelSiblingList([]);

        console.log(res?.data);
      })
      .catch(({ response }) => {
        console.log("response", response);
      })
      .finally(() => {
        getListFunc();
      });
  };

  const handleGetLabels = () => {
    setGetLabelsLoading(true);
    postData(`${BASE_URL}usps/createBulkLabel_cargo/?carrier=${selectedCargo || "usps"}`, {
      ids: rows?.map(item => item?.id),
    })
      .then(res => {
        toastSuccessNotify("Successfully created labels!");
        console.log(res?.data);
        window.open(res?.data.zip_url, "_blank");
      })
      .catch(({ response }) => {
        console.log("response", response);
      })
      .finally(() => {
        getOrdersInProgress();
        getAllZipFunc();
        getListFunc();
        setGetLabelsLoading(false);
      });
  };

  const handleGetMissingLabels = () => {
    setGetLabelsLoading(true);
    getData(`${BASE_URL}usps/find_missing_label/`)
      .then(res => {
        console.log(res?.data);
        // window.open(res?.data.zip_url, "_blank");
        if (res?.data?.difference?.length) {
          getOrdersInProgress();
          getAllZipFunc();
          getListFunc();
        }
      })
      .catch(({ response }) => {
        console.log("response", response);
      })
      .finally(() => {
        setGetLabelsLoading(false);
      });
  };

  const cargo = [
    {
      label: "USPS",
      value: "usps",
    },
    {
      label: "DHL",
      value: "dhl_ecommerce",
    },
  ];


  const handleDimensionChange = e => {
    setDimensions({
      ...dimensions,
      [e.target.name]: e.target?.value,
      ...((process.env.REACT_APP_STORE_NAME === "Linen Serisi" || process.env.REACT_APP_STORE_NAME === "Uludag") && e.target.name === "gr" && { weight: parseFloat(e.target?.value) / 28.3495 }),
      ...((process.env.REACT_APP_STORE_NAME === "Linen Serisi" || process.env.REACT_APP_STORE_NAME === "Uludag") && e.target.name === "weight" && { gr: parseFloat(e.target?.value) * 28.3495 })
    });
  };


  return (
    <>
      <div>
        <Paper className={classes.root}>
          {localRole === "workshop_istasyon_a" ||
            localRole === "workshop_istasyon_b" ||
            localRole === "workshop_istasyon_c" ? null : (
            <CustomButtonGroup
              selectedTag={filters?.status}
              handleTagChange={handleTagChange}
              tagsData={tagsData}
              nonAdminTagsData={nonAdminTagsData}
              searchHandler={searchHandler}
              loading={loading || inProgressLoading}
            />
          )}

          {localRole === "workshop_istasyon_a" ||
            localRole === "workshop_istasyon_b" ||
            localRole === "workshop_istasyon_c" ? (
            <>
              {renderBarcode}
              <h3>{barcodeInput}</h3>
            </>
          ) : selectedTag === "ready" || selectedTag === "shipped" ? (
            <div className={classes.barcodeBox}>
              <div style={{ marginRight: "0.5rem" }}>
                {!loading && !inProgressLoading ? (
                  <BarcodeInput onError={handleError} onScan={handleScan} />
                ) : null}                <p>
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
                  disabled={loading || inProgressLoading}

                />
              </div>
            </div>
          ) : null}

          <div
            style={{
              display:
                (filters?.status === "ready") &&
                  localRole !== "workshop_istasyon_a" &&
                  localRole !== "workshop_istasyon_b" &&
                  localRole !== "workshop_istasyon_c"
                  ? "block"
                  : "none",
            }}
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
              {filters?.status === "label" ? currentLabelList?.length : currentBarcodeList?.length}

            </div>
            <div style={{ display: "flex", textAlign: "left" }}>
              <div style={{ display: "inline-block", marginLeft: 16 }}>
                <p style={{ margin: 0 }}>
                  <FormattedMessage
                    id={filters?.status === "label" ? "lastScannedLabel" : "lastScannedOrder"}
                  />
                </p>
                <Button color="primary" onClick={
                  filters?.status === "label" ? handleClearLabelList : handleClearBarcodeList
                }>
                  <FormattedMessage id="clear" />
                </Button>
              </div>
              <div style={{ display: "inline-flex", flexWrap: "wrap" }}>
                {(filters?.status === "label" ? currentLabelList : currentBarcodeList)?.length
                  ? (filters?.status === "label" ? currentLabelList : currentBarcodeList)?.map(
                    item => (
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
                        onClick={() =>
                          filters?.status === "label"
                            ? removeItemfromLabelList(item)
                            : removeItemfromBarcodeList(item)
                        }
                      >
                        {item}
                        {(filters?.status === "label"
                          ? currentLabelSiblingList
                          : currentSiblingList
                        )
                          .filter(cs => cs?.id?.toString() === item?.toString())
                          .map(s =>
                            s.siblings.map((m, index) => (
                              <span
                                style={{
                                  color: "black",
                                  fontStyle: "italic",
                                  fontSize: "0.8rem",
                                }}
                              >
                                {`-${m}`}
                              </span>
                            )),
                          )}
                      </p>
                    ),
                  )
                  : null}
              </div>
            </div>
            {filters?.status === "ready" ? (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={handleSaveScanned}
                disabled={loading || inProgressLoading}
              >
                <FormattedMessage id="saveScanned" />
              </Button>
            ) : (
              <Button
                type="submit"
                variant="contained"
                // color="primary"
                style={{
                  backgroundColor: "#eb6223",
                  color: "#fff",
                }}
                className={classes.submit}
                onClick={handleSaveBarcodes}
                disabled={loading || inProgressLoading}
              >
                <FormattedMessage id="saveLabels" defaultMessage="Save Labels" />
              </Button>
            )}
          </div>

          {selectedTag === "label" ? (
            <>
              <hr />
              <div className={classes.barcodeBox}>
                <div style={{ marginRight: "0.5rem" }}>
                  {!loading ? <BarcodeInput onError={handleError} onScan={handleScan} /> : null}
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
                    disabled={loading || inProgressLoading}
                    inputRef={barcodeInputRef}
                    id="outlined-size-small"
                    variant="outlined"
                    size="small"
                    onKeyDown={handleBarcodeInputKeyDown}

                  />
                </div>
              </div>
              <div
                style={{
                  backgroundColor: "#E0E0E0",
                  width: "min-content",
                  margin: "10px auto",
                  padding: 10,
                  borderRadius: 5,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <p style={{ fontSize: 20 }}>

                  <FormattedMessage id="packageSize" defaultMessage="Package Size" />
                </p>

                {(process.env.REACT_APP_STORE_NAME === "Linen Serisi" || process.env.REACT_APP_STORE_NAME === "Uludag")
                  &&
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 5,
                      marginBottom: 10,
                    }}
                  >
                    <input
                      type="number"
                      value={dimensions.gr}
                      onChange={handleDimensionChange}
                      name="gr"
                      placeholder="Weight"
                    />
                    <b>gr</b>
                  </div>
                }
                
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 5,
                    marginBottom: 10,
                  }}
                >
                  <input
                    type="number"
                    value={dimensions.weight}
                    onChange={handleDimensionChange}
                    name="weight"
                    placeholder="Weight"
                  />
                  <b>oz</b>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}
                >
                  <input
                    type="number"
                    value={dimensions.length}
                    onChange={handleDimensionChange}
                    name="length"
                    placeholder="Length"
                    style={{ width: 42 }}
                  />

                  <input
                    type="number"
                    value={dimensions.width}
                    onChange={handleDimensionChange}
                    name="width"
                    placeholder="Width"
                    style={{ width: 42 }}
                  />

                  <input
                    type="number"
                    value={dimensions.height}
                    onChange={handleDimensionChange}
                    name="height"
                    placeholder="Height"
                    style={{ width: 42 }}
                  />
                  <b>inch</b>
                </div>
              </div>
            </>
          ) : null}


          <hr />
          {selectedTag === "in_progress" &&
            userRole !== "workshop_designer" &&
            userRole !== "workshop_designer2" &&
            process.env.REACT_APP_GOOGLE_SHEET_LINK && (
              <div
                style={{
                  marginRight: "10px",
                  textAlign: "right",
                }}
              >
                <a
                  style={{ fontSize: "1rem", marginTop: "10px" }}
                  href={process.env.REACT_APP_GOOGLE_SHEET_LINK}
                  target="_blank"
                  rel="noreferrer"
                >
                  Order List
                </a>
              </div>
            )}
          <div
            style={{
              display:
                process.env.REACT_APP_STORE_NAME === "Hilal Serisi" ||
                  process.env.REACT_APP_STORE_NAME === "Linen Serisi" ||
                  process.env.REACT_APP_STORE_NAME === "Uludag" ||
                  process.env.REACT_APP_STORE_NAME === "Kadife-1" ||
                  process.env.REACT_APP_STORE_NAME === "SWETTER" ||
                  process.env.REACT_APP_STORE_NAME === "Mina" ||
                  process.env.REACT_APP_STORE_NAME === "Güneş Tekstil"
                  ? "flex"
                  : "none",
              color: "#001A33",
              marginBottom: 16,
              marginLeft: 16,
              fontSize: "2rem",
              justifyContent: "space-between",
            }}
          >
            {localRole !== "workshop_istasyon_a" &&
              localRole !== "workshop_istasyon_b" &&
              localRole !== "workshop_istasyon_c" && filters?.status !== "label" ? (
              <div>
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
                  color={countryFilter === "international" ? "primary" : "default"}
                  className={classes.countryFilter}
                  onClick={() => setCountryFilter("international")}
                >
                  <FormattedMessage id="international" defaultMessage="International" />
                </Button>
              </div>
            ) : null}

        
        
          {selectedTag === "awaiting" &&
            userRole !== "workshop_designer" &&
            userRole !== "workshop_designer2" &&
            process.env.REACT_APP_DAILY_ORDER_LIST_LINK && 
            (
              process.env.REACT_APP_STORE_NAME === "Linen Serisi" ||
              process.env.REACT_APP_STORE_NAME === "Uludag" ||
              process.env.REACT_APP_STORE_NAME === "Kadife-1" ||
              process.env.REACT_APP_STORE_NAME === "SWETTER" ||
              process.env.REACT_APP_STORE_NAME === "Mina"
            ) &&
            (  
            <>
              <hr />
              <div
                style={{
                  marginRight: "10px",
                  textAlign: "right",
                }}
              >
                <a
                  style={{ fontSize: "1rem", marginTop: "10px" }}
                  href={process.env.REACT_APP_DAILY_ORDER_LIST_LINK}
                  target="_blank"
                  rel="noreferrer"
                >
                  Daily Order List
                </a>
              </div>
            </>
            )}
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
              {userRole === "workshop_designer" ||
                userRole === "workshop_designer2" ||
                localRole === "workshop_istasyon_a" ||
                localRole === "workshop_istasyon_b" ||
                localRole === "workshop_istasyon_c" ? null : loading || inProgressLoading ? (
                  <FormattedMessage id="updating" />
                ) : (
                <>
                  <FormattedMessage id="total" defaultMessage="Total" />{" "}
                  <FormattedMessage
                    id={filters?.status || "result"}
                    defaultMessage={filters?.status?.toUpperCase() || "Result".toUpperCase()}
                  />{" "}
                  : {count}
                  {selectedTag === "in_progress" && (
                    <>
                      {" ("}
                      <FormattedMessage id="totalScanned" />:{" "}
                      {JSON.parse(
                        localStorage.getItem(`${localStoragePrefix}-barcode_list`) || "[]",
                      )?.length || 0}
                      {")"}{" "}
                    </>
                  )}
                </>
              )}
            </div>
            {selectedTag === "shipped" ? (
              <>
                <Button color="secondary" onClick={() => uploadLabelRef.current.click()}>
                  <FormattedMessage id={isUploadingFile ? "loading" : "uploadLabel"} />
                </Button>
                <input
                  onChange={e => handleLabelUpload(e)}
                  onClick={event => event.stopPropagation()}
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
        </Paper>
        {printError ? <h1>{printError}</h1> : null}

        {filters?.status === "ready" &&
          localRole !== "workshop_istasyon_a" &&
          localRole !== "workshop_istasyon_b" &&
          localRole !== "workshop_istasyon_c" ? (
          <CargoPage
            getListFunc={getListFunc}
            setRefreshTable={setRefreshTable}
            countryFilter={countryFilter}
            ids={selected}
          />
        ) : null}
        <CustomDialog open={dialog?.open} handleDialogClose={handleDialogClose} dialog={dialog} />
        {filters?.status === "awaiting" ? (
          <>
            <Button
              variant="contained"
              color="primary"
              className={classes.print}
              onClick={printHandler}
              disabled={printLoading}
            >
              <FormattedMessage id="print" defaultMessage="Print" />
            </Button>
            <h1>
              <FormattedMessage id="labels" defaultMessage="Labels" />
            </h1>
            {allPdf ? (
              allPdf?.map((pdf, index) => (
                <div key={`${index}${pdf}`}>
                  <a href={`${BASE_URL}media/pdf/bulk/${pdf}`} target="_blank" rel="noreferrer">
                    {pdf}
                  </a>
                </div>
              ))
            ) : (
              <h2>
                <FormattedMessage id="dontHaveAnyLabel" defaultMessage="Dont have any label!" />
              </h2>
            )}
          </>
        ) : null}

        {filters?.status === "label" ? (
          <>
            <div
              style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                gap: 10,
              }}
            >
              <select value={selectedCargo} onChange={handleSelectChange}>
                {cargo?.map((item, index) => (
                  <option value={item.value} key={index}>
                    {item.label}
                  </option>
                ))}
              </select>

              <Button
                variant="contained"
                color="primary"
                className={classes.print}
                onClick={handleGetLabels}
                disabled={getLabelsLoading}
                style={{
                  backgroundColor: "#eb6223",
                  color: "#fff",
                }}
              >
                {getLabelsLoading ? (
                  "Loading..."
                ) : (
                  <FormattedMessage id="getLabels" defaultMessage="getLabels" />
                )}
              </Button>

              <Button
                variant="contained"
                color="secondary"
                className={classes.print}
                onClick={handleGetMissingLabels}
                disabled={getLabelsLoading}
              >
                {getLabelsLoading ? (
                  "Loading..."
                ) : (
                  <FormattedMessage id="getMissingLabels" defaultMessage="Get Missing Labels" />
                )}
              </Button>
            </div>
            <h1>
              <FormattedMessage id="labels" defaultMessage="Labels" />
            </h1>
            <div style={{ marginBottom: "3rem" }}>
              {allZip ? (
                allZip?.map((pdf, index) => (
                  <div key={`${index}${pdf}`}>
                    <a href={`${BASE_URL}media/easypost/${pdf}`} target="_blank" rel="noreferrer">
                      {pdf}
                    </a>
                  </div>
                ))
              ) : (
                <h2>
                  <FormattedMessage id="dontHaveAnyLabel" defaultMessage="Dont have any label!" />
                </h2>
              )}
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}

export default AllOrdersTable;
