import TableCell from "@material-ui/core/TableCell";
import { makeStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import RepeatIcon from "@material-ui/icons/Repeat";
import moment from "moment";
import { useIntl } from "react-intl";
import {
  toastErrorNotify,
  toastSuccessNotify,
} from "../../otheritems/ToastNotify";
const useStyles = makeStyles((theme) => ({
  tableCell: {
    width: 130,
    height: 40,
    fontFamily: "Courier New",
    cursor: "pointer",
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
    <TableCell
      onClick={() => {
        name === "id" &&
          navigator.clipboard.writeText(row[name]) &&
          toastSuccessNotify(`${row[name]} copied`);
      }}
      align="center"
      className={classes.tableCell}
    >
      {isEditMode ? (
        <Input
          value={row[name]}
          name={name}
          onChange={(e) => onChange(e, row)}
          className={classes.input}
        />
      ) : name === "creation_tsz" ? (
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
              : row[name]?.replace("_", " "),
        })
      ) : name === "explanation" ? (
        row[name]
          ?.replace("_", " ")
          ?.replace("REPEAT", "TEKRAR")
          ?.replace("MANUFACTURING ERROR", "ÜRETİM HATASI")
          ?.replace("LETTER_PATTERN_IS_WRONG", "")
          ?.replace("WRONG_COLOR", "")
          ?.replace("NEW_COLOR", "")
          ?.replace("STONE_FALL", "")
          ?.replace("DIFFERENT_PRODUCT", "")
          ?.replace("NEW_LINE_UP", "")
          ?.replace("LONG_CHAIN", "")
          ?.replace("SHORT_CHAIN", "")
          ?.replace("DIFFERENT_FONT", "")
          ?.replace("DISCOLORATION", "")
          ?.replace("BROKEN_LOCK", "")
          ?.replace(": BREAK OFF", "")
          ?.replace(": LOST IN MAIL", "")
          ?.replace(": SECOND", "")
          ?.replace("&#039;", "'")
          ?.replace("&#39;", "'")
          ?.replace("&lt;", "<")
          ?.replace("&gt;", ">")
      ) : row[name]?.length ? (
        row[name]
          ?.replace("&lt;", "<")
          ?.replace("&gt;", ">")
          .replace("&#039;", "'")
          .replace("&#39;", "'")
      ) : (
        row[name]
      )}
      {row[name2] ? <RepeatIcon style={{ color: "red" }} /> : null}
    </TableCell>
  );
};

export default CustomTableCell;
