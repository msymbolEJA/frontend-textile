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

const CustomTableCell = ({ row, name, name2 }) => {
  const classes = useStyles();
  return (
    <TableCell align="center" className={classes.tableCell}>
      {name2 ? (
        <>
          {row[name2]}
          <br />
        </>
      ) : null}
      {name === "id" ? (
        <>
          <a href={`/order-details/${row.id}`}>{row[name]}</a>
          <br />
        </>
      ) : (
        row[name].replace("_", " ")
      )}
    </TableCell>
  );
};

export default CustomTableCell;
