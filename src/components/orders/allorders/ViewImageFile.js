import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  file: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    //width: "2rem",
    height: "2rem",
  },
}));

const ViewImageFile = ({ row, name }) => {
  const classes = useStyles();

  return (
    <div className={classes.file}>
      {row.image ? (
        <a
          onClick={(e) => {
            e.stopPropagation();
          }}
          href={row?.image}
          className={classes.vFile}
          target="_blank"
          rel="noreferrer"
        >
          View File
        </a>
      ) : null}
    </div>
  );
};

export default ViewImageFile;
