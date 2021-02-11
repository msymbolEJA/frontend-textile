import React, { useEffect, useState, useMemo, useCallback } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { ToastContainer } from "react-toastify";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  Paper,
  TableContainer,
  Checkbox,
  TextField,
} from "@material-ui/core";
import {
  Flag as FlagIcon,
  Repeat as RepeatIcon,
  ThumbUpAlt as ThumbUpAltIcon,
} from "@material-ui/icons";

import { putData, getData, globalSearch } from "../../helper/PostData";
import OrderStatus from "../tableitems/CustomSelectCell";
import UploadFile from "../tableitems/UploadFile";
import { putImage, postData } from "../../helper/PostData";
import { getQueryParams } from "../../helper/getQueryParams";
import { toastWarnNotify } from "../otheritems/ToastNotify";
import ConstantTableCell from "../tableitems/ConstantTableCell";
import FlagAndFavCell from "./FlagAndFavCell";
import EditableTableCell from "../tableitems/EditableTableCell";
import SortableTableCell from "./SortableTableCell";
import CustomButtonGroup from "./CustomButtonGroup";
import {
  tagsData,
  BASE_URL_MAPPING,
  BASE_URL,
  repeatReasons,
} from "../../helper/Constants";
import Menu from "@material-ui/core/Menu";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
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

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

const useStyles = makeStyles((theme) => ({
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
  selectTableCell: {
    width: 60,
  },
  approveButton: {
    float: "left",
    margin: "5px 0 0",
    padding: "5px 2px",
    lineHeight: 1,
    fontSize: "small",
  },
}));

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#f5f5dc",
    color: theme.palette.common.black,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

