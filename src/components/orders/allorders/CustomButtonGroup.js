import React, { useContext } from "react";
import Button from "@material-ui/core/Button";
import { AppContext } from "../../../context/Context";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
  },
  container: {
    // maxHeight: "83vh",
  },
  table: {
    minWidth: 650,
  },
  btn: {
    width: 150,
    margin: theme.spacing(0.5),
  },
  btnGroup: {
    marginBottom: theme.spacing(0),
  },
  header: {
    fontSize: "1.5rem",
  },
}));

const CustomButtonGroup = ({
  selectedTag,
  handleTagChange,
  tagsData,
  nonAdminTagsData,
}) => {
  const classes = useStyles();

  const { isAdmin } = useContext(AppContext);

  let statusTags = isAdmin ? tagsData : nonAdminTagsData;

  return (
    <div>
      <div className={classes.btnGroup}>
        {statusTags.map((tag) => (
          <Button
            className={classes.btn}
            id={tag}
            key={tag}
            checked={selectedTag.indexOf(tag) > -1}
            onClick={(e) => handleTagChange(e)}
            variant="contained"
            style={{
              backgroundColor: selectedTag === tag ? "#3F51B5" : null,
              color: selectedTag === tag ? "white" : null,
            }}
          >
            {tag?.replace("_", " ")}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CustomButtonGroup;
