import React, { useEffect, useState, useContext, useCallback } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { getData, postData } from "../../helper/PostData";
import moment from "moment";
import Typography from "@material-ui/core/Typography";
import { useHistory } from "react-router-dom";
import { AppContext } from "../../context/Context";
import Button from "@material-ui/core/Button";
import { FormattedMessage } from "react-intl";
import EditableTableCell from "./EditableTableCell";
import { putData } from "../../helper/PostData";
import api from "../../helper/api";
import ConfirmDialog from "../otheritems/ConfirmModal";
import { toastSuccessNotify } from "../otheritems/ToastNotify";
import DownloadFile from "@material-ui/icons/GetApp";
import { cyan } from "@material-ui/core/colors";
import { isLabelStore } from "../../helper/Constants";
import WarningIcon from '@material-ui/icons/Warning';
const BASE_URL = process.env.REACT_APP_BASE_URL;

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: "rgb(100, 149, 237)",
    color: theme.palette.common.black,
    fontWeight: "bold",
    fontFamily: "Courier New",
  },
  body: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Courier New",
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

const ColorButton2 = withStyles(theme => ({
  root: {
    backgroundColor: cyan[500],
    whiteSpace: "nowrap",
    color: "#fff",
    "&:hover": {
      backgroundColor: cyan[700],
    },
  },
}))(Button);

const useStyles = makeStyles({
  table: {
    //width: "500px",
  },
  root: {
    margin: "1rem",
    minWidth: "500px",
    width: "98%",
    minHeight: "250px",
  },
  header: {
    marginBottom: "1rem",
  },
  btn: {
    margin: "0.3rem",
  },
  spanHref: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
});

