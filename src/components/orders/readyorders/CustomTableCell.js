import TableCell from "@material-ui/core/TableCell";
import { makeStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import RepeatIcon from "@material-ui/icons/Repeat";

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

const CustomTableCell = ({ row, name, name2, onChange, changeDateFormat }) => {
  const classes = useStyles();
  const { isEditMode } = row;

  if (name === "created_date") {
    row[name] = changeDateFormat(row[name]);
  }
  if (name === "status") {
    //console.log("status");
    if (row[name]) {
      row[name] = row[name].replace("_", " ");
    }
    //console.log(row[name]);
  }

  return (
    <TableCell align="center" className={classes.tableCell}>
      {isEditMode ? (
        <Input
          value={row[name]}
          name={name}
          onChange={(e) => onChange(e, row)}
          className={classes.input}
        />
      ) : (
        row[name]
      )}
      {row[name2] ? <RepeatIcon style={{ color: "red" }} /> : null}
    </TableCell>
  );
};

export default CustomTableCell;
