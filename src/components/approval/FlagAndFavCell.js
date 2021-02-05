import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import moment from "moment";
import FlagIcon from "@material-ui/icons/Flag";
import RepeatIcon from "@material-ui/icons/Repeat";

const useStyles = makeStyles((theme) => ({
  tableCell: {
    width: 130,
    height: 40,
  },
}));

const ConstantTableCell = ({
  row,
  name,
  name2,
  name3,
  name4,
  name5,
  handlerFlagRepeatChange,
}) => {
  const classes = useStyles();
  //const [followUpFlag, setFollowUpFlag] = useState(false)

  if (name === "created_date") {
    var str = row[name];
    var date = moment(str);
    var dateComponent = date.utc().format("YYYY-MM-DD");
    var timeComponent = date.utc().format("HH:mm:ss");
    row[name] = dateComponent + " " + timeComponent;
  }

  return (
    <TableCell
      align="center"
      className={classes.tableCell}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {name2 ? (
        <>
          {row[name2]}
          <br />
        </>
      ) : null}
      {name === "id" ? (
        <a href={`/order-details/${row.id}`}>{row[name]}</a>
      ) : (
        row[name]
      )}
      {name3 ? (
        <>
          <br />
          {row[name3]}
          <br />
        </>
      ) : null}

      <FlagIcon
        style={{ color: row[name4] ? "red" : "grey", cursor: "pointer" }}
        onClick={() => handlerFlagRepeatChange(row.id, name4, row[name4])}
      />

      <RepeatIcon
        style={{ color: row[name5] ? "red" : "grey", cursor: "pointer" }}
        onClick={() => handlerFlagRepeatChange(row.id, name5, row[name5])}
      />
    </TableCell>
  );
};

export default ConstantTableCell;
