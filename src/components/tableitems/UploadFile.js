import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import PublishIcon from "@material-ui/icons/Publish";

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
    fontSize: "2rem",
    marginLeft: "2.5rem",
    cursor: "pointer",
  },
  vFile: {
    marginLeft: "2.5rem",
  },
  btn: {
    marginLeft: "2.5rem",
  },
}));

const UploadFile = ({ row, selectId, fileSelectedHandler }) => {
  const classes = useStyles();
  const hasImage = !(
    (row.image ===
      "http://144.202.67.136:8080/media/2021-01-21%2017%3A24%3A28.978287") |
    (row.image === null)
  );
  //console.log("Image", row.Image)
  //console.log(row.id)

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
          onChange={(e) => fileSelectedHandler(e, row.id)}
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
