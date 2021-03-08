import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";

const useStyles = makeStyles(() => ({
  tableCell: {
    padding: 0,
    minWidth: "100px",
    maxWidth: "100px",
    borderRight: "0.5px solid grey",
  },
  input: {
    fontSize: "1rem",
    maxHeight: "100%",
    width: "100%",
    minWidth: "90px",
    maxWidth: "90px",
    //wordWrap: "break-word"
  },
}));
/* <TextareaAutosize aria-label="empty textarea" placeholder="Empty" />
 */
const EditableTableCell = ({ row, name, onChange }) => {
  const classes = useStyles();
  const { isEditMode } = row;
  return (
    <TableCell align="center" className={classes.tableCell}>
      {isEditMode ? (
        <TextareaAutosize
          rowsMin={3}
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
