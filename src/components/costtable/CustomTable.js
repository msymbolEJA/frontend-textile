import React, { useState, useEffect, useCallback } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { getData } from "../../helper/PostData";
import CustomTableBody from "./CustomTableBody.js";

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
      //boxShadow: "1px 2px",
      backgroundColor: "#add8e6",
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  root: {
    width: 500,
    margin: "1rem",
    height: "fit-content",
  },
  editable: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default function StickyHeadTable({ title, tableId }) {
  const classes = useStyles();
  const [data, setData] = useState();

  const getListFunc = () => {
    getData(`${BASE_URL}etsy/${tableId}/`).then((response) => {
      console.log(response.data.results);
      setData(response.data.results);
    });
  };

  useEffect(() => {
    getListFunc();
  }, []);

  return (
    <Paper className={classes.root}>
      <h2>{title}</h2>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Code</StyledTableCell>
              <StyledTableCell align="center">Cost</StyledTableCell>
              <StyledTableCell align="center">Description</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row, index) => (
              <CustomTableBody
                row={row}
                key={index}
                getListFunc={getListFunc}
                tableId={tableId}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
