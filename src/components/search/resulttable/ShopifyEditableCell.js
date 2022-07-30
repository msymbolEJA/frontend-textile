import React, { useState, useCallback } from "react";

import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import ContentEditable from "react-contenteditable";

const useStyles = makeStyles(() => ({
  tableCell: {
    padding: 10,
    width: "100px",

    //minWidth: "100px",
    maxWidth: "100px",
    borderRight: "0.5px solid #E0E0E0",
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
    minHeight: "109px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    whiteSpace: "pre-wrap",

  },
  allOrdersTableCell: {},
}));

/* <TextareaAutosize aria-label="empty textarea" placeholder="Empty" />
 */

const ShopifyEditableCell = ({ data, onChange, row }) => {
  const classes = useStyles();
  const [content, setContent] = useState(data?.value);
  //   console.log("ROW", row?.mapping_data);

  //   console.log("data", data);

  const handleContentChange = useCallback((e) => {
    setContent(e.target.value);
    console.log("CHANGE", e.target.value);
  }, []);

  const handleBlur = useCallback(
    (e) => {
      //   onChange(e, data.id, name);
      console.log(data?.name, content);
    },
    // eslint-disable-next-line
    [onChange, data]
  );

  return (
    <TableCell
      align="center"
      className={classes.tableCell}
      onClick={(e) => e.stopPropagation()}
      style={{}}
    >
      <div style={{}}>
        <div
          style={{
            borderBottom: "1px solid grey",
            backgroundColor: "lightgrey",
            minHeight: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {data?.name
            ?.replace("(See the font list in the description)", "")
            ?.replace("Enter the name or the word here", "Name/Word")
            ?.replace("(Height will be adjusted accordingly)", "")
            ?.replace("UPLOAD THE HANDWRITING IMAGE HERE:", "Image")}
        </div>
        {data?.value.includes("http") ? (
          <>
            <a href={data?.value} target="_blank" rel="noreferrer">
              View
            </a>
            <img
              src={data?.value}
              style={{ width: "100%", height: "auto" }}
              alt="handwriting"
            />
          </>
        ) : (
          <ContentEditable
            className={classes.editable}
            html={content || ""} // innerHTML of the editable div
            disabled={false} // use true to disable edition
            onChange={handleContentChange} // handle innerHTML change
            onBlur={handleBlur} // handle innerHTML change
          />
        )}
      </div>
    </TableCell>
  );
};

export default ShopifyEditableCell;
