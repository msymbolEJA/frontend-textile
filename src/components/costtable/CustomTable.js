import React, { useState, useEffect } from "react";
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
import CircularProgress from "@material-ui/core/CircularProgress";
import { FormattedMessage, useIntl } from "react-intl";

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
  container: {
    minHeight: "150px",
  },
});

export default function StickyHeadTable({ title, tableId }) {
  const classes = useStyles();
  const [data, setData] = useState(null);
  const { formatMessage } = useIntl();

  const getListFunc = () => {
    getData(`${BASE_URL}etsy/${tableId}/`).then((response) => {
      setData(response.data.results);
    });
  };

  useEffect(() => {
    getListFunc();
    // eslint-disable-next-line
  }, []);

  return (
    <Paper className={classes.root}>
      <h2>
        {formatMessage({
          id: tableId === "qtyCost" ? "qtyCostTable" : "typeCostTable",
          defaultMessage: title,
        })}
      </h2>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">
                <FormattedMessage id="code" defaultMessage="Code" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage
                  id="description"
                  defaultMessage="Description"
                />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="cost" defaultMessage="Cost" />
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data === null ? (
              <tr>
                <td colSpan="7" style={{ display: "table-cell" }}>
                  <CircularProgress style={{ marginTop: "1rem" }} />
                </td>
              </tr>
            ) : (
              data?.map((row, index) => (
                <CustomTableBody
                  row={row}
                  key={index}
                  getListFunc={getListFunc}
                  tableId={tableId}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
