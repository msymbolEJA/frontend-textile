import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  textarea: {
    border: "none",
    resize: "none",
    margin: "0",
    fontFamily: "inherit",
  },
}));

const EditableTableCell = ({ data, name, onChange }) => {
  const classes = useStyles();
  const content = useRef();

  const handleBlur = () => {
    onChange(content.current.value, name);
  };
  return (
    <textarea
      className={classes.textarea}
      ref={content}
      type="text"
      onBlur={handleBlur}
      defaultValue={data[name]}
    />
  );
};

export default EditableTableCell;