function App({ history }) {
  const [rows, setRows] = useState([]);
  const [previous, setPrevious] = useState({});
  const classes = useStyles();
  const [count, setCount] = useState(0);
  const [orderBy, setOrderBy] = useState("id");
  const [order, setOrder] = useState("desc");
  const [selectedRowId, setSelectedRowId] = useState();
  const [selected, setSelected] = useState([]);
  const filters = getQueryParams();
  const [selectedTag, setSelectedTag] = useState(filters?.status || "pending");
  const [repeatAnchorEl, setRepeatAnchorEl] = useState();
  const [rowIdToRepeat, setRowIdToRepeat] = useState();

  useEffect(() => {
    getListFunc();
    // eslint-disable-next-line
  }, [
    filters?.ordering,
    filters?.is_followup,
    filters?.status,
    filters?.is_repeat,
    filters?.limit,
    filters?.offset,
  ]);

  const getListFunc = useCallback(() => {
    getData(
      `${BASE_URL_MAPPING}?${
        filters?.status ? `status=${filters?.status}` : ""
      }&is_repeat=${filters?.is_repeat}&is_followup=${
        filters?.is_followup
      }&ordering=${filters?.ordering}` //&limit=${rowsPerPage}&offset=${filters?.offset}
    )
      .then((response) => {
        setRows(response.data);
        setCount(response.data.length);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, [
    filters?.is_followup,
    filters?.is_repeat,
    filters?.ordering,
    filters?.status,
  ]);

  const handleRequestSort = useCallback(
    (event, property) => {
      const isAsc = order === "asc";
      let currentUrlParams = new URLSearchParams(window.location.search);
      currentUrlParams.set("ordering", `${isAsc ? "" : "-"}${property}`);
      history.push(
        history.location.pathname + "?" + currentUrlParams.toString()
      );
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(property);
    },
    [history, order]
  );

  const onChange = useCallback(
    (e, row) => {
      if (!previous[row.id]) {
        setPrevious((state) => ({ ...state, [row.id]: row }));
      }
      const value = e.target.value;
      const name = e.target.name;
      const { id } = row;
      const newRows = rows.map((row) => {
        if (row.id === id) {
          return { ...row, [name]: value };
        }
        return row;
      });
      setRows(newRows);
    },
    [previous, rows]
  );

  const handleRowClick = useCallback(
    (id) => {
      const currentRow = rows.find((row) => row.id === id);
      if (currentRow) {
        if (!currentRow.isEditMode) {
          const newRows = rows.map((row) => {
            return { ...row, isEditMode: row.id === id };
          });
          setRows(newRows);
        }
      }
    },
    [rows]
  );

  const handleRowChange = useCallback(
    (id, data) => {
      putData(`${BASE_URL_MAPPING}${id}/`, data)
        .then((response) => {})
        .catch((error) => {
          console.log(error);
        })
        .finally(() => getListFunc());
    },
    [getListFunc]
  );

  const handleRowKeyDown = useCallback(
    (e, id) => {
      if (e.key === "Enter") {
        let data = { [e.target.name]: e.target.defaultValue };
        handleRowChange(id, data);
      }
    },
    [handleRowChange]
  );

  const handleRowBlur = useCallback(
    (e, id) => {
      let data = { [e.target.name]: e.target.defaultValue };
      handleRowChange(id, data);
    },
    [handleRowChange]
  );

  const onSelectChange = useCallback(
    (e, row) => {
      e.preventDefault();
      const value = e.target.value;
      const name = e.target.name;
      const { id } = row;
      if (
        (name === "status") &
        (value === "pending") &
        (row.approved === true)
      ) {
        let data = { [name]: value, approved: false };
        handleRowChange(id, data);
      } else if (
        (name === "status") &
        (value === "awaiting") &
        (row.approved === false)
      ) {
        let data = { [name]: value, approved: true };
        handleRowChange(id, data);
      } else {
        let data = { [name]: value };
        handleRowChange(id, data);
      }
      getListFunc();
    },
    [getListFunc, handleRowChange]
  );

  const uploadFile = useCallback(
    (e, id, imgFile) => {
      e.stopPropagation();
      try {
        let path = `${BASE_URL_MAPPING}${id}/`;
        putImage(path, imgFile, imgFile.name)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            getListFunc();
          });
      } catch (error) {
        toastWarnNotify("Select Image!");
      }
    },
    [getListFunc]
  );

  const fileSelectedHandler = useCallback(
    (e, id) => {
      e.stopPropagation();
      let imgFile = e.target.files[0];
      uploadFile(e, selectedRowId, imgFile);
    },
    [selectedRowId, uploadFile]
  );

  const selectId = useCallback((event, id) => {
    event.stopPropagation();
    setSelectedRowId(id);
  }, []);

  const handleApproveSelected = useCallback(() => {
    postData(`${BASE_URL}etsy/approved_all/`, { ids: selected })
      .then((res) => {
        toastWarnNotify("Selected 'PENDING' orders are approved");
        getListFunc();
        setSelected([]);
      })
      .catch(({ response }) => {
        toastWarnNotify(response?.data?.detail);
      });
  }, [getListFunc, selected]);

  const handleTagChange = useCallback(
    (e) => {
      const statu = e.currentTarget.id;
      setSelected([]);
      setSelectedTag(statu);
      let newUrl = "";
      switch (statu) {
        case "all_orders":
          break;
        case "repeat":
          newUrl += `is_repeat=true`; //&limit=${rowsPerPage}&offset=${page * rowsPerPage}
          break;
        case "followUp":
          newUrl += `is_followup=true`; //&limit=${rowsPerPage}&offset=${page * rowsPerPage}
          break;
        default:
          newUrl += `status=${statu}`; //&limit=${rowsPerPage}&offset=${page * rowsPerPage}
          break;
      }
      history.push(`/approval?&${newUrl}`);
    },
    [history]
  );

  const handlerFlagRepeatChange = useCallback(
    (id, name, value) => {
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
    },
    [handleRowChange]
  );

  const handleSelectAllClick = useCallback(
    (event) => {
      if (event.target.checked) {
        const newSelecteds = rows.map((n) => n?.id);
        setSelected(newSelecteds);
        return;
      }
      setSelected([]);
    },
    [rows]
  );

  const handleCheckBoxClick = useCallback(
    (event, id) => {
      const selectedIndex = selected.indexOf(id);
      let newSelected = [];
      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected?.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        );
      }
      setSelected(newSelected);
    },
    [selected]
  );

  const searchHandler = useCallback((e) => {
    if (e.keyCode === 13) {
      if (e.target.value) {
        globalSearch(`${BASE_URL_MAPPING}?search=${e.target.value}`)
          .then((response) => {
            console.log(response.data);
            setRows(response.data);
            setCount(response.data.length);
            //setList(response.data);
          })
          .catch((error) => {
            console.log(error);
            setRows([]);
          });
      }
    } else {
      // console.log(e.target.value);
    }
  }, []);

  const handleClose = useCallback(() => {
    setRepeatAnchorEl(null);
  }, []);

  const handlerRepeatChange = useCallback((e, id) => {
    setRowIdToRepeat(id);
    setRepeatAnchorEl(e.currentTarget);
  }, []);

  const menuClickHandler = useCallback(
    (row, reason) => () => {
      const data = {
        is_repeat: true,
        status: "awaiting",
        note: "**REPEAT: " + reason + "** " + row?.note,
      };
      handleRowChange(row.id, data);
      handleClose();
    },
    [handleClose, handleRowChange]
  );

  const repeatMenu = useCallback(
    (row) => {
      return (
        <>
          <StyledMenu
            id="customized-menu"
            anchorEl={repeatAnchorEl}
            keepMounted
            open={Boolean(repeatAnchorEl)}
            onClose={handleClose}
          >
            <StyledMenuItem>
              <ListItemText
                primary="Wrong manufacturing"
                id="Wrong manufacturing"
                onClick={menuClickHandler(
                  row,
                  repeatReasons.MANUFACTURING_ERROR
                )}
              />
            </StyledMenuItem>
            <StyledMenuItem>
              <ListItemText
                primary="Discoloration"
                id="discoloration"
                onClick={menuClickHandler(row, repeatReasons.DISCOLORATION)}
              />
            </StyledMenuItem>
            <StyledMenuItem>
              <ListItemText
                primary="Break off"
                id="break off"
                onClick={menuClickHandler(row, repeatReasons.BREAK_OFF)}
              />
            </StyledMenuItem>
            <StyledMenuItem>
              <ListItemText
                primary="Lost in mail"
                id="lost in mail"
                onClick={menuClickHandler(row, repeatReasons.LOST_IN_MAIL)}
              />
            </StyledMenuItem>
            <StyledMenuItem>
              <ListItemText
                primary="Second"
                id="Second"
                onClick={menuClickHandler(row, repeatReasons.SECOND)}
              />
            </StyledMenuItem>
          </StyledMenu>
        </>
      );
    },
    [handleClose, menuClickHandler, repeatAnchorEl]
  );

  return (
    <Paper className={classes.root}>
      <CustomButtonGroup
        selectedTag={selectedTag}
        handleTagChange={handleTagChange}
        tagsData={tagsData}
        searchHandler={searchHandler}
      />
      <TableContainer className={classes.container}>
        <Table
          className={classes.table}
          stickyHeader
          aria-label="caption table"
        >
          <TableHead>
            <TableRow>
              <SortableTableCell
                property="id"
                property2="Receipt/"
                property3="Index"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="Id/"
                setOrderBy={setOrderBy}
              />
              <SortableTableCell
                property="status"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="Status"
                setOrderBy={setOrderBy}
              />
              <SortableTableCell
                property="created_date"
                property3="Buyer"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="Created Date"
                setOrderBy={setOrderBy}
              />
              <SortableTableCell
                property="supplier"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="Supplier"
                setOrderBy={setOrderBy}
              />
              <SortableTableCell
                property="type"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="Type"
                setOrderBy={setOrderBy}
              />
              <SortableTableCell
                property="length"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="Length"
                setOrderBy={setOrderBy}
              />
              <SortableTableCell
                property="color"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="Color"
                setOrderBy={setOrderBy}
              />
              <SortableTableCell
                property="qty"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="Quantity"
                setOrderBy={setOrderBy}
              />
              <SortableTableCell
                property="size"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="Size"
                setOrderBy={setOrderBy}
              />
              <SortableTableCell
                property="start"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="Start"
                setOrderBy={setOrderBy}
              />
              <SortableTableCell
                property="space"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="Space"
                setOrderBy={setOrderBy}
              />
              <SortableTableCell
                property="image"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="Upload File"
                setOrderBy={setOrderBy}
              />
              <SortableTableCell
                property="explanation"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="Explanation"
                setOrderBy={setOrderBy}
              />
              <StyledTableCell
                align="center"
                style={{
                  padding: 0,
                  pointerEvents: selectedTag === "pending" ? "auto" : "none",
                }}
              >
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={handleApproveSelected}
                  className={classes.approveButton}
                  disabled={!selected?.length}
                >
                  Approve ({selected?.length})
                </Button>
                <Checkbox
                  indeterminate={
                    selected?.length > 0 && selected?.length < rows?.length
                  }
                  checked={
                    rows?.length > 0 && selected?.length === rows?.length
                  }
                  onChange={handleSelectAllClick}
                  inputProps={{ "aria-label": "select all" }}
                />
              </StyledTableCell>
              <SortableTableCell
                property="personalization"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="Personalization"
                setOrderBy={setOrderBy}
              />
              <SortableTableCell
                property="message_from_buyer"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="Customer Note"
                setOrderBy={setOrderBy}
              />
              <SortableTableCell
                property="gift_message"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="Gift Message"
                setOrderBy={setOrderBy}
              />
              <SortableTableCell
                property="note"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="Internal Note"
                setOrderBy={setOrderBy}
              />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => {
              const isItemSelected = selected.indexOf(row.id) !== -1;
              const labelId = `enhanced-table-checkbox-${index}`;
              return (
                <StyledTableRow
                  key={row.id}
                  id={row.id}
                  onClick={(e) => handleRowClick(row.id)}
                  onBlur={(e) => handleRowBlur(e, row.id)}
                  onKeyDown={(e) => handleRowKeyDown(e, row.id)}
                  style={{
                    backgroundColor:
                      (row.status !== "pending") & (row.approved === false)
                        ? "#FF9494"
                        : row["type"].includes("14K") ||
                          row["explanation"].includes("14K")
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
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    onBlur={(e) => {
                      e.stopPropagation();
                    }}
                    style={{ padding: 0, borderBottom: "1px solid #e0e0e0" }}
                  >
                    <FlagIcon
                      style={{
                        color: row["is_followup"] ? "red" : "grey",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        handlerFlagRepeatChange(
                          row.id,
                          "is_followup",
                          row["is_followup"]
                        )
                      }
                    />
                    <RepeatIcon
                      style={{
                        color: row["is_repeat"] ? "red" : "grey",
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlerRepeatChange(e, row.id);
                      }}
                    />
                    {Boolean(repeatAnchorEl) && row.id === rowIdToRepeat
                      ? repeatMenu(row)
                      : null}
                    <ThumbUpAltIcon
                      style={{
                        color: row["approved"] ? "red" : "grey",
                        cursor: "pointer",
                        pointerEvents:
                          row.status === "pending" ? "auto" : "none",
                      }}
                      onClick={() =>
                        handlerFlagRepeatChange(
                          row.id,
                          "approved",
                          row["approved"]
                        )
                      }
                    />
                    <OrderStatus {...{ row, name: "status", onSelectChange }} />
                  </td>
                  <ConstantTableCell
                    {...{ row, name: "created_date", name3: "buyer" }}
                  />
                  <EditableTableCell {...{ row, name: "supplier", onChange }} />
                  <EditableTableCell {...{ row, name: "type", onChange }} />
                  <EditableTableCell {...{ row, name: "length", onChange }} />
                  <EditableTableCell {...{ row, name: "color", onChange }} />
                  <EditableTableCell {...{ row, name: "qty", onChange }} />
                  <EditableTableCell {...{ row, name: "size", onChange }} />
                  <EditableTableCell {...{ row, name: "start", onChange }} />
                  <EditableTableCell {...{ row, name: "space", onChange }} />
                  <td
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    style={{ padding: 0, borderBottom: "1px solid #e0e0e0" }}
                  >
                    <UploadFile
                      {...{
                        row,
                        name: "image",
                        uploadFile,
                        fileSelectedHandler,
                        selectId,
                        selectedRowId,
                      }}
                    />
                  </td>
                  <EditableTableCell
                    {...{ row, name: "explanation", onChange }}
                  />
                  <td
                    style={{
                      padding: 0,
                      borderBottom: "1px solid #e0e0e0",
                      pointerEvents: row.status === "pending" ? "auto" : "none",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCheckBoxClick(e, row.id);
                    }}
                    onBlur={(e) => {
                      e.stopPropagation();
                    }}
                    onChange={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Checkbox
                      checked={isItemSelected}
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                  </td>
                  <ConstantTableCell
                    {...{ row, name: "personalization", onChange }}
                  />
                  <ConstantTableCell
                    {...{ row, name: "message_from_buyer", onChange }}
                  />
                  <EditableTableCell
                    {...{ row, name: "gift_message", onChange }}
                  />
                  <EditableTableCell {...{ row, name: "note", onChange }} />
                </StyledTableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <td colSpan="2">Total Record:{count || 0}</td>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <ToastContainer style={{ color: "black" }} />
    </Paper>
  );
}

export default App;
