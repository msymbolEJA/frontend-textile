import React, { useState, useCallback } from "react";

import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import ContentEditable from "react-contenteditable";

const useStyles = makeStyles(() => ({
  tableCell: {
    padding: 0,
    width: "100px",

    //minWidth: "100px",
    maxWidth: "100px",
  },
  input: {
    width: "100px",
    minHeight: "100px",
    background: "transparent",
    resize: "none",
    border: "none",
    wordWrap: "break-word",
  },
  explanationTableCell: {
    padding: 0,
    width: "100px",
    // minHeight: "100px",
    maxWidth: "300px",
  },
  explanationInput: {
    fontSize: "1rem",
    maxHeight: "100%",
    width: "100%",
    minWidth: "190px",
    maxWidth: "190px",
    //wordWrap: "break-word"
  },
  editable: {
    minHeight: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
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
      {trackingNumber && (
        <a
          href={trackingNumber}
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
