import React from "react";
import SortableTableCell from "./SortableTableCell";
import EditableTableCell from "../tableitems/EditableTableCell";

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
  return (
    <>
      <EditableTableCell
        {...{
          row,
          name: name1,
          onChange,
        }}
      />
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
