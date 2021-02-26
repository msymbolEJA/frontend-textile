import React from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
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
    marginBottom: theme.spacing(1),
  },
  header: {
    fontSize: "1.5rem",
  },
}));

const CustomButtonGroup = ({
  selectedTag,
  handleTagChange,
  tagsData,
  searchHandler,
}) => {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.btnGroup}>
        {tagsData.map((tag) => (
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
            <FormattedMessage
              id={tag?.replace("_", " ")}
              defaultMessage={tag?.replace("_", " ")}
            />
          </Button>
        ))}
      </div>
      <div>
        <TextField
          label="Global Search"
          id="globalSearch"
          defaultValue=""
          variant="outlined"
          size="small"
          style={{
            marginTop: "0.22rem",
            marginRight: "0.3rem",
            width: 150,
          }}
          onKeyDown={(e) => searchHandler(e)}
        />

        <Button
          className={classes.btn}
          id="all_orders"
          key="all_orders"
          onClick={(e) => handleTagChange(e)}
          variant="contained"
          style={{
            backgroundColor: selectedTag === "all_orders" ? "#3F51B5" : null,
            color: selectedTag === "all_orders" ? "white" : null,
          }}
        >
          <FormattedMessage id="all_orders" defaultMessage="ALL ORDERS" />
        </Button>
        <Button
          className={classes.btn}
          id="repeat"
          key="repeat"
          onClick={(e) => handleTagChange(e)}
          variant="contained"
          style={{
            backgroundColor: selectedTag === "repeat" ? "#3F51B5" : null,
            color: selectedTag === "repeat" ? "white" : null,
          }}
        >
          <FormattedMessage id="repeat" defaultMessage="REPEAT" />
        </Button>
        <Button
          className={classes.btn}
          id="followUp"
          key="followUp"
          onClick={(e) => handleTagChange(e)}
          variant="contained"
          style={{
            backgroundColor: selectedTag === "followUp" ? "#3F51B5" : null,
            color: selectedTag === "followUp" ? "white" : null,
          }}
        >
          <FormattedMessage id="followUp" defaultMessage="FOLLOW UP" />
        </Button>
      </div>
    </div>
  );
};

export default CustomButtonGroup;
