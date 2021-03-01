import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";

const useStyles = makeStyles((theme) => ({
  tableCell: {
    width: 130,
    height: 40,
    borderRight: "0.5px solid grey",
  },
}));

const FlagAndFavCell = ({ row, name, name2, name3 }) => {
  const classes = useStyles();
  return (
    <TableCell
      align="center"
      className={classes.tableCell}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {name2 ? (
        <>
          {row[name2]}
          <br />
        </>
      ) : null}
      {name === "id" ? (
        <a href={`/order-details/${row.id}`}>{row[name]}</a>
      ) : (
        row[name]
      )}
      {name3 ? (
        <>
          <br />
          {row[name3]}
          <br />
        </>
      ) : null}
    </TableCell>
  );
};

export default FlagAndFavCell;
