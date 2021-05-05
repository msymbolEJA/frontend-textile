import React from "react";
import CustomTable from "./CustomTable";
import { FormattedMessage } from "react-intl";

const CostTable = () => {
  return (
    <div>
      <h1>
        <FormattedMessage id="costTable" defaultMessage="Cost Table" />
      </h1>
      <div
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        <CustomTable title="Quantity Cost Table" tableId="qtyCost" />
        <CustomTable title="Type Cost Table" tableId="typCost" />
      </div>
    </div>
  );
};

export default CostTable;
