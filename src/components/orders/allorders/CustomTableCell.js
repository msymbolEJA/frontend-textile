import TableCell from "@material-ui/core/TableCell";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
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

const CustomTableCell = ({ row, name, name2, name3, name4 }) => {
  const classes = useStyles();

  if (name === "creation_tsz") {
    var str = row[name];
    var date = moment(str);
    var dateComponent = date.utc().format("DD-MM-YY");
    var timeComponent = date.utc().format("HH:mm");
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        {name === "id" ? (
          <>
            <a href={`/order-details/${row.id}`}>{row[name]}</a>
          </>
        ) : (
          row[name].replace("_", " ")
        )}
        {row[name4] ? <RepeatIcon style={{ color: "red" }} /> : null}
        {name3 ? <>{row[name3]}</> : null}
      </div>
    </TableCell>
  );
};

export default CustomTableCell;
