import { makeStyles } from "@material-ui/styles";
import React from "react";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  tableWrapper: {
    margin: "20px 5px 5px 5px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tr: {
    "&:nth-child(even)": {
      backgroundColor: "#f2f2f2",
    },
  },
  th: {
    border: "1px solid #ddd",
    textAlign: "left",
    background: "#343a40",
    color: "#fff",
    padding: "10px",
  },
  td: {
    border: "1px solid #ddd",
    textAlign: "left",
    padding: "5px 3px 3px 10px",
    maxWidth: "400px",
  },
}));
const CustomTable = ({ tableHeader, tableData }) => {
  const classes = useStyles(); // eslint-disable-next-line

  return (
    <div className={classes.tableWrapper}>
      <table className={classes.table}>
        <tbody className={classes.tbody}>
          <tr className={classes.tr}>
            {tableHeader?.map((header, index) => (
              <th key={header.id || index} className={classes.th}>
                {header.title} {header.title2 && "/"} {header.title2}
              </th>
            ))}
          </tr>
          {tableData &&
            tableData?.map((user, ind) => (
              <tr className={classes.tr} key={user.id || ind}>
                {tableHeader.map((header, id) =>
                  header.key === "title" ? (
                    <td key={header.id || id} className={classes.td}>
                      <a
                        href={user[header.key2]}
                        target="blank"
                        rel="noopener noreferrer"
                      >
                        {user[header.key]}
                      </a>
                    </td>
                  ) : header.key === "listing_id" ? (
                    <td key={header.id || id} className={classes.td}>
                      <a href={`favourites/${user[header.key]}?page=1`}>
                        {user[header.key]}
                      </a>
                    </td>
                  ) : header.key === "last_modified_tsz" ||
                    header.key === "original_creation_tsz" ||
                    header.key === "creation_tsz" ||
                    header.key === "create_date" ? (
                    <td key={header.id || id} className={classes.td}>
                      {/* {user[header.key]} */}
                      {moment
                        .utc(user[header.key] * 1000)
                        .local()
                        .format("MM-DD-YY HH:mm")}
                    </td>
                  ) : (
                    <td key={header.id || id} className={classes.td}>
                      {user[header.key] || "-"}
                    </td>
                  )
                )}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
