import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { statusData } from "../../helper/Constants";
import { useIntl } from "react-intl";
import { AppContext } from "../../context/Context";

const NON_SKU = process.env.REACT_APP_NON_SKU === "true";

const useStyles = makeStyles((theme) => ({
  opt: {
    fontSize: "0.9rem",
    width: "100px",
    backgroundColor: "transparent",
    borderColor: "#E0E0E0",
  },
}));

const OrderStatus = ({ row, name, onSelectChange }) => {
  const classes = useStyles();
  const { store } = useContext(AppContext);
  const { formatMessage } = useIntl();

  return (
    <div>
      <select
        className={classes.opt}
        id={name}
        value={row[name]}
        // disabled={false}
        disabled={
          store === "shop2"
            ? false
            : NON_SKU
            ? !(
                (!!row?.variation_1_value && !!row?.variation_2_value)
                // &&
                // !!row?.variation_1_name &&
                // !!row?.variation_2_name
              )
            : !(!!row.supplier && !!row.type && !!row.color && !!row.length)
        }
        name={name}
        onChange={(e) => onSelectChange(e, row)}
        onClick={(e) => e.stopPropagation()}
      >
        <optgroup>
          {statusData.map((item, index) => (
            <option key={`${index}+${item}`} value={item}>
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
