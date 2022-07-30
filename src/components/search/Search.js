import React, { useEffect, useState } from "react";
import Form from "./Form";
import ResultTable from "./resulttable/ResultTable";
import { queryData, globalSearch } from "../../helper/PostData";
import { getQueryParams } from "../../helper/getQueryParams";
import TextField from "@material-ui/core/TextField";
import { FormattedMessage, useIntl } from "react-intl";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      marginTop: theme.spacing(5),
      margin: theme.spacing(1),
      width: "8rem",
    },
  },
  btn: {
    height: "2.5rem",
  },
  bottomSection: {
    display: "flex",
    justifyContent: "center",
  },
  warn: {
    color: "#cc5500",
    backgroundColor: "#FFF4E5",
    borderRadius: "5px",
    height: "2rem",
    fontSize: "1rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "25rem",
  },
}));
const BASE_URL = process.env.REACT_APP_BASE_URL;

const Search = ({ location, history }) => {
  const [list, setList] = useState();
  const filters = getQueryParams();
  const { formatMessage } = useIntl();
  const classes = useStyles();
  const [globalSearchKey, setGlobalSearchKey] = useState(filters?.key || "");
  const [fillError, setFillError] = useState();

  const updateSearchKey = (key) => {
    let currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.set("key", key);
    history.push(history.location.pathname + "?" + currentUrlParams.toString());
  };

  useEffect(() => {
    handleSubmit(filters.key);
  }, [filters?.key]);

  const handleSubmit = () => {
    if (globalSearchKey) {
      if (globalSearchKey.length > 2) {
        setFillError();
        // globalSearch(`${BASE_URL_MAPPING}?search=${globalSearchKey}`)
        globalSearch(
          `${BASE_URL}etsy/mapping_search/?search=${globalSearchKey}`
        )
          .then((response) => {
            //console.log(response.data);
            setList(response?.data?.results || []);
            if (!response?.data?.results?.length) setFillError("No result!!!");
          })
          .catch((error) => {
            console.log(error);
            setList([]);
            setFillError("Hata. Tekrar deneyiniz");
          });
      } else {
        setFillError("En az 3 karakter giriniz.");
      }
    }
  };

  const clearBtn = () => {
    setGlobalSearchKey("");
    setList([]);
    updateSearchKey("");
  };

  const handleChange = (e) => {
    if (e?.keyCode === 13) updateSearchKey(e.target.value);
  };
  return (
    <div style={{ marginTop: 20 }}>
      <div className={classes.root}>
        <TextField
          variant="outlined"
          margin="dense"
          name="globalSearch"
          label={formatMessage({
            id: "globalSearch",
            defaultMessage: "Global Search",
          })}
          type="text"
          id="globalSearch"
          onChange={(e) => setGlobalSearchKey(e.target.value)}
          onKeyDown={handleChange}
          value={globalSearchKey}
        />
        <Button
          variant="contained"
          color="primary"
          className={classes.btn}
          onClick={() => updateSearchKey(globalSearchKey)}
        >
          <FormattedMessage id="search" defaultMessage="Search" />
        </Button>
        <Button
          variant="contained"
          color="default"
          className={classes.btn}
          onClick={clearBtn}
        >
          <FormattedMessage id="clear" defaultMessage="Clear" />
        </Button>
      </div>
      {fillError ? (
        <div className={classes.bottomSection}>
          <div className={classes.warn}>
            <Typography>{fillError}</Typography>
          </div>
        </div>
      ) : null}
      {list?.length ? <ResultTable list={list} /> : null}
    </div>
  );
};

export default Search;
