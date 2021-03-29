import React, { useContext } from "react";
import Button from "@material-ui/core/Button";
import { AppContext } from "../../../context/Context";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { FormattedMessage, useIntl } from "react-intl";

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
    // marginBottom: theme.spacing(1),
    marginTop: "1rem",
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
  searchHandler,
}) => {
  const classes = useStyles();
  const { formatMessage } = useIntl();

  const { isAdmin } = useContext(AppContext);

  let statusTags = isAdmin ? tagsData : nonAdminTagsData;

  return (
    <div className={classes.btnGroup}>
      {statusTags.map((tag) => (
        <Button
          className={classes.btn}
          id={tag}
          key={tag}
          checked={selectedTag?.indexOf(tag) > -1}
          onClick={(e) => handleTagChange(e)}
          variant="contained"
          style={{
            backgroundColor: selectedTag === tag ? "#3F51B5" : null,
            color: selectedTag === tag ? "white" : null,
          }}
        >
          <FormattedMessage
            id={
              tag?.replace("_", " ") === "awaiting"
                ? "approved"
                : tag?.replace("_", " ")
            }
            defaultMessage={
              tag?.replace("_", " ") === "awaiting"
                ? "approved"
                : tag?.replace("_", " ")
            }
          />
        </Button>
      ))}
      <TextField
        label={formatMessage({
          id: "globalSearch",
          defaultMessage: "Global Search",
        })}
        id="globalSearch"
        defaultValue=""
        variant="outlined"
        size="small"
        style={{
          marginTop: "0.22rem",
          marginLeft: "0.3rem",
          width: 150,
        }}
        onKeyDown={(e) => searchHandler(e)}
      />
    </div>
  );
};

export default CustomButtonGroup;
