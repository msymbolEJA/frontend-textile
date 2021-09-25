import React, { useRef } from "react";
import Button from "@material-ui/core/Button";
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
  loading,
}) => {
  const classes = useStyles();
  const { formatMessage } = useIntl();
  const myInputRef = useRef(null);

  return (
    <div>
      <div className={classes.btnGroup}>
        {tagsData.map((tag) => (
          <Button
            className={classes.btn}
            id={tag}
            key={tag}
            checked={selectedTag?.indexOf(tag) > -1}
            disabled={loading}
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
                  ? "APPROVED"
                  : tag?.replace("_", " ")
              }
            />
          </Button>
        ))}
      </div>
      <div>
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
            onKeyDown={(e) =>
              searchHandler(myInputRef.current.childNodes[0].value, e.keyCode)
            }
            ref={myInputRef}
            style={{
              marginTop: "0.25rem",
              marginRight: "0.3rem",
              width: 150,
              height: 38,
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
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

        <Button
          className={classes.btn}
          disabled={loading}
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
          disabled={loading}
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
          disabled={loading}
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
