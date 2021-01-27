import TableCell from "@material-ui/core/TableCell";
import { makeStyles } from "@material-ui/core/styles";

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

const CustomTableCell = ({ row, name }) => {
  const classes = useStyles();
  return (
    <TableCell align="center" className={classes.tableCell}>
      {row[name]}
    </TableCell>
  );
};

export default CustomTableCell;
