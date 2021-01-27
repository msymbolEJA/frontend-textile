import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import Input from "@material-ui/core/Input";

const useStyles = makeStyles(() => ({
  tableCell: {
    width: 130,
    height: 40,
  },
  input: {
    width: 100,
    height: 40,
  },
}));

const CustomTableCell = ({ row, name, onChange }) => {
  const classes = useStyles();
  const { isEditMode } = row;
  return (
    <TableCell align="center" className={classes.tableCell}>
      {isEditMode ? (
        <Input
          value={row[name] ? row[name] : ""} // first : value={row[name]} // i've changed
          name={name}
          onChange={(e) => onChange(e, row)}
          className={classes.input}
        />
      ) : (
        row[name]
      )}
    </TableCell>
  );
};

export default CustomTableCell;
