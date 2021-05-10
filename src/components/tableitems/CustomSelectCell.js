import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { statusData } from "../../helper/Constants";
import { useIntl } from "react-intl";

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
  const { formatMessage } = useIntl();

  return (
    <div>
      <select
        className={classes.opt}
        id={name}
        value={row[name]}
        // disabled={false}
        disabled={
          !(!!row.supplier && !!row.type && !!row.color && !!row.length)
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
