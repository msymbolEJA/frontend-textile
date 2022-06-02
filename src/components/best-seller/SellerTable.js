import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { FormattedMessage } from "react-intl";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { bestSellerColumns, colorNumberColumns } from "../../helper/Constants";

const useStyles = makeStyles((theme) => ({
  tContainer: {
    padding: 1,
    width: "fit-content",
    minWidth: "500px",
    marginTop: 10,
  },
  tableCellHeader: {
    color: "black",
    border: "1px white solid",
    backgroundColor: "rgb(100, 149, 237)",
    padding: 13,
  },
  darkTableRow: {
    backgroundColor: "#F2F2F2",
  },
  tableCell: {
    fontFamily: "Courier New",
    border: "1px solid gray",
    borderBottom: "2px solid black",
    borderTop: "2px solid black",
    padding: 13,
  },
  tablePaper: {
    marginTop: "10px",
    border: "1px solid lightgrey",
    borderRadius: "5px",
  },
  bottom: {
    display: "flex",
    justifyContent: "center",
  },
}));

const SellerTable = ({ bestSeller: { typeColumn, items, totals } }) => {
  const classes = useStyles();

  return (
    <div className={classes.bottom}>
      <div className={classes.tablePaper}>
        <TableContainer className={classes.tContainer}>
          <Table className={classes.table} aria-label="simple table">
            <TableBody>
              {typeColumn?.map((typeName, index) => {
                return (
                  typeName !== "null" && (
                    <TableRow
                      key={index}
                      className={index % 2 === 1 ? classes.darkTableRow : null}
                    >
                      <TableCell className={classes.tableCellHeader}>
                        {typeName} ({totals[index]})
                      </TableCell>
                      {items[typeName]?.map((item, i) => (
                        <>
                          <TableCell key={i} className={classes.tableCell}>
                            {item.color || "-"} ({item.color_count || 0} adet)
                            <br />
                            {item.goldGr_count || 0} gr Altın
                          </TableCell>
                        </>
                      ))}
                    </TableRow>
                  )
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default SellerTable;
