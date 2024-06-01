import React, { useEffect, useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableContainer,
  Checkbox,
  Menu,
  MenuItem,
  ListItemText,
} from "@material-ui/core";
import { putData, putImage, postData, removeImage, getData } from "../../../helper/PostData";
import SortableTableCell from "./SortableTableCell";

import Typography from "@material-ui/core/Typography";
import { FormattedMessage } from "react-intl";
import { statusData } from "../../../helper/Constants";
import {
  toastErrorNotify,
  toastSuccessNotify,
  toastWarnNotify,
} from "../../otheritems/ToastNotify";
import FlagAndFavCell from "./FlagAndFavCell";
import {
  Flag as FlagIcon,
  Repeat as RepeatIcon,
  // ThumbUpAlt as ThumbUpAltIcon,
} from "@material-ui/icons";
import EditableTableCell from "../../tableitems/EditableTableCell";
import { repeatReasons } from "../../../helper/Constants";
import OrderStatus from "../../tableitems/CustomSelectCell";
import UploadFile from "../../tableitems/UploadFile";
import ConstantTableCell from "../../tableitems/ConstantTableCell";

const StyledTableCell = withStyles(theme => ({
  head: {},
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})(props => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles(theme => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
  },
  container: {
    // maxHeight: "78vh",
  },
  table: {
    // height: "500px",
    marginTop: "1rem",
  },
  disabled: {
    marginTop: "1rem",
    pointerEvents: "none",
  },
  selectTableCell: {
    width: 60,
  },
  approveButton: {
    margin: "5px auto 0",
    padding: "5px 2px",
    lineHeight: 1,
    fontSize: "small",
    maxWidth: 64,
  },
}));

const BASE_URL = process.env.REACT_APP_BASE_URL;
const NON_SKU = process.env.REACT_APP_NON_SKU === "true" || false;

