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
  const [loading, setLoading] = useState();
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
            globalSearchKey?.length < 8 ? "id" : "receipt"
          }=${globalSearchKey.toString().substring(0, 10)}`
        )
          .then((response) => {
            //console.log(response.data);
            setList(response?.data?.results || []);
            setFillError();
            setGlobalSearchKey();
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
            setList([]);
            setFillError("Hata. Tekrar deneyiniz");
            setGlobalSearchKey();
            setLoading(false);
          });
      } else {
        setFillError("En az 3 karakter giriniz.");
      }
    } else {
      if (!values) return;
      let queryString = "?";

      Object.keys(values).forEach((key) => {
        if (values[key]) {
          queryString = `${queryString}${key}=${values[key]
            .toString()
            .substring(0, 10)}&`;
        }
      });
      if (queryString === "?") {
        setFillError("Please fill any field!");
      } else {
        setFillError();
        queryString = queryString.slice(0, -1);
        let path = `${BASE_URL}etsy/mapping_search/${queryString}`;
        queryData(path)
          .then((response) => {
            setList(response?.data?.results || []);
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
            setList([]);
            setLoading(false);
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
      <ResultTable
        list={list}
        refreshSearch={handleSubmit}
        loading={loading}
        setLoading={setLoading}
      />
    </div>
  );
};

export default Search;
