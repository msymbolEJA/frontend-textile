import React from "react";
import TableCell from "@material-ui/core/TableCell";
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
    padding: 0,
    backgroundColor: "#f5f5dc",
    color: theme.palette.common.black,
    borderRight: "0.5px solid #E0E0E0",
    fontFamily: "Courier New",
    fontWeight: "bold",
  },
}))(TableCell);

const TableCellHeader = ({ headerName, id }) => {
  const classes = useStyles();

  return (
    <StyledTableCell align="center" className={classes.head}>
      <FormattedMessage id={id} defaultMessage={headerName} />
    </StyledTableCell>
  );
};

export default TableCellHeader;
