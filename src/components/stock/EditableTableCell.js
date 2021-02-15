import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import Input from "@material-ui/core/Input";

const useStyles = makeStyles(() => ({
  tableCell: {
    padding: 0,
    width: "fit-content",
  },
}));

const EditableTableCell = ({ item, name, onChange }) => {
  const classes = useStyles();
  const { isEditMode } = item;
  return (
    <TableCell align="center" className={classes.tableCell}>
      {isEditMode ? (
        <Input
          value={item[name] ? item[name] : ""} // first : value={row[name]} // i've changed
          name={name}
          onChange={(e) => onChange(e, item)}
          className={classes.input}
        />
      ) : (
        item[name]
      )}
    </TableCell>
  );
};

export default EditableTableCell;
