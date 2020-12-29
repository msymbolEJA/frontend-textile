import TableCell from "@material-ui/core/TableCell";
import { makeStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";

const useStyles = makeStyles((theme) => ({
    tableCell: {
        width: 130,
        height: 40,
    },
    input: {
        width: 80,
        height: 40,
    },
}));

const CustomTableCell = ({ isEdit, row, name, onChange }) => {
    const classes = useStyles();
    const isEditMode = isEdit;
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
        </TableCell>
    );
};

export default CustomTableCell;
