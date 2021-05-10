import React, { useEffect, useState, useCallback } from "react";
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
  TablePagination,
  Paper,
  TableContainer,
  Checkbox,
  CircularProgress,
} from "@material-ui/core";
import {
  Flag as FlagIcon,
  Repeat as RepeatIcon,
  // ThumbUpAlt as ThumbUpAltIcon,
} from "@material-ui/icons";

import { putData, getData, globalSearch } from "../../helper/PostData";
import TablePaginationActions from "../tableitems/TablePaginationActions";
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
import { tagsData, repeatReasons } from "../../helper/Constants";
import Menu from "@material-ui/core/Menu";
import ListItemText from "@material-ui/core/ListItemText";
import { FormattedMessage } from "react-intl";
import MenuItem from "@material-ui/core/MenuItem";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const BASE_URL_MAPPING = process.env.REACT_APP_BASE_URL_MAPPING;

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
    margin: "5px auto 0",
    padding: "5px 2px",
    lineHeight: 1,
    fontSize: "small",
    maxWidth: 64,
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

const localstoragePrefix = process.env.REACT_APP_STORE_NAME_ORJ;

function App({ history }) {
  const [rows, setRows] = useState([]);
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [orderBy, setOrderBy] = useState("created_date");
  const [order, setOrder] = useState("asc");
  const [selectedRowId, setSelectedRowId] = useState();
  const [selected, setSelected] = useState([]);
  const filters = getQueryParams();
  const [selectedTag, setSelectedTag] = useState(filters?.status || "pending");
  const [repeatAnchorEl, setRepeatAnchorEl] = useState();
  const [rowIdToRepeat, setRowIdToRepeat] = useState();
  const [searchProg, setSearchProg] = useState(false);
  const [searchWord, setSearchWord] = useState("");
  const [loading, setloading] = useState(false);
  const [repeatMenuData, setRepeatMenuData] = useState({});

  const getListFunc = useCallback(() => {
    setloading(true);
    if (!searchProg) {
      getData(
        `${BASE_URL_MAPPING}?${
          filters?.status ? `status=${filters?.status}` : ""
        }&is_repeat=${filters?.is_repeat}&is_followup=${
          filters?.is_followup
        }&ordering=${filters?.ordering || "-id"}&limit=${
          filters?.limit
        }&offset=${filters?.offset}`
      )
        .then((response) => {
          const t = response?.data?.results?.length
            ? response?.data?.results
            : [];
          localStorage.setItem(
            `${localstoragePrefix}-mapping-${selectedTag}-${filters.limit}-${filters.offset}`,
            JSON.stringify(t)
          );
          localStorage.setItem(
            `${localstoragePrefix}-mapping-${selectedTag}-${filters.limit}-${filters.offset}-count`,
            response?.data?.count || 0
          );
          setRows(t);
        })
        .catch((error) => {
          localStorage.setItem(
            `${localstoragePrefix}-mapping-${selectedTag}-${filters.limit}-${filters.offset}-last_updated`,
            null
          );
          console.log("error", error);
        })
        .finally(() => setloading(false));
    }
  }, [
    filters?.is_followup,
    filters?.is_repeat,
    filters?.limit,
    filters?.offset,
    filters?.ordering,
    filters?.status,
    searchProg,
    selectedTag,
  ]);

  const getLastUpdateDate = () => {
    getData(`${BASE_URL}etsy/get_mapping_update_date/`)
      .then((response) => {
        const l = localStorage.getItem(
          `${localstoragePrefix}-mapping-${selectedTag}-${filters.limit}-${filters.offset}-last_updated`
        );
        if (response.data.last_updated !== l) {
          localStorage.setItem(
            `${localstoragePrefix}-mapping-${selectedTag}-${filters.limit}-${filters.offset}-last_updated`,
            response.data.last_updated
          );
          getListFunc();
        }
      })
      .catch((error) => {
        console.log("error", error);
      })
      .finally(() => {});
  };

  useEffect(() => {
    getLastUpdateDate();
    const tmp =
      JSON.parse(
        localStorage.getItem(
          `${localstoragePrefix}-mapping-${selectedTag}-${filters.limit}-${filters.offset}`
        )
      ) ?? [];
    if (!tmp.length) getListFunc();
    else {
      setRows(tmp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.ordering,
    filters.is_followup,
    filters.status,
    filters.is_repeat,
    filters.limit,
    filters.offset,
    count,
    selectedTag,
  ]);

  useEffect(() => {
    if (filters?.status) setSelectedTag(filters?.status);
  }, [filters?.status]);

  const handleRequestSort = (event, property) => {
    const isAsc = order === "asc";
    let currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.set("ordering", `${isAsc ? "" : "-"}${property}`);
    history.push(history.location.pathname + "?" + currentUrlParams.toString());
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const onChange = (e, id, name) => {
    if (!rows.length || !name || !e?.target?.innerText) return;
    if (
      rows?.filter((item) => item.id === name)?.[0]?.[name] ===
      e.target.innerText
    )
      return;
    handleRowChange(id, { [name]: e.target.innerText });
  };

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

  const handleRowChange = useCallback(
    (id, data) => {
      if (!data) return;
      if (
        rows?.filter((item) => item.id === id)?.[0]?.[Object.keys(data)[0]] ===
        Object.values(data)[0]
      )
        return;
      putData(`${BASE_URL_MAPPING}${id}/`, data)
        .then((response) => {})
        .catch((error) => {
          console.log(error);
        })
        .finally(() => getListFunc());
    },
    [getListFunc, rows]
  );

  const onSelectChange = (e, row) => {
    e.preventDefault();
    const value = e.target.value;
    const name = e.target.name;
    const { id } = row;
    if (
      (name === "status") &
      (value === "pending") &
      (row.is_repeat === true)
    ) {
      let data = { [name]: value, is_repeat: false };
      handleRowChange(id, data);
    }
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
    getListFunc();
  };

  const uploadFile = (e, id, imgFile) => {
    e.stopPropagation();
    try {
      let path = `${BASE_URL_MAPPING}${id}/`;
      putImage(path, imgFile, "image.png")
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
      console.log("error", error);
      toastWarnNotify("Select Image!");
    }
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

  const selectId = useCallback((event, id) => {
    event.stopPropagation();
    setSelectedRowId(id);
  }, []);

  const handleApproveSelected = () => {
    postData(`${BASE_URL}etsy/approved_all/`, { ids: selected })
      .then((res) => {
        toastWarnNotify("Selected 'PENDING' orders are approved");
        getListFunc();
        setSelected([]);
      })
      .catch(({ response }) => {
        toastWarnNotify(response?.data?.detail);
      });
  };

  const handleTagChange = (e) => {
    setSearchProg(false);
    if (e.currentTarget.id === filters?.status) return;
    setRows([]);
    //document.getElementById("globalSearch").value = "";
    const statu = e.currentTarget.id;
    setSelected([]);
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
    history.push(`/approval?&${newUrl}`);
    setPage(0);
  };

  const handlerFlagRepeatChange = (id, name, value) => {
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

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows?.map((row) => {
        if (!(!!row.supplier && !!row.type && !!row.color && !!row.length))
          return null;
        return row?.id;
      });
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleCheckBoxClick = (event, id, row) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (!(!!row.supplier && !!row.type && !!row.color && !!row.length)) return;
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
  };

  useEffect(() => {
    if (searchWord) {
      globalSearchFunc(searchWord);
    }
    // eslint-disable-next-line
  }, [page, searchWord]);

  const globalSearchFunc = (searchWord) => {
    globalSearch(
      `${BASE_URL_MAPPING}?search=${searchWord}&limit=${25}&offset=${page * 25}`
    )
      .then((response) => {
        //console.log(response.data.count);
        setRows(response.data.results);
        setCount(response?.data?.count || 0);
        //setList(response.data.results);
        let newUrl = "";
        newUrl += `limit=${25}&offset=${page * 25}`;
        history.push(`/approval?&${searchWord}&${newUrl}`);
      })
      .catch((error) => {
        console.log(error);
        setRows([]);
      });
  };

  const searchHandler = (e, second) => {
    if (e.keyCode === 13 && !(e.target.value === "")) {
      setRows([]);
      setSearchProg(!(e.target.value === ""));

      setSearchWord(e.target.value);
      setPage(0);
      // searchWord = ;
      if (searchWord) {
        globalSearchFunc(searchWord);
      }
    } else if (e === 1 && !(second === "")) {
      setSearchWord(second);
      setPage(0);
      // searchWord = ;
      if (second) {
        globalSearchFunc(second);
      }
    }
  };

  const handlerRepeatChange = (e, id, is_repeat) => {
    if (is_repeat) {
      let data = { is_repeat: false };
      handleRowChange(id, data);
    } else {
      setRowIdToRepeat(id);
      setRepeatAnchorEl(e.currentTarget);
    }
  };

  const handleRepeatMenuClose = useCallback(() => {
    setRepeatAnchorEl(null);
    setRepeatMenuData({});
  }, []);

  const handleRepeatMenuConfirm = useCallback(() => {
    if (repeatMenuData.rowId) {
      handleRowChange(repeatMenuData.rowId, repeatMenuData);
    }
    handleRepeatMenuClose();
  }, [handleRowChange, repeatMenuData, handleRepeatMenuClose]);

  const handleRepeatMenuItemClick = useCallback(
    (row, reason) => () => {
      const data = {
        rowId: row.id,
        is_repeat: true,
        approved: true,
        status: "awaiting",
        explanation: "**REPEAT: " + reason + "** " + row?.explanation,
      };
      setRepeatMenuData(data);
    },
    []
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
            onClose={handleRepeatMenuClose}
          >
            <hr />
            <StyledMenuItem>
              <ListItemText
                primary="Wrong manufacturing"
                id="Wrong manufacturing"
                onClick={handleRepeatMenuItemClick(
                  row,
                  repeatReasons.MANUFACTURING_ERROR
                )}
              />
            </StyledMenuItem>
            <StyledMenuItem>
              <ListItemText
                primary="Discoloration"
                id="discoloration"
                onClick={handleRepeatMenuItemClick(
                  row,
                  repeatReasons.DISCOLORATION
                )}
              />
            </StyledMenuItem>
            <StyledMenuItem>
              <ListItemText
                primary="Break off"
                id="break off"
                onClick={handleRepeatMenuItemClick(
                  row,
                  repeatReasons.BREAK_OFF
                )}
              />
            </StyledMenuItem>
            <StyledMenuItem>
              <ListItemText
                primary="Lost in mail"
                id="lost in mail"
                onClick={handleRepeatMenuItemClick(
                  row,
                  repeatReasons.LOST_IN_MAIL
                )}
              />
            </StyledMenuItem>
            <StyledMenuItem>
              <ListItemText
                primary="Second"
                id="Second"
                onClick={handleRepeatMenuItemClick(row, repeatReasons.SECOND)}
              />
            </StyledMenuItem>
            <StyledMenuItem style={{ justifyContent: "space-around" }}>
              <Button
                color="primary"
                variant="contained"
                onClick={handleRepeatMenuClose}
              >
                Cancel
              </Button>
              <Button
                color="secondary"
                variant="contained"
                onClick={handleRepeatMenuConfirm}
              >
                OK
              </Button>
            </StyledMenuItem>
          </StyledMenu>
        </>
      );
    },
    [
      handleRepeatMenuClose,
      handleRepeatMenuConfirm,
      handleRepeatMenuItemClick,
      repeatAnchorEl,
    ]
  );

  return (
    <Paper className={classes.root}>
      <CustomButtonGroup
        selectedTag={selectedTag}
        handleTagChange={handleTagChange}
        tagsData={tagsData}
        searchHandler={searchHandler}
      />
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
                `${localstoragePrefix}-mapping-${selectedTag}-${filters.limit}-${filters.offset}-count`
              )
            )
              ? localStorage.getItem(
                  `${localstoragePrefix}-mapping-${selectedTag}-${filters.limit}-${filters.offset}-count`
                ) ?? 0
              : `${rows.length}/${
                  localStorage.getItem(
                    `${localstoragePrefix}-mapping-${selectedTag}-${filters.limit}-${filters.offset}-count`
                  ) ?? 0
                }`}
          </>
        )}
      </div>
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
                  padding: 0,
                  pointerEvents: selectedTag === "pending" ? "auto" : "none",
                  borderRight: "0.5px solid #E0E0E0",
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
                <br />
                <Checkbox
                  indeterminate={
                    selected?.length > 0 && selected?.length < rows?.length
                  }
                  checked={
                    rows?.length > 0 && selected?.length === rows?.length
                  }
                  color="primary"
                  onChange={handleSelectAllClick}
                  inputProps={{ "aria-label": "select all" }}
                />
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
              <SortableTableCell
                property="gift_message"
                handleRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                colName="giftMessage"
                setOrderBy={setOrderBy}
              />
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
          {rows.length ? (
            <TableBody>
              {rows?.map((row, index) => {
                const isItemSelected = selected.indexOf(row.id) !== -1;
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <StyledTableRow
                    key={row.id}
                    id={row.id}
                    //onBlur={(e) => handleRowBlur(e, row.id)}
                    //onKeyDown={(e) => handleRowKeyDown(e, row.id)}
                    style={{
                      backgroundColor:
                        (row.status !== "pending") & (row.approved === false)
                          ? "#FF9494"
                          : row["type"]?.includes("14K") ||
                            row["explanation"]?.includes("14K")
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
                      style={{
                        padding: 0,
                        borderBottom: "1px solid #e0e0e0",
                        borderRight: "0.5px solid #E0E0E0",
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handlerRepeatChange(e, row.id, row.is_repeat);
                        }}
                      />
                      {Boolean(repeatAnchorEl) && row.id === rowIdToRepeat
                        ? repeatMenu(row)
                        : null}
                      {/* <ThumbUpAltIcon
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
                      /> */}
                      <OrderStatus
                        {...{ row, name: "status", onSelectChange }}
                      />
                    </td>
                    <ConstantTableCell
                      {...{ row, name: "created_date", name3: "buyer" }}
                    />
                    <EditableTableCell
                      {...{
                        row,
                        name: "supplier",
                        onChange,
                      }}
                    />
                    <EditableTableCell
                      {...{
                        row,
                        name: "type",
                        onChange,
                      }}
                    />
                    <EditableTableCell
                      {...{
                        row,
                        name: "length",
                        onChange,
                      }}
                    />
                    <EditableTableCell
                      {...{
                        row,
                        name: "color",
                        onChange,
                      }}
                    />
                    <EditableTableCell
                      {...{
                        row,
                        name: "qty",
                        onChange,
                      }}
                    />
                    <EditableTableCell
                      {...{
                        row,
                        name: "size",
                        onChange,
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
                      }}
                    />
                    <EditableTableCell
                      {...{
                        row,
                        name: "explanation",
                        onChange,
                      }}
                    />
                    <td
                      style={{
                        padding: 0,
                        borderBottom: "1px solid #e0e0e0",
                        pointerEvents:
                          row.status === "pending" ? "auto" : "none",
                        borderRight: "0.5px solid #E0E0E0",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCheckBoxClick(e, row.id, row);
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
                        disabled={
                          !(
                            !!row.supplier &&
                            !!row.type &&
                            !!row.color &&
                            !!row.length
                          )
                        }
                        color="primary"
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
                  </StyledTableRow>
                );
              })}
            </TableBody>
          ) : !loading ? null : (
            <tbody>
              <tr>
                <td colSpan="18" style={{ display: "table-cell" }}>
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
                  `${localstoragePrefix}-mapping-${selectedTag}-${filters.limit}-${filters.offset}-count`
                ) || 0}
              </td>
              <TablePagination
                rowsPerPageOptions={[25, 50, 100, 250, 500, 2500]}
                colSpan={22}
                count={Number(
                  localStorage.getItem(
                    `${localstoragePrefix}-mapping-${selectedTag}-${filters.limit}-${filters.offset}-count`
                  ) ?? 0
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
      <ToastContainer style={{ color: "black" }} />
    </Paper>
  );
}

export default App;
