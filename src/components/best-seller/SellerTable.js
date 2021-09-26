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
    padding: 10,
    width: "fit-content",
    minWidth: "500px",
    marginTop: 10,
  },
  thead: {
    backgroundColor: "black",
  },
  tableCellHeader: {
    color: "white",
  },
  darkTableRow: {
    backgroundColor: "#F2F2F2",
  },
  tableCell: {
    fontFamily: "Courier New",
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

const SellerTable = ({ bestSeller }) => {
  const classes = useStyles();
  const tableColumnName =
    bestSeller?.type === "topSeller" ? bestSellerColumns : colorNumberColumns;

  return (
    <div className={classes.bottom}>
      <div className={classes.tablePaper}>
        <TableContainer className={classes.tContainer}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead className={classes.thead}>
              <TableRow>
                {tableColumnName?.map((item, index) => (
                  <TableCell
                    className={classes.tableCellHeader}
                    align="center"
                    key={index}
                  >
                    {/* {item.name} */}
                    {/* {item?.name2 ? `/ ${item?.name2}` : null} */}
                    <FormattedMessage
                      id={item?.translate}
                      defaultMessage={item?.name}
                    />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {bestSeller?.bestRows?.map((row, index) => (
                <TableRow
                  key={index}
                  className={index % 2 === 1 ? classes.darkTableRow : null}
                >
                  {tableColumnName?.map((item, i) => (
                    <TableCell
                      key={i}
                      className={classes.tableCell}
                      align="center"
                    >
                      {row[item?.objKey]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default SellerTable;
