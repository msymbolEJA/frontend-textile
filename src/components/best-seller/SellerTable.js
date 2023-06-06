import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormattedMessage } from 'react-intl';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { bestSellerColumns, colorNumberColumns } from '../../helper/Constants';
import { Paper } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  tContainer: {
    padding: 1,
    width: 'fit-content',
    marginTop: 10,
  },
  rowWithNull: {
    backgroundColor: 'black',
    color: 'white',
  },
  tableCellHeader: {
    color: 'black',
    border: '1px white solid',
    backgroundColor: 'lightblue',
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
    marginTop: '10px',
    // border: '1px solid lightgrey',
    borderRadius: '5px',
    overflowX: 'auto',
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

      if (index < items.length - 1 && items[index + 1].shop !== shop) {
        result[key].nextShop = items[index + 1].shop;
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
              {color !== null ? `${color}` : '-'}
            </TableCell>
            <TableCell align="center" className={classes.boldText}>
              {colorTotalCost !== null ? `$${colorTotalCost.toFixed(2)}` : '-'}
            </TableCell>
            <TableCell align="center" className={classes.boldText}>
              {colorCount !== null ? `${colorCount}` : '-'}
            </TableCell>
            <TableCell align="center" className={classes.boldText}>
              {labor_cost !== null ? `$${labor_cost.toFixed(2)}` : '-'}
            </TableCell>
            <TableCell align="center" className={classes.boldText}>
              {goldGr !== null ? goldGr.toFixed(2) : '-'}
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
          {nextShop && (
            <TableRow className={classes.blackGround}>
              <TableCell colSpan={6} align="center">
                <h1 style={{ fontSize: 20, color: 'white', padding: 0, margin: 0 }}>{nextShop}</h1>
              </TableCell>
            </TableRow>
          )}
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
                  Type
                </TableCell>
                <TableCell className={classes.boldText} align="center">
                  Color
                </TableCell>
                <TableCell className={classes.boldText} align="center">
                  Total Cost
                </TableCell>
                <TableCell className={classes.boldText} align="center">
                  Total Count
                </TableCell>
                <TableCell className={classes.boldText} align="center">
                  Labor Cost
                </TableCell>
                <TableCell className={classes.boldText} align="center">
                  GoldGr
                </TableCell>
              </TableRow>
            </TableHead>
            {Object.values(groupedByTypeAndColor)?.[0] && (
              <TableBody>
                <TableRow className={classes.blackGround}>
                  <TableCell colSpan={6} align="center">
                    <h1 style={{ fontSize: 20, color: 'white', padding: 0, margin: 0 }}>
                      {Object.values(groupedByTypeAndColor)?.[0]?.shop}
                    </h1>
                  </TableCell>
                </TableRow>
                {renderTypeAndColorRows(groupedByTypeAndColor)}
              </TableBody>
            )}

            {/* {typeColumn?.map((typeName, index) => {
                return (
                  typeName !== 'null' && (
                    <TableRow key={index} className={index % 2 === 1 ? classes.darkTableRow : null}>
                      <TableCell className={classes.tableCellHeader}>
                        {typeName} ({totals[index]})
                      </TableCell>
                      {items[typeName]?.map((item, i) => (
                        <>
                          <TableCell key={i} className={classes.tableCell}>
                            {item.color || '-'} ({item.color_count || 0} adet)
                            <br />
                            {item.goldGr_count || 0} gr Altın
                          </TableCell>
                        </>
                      ))}
                    </TableRow>
                  )
                );
              })} */}
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default SellerTable;
