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
        ) : name === "note" ? (
          row[name]
            ?.replace(
              "**REPEAT: MANUFACTURING ERROR**",
              "**TEKRAR: ÜRETİM HATASI**"
            )
            ?.replace("**REPEAT: DISCOLORATION**", "**TEKRAR: RENK ATMA**")
            ?.replace("**REPEAT: BREAK OFF**", "")
            ?.replace("**REPEAT: LOST IN MAIL**", "")
            ?.replace("**REPEAT: SECOND**", "")
        ) : row[name] ? (
          row[name]?.replace("_", " ")
        ) : (
          "-"
        )}

        {row[name4] ? <RepeatIcon style={{ color: "red" }} /> : null}
        {name3 ? <>{row[name3]}</> : null}
      </div>
    </TableCell>
  );
};

export default CustomTableCell;
