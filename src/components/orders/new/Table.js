import React from "react";
import PropTypes from "prop-types";
import { withStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";
import TablePagination from "@material-ui/core/TablePagination";
import TableFooter from "@material-ui/core/TableFooter";
import IconButton from "@material-ui/core/IconButton";
// Icons
import LastPageIcon from "@material-ui/icons/LastPage";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import EditIcon from "@material-ui/icons/EditOutlined";
import DoneIcon from "@material-ui/icons/DoneAllTwoTone";
import RevertIcon from "@material-ui/icons/NotInterestedOutlined";

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

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
    width: 130,
    height: 40,
  },
}));

const CustomTableCell = ({ row, name, onChange }) => {
  const classes = useStyles();
  const { isEditMode } = row;
  return (
    <TableCell align="center" className={classes.tableCell}>
      {isEditMode ? (
        <Input
          value={row[name]}
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

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

function Orders({ list }) {
  const [rows, setRows] = React.useState(list);
  const [previous, setPrevious] = React.useState({});
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onToggleEditMode = (id) => {
    setRows((state) => {
      return rows.map((row) => {
        if (row.id === id) {
          return { ...row, isEditMode: !row.isEditMode };
        }
        return row;
      });
    });
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

  const onRevert = (id) => {
    const newRows = rows.map((row) => {
      if (row.id === id) {
        return previous[id] ? previous[id] : row;
      }
      return row;
    });
    setRows(newRows);
    setPrevious((state) => {
      delete state[id];
      return state;
    });
    onToggleEditMode(id);
  };

  React.useEffect(() => {
    // console.log("list_table", list);
    setRows(list);
  }, [list]);

  return (
    <Paper className={classes.root}>
      <Table className={classes.table} aria-label="caption table" size="small">
        <caption>Can be added Company Name!</caption>
        <TableHead>
          <TableRow>
            <StyledTableCell align="center" />
            <StyledTableCell align="center">Name</StyledTableCell>
            <StyledTableCell align="center">Miles Per Gallon</StyledTableCell>
            <StyledTableCell align="center">Cylinders</StyledTableCell>
            <StyledTableCell align="center">Displacement</StyledTableCell>
            <StyledTableCell align="center">Horsepower</StyledTableCell>
            <StyledTableCell align="center">Weight(lbs)</StyledTableCell>
            <StyledTableCell align="center">Acceleration</StyledTableCell>
            <StyledTableCell align="center">Year</StyledTableCell>
            <StyledTableCell align="center">Origin</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row) => (
              <StyledTableRow key={row.id}>
                <TableCell className={classes.selectTableCell}>
                  {row.isEditMode ? (
                    <>
                      <IconButton
                        aria-label="done"
                        onClick={() => onToggleEditMode(row.id)}
                      >
                        <DoneIcon />
                      </IconButton>
                      <IconButton
                        aria-label="revert"
                        onClick={() => onRevert(row.id)}
                      >
                        <RevertIcon />
                      </IconButton>
                    </>
                  ) : (
                    <IconButton
                      aria-label="delete"
                      onClick={() => onToggleEditMode(row.id)}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                </TableCell>
                <CustomTableCell {...{ row, name: "Name", onChange }} />
                <CustomTableCell
                  {...{ row, name: "Miles_per_Gallon", onChange }}
                />
                <CustomTableCell {...{ row, name: "Cylinders", onChange }} />
                <CustomTableCell {...{ row, name: "Displacement", onChange }} />
                <CustomTableCell {...{ row, name: "Horsepower", onChange }} />
                <CustomTableCell
                  {...{ row, name: "Weight_in_lbs", onChange }}
                />
                <CustomTableCell {...{ row, name: "Acceleration", onChange }} />
                <CustomTableCell {...{ row, name: "Year", onChange }} />
                <CustomTableCell {...{ row, name: "Origin", onChange }} />
              </StyledTableRow>
            ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={10}
              count={rows.length}
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
    </Paper>
  );
}

export default Orders;
