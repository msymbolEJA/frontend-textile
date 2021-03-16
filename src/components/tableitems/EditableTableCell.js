import React, { useEffect, useState, useCallback } from "react";

import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import ContentEditable from "react-contenteditable";

const useStyles = makeStyles(() => ({
  tableCell: {
    padding: 0,
    width: "100px",

    //minWidth: "100px",
    maxWidth: "100px",
    borderRight: "0.5px solid grey",
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
    borderRight: "0.5px solid grey",
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
    minHeight: "109px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

/* <TextareaAutosize aria-label="empty textarea" placeholder="Empty" />
 */

const EditableTableCell = ({
  row,
  name,
  onChange,
  handleRowClick,
  editName,
}) => {
  const classes = useStyles();
  const { isEditMode } = row;
  const [content, setContent] = useState(row[name] || "");

  const handleContentChange = useCallback((e) => {
    setContent(e.target.value);
  }, []);

  const handleBlur = useCallback(
    (e) => {
      onChange(e, row.id, name);
    },
    [onChange, row]
  );

  let expTableCell;
  let expInput;
  if (name === "explanation") {
    expTableCell = classes.explanationTableCell;
    expInput = classes.explanationInput;
  } else {
    expTableCell = classes.tableCell;
    expInput = classes.input;
  }
  return (
    <TableCell
      align="center"
      className={expTableCell}
      //  onClick={(e) => handleRowClick(row.id, name)}
    >
      <ContentEditable
        className={classes.editable}
        html={content} // innerHTML of the editable div
        disabled={false} // use true to disable edition
        onChange={handleContentChange} // handle innerHTML change
        onBlur={handleBlur} // handle innerHTML change
      />
      {/*   {true ? (
        <TextareaAutosize
          defaultValue={row[name] ? row[name] : ""} // first : value={row[name]} // i've changed
          name={name}
          // onChange={(e) => onChange(e, row)}
          className={classes.input}
        />
      ) : (
        row[name]?.replace(/&quot;/g, '"')?.replace(/&#39;/g, "'")
      )} */}
    </TableCell>
  );
};

export default EditableTableCell;
