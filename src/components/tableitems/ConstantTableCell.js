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

  if (name === "created_date") {
    var str = row[name];
    var date = moment(str);
    var dateComponent = date.utc().format("DD-MM-YY");
    var timeComponent = date.utc().format("HH:mm");
    row[name] = dateComponent + " " + timeComponent;
  }
  return (
    <TableCell
      align="center"
      className={classes.tableCell}
      style={{ minWidth: name === "message_from_buyer" ? "250px" : "auto" }}
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
        </>
      ) : null}
    </TableCell>
  );
};

export default ConstantTableCell;
