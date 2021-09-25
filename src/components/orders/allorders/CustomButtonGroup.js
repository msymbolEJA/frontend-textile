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

const NON_SKU = process.env.REACT_APP_NON_SKU === "true";

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
  loading,
}) => {
  const classes = useStyles();
  const { formatMessage } = useIntl();
  const myInputRef = useRef(null);

  const { isAdmin } = useContext(AppContext);

  let statusTags = isAdmin ? tagsData : nonAdminTagsData;

  let localRole = localStorage.getItem("localRole");

  if (localRole === "workshop_designer") {
    return null;
  }

  return (
    <div className={classes.btnGroup}>
      {statusTags.map((tag) => (
        <Button
          className={classes.btn}
          disabled={loading}
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
      {NON_SKU && (
        <Button
          className={classes.btn}
          disabled={loading}
          id="all_orders"
          checked={selectedTag?.indexOf("all_orders") > -1}
          onClick={(e) => {
            handleTagChange(e);
          }}
          variant="contained"
          style={{
            backgroundColor: selectedTag === undefined ? "#3F51B5" : null,
            color: selectedTag === undefined ? "white" : null,
          }}
        >
          <FormattedMessage id={"allorders"} defaultMessage={"All Orders"} />
        </Button>
      )}

      <FormControl className={classes.textField} variant="outlined">
        <InputLabel
          htmlFor="outlined-adornment-password"
          style={{
            marginTop: "-0.1rem",
            userSelect: "none",
            WebkitUserSelect: "none",
            "-webkit-user-select": "none",
          }}
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
          onKeyDown={(e) =>
            searchHandler(myInputRef.current.childNodes[0].value, e.keyCode)
          }
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
                onClick={() =>
                  searchHandler(myInputRef.current.childNodes[0].value, 13)
                }
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
