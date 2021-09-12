import React from "react";
import SortableTableCell from "./SortableTableCell";
import EditableTableCell from "../tableitems/EditableTableCell";
import TableCellHeader from "./TableCellHeader";

import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";

const ShopifyColumnsHeaders = ({
  setOrderBy,
  handleRequestSort,
  order,
  orderBy,
  colName1,
  property1,
}) => {
  return (
    <>
      <SortableTableCell
        property={property1}
        handleRequestSort={handleRequestSort}
        order={order}
        orderBy={orderBy}
        colName={colName1}
        setOrderBy={setOrderBy}
      />
      <TableCellHeader id="variation1" headerName="Variation1" />
      <TableCellHeader id="variation2" headerName="Variation2" />
      <TableCellHeader id="variation3" headerName="Variation3" />
      <TableCellHeader id="variation4" headerName="Variation4" />
      {/* <SortableTableCell
        property="variation_2_value"
        handleRequestSort={handleRequestSort}
        order={order}
        orderBy={orderBy}
        colName="Color"
        setOrderBy={setOrderBy}
      /> */}
    </>
  );
};

export default ShopifyColumnsHeaders;

export const ShopifyColumnsValues = ({ row, onChange, name1 }) => {
  const columnsNumber = 4 - row?.mapping_data?.length || 0;
  const dummyArray = new Array(columnsNumber).fill({
    name: "-",
    value: "-",
  });

  return (
    <>
      <EditableTableCell
        {...{
          row,
          name: name1,
          onChange,
        }}
      />
      {row?.mapping_data?.map((each, index) => {
        return (
          <ConstantTableCell
            key={index}
            {...{
              row: row,
              mappingData: each,
            }}
          />
        );
      })}
      {dummyArray?.map?.((each, index) => (
        <ConstantTableCell
          key={index}
          {...{
            row: row,
            mappingData: each,
          }}
        />
      ))}
      {/* <EditableTableCell
        {...{
          row,
          name: "variation_2_value",
          onChange,
        }}
      /> */}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  tableCell: {
    padding: 1,
    width: 130,
    height: 40,
    borderRight: "0.5px solid #E0E0E0",
    maxWidth: "190px",
  },
}));

const ConstantTableCell = ({ row, mappingData = { name: "", value: "-" } }) => {
  const classes = useStyles();

  return (
    <TableCell
      align="center"
      className={classes.tableCell}
      // style={{
      //   backgroundColor:
      //     name === "personalization" && !row[name]?.trim() && "#FF9494",
      // }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {mappingData?.name}
      <br />
      <b>{mappingData?.value}</b>
    </TableCell>
  );
};
