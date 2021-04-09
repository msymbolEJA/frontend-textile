import TableCell from "@material-ui/core/TableCell";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import RepeatIcon from "@material-ui/icons/Repeat";
import { useIntl } from "react-intl";

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
  const { formatMessage } = useIntl();

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
        ) : name === "creation_tsz" || name === "ready_date" ? (
          moment(row[name]).format("MM-DD-YY HH:mm") === "Invalid date" ? (
            row[name]
          ) : (
            moment.utc(row[name]).local().format("MM-DD-YY HH:mm")
          )
        ) : name === "status" ? (
          formatMessage({
            id: row[name] === "awaiting" ? "approved" : row[name],
            defaultMessage:
              row[name]?.replace("_", " ") === "awaiting"
                ? "APPROVED"
                : row[name].replace("_", " "),
          })
        ) : row[name] ? (
          row[name]
            .replace("_", " ")
            .replace("REPEAT", "TEKRAR")
            .replace("MANUFACTURING ERROR", "ÜRETİM HATASI")
            .replace("DISCOLORATION", "RENK ATMA")
            .replace(": BREAK OFF", "")
            .replace(": LOST IN MAIL", "")
            .replace(": SECOND", "")
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