function ResultTable({ list, history, refreshSearch, loading, setLoading }) {
  const classes = useStyles();
  const [rows, setRows] = useState();
  const [orderBy, setOrderBy] = useState("created_date");
  const [order, setOrder] = useState("asc");
  const [selectedRowId, setSelectedRowId] = useState();
  const [selected, setSelected] = useState([]);
  const [repeatAnchorEl, setRepeatAnchorEl] = useState();
  const [rowIdToRepeat, setRowIdToRepeat] = useState();
  const [disableCells, setDisableCells] = useState(false);
  const [repeatMenuData, setRepeatMenuData] = useState({});

  let localRole = localStorage.getItem("localRole");

  useEffect(() => {
    setRows(list);
  }, [list, list?.length, list?.[0], list?.[0]?.explanation]);

  const onChange = (e, id, name) => {
    if (!rows.length || !name) return;
    if (rows?.filter(item => item.id === id)?.[0]?.[name] === e.target.innerText) return;
    handleRowChange(id, { [name]: e.target.innerText });
  };

  const handleRowChange = (id, data) => {
    if (!Object.keys(data)[0]) return;

    if (
      rows?.filter(item => item.id === id)?.[0]?.[Object.keys(data)[0]] === Object.values(data)[0]
    )
      return;
    setLoading(true);
    putData(`${BASE_URL}etsy/mapping/${id}/`, data)
      .then(response => {
        refreshSearch();
      })
      .catch(error => {
        console.log(error?.response?.data);
        toastWarnNotify(
          error?.response?.data[Object.keys(error?.response?.data)[0]][0] || "Save error!",
        );
      })
      .finally(() => setTimeout(() => setDisableCells(false), 1000));
  };

  const onSelectChange = (e, row) => {
    e.preventDefault();
    const a = statusData?.indexOf(row["status"]);
    const b = statusData?.indexOf(e.target.value);
    if (b - a > 1) {
      const resp = window?.confirm(
        `Beklenmedik durum değişikliği tespit edildi. 
      \n ${row["status"]} --> ${e.target.value}
      \nDevam etmek isteğinize emin misiniz `,
      );
      if (resp !== true) return;
    }

    const value = e.target.value;
    const name = e.target.name;
    const { id } = row;
    if ((name === "status") & (value === "pending") & (row.is_repeat === true)) {
      let data = { [name]: value, is_repeat: false };
      handleRowChange(id, data);
    }
    if ((name === "status") & (value === "pending") & (row.approved === true)) {
      let data = { [name]: value, approved: false };
      handleRowChange(id, data);
    } else if ((name === "status") & (value === "awaiting") & (row.approved === false)) {
      let data = { [name]: value, approved: true };
      handleRowChange(id, data);
    } else {
      let data = { [name]: value };
      handleRowChange(id, data);
    }
  };

  const uploadFile = (e, id, imgFile) => {
    e.stopPropagation();
    try {
      // let path = `${BASE_URL_MAPPING}${id}/`;
      let path = `${BASE_URL}etsy/mapping/${id}/`;
      putImage(path, imgFile, "image.png")
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          refreshSearch();
        });
    } catch (error) {
      console.log("error", error);
      toastWarnNotify("Select Image!");
    }
  };

  const removeFile = (e, id) => {
    e.stopPropagation();
    try {
      // let path = `${BASE_URL_MAPPING}${id}/`;
      let path = `${BASE_URL}etsy/mapping/${id}/destroy_image/`;
      removeImage(path)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          refreshSearch();
        });
    } catch (error) {
      console.log("error", error);
      toastWarnNotify("Image couldn't be removed!");
    }
  };
  const handlerFlagRepeatChange = (id, name, value) => {
    if (localRole?.includes("workshop")) return;
    if (name === "is_repeat" && value === false) {
      let data = { [name]: !value, status: "awaiting" };
      handleRowChange(id, data);
    } else if (name === "approved" && value === false) {
      let data = { [name]: !value, status: "awaiting" };
      handleRowChange(id, data);
    } else {
      let data = { [name]: !value };
      handleRowChange(id, data);
    }
  };

  const handlerRepeatChange = (e, id, is_repeat) => {
    if (localRole?.includes("workshop")) return;
    if (is_repeat) {
      let data = { is_repeat: false };
      handleRowChange(id, data);
    } else {
      setRowIdToRepeat(id);
      setRepeatAnchorEl(e.currentTarget);
    }
  };

  const handleRepeatMenuClose = () => {
    setRepeatAnchorEl(null);
    setRepeatMenuData({});
  };

  const handleRepeatMenuConfirm = () => {
    if (repeatMenuData.rowId) {
      handleRowChange(repeatMenuData.rowId, repeatMenuData);
    }
    handleRepeatMenuClose();
  };

  const handleRepeatMenuItemClick = (row, reason) => () => {
    const data = {
      rowId: row.id,
      is_repeat: true,
      approved: true,
      status: "awaiting",
      explanation: "**REPEAT: " + reason + "** " + row?.explanation,
    };
    setRepeatMenuData(data);
  };

  const repeatMenu = row => {
    return (
      <>
        <StyledMenu
          id="customized-menu"
          anchorEl={repeatAnchorEl}
          keepMounted
          open={Boolean(repeatAnchorEl)}
          onClose={handleRepeatMenuClose}
        >
          {/* <hr /> */}
          <span />

          <StyledMenuItem>
            <ListItemText
              primary={repeatReasons.LETTER_PATTERN_IS_WRONG}
              id="Letter Pattern Is Wrong"
              onClick={handleRepeatMenuItemClick(row, repeatReasons.LETTER_PATTERN_IS_WRONG)}
            />
          </StyledMenuItem>
          <StyledMenuItem>
            <ListItemText
              primary={repeatReasons.WRONG_COLOR}
              id="Wrong Color"
              onClick={handleRepeatMenuItemClick(row, repeatReasons.WRONG_COLOR)}
            />
          </StyledMenuItem>
          <StyledMenuItem>
            <ListItemText
              primary={repeatReasons.NEW_COLOR}
              id="Wrong Color"
              onClick={handleRepeatMenuItemClick(row, repeatReasons.NEW_COLOR)}
            />
          </StyledMenuItem>
          <StyledMenuItem>
            <ListItemText
              primary={repeatReasons.STONE_FALL}
              id="Stone Fall"
              onClick={handleRepeatMenuItemClick(row, repeatReasons.STONE_FALL)}
            />
          </StyledMenuItem>
          <StyledMenuItem>
            <ListItemText
              primary={repeatReasons.DIFFERENT_PRODUCT}
              id="Different Product"
              onClick={handleRepeatMenuItemClick(row, repeatReasons.DIFFERENT_PRODUCT)}
            />
          </StyledMenuItem>
          <StyledMenuItem>
            <ListItemText
              primary={repeatReasons.NEW_LINE_UP}
              id="Different Product"
              onClick={handleRepeatMenuItemClick(row, repeatReasons.NEW_LINE_UP)}
            />
          </StyledMenuItem>
          <StyledMenuItem>
            <ListItemText
              primary={repeatReasons.LONG_CHAIN}
              id="Long Chain"
              onClick={handleRepeatMenuItemClick(row, repeatReasons.LONG_CHAIN)}
            />
          </StyledMenuItem>
          <StyledMenuItem>
            <ListItemText
              primary={repeatReasons.SHORT_CHAIN}
              id="Short Chain"
              onClick={handleRepeatMenuItemClick(row, repeatReasons.SHORT_CHAIN)}
            />
          </StyledMenuItem>
          <StyledMenuItem>
            <ListItemText
              primary={repeatReasons.DIFFERENT_FONT}
              id="Different Font"
              onClick={handleRepeatMenuItemClick(row, repeatReasons.DIFFERENT_FONT)}
            />
          </StyledMenuItem>
          <StyledMenuItem>
            <ListItemText
              primary={repeatReasons.DISCOLORATION}
              id="discoloration"
              onClick={handleRepeatMenuItemClick(row, repeatReasons.DISCOLORATION)}
            />
          </StyledMenuItem>
          <StyledMenuItem>
            <ListItemText
              primary={repeatReasons.BREAK_OFF}
              id="break off"
              onClick={handleRepeatMenuItemClick(row, repeatReasons.BREAK_OFF)}
            />
          </StyledMenuItem>
          <StyledMenuItem>
            <ListItemText
              primary={repeatReasons.BROKEN_LOCK}
              id="break off"
              onClick={handleRepeatMenuItemClick(row, repeatReasons.BROKEN_LOCK)}
            />
          </StyledMenuItem>
          <StyledMenuItem>
            <ListItemText
              primary={repeatReasons.LOST_IN_MAIL}
              id="lost in mail"
              onClick={handleRepeatMenuItemClick(row, repeatReasons.LOST_IN_MAIL)}
            />
          </StyledMenuItem>
          <StyledMenuItem>
            <ListItemText
              primary={repeatReasons.SECOND}
              id="Second"
              onClick={handleRepeatMenuItemClick(row, repeatReasons.SECOND)}
            />
          </StyledMenuItem>
          <StyledMenuItem style={{ justifyContent: "space-around" }}>
            <Button color="primary" variant="contained" onClick={handleRepeatMenuClose}>
              Cancel
            </Button>
            <Button color="secondary" variant="contained" onClick={handleRepeatMenuConfirm}>
              OK
            </Button>
          </StyledMenuItem>
        </StyledMenu>
      </>
    );
  };

  const handleApproveSelected = () => {
    postData(`${BASE_URL}etsy/approved_all/`, { ids: selected })
      .then(res => {
        toastWarnNotify("Selected 'PENDING' orders are approved");
        setSelected([]);
        refreshSearch();
      })
      .catch(({ response }) => {
        toastWarnNotify(response?.data?.detail);
      });
  };

  const handleRequestSort = (event, property) => {
    const isAsc = order === "asc";
    let currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.set("ordering", `${isAsc ? "" : "-"}${property}`);
    history.push(history.location.pathname + "?" + currentUrlParams.toString());
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const fileSelectedHandler = (e, id) => {
    e.stopPropagation();
    let imgFile = e.target.files[0];

    var fr = new FileReader();
    if (fr.readAsDataURL) {
      fr.readAsDataURL(imgFile);
    } else if (fr.readAsDataurl) {
      fr.readAsDataurl(imgFile);
    }
    var img = new Image();
    fr.onload = function (e) {
      img.src = e.target.result;
      img.onload = function () {
        const canvas = document.createElement("canvas");

        canvas.id = "imageUploadCanvas";
        canvas.width = img.naturalWidth < 150 ? 200 : img.naturalWidth + 20;
        canvas.height = img.naturalHeight + 50;
        canvas.style.border = "2px solid black";

        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height + 40);
        ctx.drawImage(img, 10, 40);
        ctx.font = "16px Comic Sans MS";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText("order no: " + id, canvas.width / 2, 30);
        canvas.toBlob(function (blob) {
          uploadFile(e, selectedRowId, blob);
        });
      };
    };
  };

  const selectId = (event, id) => {
    event.stopPropagation();
    setSelectedRowId(id);
  };

  const handleCheckBoxClick = (event, id, row) => {
    const selectedIndex = selected?.indexOf(id);
    let newSelected = [];
    if (NON_SKU) {
      if (
        !(
          (
            !!row?.variation_1_value?.replace(/\s/g, "") &&
            !!row?.variation_2_value?.replace(/\s/g, "")
          )
          // &&
          // !!row?.variation_1_name?.replace(/\s/g, "") &&
          // !!row?.variation_2_name?.replace(/\s/g, "")
        )
      )
        return;
    } else {
      if (
        !(
          !!row.supplier?.replace(/\s/g, "") &&
          !!row.type?.replace(/\s/g, "") &&
          !!row.color?.replace(/\s/g, "") &&
          !!row.length?.replace(/\s/g, "") &&
          !(
            row["type"]?.toLowerCase()?.includes("kolye") &&
            row["type"]?.toLowerCase()?.includes("imza") &&
            !row["image"]
          )
        )
      )
        return;
    }

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected?.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleSendToStock = async id => {
    // handlerRepeatChange(e, row.id, row.is_repeat);
    getData(`${BASE_URL}etsy/send_to_stock/${id}/`)
      .then(response => {
        toastSuccessNotify("Item is sent to stock");
        const copyRows = [...rows];
        const newRows = copyRows?.filter(item => item?.id != id);
        setRows(newRows);
      })
      .catch(error => {
        console.log("error", error);
        toastErrorNotify("Sending item to stock is not successfull");
      });
  };

  return (
    <Paper className={classes.root}>
      {rows && (
        <TableContainer className={classes.container}>
          <Typography className={classes.header}>
            <FormattedMessage id="resultTable" defaultMessage="Result Table" />({rows.length})
          </Typography>
          {disableCells ? "SAVING..." : ""}
          <Table
            className={loading ? classes.disabled : classes.table}
            stickyHeader
            aria-label="sticky table"
            size="small"
          >
            <TableHead>
              <TableRow>
                <SortableTableCell
                  property="id"
                  property2="receipt"
                  property3="index"
                  handleRequestSort={handleRequestSort}
                  order={order}
                  orderBy={orderBy}
                  colName="id"
                  setOrderBy={setOrderBy}
                />
                <SortableTableCell
                  property="status"
                  handleRequestSort={handleRequestSort}
                  order={order}
                  orderBy={orderBy}
                  colName="status"
                  setOrderBy={setOrderBy}
                />
                <SortableTableCell
                  property="created_date"
                  property3="buyer"
                  handleRequestSort={handleRequestSort}
                  order={order}
                  orderBy={orderBy}
                  colName="createdDate"
                  setOrderBy={setOrderBy}
                />
                <SortableTableCell
                  property="supplier"
                  handleRequestSort={handleRequestSort}
                  order={order}
                  orderBy={orderBy}
                  colName="supplier"
                  setOrderBy={setOrderBy}
                />
                {process.env.REACT_APP_STORE_NAME === "Linen Serisi" ||
                process.env.REACT_APP_STORE_NAME === "NAKIŞ-1" ||
                process.env.REACT_APP_STORE_NAME === "Kadife-1" ||
                process.env.REACT_APP_STORE_NAME === "Mina" ||
                process.env.REACT_APP_STORE_NAME === "Güneş Tekstil" ? (
                  <SortableTableCell
                    property="sku"
                    handleRequestSort={handleRequestSort}
                    order={order}
                    orderBy={orderBy}
                    colName="type"
                    setOrderBy={setOrderBy}
                  />
                ) : null}
                {NON_SKU ? (
                  <>
                    <SortableTableCell
                      property="variation_1_value"
                      handleRequestSort={handleRequestSort}
                      order={order}
                      orderBy={orderBy}
                      colName="Size"
                      setOrderBy={setOrderBy}
                    />
                    <SortableTableCell
                      property="variation_2_value"
                      handleRequestSort={handleRequestSort}
                      order={order}
                      orderBy={orderBy}
                      colName="Color"
                      setOrderBy={setOrderBy}
                    />
                  </>
                ) : (
                  <>
                    <SortableTableCell
                      property="type"
                      handleRequestSort={handleRequestSort}
                      order={order}
                      orderBy={orderBy}
                      colName="type"
                      setOrderBy={setOrderBy}
                    />
                    <SortableTableCell
                      property="length"
                      handleRequestSort={handleRequestSort}
                      order={order}
                      orderBy={orderBy}
                      colName="length"
                      setOrderBy={setOrderBy}
                    />
                    <SortableTableCell
                      property="color"
                      handleRequestSort={handleRequestSort}
                      order={order}
                      orderBy={orderBy}
                      colName="color"
                      setOrderBy={setOrderBy}
                    />
                    <SortableTableCell
                      property="qty"
                      handleRequestSort={handleRequestSort}
                      order={order}
                      orderBy={orderBy}
                      colName="quantity"
                      setOrderBy={setOrderBy}
                    />
                    <SortableTableCell
                      property="size"
                      handleRequestSort={handleRequestSort}
                      order={order}
                      orderBy={orderBy}
                      colName="size"
                      setOrderBy={setOrderBy}
                    />
                    <SortableTableCell
                      property="start"
                      handleRequestSort={handleRequestSort}
                      order={order}
                      orderBy={orderBy}
                      colName="start"
                      setOrderBy={setOrderBy}
                    />
                    <SortableTableCell
                      property="space"
                      handleRequestSort={handleRequestSort}
                      order={order}
                      orderBy={orderBy}
                      colName="space"
                      setOrderBy={setOrderBy}
                    />
                  </>
                )}
                <SortableTableCell
                  property="explanation"
                  handleRequestSort={handleRequestSort}
                  order={order}
                  orderBy={orderBy}
                  colName="explanation"
                  setOrderBy={setOrderBy}
                />
                <StyledTableCell
                  align="center"
                  style={{
                    padding: 10,
                    borderRight: "0.5px solid #E0E0E0",
                  }}
                >
                  <FormattedMessage id="in_stock" defaultMessage="In Stock" />
                </StyledTableCell>

                <StyledTableCell
                  align="center"
                  style={{
                    padding: 10,
                    borderRight: "0.5px solid #E0E0E0",
                    background: "rgb(100, 149, 237)",
                  }}
                >
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={handleApproveSelected}
                    className={classes.approveButton}
                    disabled={!selected?.length}
                  >
                    <FormattedMessage id="approve" defaultMessage="Approve" /> (
                    {
                      selected.filter(function (el) {
                        return el != null;
                      })?.length
                    }
                    )
                  </Button>
                </StyledTableCell>
                <SortableTableCell
                  property="personalization"
                  handleRequestSort={handleRequestSort}
                  order={order}
                  orderBy={orderBy}
                  colName="personalization"
                  setOrderBy={setOrderBy}
                />
                <SortableTableCell
                  property="message_from_buyer"
                  handleRequestSort={handleRequestSort}
                  order={order}
                  orderBy={orderBy}
                  colName="customerNote"
                  setOrderBy={setOrderBy}
                />
                {process.env.REACT_APP_STORE_NAME !== "Mina" &&
                process.env.REACT_APP_STORE_NAME !== "Linen Serisi" ? (
                  <SortableTableCell
                    property="gift_message"
                    handleRequestSort={handleRequestSort}
                    order={order}
                    orderBy={orderBy}
                    colName="giftMessage"
                    setOrderBy={setOrderBy}
                  />
                ) : null}
                <SortableTableCell
                  property="note"
                  handleRequestSort={handleRequestSort}
                  order={order}
                  orderBy={orderBy}
                  colName="internalNote"
                  setOrderBy={setOrderBy}
                />
                <SortableTableCell
                  property="image"
                  handleRequestSort={handleRequestSort}
                  order={order}
                  orderBy={orderBy}
                  colName="uploadFile"
                  setOrderBy={setOrderBy}
                />
              </TableRow>
            </TableHead>

            <TableBody>
              {rows &&
                rows?.length &&
                rows?.map((row, index) => {
                  const isItemSelected = selected?.indexOf(row.id) !== -1;
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <StyledTableRow
                      key={row.id}
                      id={row.id}
                      //onBlur={(e) => handleRowBlur(e, row.id)}
                      //onKeyDown={(e) => handleRowKeyDown(e, row.id)}
                      style={{
                        pointerEvents:
                          loading ||
                          (localRole !== "workshop_manager" &&
                            (row["status"] === "in_progress" || row["status"] === "ready"))
                            ? "none"
                            : "auto",
                        backgroundColor:
                          (row.status !== "pending") & (row.approved === false)
                            ? "#FF9494"
                            : row["type"]?.includes("14K") || row["explanation"]?.includes("14K")
                            ? "#ffef8a"
                            : null,
                      }}
                    >
                      <FlagAndFavCell
                        {...{
                          row,
                          name: "id",
                          name2: "receipt",
                          name3: "item_index",
                          name4: "is_followup",
                          name5: "is_repeat",
                          handlerFlagRepeatChange,
                        }}
                      />
                      <td
                        onClick={e => {
                          e.stopPropagation();
                        }}
                        onBlur={e => {
                          e.stopPropagation();
                        }}
                        style={{
                          padding: 10,
                          borderBottom: "1px solid #e0e0e0",
                          borderRight: "0.5px solid #E0E0E0",
                        }}
                      >
                        <Button
                          size="small"
                          onClick={e => {
                            e.stopPropagation();
                            handleSendToStock(row.id);
                          }}
                          color="primary"
                          variant="contained"
                          style={{ marginBottom: 4 }}
                        >
                          <FormattedMessage id="sendToStock2" defaultMessage="Send to Stock" />
                        </Button>
                        <br />

                        <FlagIcon
                          style={{
                            color: row["is_followup"] ? "red" : "grey",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handlerFlagRepeatChange(row.id, "is_followup", row["is_followup"])
                          }
                        />
                        {row["status"] === "in_progress" || row["status"] === "ready" ? null : (
                          <>
                            <RepeatIcon
                              style={{
                                color: row["is_repeat"] ? "red" : "grey",
                                cursor: "pointer",
                              }}
                              onClick={e => {
                                e.stopPropagation();
                                handlerRepeatChange(e, row.id, row.is_repeat);
                              }}
                            />
                          </>
                        )}

                        {Boolean(repeatAnchorEl) && row.id === rowIdToRepeat
                          ? repeatMenu(row)
                          : null}
                        <OrderStatus {...{ row, name: "status", onSelectChange }} />
                      </td>
                      <ConstantTableCell {...{ row, name: "created_date", name3: "buyer" }} />
                      <EditableTableCell
                        {...{
                          row,
                          name: "supplier",
                          onChange,
                          disableCells,
                          setDisableCells,
                        }}
                      />
                      {process.env.REACT_APP_STORE_NAME === "Linen Serisi" ||
                      process.env.REACT_APP_STORE_NAME === "NAKIŞ-1" ||
                      process.env.REACT_APP_STORE_NAME === "Kadife-1" ||
                      process.env.REACT_APP_STORE_NAME === "Mina" ||
                      process.env.REACT_APP_STORE_NAME === "Güneş Tekstil" ? (
                        <EditableTableCell
                          {...{
                            row,
                            name: "sku",
                            onChange,
                            disableCells,
                            setDisableCells,
                          }}
                        />
                      ) : null}
                      {NON_SKU ? (
                        <>
                          <EditableTableCell
                            {...{
                              row,
                              name: "variation_1_value",
                              onChange,
                              disableCells,
                              setDisableCells,
                            }}
                          />
                          <EditableTableCell
                            {...{
                              row,
                              name: "variation_2_value",
                              onChange,
                              disableCells,
                              setDisableCells,
                            }}
                          />
                        </>
                      ) : (
                        <>
                          <EditableTableCell
                            {...{
                              row,
                              name: "type",
                              onChange,
                              disableCells,
                              setDisableCells,
                            }}
                          />
                          <EditableTableCell
                            {...{
                              row,
                              name: "length",
                              onChange,
                              disableCells,
                              setDisableCells,
                            }}
                          />
                          <EditableTableCell
                            {...{
                              row,
                              name: "color",
                              onChange,
                              disableCells,
                              setDisableCells,
                            }}
                          />
                          <EditableTableCell
                            {...{
                              row,
                              name: "qty",
                              onChange,
                              disableCells,
                              setDisableCells,
                            }}
                          />
                          <EditableTableCell
                            {...{
                              row,
                              name: "size",
                              onChange,
                              disableCells,
                              setDisableCells,
                            }}
                          />
                          <EditableTableCell
                            {...{
                              row,
                              name: "start",
                              onChange,
                            }}
                          />
                          <EditableTableCell
                            {...{
                              row,
                              name: "space",
                              onChange,
                              disableCells,
                              setDisableCells,
                            }}
                          />
                        </>
                      )}
                      <EditableTableCell
                        {...{
                          row,
                          name: "explanation",
                          onChange,
                          disableCells,
                          setDisableCells,
                        }}
                      />

                      <td
                        style={{
                          padding: 10,
                          minWidth: 60,
                        }}
                      >
                        {row?.get_in_stock ? <Checkbox checked disabled /> : "-"}
                      </td>

                      <td
                        style={{
                          padding: 10,
                          borderBottom: "1px solid #e0e0e0",
                          pointerEvents: row.status === "pending" ? "auto" : "none",
                          borderRight: "0.5px solid #E0E0E0",
                          minWidth: 90,
                        }}
                        onClick={e => {
                          e.stopPropagation();
                          handleCheckBoxClick(e, row.id, row);
                        }}
                        onBlur={e => {
                          e.stopPropagation();
                        }}
                        onChange={e => {
                          e.stopPropagation();
                        }}
                      >
                        <Checkbox
                          checked={isItemSelected}
                          disabled={
                            NON_SKU
                              ? !(
                                  (
                                    !!row?.variation_1_value?.replace(/\s/g, "") &&
                                    !!row?.variation_2_value?.replace(/\s/g, "")
                                  )
                                  // &&
                                  // !!row?.variation_1_name?.replace(/\s/g, "") &&
                                  // !!row?.variation_2_name?.replace(/\s/g, "")
                                )
                              : !(
                                  !!row.supplier?.replace(/\s/g, "") &&
                                  !!row.type?.replace(/\s/g, "") &&
                                  !!row.color?.replace(/\s/g, "") &&
                                  !!row.length?.replace(/\s/g, "") &&
                                  !(
                                    row["type"]?.toLowerCase()?.includes("kolye") &&
                                    row["type"]?.toLowerCase()?.includes("imza") &&
                                    !row["image"]
                                  )
                                )
                          }
                          color="primary"
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </td>
                      <ConstantTableCell {...{ row, name: "personalization", onChange }} />
                      <ConstantTableCell {...{ row, name: "message_from_buyer", onChange }} />
                      {process.env.REACT_APP_STORE_NAME !== "Mina" &&
                      process.env.REACT_APP_STORE_NAME !== "Linen Serisi" ? (
                        <EditableTableCell
                          {...{
                            row,
                            name: "gift_message",
                            onChange,
                            disableCells,
                            setDisableCells,
                          }}
                        />
                      ) : null}
                      <EditableTableCell
                        {...{
                          row,
                          name: "note",
                          onChange,
                          disableCells,
                          setDisableCells,
                        }}
                      />
                      <td
                        onClick={e => {
                          e.stopPropagation();
                        }}
                        style={{
                          padding: 10,
                          borderBottom: "1px solid #e0e0e0",
                        }}
                      >
                        <UploadFile
                          {...{
                            row,
                            name: "image",
                            uploadFile,
                            fileSelectedHandler,
                            selectId,
                            selectedRowId,
                            removeFile,
                          }}
                        />
                      </td>
                    </StyledTableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {rows?.length === 0 ? (
        <div colSpan="2" className={classes.bottomSection}>
          <h1 className={classes.warn}>Nothing Found</h1>
        </div>
      ) : null}
    </Paper>
  );
}

export default ResultTable;
