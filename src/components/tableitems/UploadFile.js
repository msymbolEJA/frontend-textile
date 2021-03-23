import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import PublishIcon from "@material-ui/icons/Publish";
const BASE_URL = process.env.REACT_APP_BASE_URL;

const useStyles = makeStyles((theme) => ({
  root: {
    height: "6rem",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    width: "3rem",
  },
  icon: {
    fontSize: "1.5rem",
    // marginLeft: "2.5rem",
    cursor: "pointer",
  },
  vFile: {
    // marginLeft: "2.5rem",
  },
  btn: {
    // marginLeft: "2.5rem",
  },
}));

const UploadFile = ({ row, selectId, fileSelectedHandler, selectedRowId }) => {
  const classes = useStyles();
  const hasImage = !(
    (row.image === `${BASE_URL}media/2021-01-21%2017%3A24%3A28.978287`) |
    (row.image === null)
  );

  return (
    <div className={classes.root}>
      {hasImage ? (
        <a
          href={row.image}
          className={classes.vFile}
          target="_blank"
          rel="noreferrer"
        >
          View File
        </a>
      ) : null}
      <>
        <label htmlFor="myInput">
          <PublishIcon
            className={classes.icon}
            onClick={(e) => selectId(e, row.id)}
          />
        </label>
        <input
          onChange={(e) => fileSelectedHandler(e, selectedRowId)}
          onClick={(event) => event.stopPropagation()}
          id="myInput"
          style={{ display: "none" }}
          type={"file"}
        />
      </>
    </div>
  );
};

export default UploadFile;
