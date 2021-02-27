import React from "react";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import { FormattedMessage } from "react-intl";
import { withStyles } from "@material-ui/core/styles";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#f5f5dc",
    color: theme.palette.common.black,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const SortableTableCell = ({
  property,
  property2,
  property3,
  handleRequestSort,
  order,
  orderBy,
  colName,
  setOrderBy,
}) => {
  return (
    <>
      <StyledTableCell
        align="center"
        style={{ padding: 0, textAlign: "center" }}
        //sortDirection={orderBy === "id" ? order : false}
        onClick={() => setOrderBy(property)}
      >
        <TableSortLabel
          active={orderBy === property}
          direction={orderBy === property ? order : "asc"}
          onClick={(event) => handleRequestSort(event, property)}
        >
          {property2 ? (
            <>
              <FormattedMessage id={property2} defaultMessage={property2} />/
              <br />
            </>
          ) : null}
          <FormattedMessage id={colName} defaultMessage={colName} />
          {property3 ? (
            <>
              /
              <br />
              <FormattedMessage id={property3} defaultMessage={property3} />
            </>
          ) : null}
        </TableSortLabel>
      </StyledTableCell>
    </>
  );
};

export default SortableTableCell;
