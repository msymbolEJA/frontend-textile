import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  tableCell: {
    padding: 10,
    width: 100,
    height: 40,
    borderRight: "0.5px solid #E0E0E0",
    fontFamily: "Courier New",
  },
}));

const ConstantTableCell = ({ row, name, name2, name3, minWidth }) => {
  //console.log("row", row);
  const classes = useStyles();
  return (
    <TableCell
      align="center"
      className={classes.tableCell}
      style={{
        minWidth,
        backgroundColor:
          name === "personalization" && !row[name]?.trim() && "#FF9494",
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
        moment
          .utc(row?.creation_tsz || row.created_date)
          .local()
          .format("MM-DD-YY HH:mm")
      ) : name === "sku" ? (
        row[name].substring("Linen_Dress_".length)
      ) : (
        row[name]?.replace(/&quot;/g, '"')?.replace(/&#39;/g, "'")
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
