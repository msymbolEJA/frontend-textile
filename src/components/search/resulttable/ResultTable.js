import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
// Local Sample Data
import CustomTableCell from "./CustomTableCell";
import Typography from "@material-ui/core/Typography";
import { FormattedMessage } from "react-intl";

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
    overflowX: "auto",
  },
  container: {
    // maxHeight: "83vh",
    marginTop: theme.spacing(2),
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
  bottomSection: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  warn: {
    color: "#cc5500",
    backgroundColor: "#FFF4E5",
    borderRadius: "5px",
    height: "5rem",
    fontSize: "2rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "30rem",
  },
}));

function ResultTable({ list }) {
  const classes = useStyles();

  //console.log("list", list)

  return (
    <Paper className={classes.root}>
      <Typography className={classes.header}>
        <FormattedMessage id="resultTable" defaultMessage="Result Table" />
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
              <StyledTableCell align="center">
                <FormattedMessage id="id" defaultMessage="Id" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="status" defaultMessage="Status" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="supplier" defaultMessage="Supplier" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage
                  id="createdDate"
                  defaultMessage="Created Date"
                />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage
                  id="createdTSZ"
                  defaultMessage="Created TSZ"
                />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="color" defaultMessage="Color" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="length" defaultMessage="Length" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="buyer" defaultMessage="Buyer" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="itemIndex" defaultMessage="Item Index" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="size" defaultMessage="Size" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="start" defaultMessage="Start" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="quantity" defaultMessage="Quantity" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="SKU" defaultMessage="SKU" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage id="type" defaultMessage="Type" />
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormattedMessage
                  id="transaction"
                  defaultMessage="Transaction"
                />
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list?.map((row) => (
              <StyledTableRow key={row.id}>
                <CustomTableCell {...{ row, name: "id" }} />
                <CustomTableCell {...{ row, name: "status" }} />
                <CustomTableCell {...{ row, name: "supplier" }} />
                <CustomTableCell {...{ row, name: "created_date" }} />
                <CustomTableCell {...{ row, name: "creation_tsz" }} />
                <CustomTableCell {...{ row, name: "color" }} />
                <CustomTableCell {...{ row, name: "length" }} />
                <CustomTableCell {...{ row, name: "buyer" }} />
                <CustomTableCell {...{ row, name: "item_index" }} />
                <CustomTableCell {...{ row, name: "size" }} />
                <CustomTableCell {...{ row, name: "start" }} />
                <CustomTableCell {...{ row, name: "qty" }} />
                <CustomTableCell {...{ row, name: "sku" }} />
                <CustomTableCell {...{ row, name: "type" }} />
                <CustomTableCell {...{ row, name: "transaction" }} />
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {list?.length === 0 ? (
        <div colSpan="2" className={classes.bottomSection}>
          <h1 className={classes.warn}>Nothing Found</h1>
        </div>
      ) : null}
    </Paper>
  );
}

export default ResultTable;
