import React from "react";
import QtyCost from "./QtyCost";
import TypeCost from "./TypeCost";

const CostTable = () => {
  return (
    <div>
      <h1>Cost Table</h1>
      <div
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        <QtyCost />
        <TypeCost />
      </div>
    </div>
  );
};

export default CostTable;
