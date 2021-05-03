import React, { useContext, useRef } from "react";
import Button from "@material-ui/core/Button";
import { AppContext } from "../../../context/Context";
import { makeStyles } from "@material-ui/core/styles";
import { FormattedMessage, useIntl } from "react-intl";
import IconButton from "@material-ui/core/IconButton";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import SearchIcon from "@material-ui/icons/Search";

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
    marginTop: "0.8rem",
  },
  btnGroup: {
    // marginBottom: theme.spacing(1),
    marginTop: "1rem",
  },
  header: {
    fontSize: "1.5rem",
  },
  textField: {
    marginTop: "0.6rem",
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
  const myInputRef = useRef(null);

  const { isAdmin } = useContext(AppContext);

  let statusTags = isAdmin ? tagsData : nonAdminTagsData;

  const searcMyhHandler = (e) => {
    searchHandler(1, myInputRef.current.childNodes[0].value);
  };

  let localRole = localStorage.getItem("localRole");

  if (localRole === "workshop_designer") {
    return null;
  }

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

      <FormControl className={classes.textField} variant="outlined">
        <InputLabel
          htmlFor="outlined-adornment-password"
          style={{ marginTop: "-0.1rem" }}
        >
          {formatMessage({
            id: "search",
            defaultMessage: "Search",
          })}
        </InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type="text"
          defaultValue=""
          ref={myInputRef}
          onKeyDown={(e) => searchHandler(e)}
          style={{
            marginTop: "0.3rem",
            marginLeft: "0.3rem",
            width: 150,
            height: 38,
          }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={(e) => searcMyhHandler(e)}
                edge="end"
              >
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          }
          labelWidth={55}
        />
      </FormControl>
    </div>
  );
};

export default CustomButtonGroup;
