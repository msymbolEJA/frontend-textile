import React, { useEffect, useState } from "react";
import axios from "axios";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Input from "@material-ui/core/Input";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@material-ui/core/Paper";
import DATA from "../../helper/Data";
import { putData, getData } from "../../helper/PostData";
import TableContainer from "@material-ui/core/TableContainer";
import TablePaginationActions from "../tableitems/TablePaginationActions";
import CustomCheckbox from "../tableitems/CustomCheckbox";
import OrderStatus from "../tableitems/CustomSelectCell";
import UploadFile from "../tableitems/UploadFile";
import { putImage } from "../../helper/PostData";
import { ToastContainer } from "react-toastify";
import { toastWarnNotify } from "../otheritems/ToastNotify";

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
  tableCell: {
    width: 130,
    height: 40,
  },
  input: {
    width: 100,
    height: 40,
  },
  btnStyle: {
    backgroundColor: "orange",
    borderRadius: "5px",
    width: "6rem",
    cursor: "pointer",
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
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const CustomTableCell = ({ row, name, onChange }) => {
  const classes = useStyles();
  const { isEditMode } = row;
  return (
    <TableCell align="center" className={classes.tableCell}>
      {isEditMode ? (
        <Input
          value={row[name] ? row[name] : ""} // first : value={row[name]} // i've changed
          name={name}
          onChange={(e) => onChange(e, row)}
          className={classes.input}
        />
      ) : (
        row[name]
      )}
    </TableCell>
  );
};

function App() {
  const [rows, setRows] = React.useState(DATA);
  const [previous, setPrevious] = React.useState({});
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [count, setCount] = useState(0);
  //const [sendData, setSendData] = useState({});
  //const [globId, setGlobId] = useState();
  //const [selectedFile, setSelectedFile] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState();

  const getDataFunc = () => {
    let data = "";
    getData(
      `http://144.202.67.136:8080/etsy/mapping/?limit=${rowsPerPage}&offset=${
        page * rowsPerPage
      }`,
      data
    )
      .then((response) => {
        console.log(response.data);
        setRows(response.data.results);
        setCount(response.data.count);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getDataFunc();
    // eslint-disable-next-line
  }, [page, rowsPerPage]);

  const onChange = (e, row) => {
    if (!previous[row.id]) {
      setPrevious((state) => ({ ...state, [row.id]: row }));
    }
    const value = e.target.value;
    const name = e.target.name;
    const { id } = row;
    const newRows = rows.map((row) => {
      if (row.id === id) {
        //setSendData({ ...sendData, [name]: value });
        return { ...row, [name]: value };
      }
      return row;
    });
    setRows(newRows);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRowClick = (id) => {
    setRows((state) => {
      return rows.map((row) => {
        if (row.id === id) {
          return { ...row, isEditMode: true };
        }
        return row;
      });
    });
  };

  const handleRowChange = (id, data) => {
    //console.log("id", id);
    //console.log("data", data);
    setRows((state) => {
      return rows.map((row) => {
        if (row.id === id) {
          //console.log("hrcSendData",sendData)
          putData(`http://144.202.67.136:8080/etsy/mapping/${id}/`, data)
            .then((response) => {
              //console.log(response)
            })
            .catch((error) => {
              console.log(error);
            });
          //setSendData({})
          return { ...row, isEditMode: false };
        }
        return row;
      });
    });
    getDataFunc();
  };

  const handleRowKeyDown = (e, id) => {
    if (e.key === "Enter") {
      // console.log(e);
      // console.log(e.target.defaultValue);
      // console.log(e.target.name);
      let data = { [e.target.name]: e.target.defaultValue };
      //console.log(id, data);
      handleRowChange(id, data);
      getDataFunc();
      //handleRowChange(id);
    }
  };

  // const handleRowBlur = (e, id) => {
  //   //console.log(e);
  //   // console.log(e.target.defaultValue);
  //   // console.log(e.target.name);
  //   let data = { [e.target.name]: e.target.defaultValue };
  //   console.log(data);
  //   handleRowChange(id, data);
  //   getDataFunc();
  // };

  // Problem
  // Checkbox activate when onblur or enter
  // useEffect(() => {
  //   handleRowChange(globId);
  //   //console.log("useEffect")
  //   // eslint-disable-next-line
  // }, [globId]);

  const onCheckboxChange = (e, row) => {
    e.stopPropagation();
    if (!previous[row.id]) {
      setPrevious((state) => ({ ...state, [row.id]: row }));
    }
    const value = e.target.checked;
    const name = e.target.name;
    const { id } = row;
    //console.log("clicked checkbox")
    //console.log(name,value)
    if ((name === "approved") & (value === true) & (row.status === "pending")) {
      //setSendData({ [name]: value, status: "awaiting" });
      //getDataFunc();
      let data = { [name]: value, status: "awaiting" };
      handleRowChange(id, data);
      getDataFunc();
    } else if (
      (name === "approved") &
      (value === false) &
      (row.status === "awaiting")
    ) {
      //setSendData({ [name]: value, status: "pending" });
      let data = { [name]: value, status: "pending" };
      handleRowChange(id, data);
      getDataFunc();
    } else {
      //setSendData({ [name]: value });
      let data = { [name]: value };
      handleRowChange(id, data);
      getDataFunc();
      data = {};
    }

    const newRows = rows.map((row) => {
      if (row.id === id) {
        //console.log("sendData", sendData)
        //handleRowChange(id)
        //setGlobId(id);
        return { ...row, [name]: value };
      }
      return row;
    });
    setRows(newRows);
    /* console.log("name", name); */
    //getDataFunc();
  };

  const onSelectChange = (e, row) => {
    e.preventDefault();
    if (!previous[row.id]) {
      setPrevious((state) => ({ ...state, [row.id]: row }));
    }
    const value = e.target.value;
    const name = e.target.name;
    const { id } = row;
    //console.log("id, name, value, approved", id, name, value, row.approved);
    if ((name === "status") & (value === "pending") & (row.approved === true)) {
      let data = { [name]: value, approved: false };
      handleRowChange(id, data);
      // getDataFunc();
    } else if (
      (name === "status") &
      (value === "awaiting") &
      (row.approved === false)
    ) {
      let data = { [name]: value, approved: true };
      handleRowChange(id, data);
    } else {
      //setSendData({ ...sendData, [name]: value });
      let data = { [name]: value };
      handleRowChange(id, data);
    }
    const newRows = rows.map((row) => {
      if (row.id === id) {
        //console.log("sendData", sendData);
        //setGlobId(id);
        //handleRowChange(id)
        return { ...row, [name]: value };
      }
      return row;
    });
    setRows(newRows);
    getDataFunc();
  };

  const uploadFile = (e, id, imgFile) => {
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
          getDataFunc();
        });
    } catch (error) {
      toastWarnNotify("Select Image!");
    }
  };

  const fileSelectedHandler = (e, id) => {
    e.stopPropagation();
    //setSelectedFile(e.target.files[0]);
    let imgFile = e.target.files[0];
    uploadFile(e, selectedRowId, imgFile);
  };
  const selectId = (event, id) => {
    event.stopPropagation();
    //console.log("sfi", id);
    setSelectedRowId(id);
  };

  const approveAll = () => {
    console.log("Approve all");
    axios
      .get("http://144.202.67.136:8080/etsy/approved_all/")
      .then((res) => {
        console.log(res);
        toastWarnNotify(res.data.Success);
        getDataFunc();
      })
      .catch(({ response }) => {
        console.log(response.data.Failed);
        toastWarnNotify(response.data.Failed);
      });
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table
          className={classes.table}
          stickyHeader
          aria-label="caption table"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">
                Approved
                <button className={classes.btnStyle} onClick={approveAll}>
                  Approve All
                </button>
              </StyledTableCell>
              <StyledTableCell align="center">Status</StyledTableCell>
              <StyledTableCell align="center">Recept</StyledTableCell>
              <StyledTableCell align="center">Id</StyledTableCell>
              <StyledTableCell align="center">Last Updated</StyledTableCell>
              <StyledTableCell align="center">Item Index</StyledTableCell>
              <StyledTableCell align="center">Created Date</StyledTableCell>
              <StyledTableCell align="center">Buyer</StyledTableCell>
              <StyledTableCell align="center">Supplier</StyledTableCell>
              <StyledTableCell align="center">Type</StyledTableCell>
              <StyledTableCell align="center">Length</StyledTableCell>
              <StyledTableCell align="center">Color</StyledTableCell>
              <StyledTableCell align="center">Quantity</StyledTableCell>
              <StyledTableCell align="center">Size</StyledTableCell>
              <StyledTableCell align="center">Start</StyledTableCell>
              <StyledTableCell align="center">Space</StyledTableCell>
              <StyledTableCell align="center">Upload File</StyledTableCell>
              <StyledTableCell align="center">Explanation</StyledTableCell>
              <StyledTableCell align="center">Note</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow
                key={row.id}
                id={row.id}
                onClick={(e) => handleRowClick(row.id)}
                //onBlur={(e) => handleRowBlur(e, row.id)}
                onKeyDown={(e) => handleRowKeyDown(e, row.id)}
              >
                <td
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <CustomCheckbox
                    {...{ row, name: "approved", onCheckboxChange }}
                  />
                </td>
                <td
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <OrderStatus {...{ row, name: "status", onSelectChange }} />
                </td>
                <CustomTableCell {...{ row, name: "receipt", onChange }} />
                <CustomTableCell {...{ row, name: "id", onChange }} />
                <CustomTableCell {...{ row, name: "last_updated", onChange }} />
                <CustomTableCell {...{ row, name: "item_index", onChange }} />
                <CustomTableCell {...{ row, name: "created_date", onChange }} />
                <CustomTableCell {...{ row, name: "buyer", onChange }} />
                <CustomTableCell {...{ row, name: "supplier", onChange }} />
                <CustomTableCell {...{ row, name: "type", onChange }} />
                <CustomTableCell {...{ row, name: "length", onChange }} />
                <CustomTableCell {...{ row, name: "color", onChange }} />
                <CustomTableCell {...{ row, name: "qty", onChange }} />
                <CustomTableCell {...{ row, name: "size", onChange }} />
                <CustomTableCell {...{ row, name: "start", onChange }} />
                <CustomTableCell {...{ row, name: "space", onChange }} />
                <td
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <UploadFile
                    {...{
                      row,
                      name: "Image",
                      uploadFile,
                      fileSelectedHandler,
                      selectId,
                      selectedRowId,
                    }}
                  />
                </td>
                <CustomTableCell {...{ row, name: "explanation", onChange }} />
                <CustomTableCell {...{ row, name: "note", onChange }} />
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
