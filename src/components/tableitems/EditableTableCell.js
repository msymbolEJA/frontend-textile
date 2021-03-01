import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import Input from "@material-ui/core/Input";

const useStyles = makeStyles(() => ({
  tableCell: {
    padding: 0,
    width: "fit-content",
    borderRight: "0.5px solid grey",
  },
  input: {
    fontSize: "0.75rem",
    //wordWrap: "break-word"
  },
}));

const EditableTableCell = ({ row, name, onChange }) => {
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
        row[name]?.replace(/&quot;/g, '"')?.replace(/&#39;/g, "'")
      )}
    </TableCell>
  );
};

export default EditableTableCell;
