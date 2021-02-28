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
      ) : name === "status" ? (
        formatMessage({
          id: row[name],
          defaultMessage: row[name]?.replace("_", " "),
        })
      ) : name === "created_date" ? (
        moment(row[name]).format("DD-MM-YY HH:mm")
      ) : name === "status" ? (
        row[name]?.replace("_", " ")
      ) : (
        row[name]
      )}
      {row[name2] ? <RepeatIcon style={{ color: "red" }} /> : null}
    </TableCell>
  );
};

export default CustomTableCell;
