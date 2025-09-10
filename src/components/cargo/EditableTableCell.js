import React, { useState, useCallback } from "react";

import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import ContentEditable from "react-contenteditable";

const useStyles = makeStyles(() => ({
  tableCell: {
    padding: 3,
  },
  input: {
    width: "100px",
    minHeight: "100px",
    background: "transparent",
    resize: "none",
    border: "none",
    wordWrap: "break-word",
  },
  editable: {
    minHeight: "50px",
    minWidth: "100px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
}));

/* <TextareaAutosize aria-label="empty textarea" placeholder="Empty" />
 */

const EditableTableCell = ({ row, name, onChange, trackingNumber }) => {
  const classes = useStyles();
  const [content, setContent] = useState(row[name] || "");

  const handleContentChange = useCallback((e) => {
    setContent(e.target.value);
  }, []);

  const handleBlur = useCallback(
    (e) => {
      onChange(e, row.id, name);
    },
    // eslint-disable-next-line
    [onChange, row]
  );

  return (
    <TableCell
      align="center"
      className={classes.tableCell}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <ContentEditable
        className={classes.editable}
        html={content.toUpperCase()} // innerHTML of the editable div
        disabled={false} // use true to disable edition
        onChange={handleContentChange} // handle innerHTML change
        onBlur={handleBlur} // handle innerHTML change
      />
      {trackingNumber && trackingNumber !== "---" && (
        <a
          href={`https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          Visit
        </a>
      )}
    </TableCell>
  );
};

export default EditableTableCell;
