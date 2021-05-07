import React, { useCallback, useState, useRef } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import ContentEditable from "react-contenteditable";
import { putData } from "../../helper/PostData";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:hover": {
      // cursor: "pointer",
      //boxShadow: "1px 2px",
      backgroundColor: "#add8e6",
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  root: {
    width: 500,
    margin: "1rem",
    height: "fit-content",
  },
  editable: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
});

const CustomTableBody = ({ row, getListFunc, tableId }) => {
  const classes = useStyles();
  const [content, setContent] = useState(row?.cost || "");
  const inputEl = useRef(null);

  const handleContentChange = useCallback((e) => {
    setContent(e.target.value);
  }, []);

  // http://45.76.57.100:8080/etsy/typCost/100/
  // http://45.76.57.100:8080/etsy/qtyCost/10/

  const handleBlur = () => {
    if (row?.cost === inputEl.current.lastHtml) return;
    let data = {
      code: row?.code,
      cost: inputEl.current.lastHtml,
      desc: row?.desc,
    };
    putData(`${BASE_URL}etsy/${tableId}/${row?.code}/`, data)
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      })
      .finally(() => getListFunc());
  };

  return (
    <StyledTableRow hover tabIndex={-1}>
      <TableCell align="center">{row?.code}</TableCell>
      <TableCell align="center">{row?.desc}</TableCell>
      <TableCell align="center">
        <ContentEditable
          className={classes.editable}
          html={content} // innerHTML of the editable div
          disabled={false} // use true to disable edition
          onChange={handleContentChange} // handle innerHTML change
          onBlur={handleBlur} // handle innerHTML change
          ref={inputEl}
        />
      </TableCell>
    </StyledTableRow>
  );
};

export default CustomTableBody;
