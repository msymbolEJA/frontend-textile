import React, { useEffect, useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
  Paper,
  TableContainer,
  Checkbox,
} from "@material-ui/core";
import FlagIcon from "@material-ui/icons/Flag";
import RepeatIcon from "@material-ui/icons/Repeat";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";

import { putData, getData } from "../../helper/PostData";
import TablePaginationActions from "../tableitems/TablePaginationActions";
import OrderStatus from "../tableitems/CustomSelectCell";
import UploadFile from "../tableitems/UploadFile";
import { putImage } from "../../helper/PostData";
import { ToastContainer } from "react-toastify";
import { toastWarnNotify } from "../otheritems/ToastNotify";
import ConstantTableCell from "../tableitems/ConstantTableCell";
import FlagAndFavCell from "./FlagAndFavCell";
import EditableTableCell from "../tableitems/EditableTableCell";
import SortableTableCell from "./SortableTableCell";
import CustomButtonGroup from "./CustomButtonGroup";
import { tagsData } from "../../helper/Constants";

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
  btnStyle: {
    backgroundColor: "orange",
    borderRadius: "5px",
    width: "6rem",
    cursor: "pointer",
  },
  approveButton: {
    float: "left",
    margin: "0 0 0.5rem 0.5rem",
    padding: "6px 6px 4px",
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

function App() {
  const [rows, setRows] = React.useState([]);
  const [previous, setPrevious] = React.useState({});
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [count, setCount] = useState(0);
  const [orderBy, setOrderBy] = useState("id");
  const [order, setOrder] = React.useState("desc");
  const [selectedTag, setSelectedTag] = useState("pending");
  const [selectedRowId, setSelectedRowId] = useState();
  const [globStatu, setglobStatu] = useState("");
  const [selected, setSelected] = React.useState([]);
  const [url, setUrl] = useState(
    `http://144.202.67.136:8080/etsy/mapping/?status=${selectedTag}&limit=${rowsPerPage}&offset=${
      page * rowsPerPage
    }`
  );

  useEffect(() => {
    getListFunc();
    // eslint-disable-next-line
  }, [url, page, rowsPerPage]);

  const getListFunc = () => {
    getData(url)
      .then((response) => {
        setRows(response.data.results);
        setCount(response.data.count);
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleRequestSort = (event, property) => {
    console.log("event", event);
    const isAsc = order === "asc";
    if (isAsc) {
      setUrl(
        `http://144.202.67.136:8080/etsy/mapping/?status=${globStatu}&limit=${rowsPerPage}&offset=${
          page * rowsPerPage
        }&ordering=${property}`
      );
    } else if (!isAsc) {
      setUrl(
        `http://144.202.67.136:8080/etsy/mapping/?status=${globStatu}&limit=${rowsPerPage}&offset=${
          page * rowsPerPage
        }&ordering=-${property}`
      );
    }
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const onChange = (e, row) => {
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
  };

  const handleChangePage = (event, newPage) => {
    console.log({ order });
    if (order === "asc") {
      console.log("order-desc-newpage");
      setUrl(
        `http://144.202.67.136:8080/etsy/mapping/?status=${globStatu}&limit=${rowsPerPage}&offset=${
          newPage * rowsPerPage
        }&ordering=-${orderBy}`
      );
    } else if (order === "desc") {
      console.log("asc-newpage");
      setUrl(
        `http://144.202.67.136:8080/etsy/mapping/?status=${globStatu}&limit=${rowsPerPage}&offset=${
          newPage * rowsPerPage
        }&ordering=${orderBy}`
      );
    }
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    console.log("event", event);
    setRowsPerPage(+event.target.value);
    let rpp = +event.target.value;
    setPage(0);
    setUrl(
      `http://144.202.67.136:8080/etsy/orders/?status=${globStatu}&limit=${rpp}&offset=${
        0 * rpp
      }`
    );
  };

  const handleRowClick = (id) => {
    console.log("id", id);
    const currentRow = rows.find((row) => row.id === id);
    if (currentRow) {
      if (!currentRow.isEditMode) {
        const newRows = rows.map((row) => {
          return { ...row, isEditMode: row.id === id };
        });
        setRows(newRows);
      }
    }
  };

  const handleRowChange = (id, data) => {
    console.log("data", data);
    putData(`http://144.202.67.136:8080/etsy/mapping/${id}/`, data)
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      })
      .finally(() => getListFunc());
  };

  const handleRowKeyDown = (e, id) => {
    console.log("e", e);
    if (e.key === "Enter") {
      let data = { [e.target.name]: e.target.defaultValue };
      handleRowChange(id, data);
    }
  };

  const handleRowBlur = (e, id) => {
    console.log("e", e);
    let data = { [e.target.name]: e.target.defaultValue };
    handleRowChange(id, data);
  };

  const onSelectChange = (e, row) => {
    console.log("e", e);
    e.preventDefault();
    // if (!previous[row.id]) {
    //   setPrevious((state) => ({ ...state, [row.id]: row }));
    // }
    const value = e.target.value;
    const name = e.target.name;
    const { id } = row;
    if ((name === "status") & (value === "pending") & (row.approved === true)) {
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
    // const newRows = rows.map((row) => {
    //   if (row.id === id) {
    //     return { ...row, [name]: value };
    //   }
    //   return row;
    // });
    // setRows(newRows);
    getListFunc();
  };

  const uploadFile = (e, id, imgFile) => {
    console.log("e", e);
    e.stopPropagation();
    try {
      let path = `http://144.202.67.136:8080/etsy/mapping/${id}/`;
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
  };

  const fileSelectedHandler = (e, id) => {
    e.stopPropagation();
    let imgFile = e.target.files[0];
    uploadFile(e, selectedRowId, imgFile);
  };
  const selectId = (event, id) => {
    event.stopPropagation();
    setSelectedRowId(id);
  };

  const handleApproveSelected = () => {
    console.log("handleApproveSelected");
    // postData("http://144.202.67.136:8080/etsy/approved_all/", checkBoxIds)
    //   .then((res) => {
    //     console.log(res);
    //     toastWarnNotify(res.data.Success);
    //     getListFunc();
    //   })
    //   .catch(({ response }) => {
    //     console.log(response.data.Failed);
    //     toastWarnNotify(response.data.Failed);
    //   });
  };

  const handleTagChange = (e) => {
    const statu = e.currentTarget.id;
    setSelected([]);
    setSelectedTag(statu);
    let newUrl = "http://144.202.67.136:8080/etsy/mapping/?";
    switch (statu) {
      case "all_orders":
        newUrl += `limit=${rowsPerPage}&offset=${page * rowsPerPage}`;
        break;
      case "repeat":
        newUrl += `is_repeat=true&limit=${rowsPerPage}&offset=${
          page * rowsPerPage
        }`;
        break;
      case "followUp":
        newUrl += `is_followup=true&limit=${rowsPerPage}&offset=${
          page * rowsPerPage
        }`;
        break;
      default:
        newUrl += `status=${globStatu}&status=${statu}&limit=${rowsPerPage}&offset=${
          page * rowsPerPage
        }`;
        break;
    }
    setUrl(newUrl);
    setglobStatu("");
    setPage(0);
  };

  const handlerFlagRepeatChange = (id, name, value) => {
    if (name === "is_repeat" && value === false) {
      console.log("inside is repeat", id, name, value);
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

  const handleSelectAllClick = (event) => {
    console.log("handleSelectAllClick");
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n?.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleCheckBoxClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  return (
    <Paper className={classes.root}>
      <CustomButtonGroup
        selectedTag={selectedTag}
        handleTagChange={handleTagChange}
        tagsData={tagsData}
      />
      <Button
        color="secondary"
        variant="contained"
        onClick={handleApproveSelected}
        className={classes.approveButton}
        disabled={!selected.length}
      >
        Approve Selected ({selected.length})
      </Button>
      <TableContainer className={classes.container}>
        <Table
          className={classes.table}
          stickyHeader
          aria-label="caption table"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell align="center" style={{ padding: 0 }}>
                <Checkbox
                  indeterminate={
                    selected.length > 0 && selected.length < rows.length
                  }
                  checked={rows.length > 0 && selected.length === rows.length}
                  onChange={handleSelectAllClick}
                  inputProps={{ "aria-label": "select all" }}
                />
              </StyledTableCell>
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
                        : null,
                  }}
                >
                  <td
                    style={{ padding: 0 }}
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
                      onClick={() =>
                        handlerFlagRepeatChange(
                          row.id,
                          "is_repeat",
                          row["is_repeat"]
                        )
                      }
                    />
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
                  <ConstantTableCell
                    {...{ row, name: "personalization", onChange }}
                  />
                  <ConstantTableCell
                    {...{ row, name: "message_from_buyer", onChange }}
                  />
                  <EditableTableCell {...{ row, name: "note", onChange }} />
                </StyledTableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <td colspan="3">
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={handleApproveSelected}
                  className={classes.approveButton}
                  disabled={!selected.length}
                >
                  Approve Selected ({selected.length})
                </Button>
              </td>
              <td>Total Record:{count || 0}</td>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 100]}
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
      <ToastContainer style={{ color: "black" }} />
    </Paper>
  );
}

export default App;
