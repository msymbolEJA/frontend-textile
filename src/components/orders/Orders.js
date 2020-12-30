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
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import TableContainer from "@material-ui/core/TableContainer";
// Icons

import EditIcon from "@material-ui/icons/EditOutlined";
import DoneIcon from "@material-ui/icons/DoneAllTwoTone";
import RevertIcon from "@material-ui/icons/NotInterestedOutlined";
// Local Sample Data
import DATA from "../../helper/Data";
import TablePaginationActions from "./TablePaginationActions";
import CustomTableCell from "./CustomTableCell";

const tagsData = ["All", "USA", "TR", "DE", "FR", "NL", "JP"];

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
}));

function Orders() {
  const [rows, setRows] = useState(DATA);
  const [previous, setPrevious] = useState({});
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [selectedTag, setSelectedTag] = useState("All");
  const [filteredList, setFilteredList] = useState(DATA);

  useEffect(() => {
    const newList =
      selectedTag === "All"
        ? rows
        : rows.filter((item) => {
          return item?.Origin === selectedTag.toUpperCase();
        });
    setFilteredList(newList);
    // console.log(newList);
    // console.log(filteredList);
  }, [rows, selectedTag]);

  const handleTagChange = (e) => {
    setSelectedTag(e.currentTarget.id);
    /* console.log(e.target.innerHTML);
    console.log(e.currentTarget.id); */
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
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

  return (
    <Paper className={classes.root}>
      <ButtonGroup
        className={classes.buttonGroup}
        variant="contained"
        color="primary"
        aria-label="contained primary button group"
      >
        {tagsData.map((tag) => (
          <Button
            id={tag}
            key={tag}
            checked={selectedTag.indexOf(tag) > -1}
            onClick={(e) => handleTagChange(e)}
          >
            {tag}
          </Button>
        ))}
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
              <StyledTableCell align="center" />
              <StyledTableCell align="center">Name&nbsp;</StyledTableCell>
              <StyledTableCell align="center">MPG</StyledTableCell>
              <StyledTableCell align="center">Cylinders</StyledTableCell>
              <StyledTableCell align="center">Displacement</StyledTableCell>
              <StyledTableCell align="center">Horsepower</StyledTableCell>
              <StyledTableCell align="center">Weight(lb)</StyledTableCell>
              <StyledTableCell align="center">Acceleration</StyledTableCell>
              <StyledTableCell align="center">Year</StyledTableCell>
              <StyledTableCell align="center">Origin</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredList
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
                  <CustomTableCell
                    {...{ row, name: "Displacement", onChange }}
                  />
                  <CustomTableCell {...{ row, name: "Horsepower", onChange }} />
                  <CustomTableCell
                    {...{ row, name: "Weight_in_lbs", onChange }}
                  />
                  <CustomTableCell
                    {...{ row, name: "Acceleration", onChange }}
                  />
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

export default Orders;
