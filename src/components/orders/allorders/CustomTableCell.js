import TableCell from "@material-ui/core/TableCell";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";

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

const CustomTableCell = ({ row, name, name2, name3 }) => {
  const classes = useStyles();

  if (name === "creation_tsz") {
    var str = row[name];
    var date = moment(str);
    var dateComponent = date.utc().format("YYYY-MM-DD");
    var timeComponent = date.utc().format("HH:mm:ss");
    row[name] = dateComponent + " " + timeComponent;
  }

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
      {name3 ? (
        <>
          {row[name3]}
          <br />
        </>
      ) : null}
    </TableCell>
  );
};

export default CustomTableCell;
