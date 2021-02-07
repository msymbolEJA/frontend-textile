import TableCell from "@material-ui/core/TableCell";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import RepeatIcon from "@material-ui/icons/Repeat";
import EcoIcon from "@material-ui/icons/Eco";

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
        ) : name === "creation_tsz" ? (
          moment(row[name]).format("DD-MM-YY HH:mm")
        ) : (
          row[name].replace("_", " ")
        )}
        {row[name4] ? <RepeatIcon style={{ color: "red" }} /> : null}
        {name === "id" ? (
          row["type"].includes("14K") || row["explanation"].includes("14K") ? (
            <EcoIcon style={{ color: "#f9a825" }} />
          ) : null
        ) : null}
        {name3 ? <>{row[name3]}</> : null}
      </div>
    </TableCell>
  );
};

export default CustomTableCell;
