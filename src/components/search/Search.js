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

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Search = ({ location, history }) => {
  const [list, setList] = useState();
  const filters = getQueryParams();
  const { formatMessage } = useIntl();
  const [globalSearchKey, setGlobalSearchKey] = useState(
    location?.state?.global || ""
  );

  const [fillError, setFillError] = useState();

  useEffect(() => {
    if (setGlobalSearchKey) handleSubmit({});
  }, [globalSearchKey]);

  const handleSubmit = (values) => {
    if (globalSearchKey) {
      if (globalSearchKey.length > 2) {
        // globalSearch(`${BASE_URL_MAPPING}?search=${globalSearchKey}`)
        globalSearch(
          `${BASE_URL}etsy/mapping_search/?${
            globalSearchKey?.length < 7 ? "id" : "receipt"
          }=${globalSearchKey.substring(0, 10)}`
        )
          .then((response) => {
            //console.log(response.data);
            setList(response?.data?.results || []);
            setFillError();
            setGlobalSearchKey();
          })
          .catch((error) => {
            console.log(error);
            setList([]);
            setFillError("Hata. Tekrar deneyiniz");
            setGlobalSearchKey();
          });
      } else {
        setFillError("En az 3 karakter giriniz.");
      }
    } else {
      let queryString = "?";
      Object.keys(values).forEach((key) => {
        if (values[key]) {
          queryString = `${queryString}${key}=${values[key].substring(0, 10)}&`;
        }
      });
      if (queryString === "?") {
        setFillError("Please fill any field!");
      } else {
        setFillError();
        queryString = queryString.slice(0, -1);
        // let path = `${BASE_URL_MAPPING}${queryString}`;
        let path = `${BASE_URL}etsy/mapping_search/${queryString}`;
        queryData(path)
          .then((response) => {
            setList(response?.data?.results || []);
          })
          .catch((error) => {
            console.log(error);
            setList([]);
          });
      }
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <Form
        handleSubmit={handleSubmit}
        setGlobalSearchKey={setGlobalSearchKey}
        globalSearchKey={globalSearchKey}
        fillError={fillError}
      />
      <ResultTable list={list} refreshSearch={handleSubmit} />
    </div>
  );
};

export default Search;
