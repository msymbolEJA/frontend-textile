import React from "react";
import { FormattedMessage } from "react-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  tContainer: {
    padding: 1,
    width: "fit-content",
    marginTop: 10,
  },
  rowWithNull: {
    backgroundColor: "black",
    color: "white",
  },
  tableCellHeader: {
    color: "black",
    border: "1px white solid",
    backgroundColor: "lightblue",
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
    marginBottom: "10px",
    borderRadius: "5px",
    overflowX: "auto",
  },
  bottom: {
    display: "flex",
    justifyContent: "center",
  },
  table: {},
  boldText: {
    fontWeight: "bold",
  },
  blackGround: {
    backgroundColor: "black",
    color: "white",
  },
  centerCell: {
    textAlign: "center",
  },
}));

const SellerTable = ({ bestRows }) => {
  const classes = useStyles();

  const groupByTypeAndColor = items => {
    return items.reduce((result, item) => {
      const { type, color, total_cost, labor_cost, count, goldGr } = item;
      const key = `${type}`;

      if (!result[key]) {
        result[key] = {
          total_cost: 0,
          count: 0,
          colors: {},
        };
      }

      result[key].total_cost += total_cost;
      result[key].count += count;

      if (!result[key].colors[color]) {
        result[key].colors[color] = {
          total_cost: 0,
          count: 0,
          labor_cost: [],
          goldGr: [],
        };
      }

      result[key].colors[color].total_cost += total_cost;
      result[key].colors[color].count += count;
      result[key].colors[color].labor_cost.push(labor_cost);
      result[key].colors[color].goldGr.push(goldGr);

      return result;
    }, {});
  };

  const renderTypeAndColorRows = groupedItems => {
    return Object.keys(groupedItems).map((type, i) => {
      const { total_cost, count, colors } = groupedItems[type];

      return (
        <React.Fragment key={type}>
          <TableRow className={i % 2 === 1 ? classes.darkTableRow : null}>
            <TableCell
              rowSpan={Object.keys(colors).length + 1}
              className={`${classes.boldText} ${classes.centerCell}`}
              align="center"
            >
              {type} <br />
              {` (Total Count: ${count}, Total Cost: $${total_cost.toFixed(2)})`}
            </TableCell>
          </TableRow>
          {Object.keys(colors).map(color => {
            const {
              total_cost: colorTotalCost,
              count: colorCount,
              labor_cost,
              goldGr,
            } = colors[color];

            return (
              <TableRow
                key={`${type}-${color}`}
                className={i % 2 === 1 ? classes.darkTableRow : null}
              >
                <TableCell align="center" className={classes.boldText}>
                  {color !== null ? `${color}` : "-"}
                </TableCell>
                <TableCell align="center" className={classes.boldText}>
                  {colorTotalCost !== null ? `$${colorTotalCost.toFixed(2)}` : "-"}
                </TableCell>
                <TableCell align="center" className={classes.boldText}>
                  {colorCount !== null ? `${colorCount}` : "-"}
                </TableCell>
                <TableCell align="center" className={classes.boldText}>
                  {labor_cost.length > 0
                    ? `$${labor_cost.reduce((a, b) => a + b, 0).toFixed(2)}`
                    : "-"}
                </TableCell>
                <TableCell align="center" className={classes.boldText}>
                  {goldGr.length > 0 ? `${goldGr.reduce((a, b) => a + b, 0).toFixed(2)} Gr` : "-"}
                </TableCell>
              </TableRow>
            );
          })}
        </React.Fragment>
      );
    });
  };

  const sortedItems = bestRows.sort((a, b) => a.shop.localeCompare(b.shop));
  const groupedByTypeAndColor = groupByTypeAndColor(sortedItems);

  return (
    <div className={classes.bottom}>
      <div className={classes.tablePaper}>
        <TableContainer className={classes.tContainer} component={Paper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow className={classes.tableCellHeader}>
                <TableCell className={classes.boldText} align="center">
                  <FormattedMessage id="Type" defaultMessage="Type" />
                </TableCell>
                <TableCell className={classes.boldText} align="center">
                  <FormattedMessage id="Color" defaultMessage="Color" />
                </TableCell>
                <TableCell className={classes.boldText} align="center">
                  <FormattedMessage id="Total Cost" defaultMessage="Total Cost" />
                </TableCell>
                <TableCell className={classes.boldText} align="center">
                  <FormattedMessage id="Total Count" defaultMessage="Total Count" />
                </TableCell>
                <TableCell className={classes.boldText} align="center">
                  <FormattedMessage id="Labor Cost" defaultMessage="Labor Cost" />
                </TableCell>
                <TableCell className={classes.boldText} align="center">
                  <FormattedMessage id="GoldGr" defaultMessage="GoldGr" />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{renderTypeAndColorRows(groupedByTypeAndColor)}</TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default SellerTable;
