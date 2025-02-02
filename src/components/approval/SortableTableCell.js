import React from "react";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import { FormattedMessage } from "react-intl";
import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  icon: {
    display: "none",
  },
});

const StyledTableCell = withStyles((theme) => ({
  head: {
    padding: 10,
    backgroundColor: props => (props.isLabel ? "#eb6223" : "rgb(100, 149, 237)"),
    color: theme.palette.common.white,
    borderRight: "0.5px solid #E0E0E0",
    fontWeight: "bold",
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
  style,
  isLabel
}) => {
  let customStyle;
  if (property === "explanation") {
    customStyle = { padding: 10, textAlign: "center", minWidth: "200px" };
  } else if (
    property === "variation_1_name" ||
    property === "variation_2_name" ||
    property === "variation_1_value" ||
    property === "variation_2_value"
  ) {
    customStyle = { padding: 10, textAlign: "center", minWidth: "150px" };
  } else if (property === "id") {
    customStyle = { padding: 10, textAlign: "center" };
  } else {
    customStyle = { padding: 10, textAlign: "center" };
  }
  const classes = useStyles();

  return (
    <>
      <StyledTableCell
        align="center"
        style={({ ...customStyle }, { ...style })}
        //sortDirection={orderBy === "id" ? order : false}
        onClick={() => setOrderBy(property)}
         isLabel={isLabel}
      >
        <TableSortLabel
          active={orderBy === property}
          direction={orderBy === property ? order : "asc"}
          onClick={(event) => handleRequestSort(event, property)}
          classes={{ icon: classes.icon }}
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
