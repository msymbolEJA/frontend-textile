import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { convertToTitleCase } from "../../helper/convertToTitleCase";

const useStyles = makeStyles(theme => ({
  boldText: {
    fontWeight: "bold",
  },
  centerCell: {
    textAlign: "center",
  },
  darkTableRow: {
    backgroundColor: theme.palette.grey[100],
  },
  bottom: {
    marginTop: theme.spacing(2),
  },
  tablePaper: {
    padding: theme.spacing(2),
  },
  tContainer: {
    marginBottom: theme.spacing(2),
    width: "fit-content",
    margin: "0 auto",
  },
}));

const SellerTable = ({ bestRows, selectedPlatform, categoryVariationValues }) => {
  const classes = useStyles();

  const groupBySkuAndColor = items => {
    const groupedItems = [];

    if (selectedPlatform === "dress" || selectedPlatform === "approne") {
      groupedItems.length = 0;
      items.forEach(item => {
        const { sku, variation_2_value, sku_cost, sku_count, variation_1_value, total_fabric } =
          item;

        const existingGroup = groupedItems.find(group => group.sku === sku);
        if (existingGroup) {
          existingGroup.sku_cost += sku_cost;
          existingGroup.sku_count += sku_count;

          const color = variation_2_value !== null ? variation_2_value : "-";
          const size = variation_1_value !== null ? variation_1_value?.split(" ")?.[0] : "-";

          const existingColor = existingGroup.colors.find(colorObj => colorObj.color === color);
          if (existingColor) {
            const existingSize = existingColor.sizes.find(sizeObj => sizeObj.size === size);
            if (existingSize) {
              existingSize.sku_cost += sku_cost;
              existingSize.sku_count += sku_count;
            } else {
              existingColor.sizes.push({ size, sku_cost, sku_count, total_fabric });
            }
            existingColor.sku_cost += sku_cost;
            existingColor.sku_count += sku_count;
            existingColor.total_fabric += total_fabric;
          } else {
            existingGroup.colors.push({
              color,
              sizes: [{ size, sku_cost, sku_count, total_fabric }],
              sku_cost,
              sku_count,
              total_fabric
            });
          }
        } else {
          const color = variation_2_value !== null ? variation_2_value : "-";
          const size = variation_1_value !== null ? variation_1_value?.split(" ")?.[0] : "-";

          groupedItems.push({
            sku,
            sku_cost,
            sku_count,
            colors: [
              {
                color,
                sizes: [{ size, sku_cost, sku_count, total_fabric }],
                sku_cost,
                sku_count,
                total_fabric,
              },
            ],
          });
        }
      });

   
      return groupedItems.sort((a, b) => b.sku_count - a.sku_count);
    } else if (selectedPlatform === "couch") {
      groupedItems.length = 0;
      items.forEach(item => {
        const { sku, variation_2_value, sku_cost, sku_count, variation_1_value, total_fabric } =
          item;

        groupedItems.push({
          sku,
          sku_cost,
          sku_count,
          depth: variation_2_value,
          width: variation_1_value,
          total_fabric,
        });
      });
      return groupedItems.sort((a, b) => b.sku_count - a.sku_count);
    } else if (selectedPlatform === "stocking") {
      groupedItems.length = 0;
      return groupedItems;
    } else if (selectedPlatform === "curtain") {
      groupedItems.length = 0;
      items.forEach(item => {
        const { sku, variation_2_value, sku_cost, sku_count, variation_1_value, total_fabric } =
          item;

        groupedItems.push({
          sku,
          sku_cost,
          sku_count,
          length: variation_2_value,
          width: variation_1_value,
          total_fabric,
        });
      });
      return groupedItems.sort((a, b) => b.sku_count - a.sku_count);
    } else if (selectedPlatform === "fabric") {
      groupedItems.length = 0;
      items.forEach(item => {
        const { sku, sku_cost, total_metrage, variation_1_value } = item;

        groupedItems.push({
          sku,
          sku_cost,
          total_metrage,
          color: variation_1_value,
        });
      });
      return groupedItems.sort((a, b) => b.sku_count - a.sku_count);
    } else if (selectedPlatform === "pillow") {
      groupedItems.length = 0;

      groupedItems.length = 0;
      items.forEach(item => {
        const { sku, variation_2_value, sku_cost, sku_count, variation_1_value, total_fabric } =
          item;

        const existingGroup = groupedItems.find(group => group.sku === sku);
        if (existingGroup) {
          existingGroup.sku_cost += sku_cost;
          existingGroup.sku_count += sku_count;

          const color = variation_1_value !== null ? variation_1_value : "-";
          const size = variation_2_value !== null ? variation_2_value : "-";

          const existingColor = existingGroup.colors.find(colorObj => colorObj.color === color);
          if (existingColor) {
            const existingSize = existingColor.sizes.find(sizeObj => sizeObj.size === size);
            if (existingSize) {
              existingSize.sku_cost += sku_cost;
              existingSize.sku_count += sku_count;
            } else {
              existingColor.sizes.push({ size, sku_cost, sku_count, total_fabric });
            }
            existingColor.sku_cost += sku_cost;
            existingColor.sku_count += sku_count;
            existingColor.total_fabric += total_fabric;
          } else {
            existingGroup.colors.push({
              color,
              sizes: [{ size, sku_cost, sku_count, total_fabric }],
              sku_cost,
              sku_count,
              total_fabric,
            });
          }
        } else {
          const color = variation_1_value !== null ? variation_1_value : "-";
          const size = variation_2_value !== null ? variation_2_value : "-";

          groupedItems.push({
            sku,
            sku_cost,
            sku_count,
            colors: [
              {
                color,
                sizes: [{ size, sku_cost, sku_count, total_fabric }],
                sku_cost,
                sku_count,
                total_fabric,
              },
            ],
          });
        }
      });
      return groupedItems.sort((a, b) => b.sku_count - a.sku_count);

      // items.forEach(item => {
      //   const { sku, variation_2_value, sku_cost, sku_count, variation_1_value } = item;

      //   groupedItems.push({
      //     sku,
      //     sku_cost,
      //     sku_count,
      //     size: variation_2_value,
      //     color: variation_1_value,
      //   });
      // });
      // return groupedItems.sort((a, b) => b.sku_count - a.sku_count);
    } else if (selectedPlatform === "all") {
      groupedItems.length = 0;
      items.forEach(item => {
        const { color, metrage } = item;

        groupedItems.push({
          color,
          metrage,
        });
      });
      return groupedItems.sort((a, b) => b.metrage - a.metrage);
    }

    return groupedItems;
  };

  const renderSkuAndColorRows = groupedItems => {
    return groupedItems.map((group, index) => {
      const {
        sku,
        sku_cost,
        sku_count,
        colors,
        depth,
        width,
        color,
        total_metrage,
        length,
        size,
        metrage,
        total_fabric,
      } = group;

      //  <TableRow>
      //    <TableCell
      //      className={`${classes.boldText} ${classes.centerCell} ${
      //        i % 2 === 1 ? classes.darkTableRow : ""
      //      }`}
      //      align="center"
      //    >
      //      {sku} <br />
      //      {`(Total Count: ${sku_count}, Total Cost: $${sku_cost.toFixed(2)})`}
      //    </TableCell>
      //  </TableRow>;
      return (
        <React.Fragment>
          {renderColorRows({
            colors,
            index,
            sku,
            sku_cost,
            sku_count,
            depth,
            width,
            color,
            total_metrage,
            length,
            size,
            metrage,
            total_fabric,
          })}
        </React.Fragment>
      );
    });
  };

  const renderColorRows = ({
    colors,
    index: skuIndex,
    sku,
    sku_cost: SKU_COST,
    sku_count: SKU_COUNT,
    depth,
    width,
    color,
    total_metrage,
    length,
    size,
    metrage,
    total_fabric: total_fabric2,
  }) => {
    // let rowCount = 0;
    let rows = [];

    if (
      selectedPlatform === "dress" ||
      selectedPlatform === "approne" ||
      selectedPlatform === "pillow"
    ) {
      rows.length = 0;
      colors.forEach(colorObj => {
        const { color, sizes, sku_count, sku_cost , total_fabric: color_total_fabric} = colorObj;
        const sizeCount = sizes.length;

        sizes.forEach((sizeObj, i) => {
          const { size, sku_cost: sizeSkuCost, sku_count: sizeSkuCount, total_fabric } = sizeObj;

          rows.push(
            <TableRow className={skuIndex % 2 === 1 ? classes.darkTableRow : null}>
              {i === 0 ? (
                <>
                  <TableCell
                    className={`${classes.boldText} ${classes.centerCell} ${
                      i % 2 === 1 ? classes.darkTableRow : ""
                    }`}
                    rowSpan={sizeCount}
                    align="center"
                  >
                    {sku}
                    <span style={{ fontWeight: "normal" }}>
                      <br /> {`Total Count: ${SKU_COUNT}`}
                      <br />
                      {`Total Cost: $${SKU_COST.toFixed(2)}`}
                    </span>
                  </TableCell>
                  <TableCell rowSpan={sizeCount} align="center" className={classes.boldText}>
                    {color !== "-" ? (
                      <>
                        {color}
                        <span style={{ fontWeight: "normal" }}>
                          <br /> {`Total Count: ${sku_count}`}
                          <br />
                          {`Total Cost: $${sku_cost.toFixed(2)}`}
                          <br />
                          {`Total Fabric: ${color_total_fabric.toFixed(2)}m`}
                        </span>
                      </>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </>
              ) : null}
              <TableCell
                align="center"
                className={classes.boldText}
                style={{
                  backgroundColor: sizeSkuCost ? "" : "#eee685",
                }}
              >
                {size}
              </TableCell>
              <TableCell
                align="center"
                className={classes.boldText}
                style={{
                  backgroundColor: sizeSkuCost ? "" : "#eee685",
                }}
              >
                {sizeSkuCost !== null ? `$${sizeSkuCost.toFixed(2)}` : "-"}
              </TableCell>
              <TableCell
                align="center"
                className={classes.boldText}
                style={{
                  backgroundColor: sizeSkuCost ? "" : "#eee685",
                }}
              >
                {sizeSkuCount !== null ? `${sizeSkuCount}` : "-"}
              </TableCell>
              <TableCell
                align="center"
                className={classes.boldText}
                style={{
                  backgroundColor: sizeSkuCost ? "" : "#eee685",
                }}
              >
                {total_fabric !== null && total_fabric !== undefined ? `${total_fabric?.toFixed(2)}m` : ""}
              </TableCell>
            </TableRow>,
          );
        });

        // rowCount += sizeCount;
      });

      // console.log(rows);
    } else if (selectedPlatform === "couch") {
      rows.length = 0;
      rows.push(
        <TableRow className={skuIndex % 2 === 1 ? classes.darkTableRow : null}>
          <TableCell
            className={classes.boldText}
            style={{
              backgroundColor: SKU_COST ? "" : "#eee685",
            }}
            align="center"
          >
            {sku}
          </TableCell>

          <TableCell
            align="center"
            className={classes.boldText}
            style={{
              backgroundColor: SKU_COST ? "" : "#eee685",
            }}
          >
            {depth}
          </TableCell>
          <TableCell
            align="center"
            className={classes.boldText}
            style={{
              backgroundColor: SKU_COST ? "" : "#eee685",
            }}
          >
            {width}
          </TableCell>
          <TableCell
            align="center"
            className={classes.boldText}
            style={{
              backgroundColor: SKU_COST ? "" : "#eee685",
            }}
          >
            {SKU_COST !== null ? `$${SKU_COST.toFixed(2)}` : "-"}
          </TableCell>
          <TableCell
            align="center"
            className={classes.boldText}
            style={{
              backgroundColor: SKU_COST ? "" : "#eee685",
            }}
          >
            {SKU_COUNT !== null ? `${SKU_COUNT}` : "-"}
          </TableCell>
          <TableCell
            align="center"
            className={classes.boldText}
            style={{
              backgroundColor: SKU_COST ? "" : "#eee685",
            }}
          >
            {total_fabric2 !== null && total_fabric2 !== undefined ? `${total_fabric2}m` : ""}
          </TableCell>
        </TableRow>,
      );

      // rowCount += sizeCount;
    } else if (selectedPlatform === "curtain") {
      rows.length = 0;

      rows.push(
        <TableRow className={skuIndex % 2 === 1 ? classes.darkTableRow : null}>
          <TableCell
            className={classes.boldText}
            style={{
              backgroundColor: SKU_COST ? "" : "#eee685",
            }}
            align="center"
          >
            {sku}
          </TableCell>

          <TableCell
            align="center"
            className={classes.boldText}
            style={{
              backgroundColor: SKU_COST ? "" : "#eee685",
            }}
          >
            {length}
          </TableCell>
          <TableCell
            align="center"
            className={classes.boldText}
            style={{
              backgroundColor: SKU_COST ? "" : "#eee685",
            }}
          >
            {width}
          </TableCell>
          <TableCell
            align="center"
            className={classes.boldText}
            style={{
              backgroundColor: SKU_COST ? "" : "#eee685",
            }}
          >
            {SKU_COST !== null ? `$${SKU_COST.toFixed(2)}` : "-"}
          </TableCell>
          <TableCell
            align="center"
            className={classes.boldText}
            style={{
              backgroundColor: SKU_COST ? "" : "#eee685",
            }}
          >
            {SKU_COUNT !== null ? `${SKU_COUNT}` : "-"}
          </TableCell>
          <TableCell
            align="center"
            className={classes.boldText}
            style={{
              backgroundColor: SKU_COST ? "" : "#eee685",
            }}
          >
            {total_fabric2 !== null && total_fabric2 !== undefined ? `${total_fabric2}m` : ""}
          </TableCell>
        </TableRow>,
      );

      // rowCount += sizeCount;
    } else if (selectedPlatform === "fabric") {
      rows.length = 0;

      return (
        <TableRow className={skuIndex % 2 === 1 ? classes.darkTableRow : null}>
          <TableCell
            className={classes.boldText}
            style={{
              backgroundColor: SKU_COST ? "" : "#eee685",
            }}
            align="center"
          >
            {sku}
          </TableCell>

          <TableCell
            align="center"
            className={classes.boldText}
            style={{
              backgroundColor: SKU_COST ? "" : "#eee685",
            }}
          >
            {color}
          </TableCell>

          <TableCell
            align="center"
            className={classes.boldText}
            style={{
              backgroundColor: SKU_COST ? "" : "#eee685",
            }}
          >
            {total_metrage?.toFixed(2)} m
          </TableCell>
          <TableCell
            align="center"
            className={classes.boldText}
            style={{
              backgroundColor: SKU_COST ? "" : "#eee685",
            }}
          >
            {SKU_COST !== null ? `$${SKU_COST.toFixed(2)}` : "-"}
          </TableCell>
        </TableRow>
      );

      // rowCount += sizeCount;
    } else if (selectedPlatform === "stocking") {
      rows.length = 0;
    } else if (selectedPlatform === "all") {
      rows.length = 0;

      rows.push(
        <TableRow className={skuIndex % 2 === 1 ? classes.darkTableRow : null}>
          <TableCell align="center" className={classes.boldText}>
            {color}
          </TableCell>

          <TableCell align="center" className={classes.boldText}>
            {metrage?.toFixed(2)} m
          </TableCell>
        </TableRow>,
      );

      // rowCount += sizeCount;
    }

    return rows;
  };

  // const getTotalColorSizeCount = colors => {
  //   let count = 0;

  //   colors.forEach(colorObj => {
  //     count += colorObj.sizes.length;
  //   });

  //   return count;
  // };

  const groupedBySkuAndColor = groupBySkuAndColor(bestRows);

  return (
    <div className="seller-table">
      <div className={classes.bottom}>
        <div className={classes.tablePaper}>
          <TableContainer className={classes.tContainer} component={Paper}>
            <Table className={classes.table}>
              <TableHead>
                {selectedPlatform !== "all" ? (
                  <TableRow className={classes.tableCellHeader}>
                    <TableCell className={classes.boldText} align="center">
                      <FormattedMessage id="SKU" defaultMessage="SKU" />
                    </TableCell>
                    {categoryVariationValues.variation_2_value && selectedPlatform !== "fabric" && (
                      <TableCell className={classes.boldText} align="center">
                        <FormattedMessage
                          id={categoryVariationValues.variation_2_value}
                          defaultMessage={convertToTitleCase(
                            categoryVariationValues.variation_2_value,
                          )}
                        />
                      </TableCell>
                    )}

                    {categoryVariationValues.variation_1_value && (
                      <TableCell className={classes.boldText} align="center">
                        <FormattedMessage
                          id={categoryVariationValues.variation_1_value}
                          defaultMessage={convertToTitleCase(
                            categoryVariationValues.variation_1_value,
                          )}
                        />
                      </TableCell>
                    )}
                    {selectedPlatform === "fabric" && (
                      <TableCell className={classes.boldText} align="center">
                        <FormattedMessage
                          id={"total_metrage"}
                          defaultMessage={convertToTitleCase("total_metrage")}
                        />
                      </TableCell>
                    )}

                    <TableCell className={classes.boldText} align="center">
                      <FormattedMessage id="Total Cost" defaultMessage="Total Cost" />
                    </TableCell>
                    {selectedPlatform !== "fabric" && (
                      <>
                        <TableCell className={classes.boldText} align="center">
                          <FormattedMessage id="Total Count" defaultMessage="Total Count" />
                        </TableCell>
                        <TableCell className={classes.boldText} align="center">
                          <FormattedMessage
                            id="Total Fabric (m)"
                            defaultMessage="Total Fabric (m)"
                          />
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ) : (
                  <TableRow className={classes.tableCellHeader}>
                    <TableCell className={classes.boldText} align="center">
                      <FormattedMessage id="color" defaultMessage="Color" />
                    </TableCell>

                    <TableCell className={classes.boldText} align="center">
                      <FormattedMessage
                        id={"total_metrage"}
                        defaultMessage={convertToTitleCase("total_metrage")}
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableHead>
              <TableBody>{renderSkuAndColorRows(groupedBySkuAndColor)}</TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default SellerTable;
