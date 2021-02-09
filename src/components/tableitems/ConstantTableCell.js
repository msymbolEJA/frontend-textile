import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  tableCell: {
    width: 130,
    height: 40,
  },
}));

const ConstantTableCell = ({ row, name, name2, name3 }) => {
  const classes = useStyles();
  return (
    <TableCell
      align="center"
      className={classes.tableCell}
      style={{
        backgroundColor:
          name === "personalization" && !row[name].trim() && "#FF9494",
      }}
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
      ) : name === "created_date" ? (
        moment(row[name]).format("DD-MM-YY HH:mm")
      ) : (
        row[name]
      )}
      {name3 ? (
        <>
          <br />
          {row[name3]}
        </>
      ) : null}
    </TableCell>
  );
};

export default ConstantTableCell;
