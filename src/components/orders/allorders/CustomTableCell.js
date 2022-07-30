import TableCell from "@material-ui/core/TableCell";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import RepeatIcon from "@material-ui/icons/Repeat";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => ({
  tableCell: {
    height: 40,
    fontFamily: "Courier New",
  },
  input: {
    height: 40,
  },
}));

const CustomTableCell = ({
  row,
  name,
  name2,
  name3,
  name4,
  name5,
  style,
  ...rest
}) => {
  const classes = useStyles();
  const { formatMessage } = useIntl();

  return (
    <TableCell
      align="center"
      style={style}
      className={classes.tableCell}
      {...rest}
    >
      {name2 ? (
        <>
          {row[name2]}
          <br />
        </>
      ) : null}
      <div>
        {name === "id" ? (
          <>
            <a href={`/order-details/${row.id}`}>
              {row[name]?.length
                ? row[name]
                    .replace("&lt;", "<")
                    .replace("&gt;", ">")
                    .replace("&#039;", "'")
                    .replace("&#39;", "'")
                : row[name]}
            </a>
            <br />
          </>
        ) : name === "creation_tsz" || name === "ready_date" ? (
          moment(row[name]).format("MM-DD-YY HH:mm") === "Invalid date" ? (
            row[name] || "-"
          ) : (
            <>
              {moment.utc(row[name]).local().format("MM-DD-YY HH:mm")}
              {name5 === "ready_date" &&
              moment(row[name5]).format("MM-DD-YY HH:mm") !== "Invalid date"
                ? " / " +
                  moment.utc(row[name5]).local().format("MM-DD-YY HH:mm")
                : null}
            </>
          )
        ) : name === "variation_1_value" ? (
          row[name] &&
          row[name]
            .replace("US women&#039;s letter", "")
            .replace("US women's letter", "")
        ) : name === "status" ? (
          formatMessage({
            id: row[name] === "awaiting" ? "approved" : row[name],
            defaultMessage:
              row[name]?.replace("_", " ") === "awaiting"
                ? "APPROVED"
                : row[name].replace("_", " "),
          })
        ) : name === "sku" ? (
          row[name]?.replaceAll("Linen_Dress_", "")?.replaceAll("Linen_", "")
        ) : row[name] ? (
          row[name]
            .replace("_", " ")
            .replace("REPEAT", "TEKRAR")
            .replace("MANUFACTURING ERROR", "ÜRETİM HATASI")
            .replace("LETTER_PATTERN_IS_WRONG", "HARF DİZİLİMİ YANLIŞ")
            .replace("WRONG_COLOR", "YANLIŞ RENK")
            .replace("STONE_FALL", "TAŞI DÜŞMÜŞ")
            .replace("DIFFERENT_PRODUCT", "FARKLI ÜRÜN")
            .replace("LONG_CHAIN", "ZİNCİR UZUN")
            .replace("SHORT_CHAIN", "ZİNCİR KISA")
            .replace("DIFFERENT_FONT", "FARKLI FONT")
            .replace("DISCOLORATION", "RENK ATMA")
            .replace(": BREAK OFF", "")
            .replace(": LOST IN MAIL", "")
            .replace(": SECOND", "")
            .replace("&#039;", "'")
            .replace("&#39;", "'")
            .replace("&lt;", "<")
            .replace("&gt;", ">")
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
