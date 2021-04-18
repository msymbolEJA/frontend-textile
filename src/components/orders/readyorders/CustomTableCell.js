import TableCell from "@material-ui/core/TableCell";
import { makeStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import RepeatIcon from "@material-ui/icons/Repeat";
import moment from "moment";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => ({
  tableCell: {
    width: 130,
    height: 40,
  },
  input: {
    width: 130,
    height: 40,
  },
}));

const CustomTableCell = ({ row, name, name2, onChange }) => {
  const classes = useStyles();
  const { isEditMode } = row;
  const { formatMessage } = useIntl();

  return (
    <TableCell align="center" className={classes.tableCell}>
      {isEditMode ? (
        <Input
          value={row[name]}
          name={name}
          onChange={(e) => onChange(e, row)}
          className={classes.input}
        />
      ) : name === "created_date" ? (
        moment(row[name]).format("MM-DD-YY HH:mm") === "Invalid date" ? (
          row[name]
        ) : (
          moment.utc(row[name]).local().format("MM-DD-YY HH:mm")
        )
      ) : name === "status" ? (
        formatMessage({
          id: row[name] === "awaiting" ? "approved" : row[name],
          defaultMessage:
            row[name]?.replace("_", " ") === "awaiting"
              ? "APPROVED"
              : row[name].replace("_", " "),
        })
      ) : name === "explanation" ? (
        row[name]
          .replace("_", " ")
          .replace("REPEAT", "TEKRAR")
          .replace("MANUFACTURING ERROR", "ÜRETİM HATASI")
          .replace("DISCOLORATION", "RENK ATMA")
          .replace(": BREAK OFF", "")
          .replace(": LOST IN MAIL", "")
          .replace(": SECOND", "")
      ) : (
        row[name]
      )}
      {row[name2] ? <RepeatIcon style={{ color: "red" }} /> : null}
    </TableCell>
  );
};

export default CustomTableCell;
