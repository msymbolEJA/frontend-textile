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
                    .replaceAll("&lt;", "<")
                    .replaceAll("&gt;", ">")
                    .replaceAll("&#039;", "'")
                    .replaceAll("&#39;", "'")
                    .replaceAll("Pillow", "Yastik")
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
            .replaceAll("US women&#039;s letter", "")
            .replaceAll("US women's letter", "")
            .replaceAll("Pillow", "Yastik")
        ) : name === "status" ? (
          formatMessage({
            id: row[name] === "awaiting" ? "approved" : row[name],
            defaultMessage:
              row[name]?.replaceAll("_", " ") === "awaiting"
                ? "APPROVED"
                : row[name].replaceAll("_", " ").replaceAll("Pillow", "Yastik"),
          })
        ) : name === "sku" ? (
          row[name]
            ?.replaceAll("Linen_Dress_", "")
            ?.replaceAll("Linen_", "")
            .replaceAll("Pillow", "Yastik")
        ) : row[name] ? (
          row[name]
            .replaceAll("_", " ")
            .replaceAll("REPEAT", "TEKRAR")
            .replaceAll("MANUFACTURING ERROR", "ÜRETİM HATASI")
            .replaceAll("LETTER_PATTERN_IS_WRONG", "HARF DİZİLİMİ YANLIŞ")
            .replaceAll("WRONG_COLOR", "YANLIŞ RENK")
            .replaceAll("STONE_FALL", "TAŞI DÜŞMÜŞ")
            .replaceAll("DIFFERENT_PRODUCT", "FARKLI ÜRÜN")
            .replaceAll("LONG_CHAIN", "ZİNCİR UZUN")
            .replaceAll("SHORT_CHAIN", "ZİNCİR KISA")
            .replaceAll("DIFFERENT_FONT", "FARKLI FONT")
            .replaceAll("DISCOLORATION", "RENK ATMA")
            .replaceAll(": BREAK OFF", "")
            .replaceAll(": LOST IN MAIL", "")
            .replaceAll(": SECOND", "")
            .replaceAll("&#039;", "'")
            .replaceAll("&#39;", "'")
            .replaceAll("&lt;", "<")
            .replaceAll("&gt;", ">")
            .replaceAll("Pillow", "Yastik")
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
