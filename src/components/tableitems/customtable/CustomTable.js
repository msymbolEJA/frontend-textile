import { makeStyles } from "@material-ui/styles";
import React from "react";
import moment from "moment";

const styles = {
  customTableWrapper: {
    margin: "20px 5px 5px 5px",
  },
  customTable: {
    width: "100%",
    borderCollapse: "collapse",
  },
  customTr: {
    "&:nth-child(even)": {
      backgroundColor: "#f2f2f2",
    },
  },
  customTh: {
    border: "1px solid #ddd",
    textAlign: "left",
    background: "#343a40",
    color: "#fff",
    padding: "10px",
  },
  customTd: {
    border: "1px solid #ddd",
    textAlign: "left",
    padding: "5px 3px 3px 10px",
    maxWidth: "400px",
  },
};
const CustomTable = ({ tableHeader, tableData }) => {
  return (
    <div style={styles.customTableWrapper}>
      <table style={styles.customTable}>
        <tbody style={styles.tbody}>
          <tr style={styles.customTr}>
            {tableHeader?.map((header, index) => (
              <th key={header.id || index} style={styles.customTh}>
                {header.title} {header.title2 && "/"} {header.title2}
              </th>
            ))}
          </tr>
          {tableData &&
            tableData?.map((user, ind) => (
              <tr style={styles.customTr} key={user.id || ind}>
                {tableHeader.map((header, id) =>
                  header.type === "innerUrl" ? (
                    <td key={header.id || id} style={styles.customTd}>
                      <a
                        href={`${header.beginningUrl || ""}${user[header.key]}${
                          header.endingUrl || ""
                        }`}
                      >
                        {user[header.key]}
                      </a>
                    </td>
                  ) : header.type === "outerUrl" ? (
                    <td key={header.id || id} style={styles.customTd}>
                      <a
                        href={user[header.key2]}
                        target="blank"
                        rel="noopener noreferrer"
                      >
                        {user[header.key]}
                      </a>
                    </td>
                  ) : header.type === "time" ? (
                    <td key={header.id || id} style={styles.customTd}>
                      {moment
                        .utc(user[header.key] * 1000)
                        .local()
                        .format("MM-DD-YY HH:mm")}
                    </td>
                  ) : (
                    <td key={header.id || id} style={styles.customTd}>
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
