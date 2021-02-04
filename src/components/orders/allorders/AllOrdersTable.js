import React, { useState, useEffect } from "react";
//import axios from "axios";
import CustomButtonGroup from "./CustomButtonGroup";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import TableFooter from "@material-ui/core/TableFooter";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import TablePaginationActions from "./TablePaginationActions";
import CustomTableCell from "./CustomTableCell";
import { tagsData, nonAdminTagsData } from "../../../helper/Constants";
import Button from "@material-ui/core/Button";
import { getData, putData, getAllPdf } from "../../../helper/PostData";
import { useHistory } from "react-router-dom";
import CargoPage from "../../otheritems/CargoPage";
import BarcodeInput from "../../otheritems/BarcodeInput";
import ViewImageFile from "./ViewImageFile";
import TextField from "@material-ui/core/TextField";
import { toastErrorNotify } from "../../otheritems/ToastNotify";

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
    maxHeight: "83vh",
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

function AllOrdersTable() {
  const [rows, setRows] = useState([]);
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [count, setCount] = useState(0);
  const [selectedTag, setSelectedTag] = useState("all orders");
  const [printFlag, setPrintFlag] = useState(false);
  const [printError, setPrintError] = useState(false);
  const [isStatuReady, setIsStatuReady] = useState(false);
  const [barcodeManuelInput, setBarcodeManuelInput] = useState();
  const [barcodeInput, setBarcodeInput] = useState();
  const [url, setUrl] = useState(
    `http://144.202.67.136:8080/etsy/orders/?limit=${rowsPerPage}&offset=${
      page * rowsPerPage
    }`
  );
  const history = useHistory();
  const [globStatu, setglobStatu] = useState("");
  const [allPdf, setAllPdf] = useState();

  const getListFunc = () => {
    getData(url)
      .then((res) => {
        setRows(res.data.results);
        console.log(res.data.results);
        setCount(res.data.count);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //--------------- Get Orders
  //console.log("UED", url);
  useEffect(() => {
    getListFunc();
    // eslint-disable-next-line
  }, [page, rowsPerPage, url]);
  //console.log("data rows : ", rows);
  //------------------------------

  const handleChangePage = (event, newPage) => {
    //console.log(newPage)
    setUrl(
      `http://144.202.67.136:8080/etsy/orders/?status=${globStatu}&limit=${rowsPerPage}&offset=${
        newPage * rowsPerPage
      }`
    );
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    let rpp = +event.target.value;
    setPage(0);
    setUrl(
      `http://144.202.67.136:8080/etsy/orders/?status=${globStatu}&limit=${rpp}&offset=${
        0 * rpp
      }`
    );
  };

  const handleTagChange = (e) => {
    const statu = e.currentTarget.id;
    setSelectedTag(statu);
    setBarcodeInput("");
    //console.log(e.target.innerHTML);
    //console.log(statu);
    if (statu === "all orders") {
      setUrl(
        `http://144.202.67.136:8080/etsy/orders/?limit=${rowsPerPage}&offset=${
          page * rowsPerPage
        }`
      );
      setglobStatu("");
    } else {
      setUrl(
        `http://144.202.67.136:8080/etsy/orders/?status=${statu}&limit=${rowsPerPage}&offset=${
          page * rowsPerPage
        }`
      );
      setglobStatu(statu);
    }
    setPage(0);
    if (statu === "awaiting") {
      setPrintFlag(true);
      //console.log("statu awaiting");
      getAllPdfFunc();
    } else {
      setPrintFlag(false);
      setPrintError(false);
    }
    if (statu === "ready") {
      setIsStatuReady(true);
    } else {
      setIsStatuReady(false);
    }
  };

  const getAllPdfFunc = () => {
    getAllPdf("http://144.202.67.136:8080/etsy/all_pdf/")
      .then((response) => {
        //console.log(response.data.a);
        setAllPdf(response.data.a);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const printHandler = () => {
    const data = "";
    getData("http://144.202.67.136:8080/etsy/print_all/", data)
      .then((data) => {
        //console.log(data);
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
        setUrl(`http://144.202.67.136:8080/etsy/orders/?status=awaiting`);
        getAllPdfFunc();
        getListFunc();
      });
  };

  const changeOrderStatus = (id, status) => {
    putData(`http://144.202.67.136:8080/etsy/mapping/${id}/`, { status })
      .then((response) => {
        setUrl("http://144.202.67.136:8080/etsy/orders/");
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
    const url = `http://144.202.67.136:8080/etsy/mapping/${id}/`;
    try {
      const res = await getData(url);
      isInProgress = res?.data?.status === "in_progress";
      if (isInProgress) {
        changeOrderStatus(id, "ready");
      } else {
        toastErrorNotify(
          `The order is not in progress. Current status is: ${res?.data?.status}`
        );
      }
    } catch (error) {
      toastErrorNotify(error?.response?.data?.detail || error?.message);
    }

    return isInProgress;
  };

  const handleManuelBarcodeInput = (e) => {
    if (e.keyCode === 13) setBarcodeInput(barcodeManuelInput);
  };

  const handleRowClick = (id) => {
    history.push({
      pathname: `/order-details/${id}`,
    });
  };

  const handleScan = (data) => {
    setBarcodeInput(data);
    setBarcodeManuelInput(data);
  };

  const handleError = (err) => {
    console.error(err);
  };

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
              id="outlined-size-small"
              defaultValue=""
              variant="outlined"
              size="small"
              value={barcodeManuelInput}
              onChange={(e) => setBarcodeManuelInput(e.target.value)}
              onKeyDown={handleManuelBarcodeInput}
            />
          </div>
        ) : null}
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
                >
                  <CustomTableCell
                    {...{
                      row,
                      name2: "receipt_id",
                      name: "id",
                      name3: "item_index",
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
                  <td>
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
                  rowsPerPageOptions={[5, 10, 25, 100]}
                  colSpan={22}
                  count={count || 0}
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
                    href={`http://144.202.67.136:8080/media/pdf/bulk/${pdf}`}
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
      {isStatuReady ? <CargoPage getListFunc={getListFunc} /> : null}
    </div>
  );
}

export default AllOrdersTable;
