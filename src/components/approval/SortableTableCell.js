import React from "react";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
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
  handleRequestSort,
  order,
  orderBy,
  colName,
  setOrderBy,
}) => {
  //   setOrderBy(property);
  // console.log({ property });
  // console.log({ order });
  // console.log({ orderBy });
  return (
    <>
      <StyledTableCell
        align="center"
        //sortDirection={orderBy === "id" ? order : false}
        onClick={() => setOrderBy(property)}
      >
        <TableSortLabel
          active={orderBy === property}
          direction={orderBy === property ? order : "asc"}
          onClick={(event) => handleRequestSort(event, property)}
        >
          {colName}
        </TableSortLabel>
      </StyledTableCell>
    </>
  );
};

export default SortableTableCell;
