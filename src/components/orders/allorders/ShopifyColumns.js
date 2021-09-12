import React from "react";
import { TableCell } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import CustomTableCell from "./CustomTableCell";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "black",
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const ShopifyColumnHeaders = () => {
  return (
    <>
      <StyledTableCell align="center">
        <FormattedMessage id="countryId" defaultMessage="Country Id" />
      </StyledTableCell>
      <StyledTableCell align="center">
        <FormattedMessage id="variation1" defaultMessage="Variation1" />
      </StyledTableCell>
      <StyledTableCell align="center">
        <FormattedMessage id="variation2" defaultMessage="Variation2" />
      </StyledTableCell>
      <StyledTableCell align="center">
        <FormattedMessage id="variation3" defaultMessage="Variation3" />
      </StyledTableCell>
      <StyledTableCell align="center">
        <FormattedMessage id="variation4" defaultMessage="Variation4" />
      </StyledTableCell>
      <StyledTableCell align="center">
        <FormattedMessage id="title" defaultMessage="Title" />
      </StyledTableCell>
    </>
  );
};

export default ShopifyColumnHeaders;

const useStyles = makeStyles((theme) => ({
  tableCell: {
    // width: 130,
    height: 40,
    maxWidth: "130px",
  },
}));

export const ShopifyColumnValues = ({ row = [{ mapping_data: [] }] }) => {
  const classes = useStyles();
  const columnsNumber = 4 - row?.mapping_data?.length;

  for (let index = 0; index < columnsNumber; index++) {
    row?.mapping_data?.push({ name: "", value: "-" });
  }

  return (
    <>
      <CustomTableCell {...{ row, name: "country_id" }} />
      {row.mapping_data?.map((each, index) => (
        <TableCell
          key={index}
          //   style={{ maxWidth: "200px" }}
          align="center"
          className={classes.tableCell}
        >
          {each.name}
          <br />
          <b style={{ fontSize: "1.1rem" }}>{each.value}</b>
        </TableCell>
      ))}
      <CustomTableCell {...{ row, name: "title" }} />
    </>
  );
};