export default function CustomizedTables() {
  const isBeyazit =
    (localStorage.getItem("localRole") === "workshop_manager" ||
      !localStorage.getItem("localRole") ||
      localStorage.getItem("localRole") === "null") &&
    !["asya", "umraniye"].includes(localStorage.getItem("workshop")?.toLowerCase());
  const classes = useStyles();
  const [cargoList, setCargoList] = useState();
  const history = useHistory();
  const [getSupplier, setGetSupplier] = useState("");
  const [selectedItem, setSelectedItem] = useState();
  const { isAdmin, user } = useContext(AppContext);

  let localRole = localStorage.getItem("localRole");

  const userRole = user?.role || localRole;

  const getListFunc = useCallback(() => {
    getData(`${BASE_URL}etsy/cargo_list/${getSupplier}`).then(response => {
      let dataObj = response.data;
      const formattedData = dataObj
        ? Object.keys(dataObj).flatMap(key => {
          return Object.keys(dataObj[key]).map(key2 => ({
            ...dataObj[key][key2],
            refNumber: key2,
            supplier: isBeyazit ? "" : key,
          }));
        })
        : [];
      setCargoList(formattedData.sort((a, b) => b.id - a.id));
    });
  }, [getSupplier]);

  useEffect(() => {
    getListFunc();
    // eslint-disable-next-line
  }, [getSupplier]);

  const tnFunc = (tn, carrier) => {
    if (carrier.toUpperCase().includes("DHL")) {
      return `https://www.dhl.com/en/express/tracking.html?AWB=${tn}&brand=DHL`;
    } else if (carrier.toUpperCase().includes("UPS")) {
      return `https://www.ups.com/track?tracknum=${tn}`;
    } else {
      return tn;
    }
  };

  const handleRowClick = id => {
    history.push(`/cargo-content/${id}`);
  };

  const handleSupplier = e => {
    if (e.currentTarget.id) {
      setGetSupplier(`?supplier=${e.currentTarget.id}`);
    } else {
      setGetSupplier("");
    }
  };

  const handleRowChange = useCallback(
    (id, data) => {
      if (!data) return;
      putData(`${BASE_URL}etsy/shipments/${id}/`, data)
        .then(response => {
          // console.log(response);
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => getListFunc());
    },
    [getListFunc],
  );

  const onChange = (e, id, name) => {
    handleRowChange(id, { [name]: e.target.innerText });
  };

  const handleConfirm = () => {
    const url =
      selectedItem.action === "undo"
        ? `/etsy/undoCargo/${selectedItem?.id}/`
        : selectedItem?.action === "delete"
          ? `/etsy/cancelCargo/${selectedItem?.id}/`
          : selectedItem?.action === "close"
            ? `/usps/bulk_close_orders/${selectedItem?.id}/`
            : null;
    api(url, "get")
      .then(response => {
        toastSuccessNotify(response?.data);
        getListFunc();
      })
      .catch(error => console.log(error))
      .finally(() => setSelectedItem(null));
  };

  const printHandler = id => {
    if (id)
      getData(`${BASE_URL}dhl/createdhlBulkLabel_cargo/${id}/`)
        .then(response => {
          window?.location.reload(false);
        })
        .catch(({ response }) => {
          console.log(response.data.Failed);
        })
        .finally(() => { });
  };

  const handleConfirmModal = (e, id, action) => {
    setSelectedItem({ ...selectedItem, id, action });
  };

  const handleDownload = async row => {
    window.open(
      `${BASE_URL}etsy/generate-excell/?paket_no=${row?.id}&ref_no=${row?.refNumber?.split(" ")?.[0]
      }&items=${row?.content?.map(item => item?.split(",")?.[0])?.join(",")}`,
      "_blank",
    );
  };

  const handleOpen = async row => {
    getData(`${BASE_URL}etsy/shipment_mergent_labels/${row.id}/`)
      .then(response => {
        const newWindow = window.open('', '_blank');
        newWindow.location.href = response.data.merged_pdf_url;
        console.log(response)
      })
      .catch(({ response }) => {
        console.log(response.data.Failed);
      })
      .finally(() => { });
  };

    const handleInvoiceList = async row => {
    getData(`${BASE_URL}etsy/shipment_invoice/${row.id}/`)
      .then(response => {
        const newWindow = window.open('', '_blank');
        newWindow.location.href = response.data.excel_url;
        console.log(response)
      })
      .catch(({ response }) => {
        console.log(response.data.Failed);
      })
      .finally(() => { });
  };

  return (
    <>
      <TableContainer component={Paper} className={classes.root}>
        {/* {isAdmin ? (
          <div>
            <Button
              variant="contained"
              color="secondary"
              id=""
              onClick={handleSupplier}
              className={classes.btn}
            >
              <FormattedMessage id="all" defaultMessage="ALL" />
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
        ) : null} */}
        <Typography className={classes.header} variant="h3">
          <FormattedMessage id="cargoList" defaultMessage="Cargo List" />
        </Typography>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">
                <FormattedMessage id="id" defaultMessage="Id" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="referenceNumber" defaultMessage="Reference Number" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="description" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="carrier" defaultMessage="Carrier" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="content" defaultMessage="Content" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="count" defaultMessage="Count" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="shipmentDate" defaultMessage="Log Date" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="trackingNumber" defaultMessage="Tracking Number" />
              </StyledTableCell>
              {process.env.REACT_APP_IS_DHL_ENABLED === "true" &&
                (userRole === "admin" ||
                  userRole === "shop_manager" ||
                  userRole === "shop_packer") ? (
                <StyledTableCell align="center">
                  <FormattedMessage id="download" defaultMessage="Download" />
                </StyledTableCell>
              ) : null}
              {!isBeyazit && (
                <StyledTableCell align="center">
                  <FormattedMessage id="action" defaultMessage="Action" />
                </StyledTableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {cargoList === undefined ? null : cargoList?.length === 0 ? (
              <tr>
                <td colSpan="50">No Item!</td>
              </tr>
            ) : (
              cargoList.map((row, i) => {
                return (
                  <StyledTableRow key={i}>
                    <StyledTableCell align="center">
                      {row.id}
                      <br />({row.supplier})
                      <Button
                        onClick={e => {
                          e.stopPropagation();
                          handleDownload(row);
                        }}
                        color="primary"
                        variant="contained"
                        size="small"
                        style={{ marginTop: 4 }}
                      >
                        Download
                      </Button>
                      {(process.env.REACT_APP_STORE_NAME === "Linen Serisi" || process.env.REACT_APP_STORE_NAME === "Uludag") 
                        && (<><br /><Button
                          onClick={e => {
                            e.stopPropagation();
                            handleOpen(row);
                          }}
                          color="primary"
                          variant="contained"
                          size="small"
                          style={{ marginTop: 4 }}
                        >
                          Merged Label Download
                        </Button></>
                        )
                      }
                      {process.env.REACT_APP_STORE_NAME === "Linen Serisi" 
                        && (<><br />
                        <Button
                          onClick={e => {
                            e.stopPropagation();
                            handleInvoiceList(row);
                          }}
                          color="primary"
                          variant="contained"
                          size="small"
                          style={{ marginTop: 4 }}
                        >
                          Invoice List
                        </Button>
                        </>
                        )
                      }
                    </StyledTableCell>
                    <StyledTableCell align="center" component="th" scope="row" onClick={() => handleRowClick(row.id)}>
                      {row?.refNumber.split("**")[0]}
                    </StyledTableCell>
                    <EditableTableCell
                      align="center"
                      row={{ ...row, description: row?.refNumber?.split("**")[1] ?? "" }} // gösterilecek değer
                      name="description"
                      onChange={(e, id) => {
                        const firstPart = (row?.refNumber ?? "").split("**")[0] ?? "";
                        const newSecondPart = e.target.innerText ?? "";
                        handleRowChange(id, { ref_number: `${firstPart}**${newSecondPart}` });
                      }}
                    />
                    <EditableTableCell
                      align="center"
                      {...{
                        row,
                        name: "carrier",
                        onChange,
                      }}
                    />
                    <StyledTableCell align="center" className={classes.spanHref}>
                      {(process.env.REACT_APP_STORE_NAME === "Linen Serisi" || process.env.REACT_APP_STORE_NAME === "Uludag")
                        ?
                        <div style={{ display: "flex", flexDirection: "column", paddingBottom: 6 }}>
                          <div style={{ fontWeight: "bold", marginBottom: 4 }}>Label Olmayanlar</div>
                          {/* ÜST: True olanlar */}
                          <div style={{ borderBottom: "1px solid #ccc", paddingBottom: 4 }}>
                            {row.content
                              .filter(key => key.toString().split(",")[2]?.trim() === "True")
                              .map((key, i, arr) => (
                                <span key={`top-${i}`} onClick={e => e.stopPropagation()}>
                                  <a
                                    href={`/order-details/${key.toString().split(",")[0]}/`}
                                    onClick={e => e.stopPropagation()}
                                    style={{
                                      color:
                                        !key ||
                                          key.toString().split(",")[1].includes("None") ||
                                          key.toString().split(",")[1] === " 209" ||
                                          key.toString().split(",")[1] === " US"
                                          ? "black"
                                          : "red",
                                    }}
                                  >
                                    {key.toString().split(",")[0]}
                                  </a>
                                  {arr.length !== i + 1 && <span>&nbsp;|&nbsp;</span>}
                                </span>
                              ))}
                          </div>

                          {/* ALT: False veya tanımsız olanlar */}
                          <div style={{ paddingTop: 4 }}>
                            <div style={{ fontWeight: "bold", marginBottom: 4 }}>Label Olanlar</div>
                            {row.content
                              .filter(key => key.toString().split(",")[2]?.trim() !== "True")
                              .map((key, i, arr) => (
                                <span key={`bottom-${i}`} onClick={e => e.stopPropagation()}>
                                  <a
                                    href={`/order-details/${key.toString().split(",")[0]}/`}
                                    onClick={e => e.stopPropagation()}
                                    style={{
                                      color:
                                        !key ||
                                          key.toString().split(",")[1].includes("None") ||
                                          key.toString().split(",")[1] === " 209" ||
                                          key.toString().split(",")[1] === " US"
                                          ? "black"
                                          : "red",
                                    }}
                                  >
                                    {key.toString().split(",")[0]}
                                  </a>
                                  {arr.length !== i + 1 && <span>&nbsp;|&nbsp;</span>}
                                </span>
                              ))}
                          </div>
                        </div>
                        :
                        row?.content.map((key, i) => (
                          <span
                            key={i}
                            onClick={e => {
                              e.stopPropagation();
                            }}
                          >
                            <a
                              href={`/order-details/${key.toString().split(",")[0]}/`}
                              key={i}
                              onClick={e => {
                                e.stopPropagation();
                              }}
                              style={{

                                color:
                                  !key ||
                                    key.toString().split(",")[1].includes("None") ||
                                    key.toString().split(",")[1] === " 209" ||
                                    key.toString().split(",")[1] === " US"
                                    ? "black"
                                    : "red",
                              }}
                            >
                              {key.toString().split(",")[0]}{key.toString().split(",")[2]?.trim() === "True" && isLabelStore ? <WarningIcon style={{ color: "red", fontSize: 15, marginBottom: -3 }} fontSize={"10px"} /> : null}

                            </a>
                            {row?.content?.length === i + 1 ? "" : <span>&nbsp; {"|"} &nbsp;</span>}
                          </span>
                        ))
                      }
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.content.length}</StyledTableCell>
                    <StyledTableCell align="center">
                      {moment.utc(row.shipment_date).local().format("MM-DD-YY HH:mm")}
                    </StyledTableCell>
                    <EditableTableCell
                      align="center"
                      onClick={e => {
                        e.stopPropagation();
                      }}
                      {...{
                        row,
                        name: "tracking_number",
                        onChange,
                        trackingNumber: tnFunc(row.tracking_number, row.carrier),
                      }}
                    />
                    {process.env.REACT_APP_IS_DHL_ENABLED === "true" &&
                      (userRole === "admin" ||
                        userRole === "shop_manager" ||
                        userRole === "shop_packer") ? (
                      <StyledTableCell align="center" onClick={e => e.stopPropagation()}>
                        {!row?.is_label ? (
                          <Button
                            variant="contained"
                            color="primary"
                            className={classes.print}
                            onClick={() => printHandler(row.id)}
                          >
                            <FormattedMessage id="getLabel" defaultMessage="Get Label" />
                          </Button>
                        ) : (
                          <a href={`${BASE_URL}media/dhl/${row.id}.zip`}>
                            <DownloadFile />
                          </a>
                        )}
                      </StyledTableCell>
                    ) : null}

                    {!isBeyazit && (
                      <StyledTableCell align="center" onClick={e => e.stopPropagation()}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={e => handleConfirmModal(e, row.id, "undo")}
                        >
                          <FormattedMessage id="undo" defaultMessage="Undo" />
                        </Button>
                        <br />
                        <br />
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          onClick={e => handleConfirmModal(e, row.id, "delete")}
                        >
                          <FormattedMessage id="delete" defaultMessage="Delete" />
                        </Button>

                        {(process.env.REACT_APP_STORE_NAME === "Linen Serisi" || process.env.REACT_APP_STORE_NAME === "Uludag") ? <> <br />
                          <br />
                          <ColorButton2
                            variant="contained"
                            size="small"
                            onClick={e => handleConfirmModal(e, row.id, "close")}
                            color=""
                          >
                            <FormattedMessage id="close" defaultMessage="close" />
                          </ColorButton2>
                          <br />
                          <br /> </> : null}


                      </StyledTableCell>
                    )}
                  </StyledTableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <ConfirmDialog
        handleConfirm={handleConfirm}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
      />
    </>
  );
}
