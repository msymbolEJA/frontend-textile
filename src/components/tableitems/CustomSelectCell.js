import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { statusData } from "../../helper/Constants";
import { useIntl } from "react-intl";

const NON_SKU = process.env.REACT_APP_NON_SKU === "true";

const useStyles = makeStyles(theme => ({
  opt: {
    fontSize: "0.9rem",
    width: "100px",
    backgroundColor: "transparent",
    borderColor: "#E0E0E0",
  },
}));

const OrderStatus = ({ row, name, onSelectChange }) => {
  const classes = useStyles();
  const { formatMessage } = useIntl();

  let localRole = localStorage.getItem("localRole");

  let disabledForReadyNProgress =
    !localRole?.includes("workshop") &&
    process.env.REACT_APP_STORE_NAME !== "Kalpli Serisi" &&
    process.env.REACT_APP_STORE_NAME_ORJ !== "Silveristic" &&
    !NON_SKU &&
    (row[name] === "in_progress" || row[name] === "ready");

  // console.log("disabledForReadyNProgress", disabledForReadyNProgress)

  return (
    <div>
      <select
        className={classes.opt}
        id={name}
        value={row[name]}
        name={name}
        onChange={e => onSelectChange(e, row)}
        onClick={e => e.stopPropagation()}
      >
        <optgroup>
          {statusData.map((item, index) => (
            <option
              key={`${index}+${item}`}
              value={item}
              disabled={disabledForReadyNProgress ? "disabled" : ""}
            >
              {formatMessage({
                id: item === "awaiting" ? "approved" : item,
                defaultMessage: item === "awaiting" ? "APPROVED" : item,
              })}
            </option>
          ))}
        </optgroup>
      </select>
    </div>
  );
};

export default OrderStatus;
