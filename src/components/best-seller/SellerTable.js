import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(theme => ({
  tContainer: {
    padding: 1,
    width: "fit-content",
    marginTop: 10,
  },
  rowWithNull: {
    backgroundColor: 'black',
    color: 'white',
  },
  tableCellHeader: {
    color: "black",
    border: "1px white solid",
    backgroundColor: "lightblue",
    padding: 13,
  },
  darkTableRow: {
    backgroundColor: '#F2F2F2',
  },
  tableCell: {
    fontFamily: 'Courier New',
    border: '1px solid gray',
    borderBottom: '2px solid black',
    borderTop: '2px solid black',
    padding: 13,
  },
  tablePaper: {
    marginTop: "10px",
    marginBottom: "10px",
    // border: '1px solid lightgrey',
    borderRadius: "5px",
    overflowX: "auto",
  },
  bottom: {
    display: 'flex',
    justifyContent: 'center',
  },
  table: {},
  boldText: {
    fontWeight: 'bold',
  },
  blackGround: {
    backgroundColor: 'black',
    color: 'white',
  },
  centerCell: {
    textAlign: 'center',
  },
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
  const sortByShop = items => {
    return items.sort((a, b) => a.shop.localeCompare(b.shop));
  };

  const groupByTypeAndColor = items => {
    return items.reduce((result, item, index) => {
      const { shop, type, color, total_cost, labor_cost, count, goldGr } = item;
      const key = `${type}`;

      if (!result[key]) {
        result[key] = {
          total_cost: 0,
          labor_cost: 0,
          count: 0,
          colors: {},
          goldGr: goldGr ? goldGr : null,
          shop: shop,
        };
      }

      result[key].total_cost += total_cost;
      result[key].count += count;

      if (!result[key].colors[color]) {
        result[key].colors[color] = {
          total_cost: 0,
          count: 0,
        };
      }

      result[key].colors[color].total_cost += total_cost;
      result[key].colors[color].count += count;

      if (labor_cost !== null) {
        result[key].labor_cost += labor_cost;
      }

      return result;
    }, {});
  };

  const renderTypeAndColorRows = groupedItems => {
    return Object.keys(groupedItems).map((type, typeIndex) => {
      const { total_cost, labor_cost, count, colors, goldGr, shop, nextShop } = groupedItems[type];

      const colorRows = Object.keys(colors).map(color => {
        const { total_cost: colorTotalCost, count: colorCount } = colors[color];

        return (
          <TableRow
            key={`${type}-${color}`}
            className={typeIndex % 2 === 1 ? classes.darkTableRow : null}
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
              {labor_cost !== null ? `$${labor_cost.toFixed(2)}` : "-"}
            </TableCell>
            <TableCell align="center" className={classes.boldText}>
              {goldGr !== null ? goldGr.toFixed(2) : "-"}
            </TableCell>
          </TableRow>
        );
      });

      const typeRowSpan = Object.keys(colors).length;
      let rowSpanned = false;

      return (
        <>
          {!rowSpanned && (
            <>
              <TableRow key={type} className={typeIndex % 2 === 1 ? classes.darkTableRow : null}>
                <TableCell
                  rowSpan={typeRowSpan + 1}
                  className={`${classes.boldText} ${classes.centerCell}`}
                  align="center"
                >
                  {type} <br />
                  {` (Total Count: ${count}, Total Cost: $${total_cost.toFixed(2)})`}
                </TableCell>
              </TableRow>
            </>
          )}
          {colorRows}
          {(rowSpanned = true)}
        </>
      );
    });
  };

  const sortedItems = sortByShop(bestRows);
  const groupedByTypeAndColor = groupByTypeAndColor(sortedItems);

  console.log(groupedByTypeAndColor);
  return (
    <div className={classes.bottom}>
      <div className={classes.tablePaper}>
        <TableContainer className={classes.tContainer}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow className={classes.tableCellHeader}>
                <TableCell className={classes.boldText} align="center">
                  <FormattedMessage id={"Type"} defaultMessage={"Type"} />
                </TableCell>
                <TableCell className={classes.boldText} align="center">
                  <FormattedMessage id={"Color"} defaultMessage={"Color"} />
                </TableCell>
                <TableCell className={classes.boldText} align="center">
                  <FormattedMessage id={"Total Cost"} defaultMessage={"Total Cost"} />
                </TableCell>
                <TableCell className={classes.boldText} align="center">
                  <FormattedMessage id={"Total Count"} defaultMessage={"Total Count"} />
                </TableCell>
                <TableCell className={classes.boldText} align="center">
                  <FormattedMessage id={"Labor Cost"} defaultMessage={"Labor Cost"} />
                </TableCell>
                <TableCell className={classes.boldText} align="center">
                  <FormattedMessage id={"GoldGr"} defaultMessage={"GoldGr"} />
                </TableCell>
              </TableRow>
            </TableHead>
            {Object.values(groupedByTypeAndColor)?.[0] && (
              <TableBody>{renderTypeAndColorRows(groupedByTypeAndColor)}</TableBody>
            )}
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default SellerTable;
