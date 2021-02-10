import React, { useState, useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import TableFooter from "@material-ui/core/TableFooter";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import TableContainer from "@material-ui/core/TableContainer";
// Local Sample Data
import DATA from "../../../helper/OrderPrepData";
import TablePaginationActions from "../TablePaginationActions";
import CustomTableCell from "./CustomTableCell";
import OrderStatus from "./CustomSelectCell";
import CustomCheckbox from "./CustomCheckbox";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
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
}));

function OrderPrep() {
  const [rows, setRows] = useState(DATA);
  const [previous, setPrevious] = useState({});
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selectedTag, setSelectedTag] = useState("All");
  const [filteredList, setFilteredList] = useState(DATA);

  useEffect(() => {
    const newList =
      selectedTag === "All"
        ? rows
        : rows.filter((item) => {
            return item?.ready === false;
          });
    setFilteredList(newList);
  }, [rows, selectedTag]);

  const handleTagChange = (e) => {
    setSelectedTag(e.currentTarget.id);
    // console.log(e.target.innerHTML);
    // console.log("target : ", e.target.id);
    // console.log("cT : ", e.currentTarget.id);
    setPage(0);
  };

  console.log(DATA);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
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

  const onCheckboxChange = (e, row) => {
    if (!previous[row.id]) {
      setPrevious((state) => ({ ...state, [row.id]: row }));
    }
    const value = e.target.checked;
    const name = e.target.name;
    const { id } = row;
    const newRows = rows.map((row) => {
      if (row.id === id) {
        return { ...row, [name]: value };
      }
      return row;
    });
    setRows(newRows);
    /* console.log("name", name); */
  };

  const onSelectChange = (e, row) => {
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
    // console.log("name", name);
    // console.log("value", value);
    // console.log(newRows);
  };

  return (
    <Paper className={classes.root}>
      <h3>Order Preparation</h3>
      <ButtonGroup
        className={classes.buttonGroup}
        variant="contained"
        color="primary"
        aria-label="contained primary button group"
      >
        <Button onClick={(e) => handleTagChange(e)} id="All">
          All
        </Button>
        <Button onClick={(e) => handleTagChange(e)} id="notReady">
          Not Ready
        </Button>
      </ButtonGroup>
      <TableContainer className={classes.container}>
        <Table
          className={classes.table}
          stickyHeader
          aria-label="sticky table"
          size="small"
        >
          <caption>Can be added Company Name!</caption>
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Nr</StyledTableCell>
              <StyledTableCell align="center">Date</StyledTableCell>
              <StyledTableCell align="center">Buyer</StyledTableCell>
              <StyledTableCell align="center">Status</StyledTableCell>
              <StyledTableCell align="center">Supplier</StyledTableCell>
              <StyledTableCell align="center">Name</StyledTableCell>
              <StyledTableCell align="center">Length</StyledTableCell>
              <StyledTableCell align="center">Color</StyledTableCell>
              <StyledTableCell align="center">Qty</StyledTableCell>
              <StyledTableCell align="center">Size</StyledTableCell>
              <StyledTableCell align="center">Start</StyledTableCell>
              <StyledTableCell align="center">Gap</StyledTableCell>
              <StyledTableCell align="center">Ready</StyledTableCell>
              <StyledTableCell align="center">Explanation</StyledTableCell>
              <StyledTableCell align="center">Personalization</StyledTableCell>
              <StyledTableCell align="center">C.Note</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <StyledTableRow key={row.id}>
                  <CustomTableCell
                    {...{ row, name: "orderNumber", onChange }}
                  />
                  <CustomTableCell {...{ row, name: "orderDate", onChange }} />
                  <CustomTableCell {...{ row, name: "orderBuyer", onChange }} />
                  <td>
                    <OrderStatus {...{ row, name: "status", onSelectChange }} />
                  </td>
                  <CustomTableCell
                    {...{ row, isEdit: true, name: "supplier", onChange }}
                  />
                  <CustomTableCell {...{ row, name: "orderName", onChange }} />
                  <CustomTableCell
                    {...{ row, name: "orderLength", onChange }}
                  />
                  <CustomTableCell {...{ row, name: "orderColor", onChange }} />
                  <CustomTableCell {...{ row, name: "qty", onChange }} />
                  <CustomTableCell {...{ row, name: "size", onChange }} />
                  <CustomTableCell {...{ row, name: "start", onChange }} />
                  <CustomTableCell {...{ row, name: "gap", onChange }} />
                  <td>
                    <CustomCheckbox
                      {...{ row, name: "ready", onCheckboxChange }}
                    />
                  </td>
                  <CustomTableCell
                    {...{ row, name: "explanation", onChange }}
                  />
                  <CustomTableCell
                    {...{ row, name: "personalization", onChange }}
                  />
                  <CustomTableCell {...{ row, name: "cNote", onChange }} />
                </StyledTableRow>
              ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={17}
                count={filteredList.length}
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
    </Paper>
  );
}

export default OrderPrep;
