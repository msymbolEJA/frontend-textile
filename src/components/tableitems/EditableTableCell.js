import React, { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import ContentEditable from "react-contenteditable";
import FontPreview from "./FontPreview";
import { repeatReplacerWithTR } from "../../helper/Functions";

const useStyles = makeStyles(() => ({
  tableCell: {
    padding: 10,
    width: "100px",
    maxWidth: "100px",
    borderRight: "0.5px solid #E0E0E0",
  },
  input: {
    width: "100px",
    minHeight: "100px",
    background: "transparent",
    resize: "none",
    border: "none",
    //wordWrap: "break-word",
  },
  explanationTableCell: {
    padding: 10,
    width: "100px",
    maxWidth: "200px",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  editable: {
    minHeight: "109px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    wordBreak: "break-word",
    whiteSpace: "pre-wrap",
    minWidth: "200px",
  },
  editableMod: {
    minHeight: "109px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    wordBreak: "break-word",
    whiteSpace: "pre-wrap",
    minWidth: "auto",
  },
  allOrdersTableCell: {},
}));

const EditableTableCell = ({
  row,
  name,
  onChange,
  from,
  minWidth = 40,
  style,
  disableCells,
  setDisableCells,
}) => {
  useEffect(() => {
    setContent(
      name === "explanation"
        ? repeatReplacerWithTR(row[name])
        : name === "variation_1_value"
        ? row[name]
            ?.replaceAll(" US women&#039;s letter", "")
            ?.replaceAll(" US women's letter", "") === "2X"
          ? "2XL"
          : row[name]
              ?.replaceAll(" US women&#039;s letter", "")
              ?.replaceAll(" US women's letter", "")
        : row[name]
        ? row[name]?.replaceAll("Linen_Dress_", "")?.replaceAll("Linen_", "")
        : ""
    );
  }, [row, name]);

  let localRole = localStorage.getItem("localRole");

  const classes = useStyles();
  const [content, setContent] = useState(
    name === "explanation"
      ? row[name]?.replaceAll(",", ", ")
      : name === "variation_1_value"
      ? row[name]
          ?.replaceAll(" US women&#039;s letter", "")
          ?.replaceAll(" US women's letter", "") === "2X"
        ? "2XL"
        : row[name]
            ?.replaceAll(" US women&#039;s letter", "")
            ?.replaceAll(" US women's letter", "")
      : row[name]
      ? row[name]?.replaceAll("Linen_Dress_", "")?.replaceAll("Linen_", "")
      : ""
  );

  const handleContentChange = (e) => {
    setDisableCells(true);
    setContent(e.target.value);
  };

  const handleBlur = (e) => {
    onChange(e, row.id, name);
  };

  let expTableCell;

  if (from === "all-orders" && name === "goldGr") {
    expTableCell = classes.allOrdersTableCell;
  } else if (name === "explanation") {
    expTableCell = classes.explanationTableCell;
  } else {
    expTableCell = classes.tableCell;
  }

  const isDanger =
    name === "supplier" ||
    name === "variation_1_name" ||
    name === "variation_2_name" ||
    name === "variation_1_value" ||
    name === "variation_2_value";

  return (
    <TableCell
      align="center"
      className={expTableCell}
      onClick={(e) => e.stopPropagation()}
      style={{
        pointerEvents: disableCells ? "none" : "auto",
        minWidth: minWidth ?? "auto",
        backgroundColor:
          isDanger &&
          (row[name] === " " || row[name] === "" || row[name] === null)
            ? "#FF9494"
            : null,
        ...style,
      }}
    >
      {name === "qty" && content.includes("FONT") ? (
        <>
          <FontPreview
            id={row.id}
            font={content}
            text={row["personalization"]}
          />
        </>
      ) : null}

      {localRole?.includes("workshop") && name === "explanation" ? (
        <p>{content}</p>
      ) : (
        <ContentEditable
          className={classes.editableMod}
          html={content || ""} // innerHTML of the editable div
          disabled={false} // use true to disable edition
          onChange={handleContentChange} // handle innerHTML change
          onBlur={handleBlur} // handle innerHTML change
        />
      )}

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
