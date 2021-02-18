import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
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
// Local Sample Data
import DATA from "../../../helper/Data";
import TablePaginationActions from "./TablePaginationActions";
import CustomTableCell from "./CustomTableCell";
import Typography from "@material-ui/core/Typography";
const BASE_URL = process.env.REACT_APP_BASE_URL;

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
    "&:hover": {
      cursor: "pointer",
      boxShadow: "1px 2px",
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
  header: {
    fontSize: "1.5rem",
  },
  sub: {
    fontSize: "1rem",
  },
}));

function ReadyOrders() {
  const [rows, setRows] = useState(DATA);
  const [previous, setPrevious] = useState({});
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const history = useHistory();

  //--------------- Get Orders
  useEffect(() => {
    const myUrl = `${BASE_URL}etsy/orders/?limit=${rowsPerPage}&offset=${
      page * rowsPerPage
    }`;
    axios
      .get(myUrl)
      .then((res) => {
        setRows(res.data.results);
        setCount(res.data.count);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [page, rowsPerPage]);
  //------------------------------

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
    const id = row?.id;
    const newRows = rows.map((row) => {
      if (row.id === id) {
        return { ...row, [name]: value };
      }
      return row;
    });
    setRows(newRows);
  };

  const handleRowClick = (id) => {
    let res;
    rows.forEach((row) => {
      if (row.id === id) {
        res = row;
      }
    });
    history.push({
      pathname: "/order-details",
      state: { data: res },
    });
  };

  return (
    <Paper className={classes.root}>
      <Typography className={classes.header}>Ready Orders</Typography>
      <Typography className={classes.sub}>
        <span className={classes.header}>{count}</span> result found!
      </Typography>
      <TableContainer className={classes.container}>
        <Table
          className={classes.table}
          stickyHeader
          aria-label="sticky table"
          size="small"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Order No</StyledTableCell>
              <StyledTableCell align="center">Date</StyledTableCell>
              <StyledTableCell align="center">System Date</StyledTableCell>
              <StyledTableCell align="center">Type</StyledTableCell>
              <StyledTableCell align="center">Length</StyledTableCell>
              <StyledTableCell align="center">Color</StyledTableCell>
              <StyledTableCell align="center">Number</StyledTableCell>
              <StyledTableCell align="center">Size</StyledTableCell>
              <StyledTableCell align="center">Start</StyledTableCell>
              <StyledTableCell align="center">Gap</StyledTableCell>
              <StyledTableCell align="center">Explanation</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.map((row) => (
              <StyledTableRow
                key={row.id}
                id={row.id}
                onClick={() => handleRowClick(row.id)}
              >
                <CustomTableCell {...{ row, name: "receipt_id", onChange }} />
                <CustomTableCell {...{ row, name: "created_date", onChange }} />
                <CustomTableCell {...{ row, name: "creation_tsz", onChange }} />
                <CustomTableCell {...{ row, name: "buyer", onChange }} />
                <CustomTableCell {...{ row, name: "sku", onChange }} />
                <CustomTableCell
                  {...{ row, name: "seller_user_id", onChange }}
                />
                <CustomTableCell {...{ row, name: "color", onChange }} />
                <CustomTableCell {...{ row, name: "explanation", onChange }} />
                <CustomTableCell {...{ row, name: "is_ready", onChange }} />
                <CustomTableCell {...{ row, name: "item_index", onChange }} />
                <CustomTableCell {...{ row, name: "last_updated", onChange }} />
              </StyledTableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <td>Total Record :</td>
              <td>{count}</td>
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
    </Paper>
  );
}

export default ReadyOrders;
