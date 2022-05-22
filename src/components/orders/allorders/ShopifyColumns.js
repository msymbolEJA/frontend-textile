import React from "react";
import { TableCell } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import CustomTableCell from "./CustomTableCell";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";

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
        <FormattedMessage id="title" defaultMessage="Title" />
      </StyledTableCell>
      <StyledTableCell align="center">
        <FormattedMessage id="var1" defaultMessage="Var1" />
      </StyledTableCell>
      <StyledTableCell align="center">
        <FormattedMessage id="var2" defaultMessage="Var2" />
      </StyledTableCell>
      <StyledTableCell align="center">
        <FormattedMessage id="var3" defaultMessage="Var3" />
      </StyledTableCell>
      <StyledTableCell align="center">
        <FormattedMessage id="var4" defaultMessage="Var4" />
      </StyledTableCell>
      <StyledTableCell align="center">
        <FormattedMessage id="countryId" defaultMessage="Country Id" />
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
  button: {
    maxWidth: "130px",
  },
}));

const CustomTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: "0.75rem",
  },
}))(Tooltip);

export const ShopifyColumnValues = ({ row = [{ mapping_data: [] }] }) => {
  const classes = useStyles();
  const columnsNumber = 4 - row?.mapping_data?.length;

  for (let index = 0; index < columnsNumber; index++) {
    row?.mapping_data?.push({ name: "", value: "-" });
  }

  return (
    <>
      <CustomTableCell {...{ row, name: "title" }} />
      {row.mapping_data?.map((each, index) => (
        <TableCell key={index} align="center" className={classes.tableCell}>
          {each?.name?.toLowerCase()?.includes("image") ? (
            <CustomTooltip title={each.name} placement="top-start">
              <Button className={classes.button}>
                <img src={each.value} alt={each.value} width="100px" />
              </Button>
            </CustomTooltip>
          ) : (
            <CustomTooltip title={each.name} placement="top-start">
              <Button className={classes.button}>{each.value}</Button>
            </CustomTooltip>
          )}
        </TableCell>
      ))}
      <CustomTableCell {...{ row, name: "country_id" }} />
    </>
  );
};
